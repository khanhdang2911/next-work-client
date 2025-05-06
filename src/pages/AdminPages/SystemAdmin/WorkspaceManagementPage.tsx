import type React from "react"
import { useState } from "react"
import { Button, Card, Table, Badge, Modal, TextInput, Textarea, Spinner } from "flowbite-react"
import { HiPlus, HiPencil, HiTrash, HiOfficeBuilding, HiSearch, HiArrowLeft } from "react-icons/hi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog"

// Mock data for workspaces
const MOCK_WORKSPACES = [
  {
    _id: "ws1",
    name: "Marketing Team",
    description: "Workspace for the marketing department",
    memberCount: 15,
    channelCount: 8,
    createdAt: "2023-01-15T10:30:00Z",
    status: "active",
    admin: {
      _id: "u1",
      name: "John Doe",
      email: "john@example.com",
    },
  },
  {
    _id: "ws2",
    name: "Engineering",
    description: "Software development team workspace",
    memberCount: 32,
    channelCount: 12,
    createdAt: "2023-02-20T14:45:00Z",
    status: "active",
    admin: {
      _id: "u2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
  },
  {
    _id: "ws3",
    name: "Sales Department",
    description: "Sales team collaboration",
    memberCount: 18,
    channelCount: 5,
    createdAt: "2023-03-10T09:15:00Z",
    status: "active",
    admin: {
      _id: "u3",
      name: "Robert Johnson",
      email: "robert@example.com",
    },
  },
  {
    _id: "ws4",
    name: "HR Department",
    description: "Human resources workspace",
    memberCount: 8,
    channelCount: 4,
    createdAt: "2023-04-05T11:20:00Z",
    status: "inactive",
    admin: {
      _id: "u4",
      name: "Sarah Williams",
      email: "sarah@example.com",
    },
  },
  {
    _id: "ws5",
    name: "Executive Team",
    description: "Management and executive discussions",
    memberCount: 6,
    channelCount: 3,
    createdAt: "2023-05-12T16:30:00Z",
    status: "active",
    admin: {
      _id: "u5",
      name: "Michael Brown",
      email: "michael@example.com",
    },
  },
]

// Add this to the component props
interface WorkspaceManagementPageProps {
  isEmbedded?: boolean
}

// Update the component definition
const WorkspaceManagementPage: React.FC<WorkspaceManagementPageProps> = ({ isEmbedded = false }) => {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  // Filter workspaces based on search term
  const filteredWorkspaces = workspaces.filter(
    (workspace) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.admin.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Open edit modal with workspace data
  const handleEditClick = (workspace: any) => {
    setCurrentWorkspace(workspace)
    setFormData({
      name: workspace.name,
      description: workspace.description,
    })
    setShowEditModal(true)
  }

  // Open delete confirmation modal
  const handleDeleteClick = (workspace: any) => {
    setCurrentWorkspace(workspace)
    setShowDeleteModal(true)
  }

  // Create new workspace
  const handleCreateWorkspace = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newWorkspace = {
        _id: `ws${workspaces.length + 1}`,
        name: formData.name,
        description: formData.description,
        memberCount: 1,
        channelCount: 1,
        createdAt: new Date().toISOString(),
        status: "active",
        admin: {
          _id: "current-user",
          name: "Current User",
          email: "current@example.com",
        },
      }

      setWorkspaces([...workspaces, newWorkspace])
      setShowCreateModal(false)
      setFormData({ name: "", description: "" })
      setIsLoading(false)
      toast.success("Workspace created successfully")
    }, 1000)
  }

  // Update existing workspace
  const handleUpdateWorkspace = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedWorkspaces = workspaces.map((workspace) =>
        workspace._id === currentWorkspace._id
          ? { ...workspace, name: formData.name, description: formData.description }
          : workspace,
      )

      setWorkspaces(updatedWorkspaces)
      setShowEditModal(false)
      setCurrentWorkspace(null)
      setFormData({ name: "", description: "" })
      setIsLoading(false)
      toast.success("Workspace updated successfully")
    }, 1000)
  }

  // Delete workspace
  const handleDeleteWorkspace = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedWorkspaces = workspaces.filter((workspace) => workspace._id !== currentWorkspace._id)

      setWorkspaces(updatedWorkspaces)
      setShowDeleteModal(false)
      setCurrentWorkspace(null)
      setIsLoading(false)
      toast.success("Workspace deleted successfully")
    }, 1000)
  }

  // Toggle workspace status (active/inactive)
  const handleToggleStatus = (workspaceId: string) => {
    const updatedWorkspaces = workspaces.map((workspace) =>
      workspace._id === workspaceId
        ? { ...workspace, status: workspace.status === "active" ? "inactive" : "active" }
        : workspace,
    )

    setWorkspaces(updatedWorkspaces)
    toast.success("Workspace status updated")
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
          <h1 className="text-2xl font-bold">Workspace Management</h1>
        </div>
        <Button color="blue" onClick={() => setShowCreateModal(true)}>
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
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Members</Table.HeadCell>
              <Table.HeadCell>Channels</Table.HeadCell>
              <Table.HeadCell>Created</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredWorkspaces.map((workspace) => (
                <Table.Row key={workspace._id} className="bg-white">
                  <Table.Cell className="font-medium text-gray-900">
                    <div className="flex items-center">
                      <HiOfficeBuilding className="mr-2 h-5 w-5 text-blue-600" />
                      {workspace.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="max-w-xs truncate">{workspace.description}</Table.Cell>
                  <Table.Cell>{workspace.admin.name}</Table.Cell>
                  <Table.Cell>{workspace.memberCount}</Table.Cell>
                  <Table.Cell>{workspace.channelCount}</Table.Cell>
                  <Table.Cell>{formatDate(workspace.createdAt)}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={workspace.status === "active" ? "success" : "gray"}
                      onClick={() => handleToggleStatus(workspace._id)}
                      className="cursor-pointer"
                    >
                      {workspace.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button color="light" size="xs" onClick={() => handleEditClick(workspace)}>
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button color="failure" size="xs" onClick={() => handleDeleteClick(workspace)}>
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

      {/* Create Workspace Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Header>Create New Workspace</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                Workspace Name
              </label>
              <TextInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter workspace name"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter workspace description"
                rows={3}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleCreateWorkspace} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              "Create Workspace"
            )}
          </Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Workspace Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Workspace</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block mb-2 text-sm font-medium text-gray-900">
                Workspace Name
              </label>
              <TextInput
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter workspace name"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block mb-2 text-sm font-medium text-gray-900">
                Description
              </label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter workspace description"
                rows={3}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleUpdateWorkspace} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Updating...
              </>
            ) : (
              "Update Workspace"
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
        title="Delete Workspace"
        message={`Are you sure you want to delete the workspace "${currentWorkspace?.name}"? This action will permanently delete the workspace and all its channels. This cannot be undone.`}
        onConfirm={handleDeleteWorkspace}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}

export default WorkspaceManagementPage
