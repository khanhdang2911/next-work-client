import type React from "react"
import { useState } from "react"
import { Button, Card, Table, Badge, Modal, TextInput, Avatar, Spinner, Select } from "flowbite-react"
import { HiSearch, HiUserRemove, HiUserAdd, HiMail, HiArrowLeft, HiUserCircle } from "react-icons/hi"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"

// Mock data for workspace users
const MOCK_WORKSPACE_USERS = [
  {
    _id: "u1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    role: "admin",
    status: "active",
    joinedAt: "2023-01-15T10:30:00Z",
    channels: 8,
    lastActive: "2023-06-15T10:30:00Z",
  },
  {
    _id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    role: "member",
    status: "active",
    joinedAt: "2023-02-20T14:45:00Z",
    channels: 6,
    lastActive: "2023-06-14T14:45:00Z",
  },
  {
    _id: "u3",
    name: "Robert Johnson",
    email: "robert@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    role: "member",
    status: "inactive",
    joinedAt: "2023-03-10T09:15:00Z",
    channels: 4,
    lastActive: "2023-05-20T09:15:00Z",
  },
  {
    _id: "u4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
    role: "member",
    status: "active",
    joinedAt: "2023-04-05T11:20:00Z",
    channels: 7,
    lastActive: "2023-06-16T16:30:00Z",
  },
  {
    _id: "u5",
    name: "Michael Brown",
    email: "michael@example.com",
    avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    role: "member",
    status: "active",
    joinedAt: "2023-05-12T16:30:00Z",
    channels: 5,
    lastActive: "2023-06-10T11:20:00Z",
  },
]

// Update the WorkspaceUserManagementPage to support being embedded in the dashboard
// Add isEmbedded prop and conditionally render the back button

// Add this to the component props
interface WorkspaceUserManagementPageProps {
  isEmbedded?: boolean
  workspaceId?: string
}

// Update the component definition
const WorkspaceUserManagementPage: React.FC<WorkspaceUserManagementPageProps> = ({
  isEmbedded = false,
  workspaceId: propWorkspaceId,
}) => {
  const params = useParams<{ workspaceId: string }>()
  const effectiveWorkspaceId = propWorkspaceId || params.workspaceId
  const [users, setUsers] = useState(MOCK_WORKSPACE_USERS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("member")

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Open remove confirmation modal
  const handleRemoveClick = (user: any) => {
    setCurrentUser(user)
    setShowRemoveModal(true)
  }

  // Open change role modal
  const handleRoleClick = (user: any) => {
    setCurrentUser(user)
    setSelectedRole(user.role)
    setShowRoleModal(true)
  }

  // Remove user from workspace
  const handleRemoveUser = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.filter((user) => user._id !== currentUser._id)

      setUsers(updatedUsers)
      setShowRemoveModal(false)
      setCurrentUser(null)
      setIsLoading(false)
      toast.success(`${currentUser.name} has been removed from the workspace`)
    }, 1000)
  }

  // Change user role
  const handleChangeRole = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) => (user._id === currentUser._id ? { ...user, role: selectedRole } : user))

      setUsers(updatedUsers)
      setShowRoleModal(false)
      setCurrentUser(null)
      setSelectedRole("member")
      setIsLoading(false)
      toast.success(`${currentUser.name}'s role has been updated to ${selectedRole}`)
    }, 1000)
  }

  // Invite user to workspace
  const handleInviteUser = () => {
    setIsLoading(true)

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail)) {
      toast.error("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(`Invitation sent to ${inviteEmail}`)
      setShowInviteModal(false)
      setInviteEmail("")
      setIsLoading(false)
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
          <h1 className="text-2xl font-bold">Workspace User Management</h1>
        </div>
        <Button color="blue" onClick={() => setShowInviteModal(true)}>
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
              <Table.HeadCell>Channels</Table.HeadCell>
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
                      {user.role === "admin" ? "Admin" : "Member"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={user.status === "active" ? "success" : "gray"}>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{user.channels}</Table.Cell>
                  <Table.Cell>{formatDate(user.joinedAt)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button color="light" size="xs" onClick={() => handleRoleClick(user)}>
                        <HiUserCircle className="h-4 w-4" />
                      </Button>
                      <Button color="failure" size="xs" onClick={() => handleRemoveClick(user)}>
                        <HiUserRemove className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>

      {/* Invite User Modal */}
      <Modal show={showInviteModal} onClose={() => setShowInviteModal(false)}>
        <Modal.Header>Invite User to Workspace</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Email Address
              </label>
              <TextInput
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
                icon={HiMail}
              />
              <p className="mt-2 text-sm text-gray-500">An invitation email will be sent to this address.</p>
            </div>
            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">
                Role
              </label>
              <Select id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleInviteUser} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Sending Invitation...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
          <Button color="gray" onClick={() => setShowInviteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Remove User Modal */}
      <ConfirmDialog
        show={showRemoveModal}
        title={currentUser?.status === "active" ? "Lock User Account" : "Unlock User Account"}
        message={`Are you sure you want to remove ${currentUser?.name} from this workspace? 
        This user will lose access to all channels in this workspace. They can be invited back later.`}
        onConfirm={handleRemoveUser}
        onCancel={() => setShowRemoveModal(false)}
      />

      {/* Change Role Modal */}
      <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)}>
        <Modal.Header>Change User Role</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Avatar img={currentUser?.avatar} rounded size="md" className="mr-3" />
              <div>
                <p className="font-medium">{currentUser?.name}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
            <div>
              <label htmlFor="change-role" className="block mb-2 text-sm font-medium text-gray-900">
                Role
              </label>
              <Select id="change-role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </Select>
              <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                {selectedRole === "admin" ? (
                  <p className="text-sm text-gray-600">Admins can manage workspace settings, channels, and members.</p>
                ) : (
                  <p className="text-sm text-gray-600">Members can participate in channels they are invited to.</p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleChangeRole} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Updating...
              </>
            ) : (
              "Update Role"
            )}
          </Button>
          <Button color="gray" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default WorkspaceUserManagementPage
