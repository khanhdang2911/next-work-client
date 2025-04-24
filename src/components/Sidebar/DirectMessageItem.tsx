import React from 'react'
import { Link, useParams } from 'react-router-dom'
// import { getStatusColor } from '../../utils/formatUtils'
import type { IDirectMessage } from '../../interfaces/Workspace'
// import type { IUser } from '../../interfaces/User'
interface DirectMessageItemProps {
  directMessage: IDirectMessage 
}

const DirectMessageItem: React.FC<DirectMessageItemProps> = React.memo(({ directMessage }) => {
  const { workspaceId, directMessageId } = useParams<{ workspaceId: string; directMessageId: string }>()
  const isActive = directMessageId === directMessage._id
  // const statusColor = getStatusColor(otherUser.status)

  return (
    <Link to={`/workspace/${workspaceId}/dm/${directMessage.conversationId}`}>
      <div
        className={`flex items-center px-4 py-1.5 rounded-md ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`}
      >
        <div className='relative mr-2'>
          <img src={directMessage.avatar || '/placeholder.svg'} alt={directMessage.name} className='w-4 h-4 rounded-full' />
          <span
            className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-green-500 border border-gray-800`}//co fix cung status o day
          ></span>
        </div>
        <span className='text-sm'>{directMessage.name}</span>
        {directMessage.unreadCount ? (
          <span className='ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5'>
            {directMessage.unreadCount}
          </span>
        ) : null}
      </div>
    </Link>
  )
})

DirectMessageItem.displayName = 'DirectMessageItem'

export default DirectMessageItem
