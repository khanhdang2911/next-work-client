import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { HiChevronDown, HiChevronRight, HiPlus, HiUserAdd } from 'react-icons/hi'
import ChannelItem from './ChannelItem'
import DirectMessageItem from './DirectMessageItem'
import CreateChannelModal from './CreateChannelModal'
import { getChannelsByWorkspaceId, getAllDmConversationsOfUser, getAllWorkspaces, createChannel } from '../../api/auth.api'
import { toast } from 'react-toastify'
import type { IChannel, IDirectMessage, IWorkspace } from '../../interfaces/Workspace'
import { ErrorMessage } from '../../config/constants'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../../redux/selectors'

const WorkspaceSidebar: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [channelsExpanded, setChannelsExpanded] = useState(true)
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [channels, setChannels] = useState<IChannel[]>([])
  const [alldm, setAlldm] = useState<IDirectMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
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
        if (res.status === 'success') {
          const currentWorkspace = res.data.find((ws: IWorkspace) => ws._id === workspaceId)
          if (currentWorkspace) {
            setWorkspace(currentWorkspace)
            // Check if current user is the admin of this workspace
            setIsAdmin(currentWorkspace.admin === currentUserId)
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      }
    }

    fetchWorkspaceDetails()
  }, [workspaceId, currentUserId])

  useEffect(() => {
    const fetchChannels = async () => {
      if (!workspaceId) return

      setIsLoading(true)
      try {
        const res = await getChannelsByWorkspaceId(workspaceId)
        if (res.status === 'success') {
          setChannels(res.data)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannels()
  }, [workspaceId, channels.length])

  useEffect(() => {
    const fetchAllDm = async () => {
      try {
        const res = await getAllDmConversationsOfUser(workspaceId ?? '')
        if (res.status === 'success') {
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
      if (res.status === 'success') {
        const newChannel: IChannel = {
          _id: res.data._id,
          name,
          workspaceId: workspaceId,
          description,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
          conversationId: res.data.conversationId || ''
        }
        // Add to local state
        setChannels((prev) => [...prev, newChannel])
        toast.success('Channel created successfully!')
        setIsCreateChannelModalOpen(false)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    }
  }

  const handleInviteUsers = () => {
    navigate(`/workspace/${workspaceId}/workspace-invite`)
  }

  return (
    <div className='w-64 bg-gray-900 h-screen flex flex-col'>
      <div className='p-4 border-b border-gray-700'>
        <h1 className='text-white font-bold text-lg flex items-center'>
          {workspace ? workspace.name : 'Loading workspace...'}
          <span className='ml-auto text-gray-400 text-xs'>Y</span>
        </h1>
        {isAdmin && (
          <div className="flex space-x-2 mt-2">
            <Button
              color="light"
              size="xs"
              className="w-1/2"
              onClick={() => navigate(`/admin/workspace/${workspaceId}/channels`)}
            >
              Channels
            </Button>
            <Button
              color="light"
              size="xs"
              className="w-1/2"
              onClick={() => navigate(`/admin/workspace/${workspaceId}/users`)}
            >
              Users
            </Button>
          </div>
        )}
        
        {isAdmin && (
          <div className='mt-2'>
            <Button color='blue' size='xs' className='w-full' onClick={handleInviteUsers}>
              <HiUserAdd className='mr-1 h-3 w-3' />
              Invite Users
            </Button>
          </div>
        )}
      </div>

      <div className='flex-1 overflow-y-auto py-4'>
        <div className='mb-4'>
          <div
            className='flex items-center px-4 py-1 text-gray-300 cursor-pointer'
            onClick={() => setChannelsExpanded(!channelsExpanded)}
          >
            {channelsExpanded ? (
              <HiChevronDown className='h-4 w-4 mr-1' />
            ) : (
              <HiChevronRight className='h-4 w-4 mr-1' />
            )}
            <span className='text-sm font-medium'>CHANNELS</span>
            <Button
              id='create-channel-btn'
              ref={createChannelBtnRef}
              color='gray'
              size='xs'
              pill
              className='ml-auto p-1'
              title='Add Channel'
              onClick={(e: any) => {
                e.stopPropagation()
                setIsCreateChannelModalOpen(true)
              }}
            >
              <HiPlus className='h-3 w-3' />
            </Button>
          </div>
          {channelsExpanded && (
            <div className='mt-2 space-y-1'>
              {isLoading ? (
                <div className='px-4 py-2 text-gray-400 text-sm'>Loading channels...</div>
              ) : channels.length > 0 ? (
                channels.map((channel) => <ChannelItem key={channel._id} channel={channel} />)
              ) : (
                <div className='px-4 py-2 text-gray-400 text-sm'>No channels found</div>
              )}
            </div>
          )}
        </div>

        <div>
          <div
            className='flex items-center px-4 py-1 text-gray-300 cursor-pointer'
            onClick={() => setDirectMessagesExpanded(!directMessagesExpanded)}
          >
            {directMessagesExpanded ? (
              <HiChevronDown className='h-4 w-4 mr-1' />
            ) : (
              <HiChevronRight className='h-4 w-4 mr-1' />
            )}
            <span className='text-sm font-medium'>DIRECT MESSAGES</span>
          </div>
          {directMessagesExpanded && (
            <div className='mt-2 space-y-1'>
              {alldm.length > 0 ? (
                alldm.map((dm) => <DirectMessageItem key={dm.conversationId} directMessage={dm} />)
              ) : (
                <div className='px-4 py-2 text-gray-400 text-sm'>No direct messages</div>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />
    </div>
  )
}

export default WorkspaceSidebar
