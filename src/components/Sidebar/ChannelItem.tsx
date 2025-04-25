import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiHashtag, HiLockClosed } from 'react-icons/hi'
import type { IChannel } from '../../interfaces/Workspace'

interface ChannelItemProps {
  channel: IChannel
}

const ChannelItem: React.FC<ChannelItemProps> = React.memo(({ channel }) => {
  const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>()
  const isActive = channelId === channel._id

  return (
    <Link to={`/workspace/${workspaceId}/channel/${channel.conversationId}`}>
      <div
        className={`flex items-center px-4 py-1.5 rounded-md ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`}
      >
        {channel.isPrivate ? (
          <HiLockClosed className="mr-2 h-4 w-4" />
        ) : (
          <HiHashtag className="mr-2 h-4 w-4" />
        )}
        <span className='text-sm'>{channel.name}</span>
        {channel.unreadCount ? (
          <span className='ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5'>
            {channel.unreadCount}
          </span>
        ) : null}
      </div>
    </Link>
  )
})

ChannelItem.displayName = 'ChannelItem'

export default ChannelItem
