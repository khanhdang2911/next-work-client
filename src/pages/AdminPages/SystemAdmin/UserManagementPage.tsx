import type React from "react"
import { useEffect, useState } from "react"
import { Button, Card, Table, Badge, Modal, TextInput, Avatar, Spinner, Select, Pagination } from "flowbite-react"
import { HiSearch, HiLockClosed, HiLockOpen, HiUserCircle, HiArrowLeft } from "react-icons/hi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"
import type { IUsersAdmin } from "../../../interfaces/User"
import { getAllUsers, updateUser, lockUser, unlockUser, searchUsers } from "../../../api/admin.api"
import { ErrorMessage } from "../../../config/constants"
import { useNavigate } from "react-router-dom"
import useDebounce from "../../../hooks/useDebounce"

interface UserManagementPageProps {
  isEmbedded?: boolean
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ isEmbedded = false }) => {
  const [users, setUsers] = useState<IUsersAdmin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showLockModal, setShowLockModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
  })
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(5)

  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, navigate])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const res = await getAllUsers(currentPage, limit)
      if (res.status === "success") {
        setUsers(res.data.users)
        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
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
    }
  }

  //useEffect for search
  useEffect(() => {
    if (!debouncedSearchTerm) {
      if (searchTerm === "") {
        fetchUsers()
      }
      return
    }

    const fetchSearchResults = async () => {
      setIsSearching(true)
      try {
        const res = await searchUsers(debouncedSearchTerm, currentPage, limit)
        if (res.status === "success") {
          setUsers(res.data.users)
          setCurrentPage(res.data.currentPage)
          setTotalPages(res.data.totalPages)
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
  }, [debouncedSearchTerm, currentPage, limit])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (currentUser) {
      const hasNameChanged = name === "name" && value !== currentUser.name
      const hasRoleChanged = name === "role" && value !== currentUser.role
      setHasChanges(hasNameChanged || hasRoleChanged)
    }
  }

  const handleLockClick = (user: any) => {
    setCurrentUser(user)
    setShowLockModal(true)
  }

  const handleEditClick = (user: any) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      role: user.role,
    })
    setHasChanges(false)
    setShowEditModal(true)
  }

  const handleToggleUserStatus = async () => {
    setIsLoading(true)
    try {
      if (currentUser.isLocked) {
        const res = await unlockUser(currentUser._id)
        if (res.status === "success") {
          const updatedUsers = users.map((user) => (user._id === currentUser._id ? { ...user, isLocked: false } : user))
          setUsers(updatedUsers)
          setShowLockModal(false)
          setCurrentUser(null)
          setIsLoading(false)
          toast.success(res.message)
        }
      } else {
        const res = await lockUser(currentUser._id)
        if (res.status === "success") {
          const updatedUsers = users.map((user) => (user._id === currentUser._id ? { ...user, isLocked: true } : user))
          setUsers(updatedUsers)
          setShowLockModal(false)
          setCurrentUser(null)
          setIsLoading(false)
          toast.success(res.message)
        }
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
    }
  }

  const handleUpdateUser = async () => {
    setIsLoading(true)
    try {
      const res = await updateUser(currentUser._id, formData)
      if (res.status === "success") {
        const updatedUsers = users.map((user) =>
          user._id === currentUser._id ? { ...user, name: formData.name, role: formData.role } : user,
        )

        setUsers(updatedUsers)
        setShowEditModal(false)
        setCurrentUser(null)
        setFormData({ name: "", role: "" })
        setIsLoading(false)
        toast.success(res.message)
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
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

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
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Users</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-500" />
            </div>
            <TextInput
              type="search"
              placeholder="Search users..."
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
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Activated</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Workspaces</Table.HeadCell>
              <Table.HeadCell>Joined</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {isSearching ? (
                <Table.Row>
                  <Table.Cell colSpan={9} className="text-center py-4">
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
                    <Table.Cell>{user.gender}</Table.Cell>
                    <Table.Cell>
                      <Badge color={user.isActivated ? "success" : "failure"}>
                        {user.isActivated ? "Email verified" : "Email not verified"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role: string) => (
                          <Badge key={role} color="indigo">
                            {role}
                          </Badge>
                        )) || <Badge color="gray">{user.role}</Badge>}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={user.status === "Online" ? "success" : "warning"}>{user.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>{user.numberOfWorkspaces}</Table.Cell>
                    <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button color="light" size="xs" onClick={() => handleEditClick(user)}>
                          <HiUserCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          color={user.isLocked ? "success" : "warning"}
                          size="xs"
                          onClick={() => handleLockClick(user)}
                        >
                          {user.isLocked ? <HiLockOpen className="h-4 w-4" /> : <HiLockClosed className="h-4 w-4" />}
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={9} className="text-center py-4">
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

      <ConfirmDialog
        show={showLockModal}
        title={currentUser?.status === "active" ? "Lock User Account" : "Unlock User Account"}
        message={
          currentUser?.isLocked
            ? `Are you sure you want to unlock ${currentUser?.name}'s account? This will restore the user's access to the platform.`
            : `Are you sure you want to lock ${currentUser?.name}'s account? This user will not be able to log in until their account is unlocked.`
        }
        onConfirm={handleToggleUserStatus}
        onCancel={() => setShowLockModal(false)}
      />

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block mb-2 text-sm font-medium text-gray-900">
                Full Name
              </label>
              <TextInput
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                icon={HiUserCircle}
              />
            </div>
            <div>
              <label htmlFor="edit-role" className="block mb-2 text-sm font-medium text-gray-900">
                Role
              </label>
              <Select id="edit-role" name="role" value={formData.role} onChange={handleInputChange} required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleUpdateUser} disabled={isLoading || !hasChanges}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Updating...
              </>
            ) : (
              "Update User"
            )}
          </Button>
          <Button color="gray" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserManagementPage
