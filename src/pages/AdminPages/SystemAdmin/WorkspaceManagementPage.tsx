import type React from "react"
import { useState, useEffect } from "react"
import { Button, Card, Table, Badge, TextInput, Pagination } from "flowbite-react"
import { HiPlus, HiTrash, HiOfficeBuilding, HiSearch, HiArrowLeft } from "react-icons/hi"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"
import { ErrorMessage } from "../../../config/constants"
import LoadingIndicator from "../../../components/LoadingPage/Loading"
import { getAllWorkspacesAdmin, deleteWorkspaceAdmin, searchWorkspaces } from "../../../api/admin.api"
import type { IWorkspaceAdmin } from "../../../interfaces/Workspace"
import CreateWorkspaceModal from "../../../components/Workspace/CreateWorkspaceModal"
import { createWorkspaces } from "../../../api/auth.api"
import useDebounce from "../../../hooks/useDebounce"
import useAuth from "../../../hooks/useAuth"
import { SkeletonTable } from "../../../components/Skeleton/SkeletonLoaders"

interface WorkspaceManagementPageProps {
  isEmbedded?: boolean
}

const WorkspaceManagementPage: React.FC<WorkspaceManagementPageProps> = ({ isEmbedded = false }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspaceAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState<IWorkspaceAdmin | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { isAdmin } = useAuth()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(5)

  const navigate = useNavigate()

  // Check admin role first - separate from data fetching
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/forbidden")
    }
  }, [isAdmin, navigate])

  // Fetch workspaces from API - simple and clean
  useEffect(() => {
    fetchWorkspaces()
  }, [currentPage])

  const fetchWorkspaces = async () => {
    setIsLoading(true)
    try {
      const response = await getAllWorkspacesAdmin(currentPage, limit)
      if (response.status === "success") {
        setWorkspaces(response.data.workspaces || response.data)
        setCurrentPage(response.data.currentPage || currentPage)
        setTotalPages(response.data.totalPages || 1)
      } else {
        toast.error("Failed to fetch workspaces")
      }
    } catch (error: any) {
      if (error.response) {
        const { statusCode, message } = error.response.data
        toast.error(message || ErrorMessage)
        if (statusCode === 403) {
          navigate("/forbidden")
        }
      }
    } finally {
      // Always set loading to false when done
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (workspace: IWorkspaceAdmin) => {
    setCurrentWorkspace(workspace)
    setShowDeleteModal(true)
  }

  const handleCreateClick = () => {
    setShowCreateModal(true)
  }

  const handleCreateWorkspace = async (name: string, description: string) => {
    const newWorkspace = {
      name,
      description,
    }
    try {
      const res = await createWorkspaces(newWorkspace)
      if (res.status === "success") {
        fetchWorkspaces()
        toast.success(res.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || ErrorMessage)
    }
  }

  const handleDeleteWorkspace = async () => {
    if (!currentWorkspace) return

    setIsLoading(true)
    try {
      const res = await deleteWorkspaceAdmin(currentWorkspace._id)
      if (res.status === "success") {
        const updatedWorkspaces = workspaces.filter((workspace) => workspace._id !== currentWorkspace._id)
        setWorkspaces(updatedWorkspaces)
        setShowDeleteModal(false)
        setCurrentWorkspace(null)
        toast.success(res.message)
      }
    } catch (error: any) {
      if (error.response) {
        const { statusCode, message } = error.response.data
        toast.error(message || ErrorMessage)
        if (statusCode === 403) {
          navigate("/forbidden")
        }
      }
    } finally {
      // Always set loading to false when done
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (workspace: IWorkspaceAdmin) => {
    // fake api call
    setTimeout(() => {
      const updatedWorkspaces = workspaces.map((w) => (w._id === workspace._id ? { ...w, isLocked: !w.isLocked } : w))

      setWorkspaces(updatedWorkspaces)
      toast.success(`Workspace ${workspace.isLocked ? "unlocked" : "locked"} successfully`)
    }, 500)
  }

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // useEffect for search - keep it simple
  useEffect(() => {
    if (!debouncedSearchTerm) {
      if (searchTerm === "") {
        // Call get all when search is cleared
        fetchWorkspaces()
      }
      return
    }

    const fetchSearchResults = async () => {
      setIsSearching(true)
      try {
        const response = await searchWorkspaces(debouncedSearchTerm, currentPage, limit)
        if (response.status === "success") {
          setWorkspaces(response.data.workspaces || response.data)
          setCurrentPage(response.data.currentPage || currentPage)
          setTotalPages(response.data.totalPages || 1)
        }
      } catch (error: any) {
        if (error.response) {
          const { statusCode, message } = error.response.data
          toast.error(message || ErrorMessage)
          if (statusCode === 403) {
            navigate("/forbidden")
          }
        }
      } finally {
        setIsSearching(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchTerm, currentPage, limit])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          {!isEmbedded && (
            <Link to="/admin">
              <Button color="light" size="sm" className="mr-4">
                <HiArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Dashboard
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold">Workspace Management</h1>
        </div>
        <Button color="blue" onClick={handleCreateClick}>
          <HiPlus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Workspaces</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-500" />
            </div>
            <TextInput
              type="search"
              placeholder="Search workspaces..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <SkeletonTable rows={5} cols={8} />
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Members</Table.HeadCell>
                <Table.HeadCell>Channels</Table.HeadCell>
                <Table.HeadCell>Created</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {isSearching ? (
                  <Table.Row>
                    <Table.Cell colSpan={8} className="text-center py-4">
                      <LoadingIndicator size="sm" text="Searching..." />
                    </Table.Cell>
                  </Table.Row>
                ) : workspaces.length > 0 ? (
                  workspaces.map((workspace) => (
                    <Table.Row key={workspace._id} className="bg-white">
                      <Table.Cell className="font-medium text-gray-900">
                        <div className="flex items-center">
                          <HiOfficeBuilding className="mr-2 h-5 w-5 text-blue-600" />
                          {workspace.name}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="max-w-xs truncate">{workspace.description}</Table.Cell>
                      <Table.Cell>{workspace.admin.name}</Table.Cell>
                      <Table.Cell>{workspace.numberOfMembers}</Table.Cell>
                      <Table.Cell>{workspace.numberOfChannels}</Table.Cell>
                      <Table.Cell>{formatDate(workspace.createdAt)}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={workspace.isLocked ? "gray" : "success"}
                          onClick={() => handleToggleStatus(workspace)}
                          className="cursor-pointer"
                        >
                          {workspace.isLocked ? "Locked" : "Active"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex space-x-2">
                          <Button color="failure" size="xs" onClick={() => handleDeleteClick(workspace)}>
                            <HiTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={8} className="text-center py-4">
                      {searchTerm ? "No workspaces found matching your search" : "No workspaces found"}
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

      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />

      <ConfirmDialog
        show={showDeleteModal}
        title="Delete Workspace"
        message={`Are you sure you want to delete the workspace "${currentWorkspace?.name}"? This action will permanently delete the workspace and all its channels. This cannot be undone.`}
        onConfirm={handleDeleteWorkspace}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}

export default WorkspaceManagementPage
