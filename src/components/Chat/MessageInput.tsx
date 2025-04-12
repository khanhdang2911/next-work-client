import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button, Tooltip } from 'flowbite-react'
import { HiPaperClip, HiEmojiHappy, HiCode, HiAtSymbol, HiPaperAirplane } from 'react-icons/hi'
import { HiListBullet } from 'react-icons/hi2'
import EmojiPicker from './EmojiPicker'
import FileUploadModal from './FileUploadModal'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  onAttachFile?: (file: File) => void
  isEditing?: boolean
  initialContent?: string
  onCancelEdit?: () => void
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAttachFile,
  isEditing = false,
  initialContent = '',
  onCancelEdit
}) => {
  const [message, setMessage] = useState(initialContent)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
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

  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const newText = message.slice(0, start) + emoji + message.slice(start)
      setMessage(newText)

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          const newPosition = start + emoji.length
          textareaRef.current.selectionStart = newPosition
          textareaRef.current.selectionEnd = newPosition
        }
      }, 0)
    } else {
      setMessage(message + emoji)
    }
  }

  const handleFileUpload = (file: File) => {
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

        <Tooltip content='Mention'>
          <Button color='gray' pill size='xs' onClick={() => insertFormatting('@')} type='button'>
            <HiAtSymbol className='h-4 w-4' />
          </Button>
        </Tooltip>
      </div>

      <div className='flex items-center'>
        <textarea
          ref={textareaRef}
          className='flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
          placeholder='Message #general'
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className='ml-2 flex items-center space-x-2'>
          <div className='relative'>
            <Tooltip content='Add Emoji'>
              <Button color='gray' pill size='sm' type='button' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <HiEmojiHappy className='h-4 w-4' />
              </Button>
            </Tooltip>

            {showEmojiPicker && (
              <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
            )}
          </div>

          <Tooltip content='Attach File'>
            <Button color='gray' pill size='sm' type='button' onClick={() => setShowFileUploadModal(true)}>
              <HiPaperClip className='h-4 w-4' />
            </Button>
          </Tooltip>

          <Button color='blue' pill size='sm' type='submit' disabled={!message.trim()}>
            <HiPaperAirplane className='h-4 w-4' />
            <span className='ml-1'>Send</span>
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
