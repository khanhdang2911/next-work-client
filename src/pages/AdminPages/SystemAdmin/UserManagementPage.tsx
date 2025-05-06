import type React from "react"
import { useState } from "react"
import { Button, Card, Table, Badge, Modal, TextInput, Avatar, Spinner, Select } from "flowbite-react"
import { HiSearch, HiLockClosed, HiLockOpen, HiUserCircle, HiArrowLeft, HiMail } from "react-icons/hi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"

// Mock data for users
const MOCK_USERS = [
  {
    _id: "u1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    role: "admin",
    status: "active",
    workspaces: 3,
    createdAt: "2023-01-10T08:15:00Z",
  },
  {
    _id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    role: "user",
    status: "active",
    workspaces: 2,
    createdAt: "2023-02-05T11:20:00Z",
  },
  {
    _id: "u3",
    name: "Robert Johnson",
    email: "robert@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    role: "user",
    status: "locked",
    workspaces: 1,
    createdAt: "2023-03-12T15:30:00Z",
  },
  {
    _id: "u4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
    role: "user",
    status: "active",
    workspaces: 4,
    createdAt: "2023-01-25T09:45:00Z",
  },
  {
    _id: "u5",
    name: "Michael Brown",
    email: "michael@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    role: "admin",
    status: "active",
    workspaces: 2,
    createdAt: "2023-02-18T13:10:00Z",
  },
]

interface UserManagementPageProps {
  isEmbedded?: boolean
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ isEmbedded = false }) => {
  const [users, setUsers] = useState(MOCK_USERS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showLockModal, setShowLockModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  })

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Open lock/unlock confirmation modal
  const handleLockClick = (user: any) => {
    setCurrentUser(user)
    setShowLockModal(true)
  }

  // Open edit modal with user data
  const handleEditClick = (user: any) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setShowEditModal(true)
  }

  // Toggle user status (lock/unlock)
  const handleToggleUserStatus = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) =>
        user._id === currentUser._id ? { ...user, status: user.status === "active" ? "locked" : "active" } : user,
      )

      setUsers(updatedUsers)
      setShowLockModal(false)
      setCurrentUser(null)
      setIsLoading(false)
      toast.success(`User ${currentUser.status === "active" ? "locked" : "unlocked"} successfully`)
    }, 1000)
  }

  // Update user
  const handleUpdateUser = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) =>
        user._id === currentUser._id
          ? { ...user, name: formData.name, email: formData.email, role: formData.role }
          : user,
      )

      setUsers(updatedUsers)
      setShowEditModal(false)
      setCurrentUser(null)
      setFormData({ name: "", email: "", role: "" })
      setIsLoading(false)
      toast.success("User updated successfully")
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Workspaces</Table.HeadCell>
              <Table.HeadCell>Joined</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredUsers.map((user) => (
                <Table.Row key={user._id} className="bg-white">
                  <Table.Cell className="font-medium text-gray-900">
                    <div className="flex items-center">
                      <Avatar img={user.avatar} rounded size="sm" className="mr-3" />
                      {user.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color={user.role === "admin" ? "purple" : "blue"}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={user.status === "active" ? "success" : "failure"}>
                      {user.status === "active" ? "Active" : "Locked"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{user.workspaces}</Table.Cell>
                  <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button color="light" size="xs" onClick={() => handleEditClick(user)}>
                        <HiUserCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        color={user.status === "active" ? "warning" : "success"}
                        size="xs"
                        onClick={() => handleLockClick(user)}
                      >
                        {user.status === "active" ? (
                          <HiLockClosed className="h-4 w-4" />
                        ) : (
                          <HiLockOpen className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>

      {/* Lock/Unlock User Confirmation Dialog */}
      <ConfirmDialog
        show={showLockModal}
        title={currentUser?.status === "active" ? "Lock User Account" : "Unlock User Account"}
        message={
          currentUser?.status === "active"
            ? `Are you sure you want to lock ${currentUser?.name}'s account? This user will not be able to log in until their account is unlocked.`
            : `Are you sure you want to unlock ${currentUser?.name}'s account? This will restore the user's access to the platform.`
        }
        onConfirm={handleToggleUserStatus}
        onCancel={() => setShowLockModal(false)}
      />

      {/* Edit User Modal */}
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
              <label htmlFor="edit-email" className="block mb-2 text-sm font-medium text-gray-900">
                Email Address
              </label>
              <TextInput
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
                icon={HiMail}
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
          <Button color="blue" onClick={handleUpdateUser} disabled={isLoading}>
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
