import type React from 'react'
import { Button, Tooltip } from 'flowbite-react'
import { HiHashtag, HiInformationCircle, HiPhone, HiVideoCamera, HiUserAdd, HiSearch, HiUsers } from 'react-icons/hi'
import type { IChannel } from '../../interfaces/Workspace'
import type { IUser } from '../../interfaces/User'
import { useNavigate, useParams } from 'react-router-dom'

interface ChatHeaderProps {
  channel?: IChannel
  directMessageUser?: IUser
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ channel, directMessageUser }) => {
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string }>()

  const handleViewMembers = () => {
    navigate(`/workspace/${workspaceId}/members`)
  }

  const handleInviteMembers = () => {
    navigate(`/workspace/${workspaceId}/invite`)
  }

  return (
    <div className='border-b p-3 flex items-center'>
      <div className='flex-1'>
        {channel && (
          <div className='flex items-center'>
            <HiHashtag className='h-5 w-5 text-gray-500 mr-2' />
            <h2 className='font-semibold'>{channel.name}</h2>
            {channel.description && <span className='ml-2 text-gray-500 text-sm'>{channel.description}</span>}
          </div>
        )}

        {directMessageUser && (
          <div className='flex items-center'>
            <img
              src={directMessageUser.avatar || '/placeholder.svg'}
              alt={directMessageUser.name}
              className='w-5 h-5 rounded-full mr-2'
            />
            <h2 className='font-semibold'>{directMessageUser.name}</h2>
            <span
              className={`ml-2 w-2 h-2 rounded-full ${
                directMessageUser.status === 'online'
                  ? 'bg-green-500'
                  : directMessageUser.status === 'away'
                    ? 'bg-yellow-500'
                    : directMessageUser.status === 'busy'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
              }`}
            ></span>
            <span className='ml-1 text-gray-500 text-sm'>{directMessageUser.status}</span>
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
          </Button>
        </Tooltip>

        <Tooltip content='Invite People'>
          <Button color='gray' pill size='sm' onClick={handleInviteMembers}>
            <HiUserAdd className='h-4 w-4' />
          </Button>
        </Tooltip>

        <Tooltip content='Info'>
          <Button color='gray' pill size='sm'>
            <HiInformationCircle className='h-4 w-4' />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default ChatHeader
