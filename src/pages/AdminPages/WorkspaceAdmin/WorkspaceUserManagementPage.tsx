import type React from "react"
import { useState, useEffect } from "react"
import { Button, Card, Table, Badge, Avatar, Pagination, Modal, Spinner } from "flowbite-react"
import { HiSearch, HiUserRemove, HiUserAdd, HiArrowLeft, HiPencil } from "react-icons/hi"
import { Link, useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"
import { ErrorMessage } from "../../../config/constants"
import useDebounce from "../../../hooks/useDebounce"
import { getAllWorkspaceUsers, searchWorkspaceUsers, deleteUserFromWorkspace } from "../../../api/workspace.admin.api"
import type { IWorkspace, IWorkspaceUser } from "../../../interfaces/Workspace"
import { TextInput } from "flowbite-react"
import { SkeletonTable } from "../../../components/Skeleton/SkeletonLoaders"
import LoadingIndicator from "../../../components/LoadingPage/Loading"
import { getAllWorkspaces } from "../../../api/auth.api"
import { updateRoleWorkspace } from "../../../api/user.api"
import { useSelector } from "react-redux"
import { getAuthSelector } from "../../../redux/selectors"

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
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<IWorkspaceUser | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState("member")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const auth: any = useSelector(getAuthSelector)
  const currentUserId = auth.user?._id

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

  const handleEditClick = async (user: IWorkspaceUser) => {
    setCurrentUser(user)
    setCurrentUserRole("")
    setHasChanges(false);
    setShowEditModal(true)
    try {
      const res = await getAllWorkspaces()
      if (res.status === "success") {
        const currentWorkspace = res.data.find((ws: IWorkspace) => ws._id === effectiveWorkspaceId)
        if (currentWorkspace) {
          // Check if current user is the admin of this workspace
          setCurrentUserRole(currentWorkspace.admin.includes(user._id) ? "admin" : "member")
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    }
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentUserRole(value)

    if (currentUser) {
      const hasChangesRole = name === "role" && value !== currentUserRole;
      setHasChanges(hasChangesRole);
    }
};

  const handleUpdateRole = async () => {
    if (!hasChanges) return
    setShowEditModal(false)
    setIsLoading(true)
    try {
      const res = await updateRoleWorkspace(effectiveWorkspaceId, {
        memberId: currentUser?._id,
        role: currentUserRole,
      })

      if (res.status === "success") {
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user._id === currentUser?._id) {
              return {
                ...user,
                isWorkspaceAdmin: currentUserRole === "admin",
              }
            }
            return user
          })
        )
        setIsLoading(false)
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    }
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
          {isLoading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : (
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
                      <LoadingIndicator size="sm" text="Searching..." />
                    </Table.Cell>
                  </Table.Row>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    user._id === currentUserId ? null : (
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
                          <Button color="light" size="xs" onClick={() => handleEditClick(user)}>
                            <HiPencil className="h-4 w-4" />
                          </Button>
                          <Button color="failure" size="xs" onClick={() => handleRemoveClick(user)}>
                            <HiUserRemove className="h-4 w-4" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )
                    )
                    )
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4">
                      {searchTerm ? "No users found matching your search" : "No users found"}
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

      {/* Edit Channel Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Role User</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-role" className="block mb-2 text-sm font-medium text-gray-900">
                Role
              </label>
              <select
                id="edit-role"
                name="role"
                value={currentUserRole}
                onChange={handleRoleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleUpdateRole} disabled={isLoading || !hasChanges}>
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
