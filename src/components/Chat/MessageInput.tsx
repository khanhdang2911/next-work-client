"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button, Tooltip } from "flowbite-react"
import { HiPaperClip, HiEmojiHappy, HiCode, HiPaperAirplane } from "react-icons/hi"
import { HiListBullet } from "react-icons/hi2"
import FileUploadModal from "./FileUploadModal"
import { createMessage } from "../../api/auth.api"
import { toast } from "react-toastify"
import { ErrorMessage } from "../../config/constants"
import type { IMessage } from "../../interfaces/Workspace"
import EmojiPicker from "emoji-picker-react"
import type { EmojiClickData } from "emoji-picker-react"

interface MessageInputProps {
  onSendMessage: (content: string | IMessage) => void | Promise<void> | ((message: IMessage) => void)
  onAttachFile?: (file: File) => void
  isEditing?: boolean
  initialContent?: string
  onCancelEdit?: () => void
  onMessageSent?: () => void
  conversationId?: string
  channelName?: string
  directMessageName?: string
}

const MAX_FILE_SIZE = 40 * 1024 * 1024

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAttachFile,
  isEditing = false,
  initialContent = "",
  onCancelEdit,
  onMessageSent,
  conversationId,
  channelName,
  directMessageName,
}) => {
  const [message, setMessage] = useState(initialContent)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)

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

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && selectedFiles.length === 0) {
      return
    }

    // Process the message with formatting before sending
    let processedMessage = message

    // Apply bold formatting if active
    if (isBold) {
      processedMessage = `**${processedMessage}**`
    }

    // Apply italic formatting if active
    if (isItalic) {
      processedMessage = `*${processedMessage}*`
    }

    if (isEditing) {
      onSendMessage(processedMessage)
      setMessage("")
      setIsBold(false)
      setIsItalic(false)
      return
    }

    if (!conversationId) {
      toast.error("Conversation ID is missing")
      return
    }

    // Validate file sizes before sending
    const oversizedFiles = selectedFiles.filter((file) => file.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the 40MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`)
      return
    }

    setIsSending(true)

    try {
      const response = await createMessage(conversationId, processedMessage, selectedFiles)

      if (response.status === "success") {
        // Pass the new message to the parent component
        onSendMessage(response.data)

        setMessage("")
        setSelectedFiles([])
        setIsBold(false)
        setIsItalic(false)
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Toggle bold formatting
  const toggleBold = () => {
    setIsBold(!isBold)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Toggle italic formatting
  const toggleItalic = () => {
    setIsItalic(!isItalic)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Handle list formatting
  const insertList = () => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const selectedText = message.substring(start, end)
    const beforeText = message.substring(0, start)
    const afterText = message.substring(end)

    let newText

    if (selectedText) {
      // Convert selected text to numbered list
      const lines = selectedText.split("\n")
      const numberedLines = lines.map((line, index) => `${index + 1}. ${line}`)
      newText = beforeText + numberedLines.join("\n") + afterText
    } else {
      // Start a numbered list with the current message
      const lines = message.split("\n")
      const numberedLines = lines.map((line, index) => `${index + 1}. ${line}`)
      newText = numberedLines.join("\n")
    }

    setMessage(newText)

    // Focus back on textarea after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  // Handle code block formatting
  const insertCodeBlock = () => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const selectedText = message.substring(start, end)
    const beforeText = message.substring(0, start)
    const afterText = message.substring(end)

    let newText

    if (selectedText) {
      // Wrap selected text in code block
      newText = beforeText + "```\n" + selectedText + "\n```" + afterText
    } else {
      // Wrap entire message in code block
      newText = "```\n" + message + "\n```"
    }

    setMessage(newText)

    // Focus back on textarea after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
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
    // Validate file size before adding
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File "${file.name}" exceeds the 40MB size limit`)
      return
    }

    setSelectedFiles((prev) => [...prev, file])
    setShowFileUploadModal(false)

    if (onAttachFile) {
      onAttachFile(file)
    }
  }

  const getPlaceholderText = () => {
    if (channelName) {
      return `Message #${channelName}`
    } else if (directMessageName) {
      return `Message ${directMessageName}`
    }
    return "Type a message..."
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 relative">
      {/* Update the formatting buttons to use the improved function */}
      <div className="flex items-center space-x-2 mb-2">
        <Tooltip content="Bold">
          <Button color={isBold ? "blue" : "gray"} pill size="xs" onClick={toggleBold} type="button">
            <span className="font-bold">B</span>
          </Button>
        </Tooltip>

        <Tooltip content="Italic">
          <Button color={isItalic ? "blue" : "gray"} pill size="xs" onClick={toggleItalic} type="button">
            <span className="italic">/</span>
          </Button>
        </Tooltip>

        <Tooltip content="Numbered List">
          <Button color="gray" pill size="xs" onClick={insertList} type="button">
            <HiListBullet className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Code Block">
          <Button color="gray" pill size="xs" onClick={insertCodeBlock} type="button">
            <HiCode className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center">
              <span className="truncate max-w-[150px]">{file.name}</span>
              <span className="text-xs text-gray-500 ml-1">({(file.size / (1024 * 1024)).toFixed(2)}MB)</span>
              <button
                type="button"
                className="ml-1 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center">
        {/* Update the textarea to show formatting visually */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              isBold ? "font-bold" : ""
            } ${isItalic ? "italic" : ""}`}
            placeholder={getPlaceholderText()}
            rows={1}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              // Auto-resize the textarea based on content
              e.target.style.height = "auto"
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
            }}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          {(isBold || isItalic) && (
            <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-bl-md">
              {isBold && isItalic ? "Bold + Italic" : isBold ? "Bold" : "Italic"}
            </div>
          )}
        </div>

        <div className="ml-2 flex items-center space-x-2">
          <div className="relative">
            <Tooltip content="Add Emoji">
              <Button
                ref={emojiButtonRef}
                color="gray"
                pill
                size="sm"
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <HiEmojiHappy className="h-4 w-4" />
              </Button>
            </Tooltip>

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full right-0 mb-2 z-50"
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

          <Tooltip content="Attach File">
            <Button color="gray" pill size="sm" type="button" onClick={() => setShowFileUploadModal(true)}>
              <HiPaperClip className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Button
            color="blue"
            pill
            size="sm"
            type="submit"
            disabled={isSending || (!message.trim() && selectedFiles.length === 0)}
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></div>
                <span>Sending</span>
              </>
            ) : (
              <>
                <HiPaperAirplane className="h-4 w-4" />
                <span className="ml-1">Send</span>
              </>
            )}
          </Button>

          {isEditing && onCancelEdit && (
            <Button color="gray" pill size="sm" type="button" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <FileUploadModal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        onFileUpload={handleFileUpload}
        maxFileSize={MAX_FILE_SIZE}
      />
    </form>
  )
}

export default MessageInput
