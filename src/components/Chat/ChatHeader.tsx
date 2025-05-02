import type React from 'react'
import { useState } from 'react'
import { Button, Tooltip, Badge } from 'flowbite-react'
import {
  HiHashtag,
  HiLockClosed,
  HiInformationCircle,
  HiPhone,
  HiVideoCamera,
  HiUserAdd,
  HiSearch,
  HiUsers
} from 'react-icons/hi'
import type { IChannel, IDirectMessage } from '../../interfaces/Workspace'
import { useNavigate, useParams } from 'react-router-dom'
import ChannelMembersModal from './ChannelMembersModal'
import ChannelInviteModal from './ChannelInviteModel'

interface ChatHeaderProps {
  channel?: IChannel | null
  directMessage?: IDirectMessage | null
  onlineUsers?: string[]
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ channel, directMessage, onlineUsers = [] }) => {
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string; conversationId: string }>()
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const handleViewMembers = () => {
    setShowMembersModal(true)
  }

  const handleInviteToChannel = () => {
    setShowInviteModal(true)
  }

  const handleInviteMembers = () => {
    navigate(`/workspace/${workspaceId}/invite`)
  }

  // Check if direct message user is online
  const isUserOnline = directMessage && onlineUsers.includes(directMessage._id)

  return (
    <div className='border-b p-3 flex items-center'>
      <div className='flex-1'>
        {channel && (
          <div className='flex items-center'>
            {channel.isPrivate ? <HiLockClosed className='mr-2 h-4 w-4' /> : <HiHashtag className='mr-2 h-4 w-4' />}
            <h2 className='font-semibold'>{channel.name}</h2>
            {channel.description && <span className='ml-2 text-gray-500 text-sm'>{channel.description}</span>}
          </div>
        )}

        {directMessage && (
          <div className='flex items-center'>
            <img
              src={directMessage.avatar || '/placeholder.svg'}
              alt={directMessage.name}
              className='w-5 h-5 rounded-full mr-2'
            />
            <h2 className='font-semibold'>{directMessage.name}</h2>
            <span className={`ml-2 w-2 h-2 rounded-full ${isUserOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className='ml-1 text-gray-500 text-sm'>{isUserOnline ? 'Online' : 'Away'}</span>
          </div>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <Tooltip content='Search'>
          <Button color='gray' pill size='sm'>
            <HiSearch className='h-4 w-4' />
          </Button>
        </Tooltip>

        <Tooltip content='Call'>
          <Button color='gray' pill size='sm'>
            <HiPhone className='h-4 w-4' />
          </Button>
        </Tooltip>

        <Tooltip content='Video Call'>
          <Button color='gray' pill size='sm'>
            <HiVideoCamera className='h-4 w-4' />
          </Button>
        </Tooltip>

        <Tooltip content='View Members'>
          <Button color='gray' pill size='sm' onClick={handleViewMembers}>
            <HiUsers className='h-4 w-4' />
            {onlineUsers.length > 0 && (
              <Badge color='success' className='ml-1'>
                {onlineUsers.length}
              </Badge>
            )}
          </Button>
        </Tooltip>

        {channel ? (
          <Tooltip content='Invite to Channel'>
            <Button color='gray' pill size='sm' onClick={handleInviteToChannel}>
              <HiUserAdd className='h-4 w-4' />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content='Invite to Workspace'>
            <Button color='gray' pill size='sm' onClick={handleInviteMembers}>
              <HiUserAdd className='h-4 w-4' />
            </Button>
          </Tooltip>
        )}

        <Tooltip content='Info'>
          <Button color='gray' pill size='sm'>
            <HiInformationCircle className='h-4 w-4' />
          </Button>
        </Tooltip>
      </div>

      {channel && (
        <>
          <ChannelMembersModal
            isOpen={showMembersModal}
            onClose={() => setShowMembersModal(false)}
            channelId={channel._id}
            workspaceId={workspaceId}
            onlineUsers={onlineUsers}
          />

          <ChannelInviteModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            workspaceId={workspaceId ?? ''}
            channelId={channel._id}
            channelName={channel.name}
          />
        </>
      )}
    </div>
  )
}

export default ChatHeader
