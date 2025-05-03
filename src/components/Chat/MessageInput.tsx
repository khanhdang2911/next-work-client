import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button, Tooltip } from 'flowbite-react'
import { HiPaperClip, HiEmojiHappy, HiCode, HiPaperAirplane } from 'react-icons/hi'
import { HiListBullet } from 'react-icons/hi2'
import FileUploadModal from './FileUploadModal'
import { createMessage } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../config/constants'
import type { IMessage } from '../../interfaces/Workspace'
import EmojiPicker from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'

interface MessageInputProps {
  onSendMessage: (content: string | IMessage) => void | Promise<void> | ((message: IMessage) => void)
  onAttachFile?: (file: File) => void
  isEditing?: boolean
  initialContent?: string
  onCancelEdit?: () => void
  onMessageSent?: () => void
  conversationId?: string
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAttachFile,
  isEditing = false,
  initialContent = '',
  onCancelEdit,
  onMessageSent,
  conversationId
}) => {
  const [message, setMessage] = useState(initialContent)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)
  // const [currentChannel, setCurrentChannel] = useState<any>(null)
  // const [currentDirectMessage, setCurrentDirectMessage] = useState<any>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch current channel or DM details for placeholder text
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && selectedFiles.length === 0) {
      return
    }

    if (isEditing) {
      onSendMessage(message)
      setMessage('')
      return
    }

    if (!conversationId) {
      toast.error('Conversation ID is missing')
      return
    }

    setIsSending(true)

    try {
      const response = await createMessage(conversationId, message, selectedFiles)

      if (response.status === 'success') {
        // Pass the new message to the parent component
        onSendMessage(response.data)

        setMessage('')
        setSelectedFiles([])
        if (onMessageSent) {
          onMessageSent()
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const selectedText = message.substring(start, end)
    const beforeText = message.substring(0, start)
    const afterText = message.substring(end)

    const newText = beforeText + prefix + selectedText + suffix + afterText
    setMessage(newText)

    // Focus back on textarea after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.selectionStart = start + prefix.length
        textareaRef.current.selectionEnd = start + prefix.length + selectedText.length
      }
    }, 0)
  }

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const newText = message.slice(0, start) + emojiData.emoji + message.slice(start)
      setMessage(newText)

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          const newPosition = start + emojiData.emoji.length
          textareaRef.current.selectionStart = newPosition
          textareaRef.current.selectionEnd = newPosition
        }
      }, 0)
    } else {
      setMessage(message + emojiData.emoji)
    }

    setShowEmojiPicker(false)
  }

  const handleFileUpload = (file: File) => {
    setSelectedFiles((prev) => [...prev, file])
    setShowFileUploadModal(false)

    if (onAttachFile) {
      onAttachFile(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='border-t p-3 relative'>
      <div className='flex items-center space-x-2 mb-2'>
        <Tooltip content='Bold'>
          <Button color='gray' pill size='xs' onClick={() => insertFormatting('**')} type='button'>
            <span className='font-bold'>B</span>
          </Button>
        </Tooltip>

        <Tooltip content='Italic'>
          <Button color='gray' pill size='xs' onClick={() => insertFormatting('*')} type='button'>
            <span className='italic'>I</span>
          </Button>
        </Tooltip>

        <Tooltip content='List'>
          <Button color='gray' pill size='xs' onClick={() => insertFormatting('- ')} type='button'>
            <HiListBullet className='h-4 w-4' />
          </Button>
        </Tooltip>

        <Tooltip content='Code'>
          <Button color='gray' pill size='xs' onClick={() => insertFormatting('`')} type='button'>
            <HiCode className='h-4 w-4' />
          </Button>
        </Tooltip>
      </div>

      {selectedFiles.length > 0 && (
        <div className='mb-2 flex flex-wrap gap-2'>
          {selectedFiles.map((file, index) => (
            <div key={index} className='bg-gray-100 rounded px-2 py-1 text-sm flex items-center'>
              <span className='truncate max-w-[150px]'>{file.name}</span>
              <button
                type='button'
                className='ml-1 text-gray-500 hover:text-gray-700'
                onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='flex items-center'>
        <textarea
          ref={textareaRef}
          className='flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
          placeholder={'Type a message...'}
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />

        <div className='ml-2 flex items-center space-x-2'>
          <div className='relative'>
            <Tooltip content='Add Emoji'>
              <Button
                ref={emojiButtonRef}
                color='gray'
                pill
                size='sm'
                type='button'
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <HiEmojiHappy className='h-4 w-4' />
              </Button>
            </Tooltip>

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className='absolute bottom-full right-0 mb-2 z-50'
                onClick={(e) => e.stopPropagation()}
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  searchDisabled={false}
                  skinTonesDisabled
                  width={280}
                  height={350}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>

          <Tooltip content='Attach File'>
            <Button color='gray' pill size='sm' type='button' onClick={() => setShowFileUploadModal(true)}>
              <HiPaperClip className='h-4 w-4' />
            </Button>
          </Tooltip>

          <Button
            color='blue'
            pill
            size='sm'
            type='submit'
            disabled={isSending || (!message.trim() && selectedFiles.length === 0)}
          >
            {isSending ? (
              <>
                <div className='h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-1'></div>
                <span>Sending</span>
              </>
            ) : (
              <>
                <HiPaperAirplane className='h-4 w-4' />
                <span className='ml-1'>Send</span>
              </>
            )}
          </Button>

          {isEditing && onCancelEdit && (
            <Button color='gray' pill size='sm' type='button' onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <FileUploadModal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        onFileUpload={handleFileUpload}
      />
    </form>
  )
}

export default MessageInput
