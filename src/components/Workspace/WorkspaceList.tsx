import type React from "react"
import WorkspaceItem from "./WorkspaceItem"
import { Button } from "flowbite-react"
import { HiPlus } from "react-icons/hi"
import type { IWorkspace } from "../../interfaces/Workspace"
import { useState, useEffect } from "react"
import { createWorkspaces, getAllWorkspaces } from "../../api/auth.api"
import { toast } from "react-toastify"
import CreateWorkspaceModal from "./CreateWorkspaceModal"
import { ErrorMessage } from "../../config/constants"
import { SkeletonWorkspaceItem } from "../Skeleton/SkeletonLoaders"

interface WorkspaceListProps {
  activeWorkspaceId?: string
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({ activeWorkspaceId }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true)
      try {
        const res = await getAllWorkspaces()
        if (res.status === "success") {
          setWorkspaces(res.data)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  const handleCreateWorkspace = async (name: string, description: string) => {
    const newWorkspace = {
      name,
      description,
    }
    try {
      const res = await createWorkspaces(newWorkspace)

      if (res.status === "success") {
        const workspace_new: IWorkspace = res.data
        setWorkspaces((prev) => [...prev, workspace_new])
        setIsCreateModalOpen(false)
        toast.success(res.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || ErrorMessage)
    }
  }

  return (
    <div className="w-16 bg-gray-800 h-screen flex flex-col items-center py-4">
      {isLoading ? (
        // Show skeleton loaders for workspaces
        Array(3)
          .fill(0)
          .map((_, index) => <SkeletonWorkspaceItem key={`workspace-skeleton-${index}`} />)
      ) : (
        <>
          {workspaces.map((workspace) => (
            <WorkspaceItem key={workspace._id} workspace={workspace} isActive={workspace._id === activeWorkspaceId} />
          ))}
          <Button
            color="gray"
            pill
            className="mt-4 w-10 h-10 flex items-center justify-center"
            title="Add Workspace"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <HiPlus className="h-5 w-5" />
          </Button>
        </>
      )}

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
      />
    </div>
  )
}

export default WorkspaceList
