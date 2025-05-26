import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "flowbite-react"
import { HiChevronDown, HiChevronRight, HiPlus, HiUserAdd, HiShieldCheck, HiLogout, HiArrowLeft } from "react-icons/hi"
import ChannelItem from "./ChannelItem"
import DirectMessageItem from "./DirectMessageItem"
import ChatbotItem from "./ChatbotItem"
import CreateChannelModal from "./CreateChannelModal"
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog"
import {
  getChannelsByWorkspaceId,
  getAllDmConversationsOfUser,
  getAllWorkspaces,
  createChannel,
  leaveWorkspace,
} from "../../api/auth.api"
import { toast } from "react-toastify"
import type { IChannel, IDirectMessage, IWorkspace } from "../../interfaces/Workspace"
import { ErrorMessage } from "../../config/constants"
import { useSelector } from "react-redux"
import { getAuthSelector } from "../../redux/selectors"
import { SkeletonChannelItem } from "../Skeleton/SkeletonLoaders"

const WorkspaceSidebar: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [channelsExpanded, setChannelsExpanded] = useState(true)
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [channels, setChannels] = useState<IChannel[]>([])
  const [alldm, setAlldm] = useState<IDirectMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null)
  const [isAdminWrokspace, setIsAdminWrokspace] = useState(false)
  const [showLeaveWorkspaceConfirm, setShowLeaveWorkspaceConfirm] = useState(false)
  const [isLeavingWorkspace, setIsLeavingWorkspace] = useState(false)
  const createChannelBtnRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const auth: any = useSelector(getAuthSelector)
  const currentUserId = auth.user?._id

  // Fetch workspace details to get the name and check if user is admin
  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      if (!workspaceId || !currentUserId) return

      try {
        const res = await getAllWorkspaces()
        if (res.status === "success") {
          const currentWorkspace = res.data.find((ws: IWorkspace) => ws._id === workspaceId)
          if (currentWorkspace) {
            setWorkspace(currentWorkspace)
            // Check if current user is the admin of this workspace
            setIsAdminWrokspace(currentWorkspace.admin.includes(currentUserId))
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      }
    }

    fetchWorkspaceDetails()
  }, [workspaceId, currentUserId])

  const fetchChannels = async () => {
    if (!workspaceId) return

    setIsLoading(true)
    try {
      const res = await getChannelsByWorkspaceId(workspaceId)
      if (res.status === "success") {
        setChannels(res.data)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, [workspaceId])

  useEffect(() => {
    const fetchAllDm = async () => {
      try {
        const res = await getAllDmConversationsOfUser(workspaceId ?? "")
        if (res.status === "success") {
          setAlldm(res.data)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      }
    }

    fetchAllDm()
  }, [workspaceId])

  const handleCreateChannel = async (name: string, description: string) => {
    try {
      if (!workspaceId) return
      const res = await createChannel(workspaceId, name, description)
      if (res.status === "success") {
        const newChannel: IChannel = {
          _id: res.data._id,
          name,
          workspaceId: workspaceId,
          description,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
          conversationId: res.data.conversationId || "",
        }
        // Add to local state
        setChannels((prev) => [...prev, newChannel])
        fetchChannels()
        toast.success("Channel created successfully!")
        setIsCreateChannelModalOpen(false)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    }
  }

  const handleInviteUsers = () => {
    navigate(`/workspace/${workspaceId}/workspace-invite`)
  }

  const handleLeaveWorkspace = async () => {
    if (!workspaceId) return

    try {
      setIsLeavingWorkspace(true)
      const response = await leaveWorkspace(workspaceId)
      if (response.status === "success") {
        toast.success(response.message || "Left workspace successfully")
        // Navigate to home page after leaving workspace
        navigate("/")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || ErrorMessage)
    } finally {
      setIsLeavingWorkspace(false)
      setShowLeaveWorkspaceConfirm(false)
    }
  }

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <Button
          color="light"
          size="sm" // Increased from xs to sm for better proportions
          className="w-full mb-2 flex items-center justify-center text-sm font-semibold py-2" // Adjusted text size and added more vertical padding
          onClick={() => navigate("/")}
        >
          <HiArrowLeft className="mr-2 h-5 w-5" /> {/* Increased icon size */}
          Back to Home
        </Button>
        <h1 className="text-white font-bold text-lg flex items-center">
          {workspace ? workspace.name : "Loading workspace..."}
          <span className="ml-auto text-gray-400 text-xs">Y</span>
        </h1>
        {isAdminWrokspace && (
          <div className="flex space-x-2 mt-2">
            <Button
              color="light"
              size="xs"
              className="w-1/2"
              onClick={() => navigate(`/admin/workspace/${workspaceId}/channels`)}
            >
              <HiShieldCheck className="mr-1 h-3 w-3" />
              Channels
            </Button>
            <Button
              color="light"
              size="xs"
              className="w-1/2"
              onClick={() => navigate(`/admin/workspace/${workspaceId}/users`)}
            >
              <HiShieldCheck className="mr-1 h-3 w-3" />
              Users
            </Button>
          </div>
        )}

        {isAdminWrokspace && (
          <div className="mt-2">
            <Button color="blue" size="xs" className="w-full" onClick={handleInviteUsers}>
              <HiUserAdd className="mr-1 h-3 w-3" />
              Invite Users
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="mb-4">
          <div
            className="flex items-center px-4 py-1 text-gray-300 cursor-pointer"
            onClick={() => setChannelsExpanded(!channelsExpanded)}
          >
            {channelsExpanded ? (
              <HiChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <HiChevronRight className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">CHANNELS</span>
            <Button
              id="create-channel-btn"
              ref={createChannelBtnRef}
              color="gray"
              size="xs"
              pill
              className="ml-auto p-1"
              title="Add Channel"
              onClick={(e: any) => {
                e.stopPropagation()
                setIsCreateChannelModalOpen(true)
              }}
            >
              <HiPlus className="h-3 w-3" />
            </Button>
          </div>
          {channelsExpanded && (
            <div className="mt-2 space-y-1">
              {isLoading ? (
                // Show skeleton loaders for channels
                Array(3)
                  .fill(0)
                  .map((_, index) => <SkeletonChannelItem key={`skeleton-${index}`} />)
              ) : channels.length > 0 ? (
                channels.map((channel) => (
                  <ChannelItem key={channel._id} channel={channel} onChannelLeave={fetchChannels} />
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400 text-sm">No channels found</div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div
            className="flex items-center px-4 py-1 text-gray-300 cursor-pointer"
            onClick={() => setDirectMessagesExpanded(!directMessagesExpanded)}
          >
            {directMessagesExpanded ? (
              <HiChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <HiChevronRight className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">DIRECT MESSAGES</span>
          </div>
          {directMessagesExpanded && (
            <div className="mt-2 space-y-1">
              {isLoading ? (
                // Show skeleton loaders for direct messages
                Array(2)
                  .fill(0)
                  .map((_, index) => <SkeletonChannelItem key={`dm-skeleton-${index}`} />)
              ) : alldm.length > 0 ? (
                alldm.map((dm) => <DirectMessageItem key={dm.conversationId} directMessage={dm} />)
              ) : (
                <div className="px-4 py-2 text-gray-400 text-sm">No direct messages</div>
              )}
            </div>
          )}
        </div>

        {/* AI Assistant Section */}
        <div className="mb-4">
          <div className="px-4 py-1 text-gray-300">
            <span className="text-sm font-medium">AI ASSISTANT</span>
          </div>
          <div className="mt-2">
            <ChatbotItem workspaceId={workspaceId || ""} />
          </div>
        </div>
      </div>

      {/* Leave Workspace Button */}
      <div className="p-4 border-t border-gray-700">
        <Button
          color="failure"
          size="xs"
          className="w-full"
          onClick={() => setShowLeaveWorkspaceConfirm(true)}
          disabled={isLeavingWorkspace}
        >
          <HiLogout className="mr-1 h-3 w-3" />
          Leave Workspace
        </Button>
      </div>

      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      <ConfirmDialog
        show={showLeaveWorkspaceConfirm}
        title="Leave Workspace"
        message={`Are you sure you want to leave the "${workspace?.name}" workspace? You will need to be invited back to rejoin.`}
        onConfirm={handleLeaveWorkspace}
        onCancel={() => setShowLeaveWorkspaceConfirm(false)}
      />
    </div>
  )
}

export default WorkspaceSidebar
