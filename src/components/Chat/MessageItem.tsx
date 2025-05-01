import React, { useState, useMemo, useRef } from 'react'
import { Avatar, Button, Dropdown } from 'flowbite-react'
import { HiDotsVertical, HiPencil, HiTrash, HiEmojiHappy, HiEye } from 'react-icons/hi'
import { formatTime } from '../../utils/formatUtils'
import type { IMessage, ISender } from '../../interfaces/Workspace'
import EmojiPicker from './EmojiPicker'
import { useNavigate } from 'react-router-dom'
import { getAuthSelector } from '../../redux/selectors'
import { useSelector } from 'react-redux'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

interface MessageItemProps {
  message: IMessage
  user: ISender
  onEdit: (messageId: string) => void
  onDelete: (messageId: string) => void
  onReact: (messageId: string, emoji: string) => void
  onViewProfile?: (userId: string) => void
}

const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ message, user, onEdit, onDelete, onReact}) => {
    const [showActions, setShowActions] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const emojiButtonRef = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate()
    const auth: any = useSelector(getAuthSelector)
    const formattedContent = useMemo(() => {
      // Replace **text** with <strong>text</strong>
      let content = message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

      // Replace *text* or _text_ with <em>text</em>
      content = content.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')

      return content
    }, [message.content])

    const isEdited = useMemo(() => {
      return message.createdAt !== message.updatedAt
    }, [message.createdAt, message.updatedAt])

    const isCurrentUser = user._id === auth?.user._id
    const messageTime = formatTime(message.createdAt)

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDeleteClick = () => {
      setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = () => {
      onDelete(message._id)
      setShowDeleteConfirm(false)
    }

    const handleCancelDelete = () => {
      setShowDeleteConfirm(false)
    }

    const handleReactionClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiSelect = (emoji: string) => {
      onReact(message._id, emoji)
      setShowEmojiPicker(false)
    }

    const handleViewProfile = () => {
      if (isCurrentUser) {
        navigate('/profile')
      } else {
        navigate(`/profile/${user._id}`)
      }
    }

    // Check if a file is an image
    const isImageFile = (type: string) => {
      return type.startsWith('image/')
    }

    return (
      <div
        className='py-2 px-4 hover:bg-gray-100 flex relative'
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className='cursor-pointer' onClick={handleViewProfile}>
          <Avatar img={user.avatar} rounded size='md' className='mr-3' />
        </div>

        <div className='flex-1'>
          <div className='flex items-center'>
            <span className='font-semibold cursor-pointer hover:underline' onClick={handleViewProfile}>
              {user.name}
            </span>
            <span className='text-gray-500 text-xs ml-2'>{messageTime}</span>
            {isEdited && (
              <span className="text-purple-700 text-xs ml-1 font-semibold">(Edited)</span>
            )}

            {showActions && (
              <div className='ml-2 flex'>
                <div className='relative'>
                  <Button
                    ref={emojiButtonRef}
                    color='gray'
                    pill
                    size='xs'
                    className='p-1 mr-1'
                    onClick={handleReactionClick}
                  >
                    <HiEmojiHappy className='h-3 w-3' />
                  </Button>

                  {showEmojiPicker && (
                    <div className='absolute z-50 top-6 left-0'>
                      <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                    </div>
                  )}
                </div>
                {isCurrentUser && (
                  <>
                    <Button color='gray' pill size='xs' className='p-1 mr-1' onClick={() => onEdit(message._id)}>
                      <HiPencil className='h-3 w-3' />
                    </Button>
                    <Button color='gray' pill size='xs' className='p-1' onClick={handleDeleteClick}>
                      <HiTrash className='h-3 w-3' />
                    </Button>
                  </>
                )}

                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <div className='p-1 ml-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full h-6 w-6 cursor-pointer'>
                      <HiDotsVertical className='h-3 w-3' />
                    </div>
                  }
                >
                  <Dropdown.Item icon={HiEmojiHappy} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    Add Reaction
                  </Dropdown.Item>
                  {isCurrentUser && (
                    <>
                      <Dropdown.Item icon={HiPencil} onClick={() => onEdit(message._id)}>
                        Edit Message
                      </Dropdown.Item>
                      <Dropdown.Item icon={HiTrash} onClick={handleDeleteClick}>
                        Delete Message
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown>
                <ConfirmDialog
                  show={showDeleteConfirm}
                  title="Delete Message"
                  message="Are you sure you want to delete this message?"
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelDelete}
                />
              </div>
            )}
          </div>

          <div className='mt-1 text-sm' dangerouslySetInnerHTML={{ __html: formattedContent }} />

          {message.attachments && message.attachments.length > 0 && (
            <div className='mt-2'>
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className='mt-2'>
                  {isImageFile(attachment.type) ? (
                    // Display images directly
                    <div className='mt-2'>
                      <img
                        src={attachment.url || '/placeholder.svg'}
                        alt={attachment.name}
                        className='max-w-md rounded-md border border-gray-200'
                        style={{ maxHeight: '300px' }}
                      />
                      <div className='mt-1 text-xs text-gray-500'>
                        {attachment.name} ({attachment.size} MB)
                      </div>
                    </div>
                  ) : (
                    // Display other files as downloadable items
                    <div className='border border-gray-200 rounded-md p-3 bg-gray-50 inline-block'>
                      <div className='flex items-center'>
                        <div className='mr-3 text-blue-500'>
                          <svg className='h-8 w-8' fill='currentColor' viewBox='0 0 20 20'>
                            <path
                              fillRule='evenodd'
                              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                        <div className='flex-1 mr-2'>
                          <div className='text-sm font-medium'>{attachment.name}</div>
                          <div className='text-xs text-gray-500'>{attachment.size} MB</div>
                        </div>
                        <a href={attachment.url} download={attachment.name} target='_blank' rel='noopener noreferrer'>
                          <Button color='gray' size='xs' pill>
                            <HiEye className='h-3 w-3' />
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {message.reactions && message.reactions.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-2'>
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.id}
                  className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200'
                  onClick={() => onReact(message._id, reaction.emoji)}
                >
                  <span className='mr-1'>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)

MessageItem.displayName = 'MessageItem'

export default MessageItem
