import React, { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HiHashtag } from 'react-icons/hi'
import type { IChannel } from '../../interfaces/Workspace'

interface ChannelItemProps {
  channel: IChannel
}

const ChannelItem: React.FC<ChannelItemProps> = React.memo(({ channel }) => {
  const { workspaceId, conversationId } = useParams<{ workspaceId: string; conversationId: string }>()
  // Fix: Compare with conversationId instead of channelId
  const isActive = conversationId === channel.conversationId
  const navigate = useNavigate()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      navigate(`/workspace/${workspaceId}/channel/${channel.conversationId}`)
    },
    [workspaceId, channel.conversationId, navigate]
  )

  return (
    <div
      onClick={handleClick}
      className={`flex items-center px-4 py-1.5 rounded-md cursor-pointer ${
        isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
      }`}
    >
      <HiHashtag className='mr-2 h-4 w-4' />
      <span className='text-sm'>{channel.name}</span>
      {channel.unreadCount ? (
        <span className='ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5'>{channel.unreadCount}</span>
      ) : null}
    </div>
  )
})

ChannelItem.displayName = 'ChannelItem'

export default ChannelItem
