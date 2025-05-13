import type React from "react"
import { useState, useEffect } from "react"
import { Button, Card, Table, Modal, TextInput, Textarea, Spinner, Pagination } from "flowbite-react"
import { HiPlus, HiPencil, HiTrash, HiHashtag, HiSearch, HiArrowLeft } from "react-icons/hi"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"
import { ErrorMessage } from "../../../config/constants"
import useDebounce from "../../../hooks/useDebounce"
import {
  getAllChannelsAdmin,
  searchChannelsAdmin,
  updateChannelAdmin,
  deleteChannelAdmin,
} from "../../../api/workspace.admin.api"
import type { IChannelAdmin } from "../../../interfaces/Workspace"
import CreateChannelModal from "../../../components/Sidebar/CreateChannelModal"
import { createChannel } from "../../../api/auth.api"
import { SkeletonTable } from "../../../components/Skeleton/SkeletonLoaders"
import LoadingIndicator from "../../../components/LoadingPage/Loading"

interface ChannelManagementPageProps {
  isEmbedded?: boolean
  workspaceId?: string
}

const ChannelManagementPage: React.FC<ChannelManagementPageProps> = ({
  isEmbedded = false,
  workspaceId: propWorkspaceId,
}) => {
  const params = useParams<{ workspaceId: string }>()
  const effectiveWorkspaceId = propWorkspaceId ?? params.workspaceId ?? ""

  const [channels, setChannels] = useState<IChannelAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<IChannelAdmin | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(5)

  // Fetch channels from API - this will run before rendering the UI
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!effectiveWorkspaceId) {
        setIsInitialLoading(false)
        return
      }

      setIsInitialLoading(true)
      try {
        const response = await getAllChannelsAdmin(effectiveWorkspaceId, currentPage, limit)
        if (response.status === "success") {
          setChannels(response.data.channels)
          setCurrentPage(response.data.currentPage)
          setTotalPages(response.data.totalPages)
        }
      } catch (error: any) {
        // The global interceptor will handle 403 errors
        toast.error(error.response?.data?.message || ErrorMessage)
      } finally {
        setIsInitialLoading(false)
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [effectiveWorkspaceId])

  // Fetch channels when page changes
  useEffect(() => {
    if (isInitialLoading) return

    fetchChannels()
  }, [currentPage, effectiveWorkspaceId, isInitialLoading])

  const fetchChannels = async () => {
    if (!effectiveWorkspaceId) return

    setIsLoading(true)
    try {
      const response = await getAllChannelsAdmin(effectiveWorkspaceId, currentPage, limit)
      if (response.status === "success") {
        setChannels(response.data.channels)
        setCurrentPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      }
    } catch (error: any) {
      // The global interceptor will handle 403 errors
      toast.error(error.response?.data?.message || ErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search with debounce
  useEffect(() => {
    if (!debouncedSearchTerm) {
      if (searchTerm === "") {
        fetchChannels()
      }
      return
    }

    const fetchSearchResults = async () => {
      if (!effectiveWorkspaceId) return

      setIsSearching(true)
      try {
        const response = await searchChannelsAdmin(effectiveWorkspaceId, debouncedSearchTerm, currentPage, limit)
        if (response.status === "success") {
          setChannels(response.data.channels)
          setCurrentPage(response.data.currentPage)
          setTotalPages(response.data.totalPages)
        }
      } catch (error: any) {
        // The global interceptor will handle 403 errors
        toast.error(error.response?.data?.message || ErrorMessage)
      } finally {
        setIsSearching(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchTerm, currentPage, limit, effectiveWorkspaceId])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (currentChannel) {
      const hasChangesName = name === "name" && value !== currentChannel.name
      const hasChangesDescription = name === "description" && value !== currentChannel.description

      setHasChanges(hasChangesName || hasChangesDescription)
    }
  }

  // Open edit modal with channel data
  const handleEditClick = (channel: IChannelAdmin) => {
    setCurrentChannel(channel)
    setFormData({
      name: channel.name,
      description: channel.description || "",
    })
    setShowEditModal(true)
    setHasChanges(false)
  }

  // Open delete confirmation modal
  const handleDeleteClick = (channel: IChannelAdmin) => {
    setCurrentChannel(channel)
    setShowDeleteModal(true)
  }

  // Create new channel
  const handleCreateChannel = async (name: string, description: string) => {
    if (!effectiveWorkspaceId) return

    setIsLoading(true)

    // Validate channel name (lowercase, no spaces, etc.)
    const channelNameRegex = /^[a-z0-9_-]+$/
    if (!channelNameRegex.test(name)) {
      toast.error("Channel name can only contain lowercase letters, numbers, hyphens, and underscores")
      setIsLoading(false)
      return
    }

    try {
      const response = await createChannel(effectiveWorkspaceId, name, description)
      if (response.status === "success") {
        toast.success(response.message)
        fetchChannels()
        setShowCreateModal(false)
      }
    } catch (error: any) {
      // The global interceptor will handle 403 errors
      toast.error(error.response?.data?.message || ErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Update existing channel
  const handleUpdateChannel = async () => {
    if (!currentChannel) return

    setIsLoading(true)

    // Validate channel name (lowercase, no spaces, etc.)
    const channelNameRegex = /^[a-z0-9_-]+$/
    if (!channelNameRegex.test(formData.name)) {
      toast.error("Channel name can only contain lowercase letters, numbers, hyphens, and underscores")
      setIsLoading(false)
      return
    }

    try {
      const response = await updateChannelAdmin(effectiveWorkspaceId, currentChannel._id, {
        name: formData.name,
        description: formData.description,
      })

      if (response.status === "success") {
        const updatedChannels = channels.map((channel) =>
          channel._id === currentChannel._id
            ? {
                ...channel,
                name: formData.name,
                description: formData.description,
              }
            : channel,
        )

        setChannels(updatedChannels)
        setShowEditModal(false)
        setCurrentChannel(null)
        setFormData({ name: "", description: "" })
        toast.success(response.message)
      }
    } catch (error: any) {
      // The global interceptor will handle 403 errors
      toast.error(error.response?.data?.message || ErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Delete channel
  const handleDeleteChannel = async () => {
    if (!currentChannel) return

    setIsLoading(true)

    try {
      const response = await deleteChannelAdmin(effectiveWorkspaceId, currentChannel._id)

      if (response.status === "success") {
        const updatedChannels = channels.filter((channel) => channel._id !== currentChannel._id)
        setChannels(updatedChannels)
        setShowDeleteModal(false)
        setCurrentChannel(null)
        toast.success(response.message)
      }
    } catch (error: any) {
      // The global interceptor will handle 403 errors
      toast.error(error.response?.data?.message || ErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isInitialLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <LoadingIndicator text="Loading channels..." />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          {!isEmbedded && (
            <Link to={`/workspace/${effectiveWorkspaceId}`}>
              <Button color="light" size="sm" className="mr-4">
                <HiArrowLeft className="mr-2 h-4 w-4" />
                Back to Workspace
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold">Channel Management</h1>
        </div>
        <Button color="blue" onClick={() => setShowCreateModal(true)}>
          <HiPlus className="mr-2 h-4 w-4" />
          Create Channel
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Channels</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-500" />
            </div>
            <TextInput
              type="search"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Created By</Table.HeadCell>
                <Table.HeadCell>Members</Table.HeadCell>
                <Table.HeadCell>Created</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {isSearching ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-4">
                      <LoadingIndicator size="sm" text="Searching..." />
                    </Table.Cell>
                  </Table.Row>
                ) : channels.length > 0 ? (
                  channels.map((channel) => (
                    <Table.Row key={channel._id} className="bg-white">
                      <Table.Cell className="font-medium text-gray-900">
                        <div className="flex items-center">
                          <HiHashtag className="mr-2 h-5 w-5 text-gray-600" />
                          {channel.name}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="max-w-xs truncate">{channel.description}</Table.Cell>
                      <Table.Cell>{channel.admin.name}</Table.Cell>
                      <Table.Cell>{channel.members}</Table.Cell>
                      <Table.Cell>{formatDate(channel.createdAt)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex space-x-2">
                          <Button color="light" size="xs" onClick={() => handleEditClick(channel)}>
                            <HiPencil className="h-4 w-4" />
                          </Button>
                          <Button color="failure" size="xs" onClick={() => handleDeleteClick(channel)}>
                            <HiTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="text-center py-4">
                      {searchTerm ? "No channels found matching your search" : "No channels found"}
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
          </div>
        )}
      </Card>

      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateChannel={handleCreateChannel}
      />

      {/* Edit Channel Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Channel</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block mb-2 text-sm font-medium text-gray-900">
                Channel Name
              </label>
              <TextInput
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. project-updates"
                required
                helperText="Lowercase letters, numbers, hyphens and underscores only"
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block mb-2 text-sm font-medium text-gray-900">
                Description (Optional)
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What's this channel about?"
                rows={3}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleUpdateChannel} disabled={isLoading || !hasChanges}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Updating...
              </>
            ) : (
              "Update Channel"
            )}
          </Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        show={showDeleteModal}
        title="Delete Channel"
        message={`Are you sure you want to delete the #${currentChannel?.name} channel? This action will permanently delete the channel and all its messages. This cannot be undone.`}
        onConfirm={handleDeleteChannel}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}

export default ChannelManagementPage
