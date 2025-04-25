import React, { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { IDirectMessage } from '../../interfaces/Workspace'

interface DirectMessageItemProps {
  directMessage: IDirectMessage
}

const DirectMessageItem: React.FC<DirectMessageItemProps> = React.memo(({ directMessage }) => {
  const { workspaceId, conversationId } = useParams<{ workspaceId: string; conversationId: string }>()
  const isActive = conversationId === directMessage.conversationId
  const navigate = useNavigate()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      // Ensure we're using the correct path format and passing the conversationId properly
      navigate(`/workspace/${workspaceId}/dm/${directMessage.conversationId}`)
    },
    [workspaceId, directMessage.conversationId, navigate]
  )

  return (
    <div
      onClick={handleClick}
      className={`flex items-center px-4 py-1.5 rounded-md cursor-pointer ${
        isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
      }`}
    >
      <div className='relative mr-2'>
        <img
          src={directMessage.avatar || '/placeholder.svg'}
          alt={directMessage.name}
          className='w-4 h-4 rounded-full'
        />
        <span
          className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-green-500 border border-gray-800`}
        ></span>
      </div>
      <span className='text-sm'>{directMessage.name}</span>
      {directMessage.unreadCount ? (
        <span className='ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5'>
          {directMessage.unreadCount}
        </span>
      ) : null}
    </div>
  )
})

DirectMessageItem.displayName = 'DirectMessageItem'

export default DirectMessageItem
