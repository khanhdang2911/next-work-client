import React, { useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HiHashtag, HiLogout } from 'react-icons/hi'
import type { IChannel } from '../../interfaces/Workspace'
import { leaveChannel } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../config/constants'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

interface ChannelItemProps {
  channel: IChannel
  onChannelLeave?: () => void
}

const ChannelItem: React.FC<ChannelItemProps> = React.memo(({ channel, onChannelLeave }) => {
  const { workspaceId, conversationId } = useParams<{ workspaceId: string; conversationId: string }>()
  // Fix: Compare with conversationId instead of channelId
  const isActive = conversationId === channel.conversationId
  const navigate = useNavigate()
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      navigate(`/workspace/${workspaceId}/channel/${channel.conversationId}`)
    },
    [workspaceId, channel.conversationId, navigate]
  )

  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowLeaveConfirm(true)
  }

  const handleLeaveConfirm = async () => {
    try {
      const response = await leaveChannel(channel._id)
      if (response.status === 'success') {
        toast.success(response.message)

        // If we're currently viewing this channel, navigate to the workspace
        if (conversationId === channel.conversationId) {
          navigate(`/workspace/${workspaceId}`)
        }

        // Notify parent component to refresh channels list
        if (onChannelLeave) {
          onChannelLeave()
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || ErrorMessage)
    } finally {
      setShowLeaveConfirm(false)
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex items-center px-4 py-1.5 rounded-md cursor-pointer group ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`}
      >
        <HiHashtag className='mr-2 h-4 w-4' />
        <span className='text-sm flex-1'>{channel.name}</span>
        <button
          onClick={handleLeaveClick}
          className={`p-1 rounded-full ${
            isActive
              ? 'text-white opacity-0 group-hover:opacity-100'
              : 'text-gray-400 opacity-0 group-hover:opacity-100'
          } transition-opacity`}
          title='Leave channel'
        >
          <HiLogout className='h-3.5 w-3.5' />
        </button>
      </div>

      <ConfirmDialog
        show={showLeaveConfirm}
        title='Leave Channel'
        message={`Are you sure you want to leave #${channel.name}? You will need to be invited back to rejoin.`}
        onConfirm={handleLeaveConfirm}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </>
  )
})

ChannelItem.displayName = 'ChannelItem'

export default ChannelItem
