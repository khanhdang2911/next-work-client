import type React from "react"
import { useState } from "react"
import { Button, Card, Table, Modal, TextInput, Textarea, Spinner } from "flowbite-react"
import { HiPlus, HiPencil, HiTrash, HiHashtag, HiSearch, HiArrowLeft, HiLockClosed } from "react-icons/hi"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"

// Mock data for channels
const MOCK_CHANNELS = [
  {
    _id: "ch1",
    name: "general",
    description: "General discussions for everyone",
    memberCount: 32,
    createdAt: "2023-01-15T10:30:00Z",
    isPrivate: false,
    createdBy: {
      _id: "u1",
      name: "John Doe",
    },
  },
  {
    _id: "ch2",
    name: "announcements",
    description: "Important announcements from the team",
    memberCount: 32,
    createdAt: "2023-01-16T14:45:00Z",
    isPrivate: false,
    createdBy: {
      _id: "u1",
      name: "John Doe",
    },
  },
  {
    _id: "ch3",
    name: "project-alpha",
    description: "Discussions about Project Alpha",
    memberCount: 12,
    createdAt: "2023-02-10T09:15:00Z",
    isPrivate: true,
    createdBy: {
      _id: "u2",
      name: "Jane Smith",
    },
  },
  {
    _id: "ch4",
    name: "random",
    description: "Random discussions and off-topic chat",
    memberCount: 28,
    createdAt: "2023-02-12T11:20:00Z",
    isPrivate: false,
    createdBy: {
      _id: "u3",
      name: "Robert Johnson",
    },
  },
  {
    _id: "ch5",
    name: "design-team",
    description: "Design team discussions and resources",
    memberCount: 8,
    createdAt: "2023-03-05T16:30:00Z",
    isPrivate: true,
    createdBy: {
      _id: "u4",
      name: "Sarah Williams",
    },
  },
]

interface ChannelManagementPageProps {
  isEmbedded?: boolean
  workspaceId?: string
}

const ChannelManagementPage: React.FC<ChannelManagementPageProps> = ({
  isEmbedded = false,
  workspaceId: propWorkspaceId,
}) => {
  const params = useParams<{ workspaceId: string }>()
  const effectiveWorkspaceId = propWorkspaceId || params.workspaceId
  const [channels, setChannels] = useState(MOCK_CHANNELS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  })

  // Filter channels based on search term
  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Open edit modal with channel data
  const handleEditClick = (channel: any) => {
    setCurrentChannel(channel)
    setFormData({
      name: channel.name,
      description: channel.description,
      isPrivate: channel.isPrivate,
    })
    setShowEditModal(true)
  }

  // Open delete confirmation modal
  const handleDeleteClick = (channel: any) => {
    setCurrentChannel(channel)
    setShowDeleteModal(true)
  }

  // Create new channel
  const handleCreateChannel = () => {
    setIsLoading(true)

    // Validate channel name (lowercase, no spaces, etc.)
    const channelNameRegex = /^[a-z0-9_-]+$/
    if (!channelNameRegex.test(formData.name)) {
      toast.error("Channel name can only contain lowercase letters, numbers, hyphens, and underscores")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const newChannel = {
        _id: `ch${channels.length + 1}`,
        name: formData.name,
        description: formData.description,
        memberCount: 1,
        createdAt: new Date().toISOString(),
        isPrivate: formData.isPrivate,
        createdBy: {
          _id: "current-user",
          name: "Current User",
        },
      }

      setChannels([...channels, newChannel])
      setShowCreateModal(false)
      setFormData({ name: "", description: "", isPrivate: false })
      setIsLoading(false)
      toast.success("Channel created successfully")
    }, 1000)
  }

  // Update existing channel
  const handleUpdateChannel = () => {
    setIsLoading(true)

    // Validate channel name (lowercase, no spaces, etc.)
    const channelNameRegex = /^[a-z0-9_-]+$/
    if (!channelNameRegex.test(formData.name)) {
      toast.error("Channel name can only contain lowercase letters, numbers, hyphens, and underscores")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const updatedChannels = channels.map((channel) =>
        channel._id === currentChannel._id
          ? {
              ...channel,
              name: formData.name,
              description: formData.description,
              isPrivate: formData.isPrivate,
            }
          : channel,
      )

      setChannels(updatedChannels)
      setShowEditModal(false)
      setCurrentChannel(null)
      setFormData({ name: "", description: "", isPrivate: false })
      setIsLoading(false)
      toast.success("Channel updated successfully")
    }, 1000)
  }

  // Delete channel
  const handleDeleteChannel = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedChannels = channels.filter((channel) => channel._id !== currentChannel._id)

      setChannels(updatedChannels)
      setShowDeleteModal(false)
      setCurrentChannel(null)
      setIsLoading(false)
      toast.success("Channel deleted successfully")
    }, 1000)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {filteredChannels.map((channel) => (
                <Table.Row key={channel._id} className="bg-white">
                  <Table.Cell className="font-medium text-gray-900">
                    <div className="flex items-center">
                      <HiHashtag className="mr-2 h-5 w-5 text-gray-600" />
                      {channel.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="max-w-xs truncate">{channel.description}</Table.Cell>
                  <Table.Cell>{channel.createdBy.name}</Table.Cell>
                  <Table.Cell>{channel.memberCount}</Table.Cell>
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
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>

      {/* Create Channel Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Header>Create New Channel</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                Channel Name
              </label>
              <TextInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. project-updates"
                required
                helperText="Lowercase letters, numbers, hyphens and underscores only"
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                Description (Optional)
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What's this channel about?"
                rows={3}
              />
            </div>
            <div className="flex items-center">
              <input
                id="isPrivate"
                name="isPrivate"
                type="checkbox"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPrivate" className="ml-2 text-sm font-medium text-gray-900">
                Make channel private
              </label>
            </div>
            {formData.isPrivate && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <div className="flex">
                  <HiLockClosed className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Private channels are only visible to invited members. This cannot be changed later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleCreateChannel} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              "Create Channel"
            )}
          </Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

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
            <div className="flex items-center">
              <input
                id="edit-isPrivate"
                name="isPrivate"
                type="checkbox"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                disabled={currentChannel?.isPrivate !== formData.isPrivate}
              />
              <label htmlFor="edit-isPrivate" className="ml-2 text-sm font-medium text-gray-900">
                Make channel private
              </label>
            </div>
            {currentChannel?.isPrivate && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <div className="flex">
                  <HiLockClosed className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    The privacy setting of a channel cannot be changed after creation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleUpdateChannel} disabled={isLoading}>
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
