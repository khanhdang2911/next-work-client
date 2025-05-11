"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button, Card, Table, Badge, Avatar, Pagination } from "flowbite-react"
import { HiSearch, HiUserRemove, HiUserAdd, HiArrowLeft } from "react-icons/hi"
import { Link, useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"
import { ErrorMessage } from "../../../config/constants"
import useDebounce from "../../../hooks/useDebounce"
import { getAllWorkspaceUsers, searchWorkspaceUsers, deleteUserFromWorkspace } from "../../../api/workspace.admin.api"
import type { IWorkspaceUser } from "../../../interfaces/Workspace"
import { TextInput } from "flowbite-react"

interface WorkspaceUserManagementPageProps {
  isEmbedded?: boolean
  workspaceId?: string
}

const WorkspaceUserManagementPage: React.FC<WorkspaceUserManagementPageProps> = ({
  isEmbedded = false,
  workspaceId: propWorkspaceId,
}) => {
  const params = useParams<{ workspaceId: string }>()
  const effectiveWorkspaceId = propWorkspaceId || params.workspaceId || ""
  const navigate = useNavigate()

  const [users, setUsers] = useState<IWorkspaceUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<IWorkspaceUser | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(5)

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [currentPage, effectiveWorkspaceId])

  const fetchUsers = async () => {
    if (!effectiveWorkspaceId) return

    setIsLoading(true)
    try {
      const response = await getAllWorkspaceUsers(effectiveWorkspaceId, currentPage, limit)
      if (response.status === "success") {
        setUsers(response.data.users)
        setCurrentPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      } else {
        toast.error("Failed to fetch workspace users")
      }
    } catch (error: any) {
      if (error.response) {
        const { statusCode, message } = error.response.data
        toast.error(message || ErrorMessage)
        if (statusCode === 403) {
          navigate("/forbidden")
        }
      } else {
        toast.error(error.response?.data?.message || ErrorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search with debounce
  useEffect(() => {
    if (!debouncedSearchTerm) {
      if (searchTerm === "") {
        fetchUsers()
      }
      return
    }

    const fetchSearchResults = async () => {
      if (!effectiveWorkspaceId) return

      setIsSearching(true)
      try {
        const response = await searchWorkspaceUsers(effectiveWorkspaceId, debouncedSearchTerm, currentPage, limit)
        if (response.status === "success") {
          setUsers(response.data.users)
          setCurrentPage(response.data.currentPage)
          setTotalPages(response.data.totalPages)
        }
      } catch (error: any) {
        if (error.response) {
          const { statusCode, message } = error.response.data
          toast.error(message || ErrorMessage)
          if (statusCode === 403) {
            navigate("/forbidden")
          }
        } else {
          toast.error(error.response?.data?.message || ErrorMessage)
        }
      } finally {
        setIsSearching(false)
      }
    }

    fetchSearchResults()
  }, [debouncedSearchTerm, currentPage, limit, effectiveWorkspaceId])

  // Open remove confirmation modal
  const handleRemoveClick = (user: IWorkspaceUser) => {
    setCurrentUser(user)
    setShowRemoveModal(true)
  }

  // Handle invite users
  const handleInviteUsers = () => {
    navigate(`/workspace/${effectiveWorkspaceId}/workspace-invite`)
  }

  // Remove user from workspace
  const handleRemoveUser = async () => {
    if (!currentUser || !effectiveWorkspaceId) return

    setIsLoading(true)
    try {
      const response = await deleteUserFromWorkspace(effectiveWorkspaceId, currentUser._id)
      if (response.status === "success") {
        const updatedUsers = users.filter((user) => user._id !== currentUser._id)
        setUsers(updatedUsers)
        setShowRemoveModal(false)
        setCurrentUser(null)
        toast.success(response.message)
      }
    } catch (error: any) {
      if (error.response) {
        const { statusCode, message } = error.response.data
        toast.error(message || ErrorMessage)
        if (statusCode === 403) {
          navigate("/forbidden")
        }
      } else {
        toast.error(error.response?.data?.message || ErrorMessage)
      }
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
          <h1 className="text-2xl font-bold">Workspace User Management</h1>
        </div>
        <Button color="blue" onClick={handleInviteUsers}>
          <HiUserAdd className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Workspace Members</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-500" />
            </div>
            <TextInput
              type="search"
              placeholder="Search members..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Joined</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {isSearching ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : isLoading && users.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <Table.Row key={user._id} className="bg-white">
                    <Table.Cell className="font-medium text-gray-900">
                      <div className="flex items-center">
                        <Avatar img={user.avatar} rounded size="sm" className="mr-3" />
                        {user.name}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Badge color={user.isWorkspaceAdmin ? "purple" : "blue"}>
                        {user.isWorkspaceAdmin ? "Admin" : "Member"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{formatDate(user.joinedAt)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button color="failure" size="xs" onClick={() => handleRemoveClick(user)}>
                          <HiUserRemove className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-4">
                    {searchTerm ? "No users found matching your search" : "No users found"}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons />
          </div>
        )}
      </Card>

      {/* Remove User Modal */}
      <ConfirmDialog
        show={showRemoveModal}
        title="Remove User"
        message={`Are you sure you want to remove ${currentUser?.name} from this workspace? 
        This user will lose access to all channels in this workspace. They can be invited back later.`}
        onConfirm={handleRemoveUser}
        onCancel={() => setShowRemoveModal(false)}
      />
    </div>
  )
}

export default WorkspaceUserManagementPage
