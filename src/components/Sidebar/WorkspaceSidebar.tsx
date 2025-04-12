import type React from 'react'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { HiChevronDown, HiChevronRight, HiPlus } from 'react-icons/hi'
import ChannelItem from './ChannelItem'
import DirectMessageItem from './DirectMessageItem'
import CreateChannelModal from './CreateChannelModal'
import {
  getWorkspaceById,
  getChannelsByWorkspaceId,
  getDirectMessagesByWorkspaceId,
  getUserById,
  mockChannels
} from '../../mockData/workspaces'
import type { IChannel } from '../../interfaces/Workspace'

const WorkspaceSidebar: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [channelsExpanded, setChannelsExpanded] = useState(true)
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true)
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false)
  const [channels, setChannels] = useState<IChannel[]>([])

  const workspace = useMemo(() => {
    return getWorkspaceById(workspaceId || '')
  }, [workspaceId])

  useMemo(() => {
    setChannels(getChannelsByWorkspaceId(workspaceId || ''))
  }, [workspaceId])

  const directMessages = useMemo(() => {
    return getDirectMessagesByWorkspaceId(workspaceId || '')
  }, [workspaceId])

  const handleCreateChannel = (name: string, description: string, isPrivate: boolean) => {
    const newChannel: IChannel = {
      id: `channel${Date.now()}`,
      name,
      workspaceId: workspaceId || '',
      description,
      isPrivate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    }

    // Add to local state
    setChannels((prev) => [...prev, newChannel])

    // In a real app, you would also add this to your backend
    mockChannels.push(newChannel)
  }

  if (!workspace) {
    return <div>Workspace not found</div>
  }

  return (
    <div className='w-64 bg-gray-900 h-screen flex flex-col'>
      <div className='p-4 border-b border-gray-700'>
        <h1 className='text-white font-bold text-lg flex items-center'>
          {workspace.name}
          <span className='ml-auto text-gray-400 text-xs'>Y</span>
        </h1>
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
              color='gray'
              size='xs'
              pill
              className='ml-auto p-1'
              title='Add Channel'
              onClick={(e) => {
                e.stopPropagation()
                setIsCreateChannelModalOpen(true)
              }}
            >
              <HiPlus className='h-3 w-3' />
            </Button>
          </div>
          {channelsExpanded && (
            <div className='mt-2 space-y-1'>
              {channels.map((channel) => (
                <ChannelItem key={channel.id} channel={channel} />
              ))}
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
            <Button color='gray' size='xs' pill className='ml-auto p-1' title='Add Direct Message'>
              <HiPlus className='h-3 w-3' />
            </Button>
          </div>
          {directMessagesExpanded && (
            <div className='mt-2 space-y-1'>
              {directMessages.map((dm) => {
                // Find the other user in the direct message
                const otherUserId = dm.participants.find((id) => id !== 'user1')
                const otherUser = otherUserId ? getUserById(otherUserId) : null

                if (!otherUser) return null

                return <DirectMessageItem key={dm.id} directMessage={dm} otherUser={otherUser} />
              })}
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
