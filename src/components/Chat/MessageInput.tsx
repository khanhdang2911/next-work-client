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
  isChatbot?: boolean;
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
  // const [formattedRanges, setFormattedRanges] = useState<
  //   {
  //     type: "bold" | "italic"
  //     start: number
  //     end: number
  //   }[]
  // >([])

  const contentEditableRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isEditing && contentEditableRef.current) {
      contentEditableRef.current.focus()
    }
  }, [isEditing])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside both the emoji picker and the emoji button
      if (
        showEmojiPicker &&
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
  }, [showEmojiPicker]) // Add showEmojiPicker as a dependency

  // Convert formatted content to markdown before sending
  const getMarkdownContent = () => {
    if (!contentEditableRef.current) return message

    // Get the HTML content
    const htmlContent = contentEditableRef.current.innerHTML

    // Convert HTML to markdown
    let markdownContent = htmlContent
      .replace(/<div><br><\/div>/g, "\n")
      .replace(/<div>(.*?)<\/div>/g, "\n$1")
      .replace(/<br>/g, "\n")
      .replace(/<b>(.*?)<\/b>/g, "**$1**")
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<i>(.*?)<\/i>/g, "*$1*")
      .replace(/<em>(.*?)<\/em>/g, "*$1*")

    // Clean up any HTML entities
    markdownContent = markdownContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")

    return markdownContent.trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Get the markdown content from the contentEditable div
    const markdownContent = getMarkdownContent()

    if (!markdownContent.trim() && selectedFiles.length === 0) {
      return
    }

    if (isEditing) {
      onSendMessage(markdownContent)
      setMessage("")
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = ""
      }
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
      const response = await createMessage(conversationId, markdownContent, selectedFiles)

      if (response.status === "success") {
        // Pass the new message to the parent component
        onSendMessage(response.data)

        setMessage("")
        setSelectedFiles([])

        // Clear the contentEditable div
        if (contentEditableRef.current) {
          contentEditableRef.current.innerHTML = ""
        }

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

  // Apply formatting to selected text
  const applyFormatting = (formatType: "bold" | "italic") => {
    if (document.getSelection) {
      const selection = document.getSelection()
      if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
        // Check if the selection is within our contentEditable div
        const range = selection.getRangeAt(0)
        if (contentEditableRef.current && contentEditableRef.current.contains(range.commonAncestorContainer)) {
          // Apply the formatting using execCommand
          document.execCommand(formatType, false, "")
        } else {
          toast.info("Please select text in the message input")
        }
      } else {
        toast.info("Please select text to format")
      }
    }
  }

  // Handle list formatting
  const insertList = () => {
    if (!contentEditableRef.current) return

    const selection = document.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (contentEditableRef.current.contains(range.commonAncestorContainer)) {
        // Get selected text
        const selectedText = selection.toString()

        if (selectedText) {
          // Convert selected text to numbered list
          const lines = selectedText.split("\n").filter((line) => line.trim() !== "")
          const numberedLines = lines.map((line, index) => `${index + 1}. ${line}`)
          const formattedList = numberedLines.join("\n")

          // Replace the selected content with the numbered list
          document.execCommand("insertText", false, formattedList)
        } else {
          // Insert a new numbered list item
          document.execCommand("insertText", false, "1. ")
        }
      }
    }
  }

  // Handle code block formatting
  const insertCodeBlock = () => {
    if (!contentEditableRef.current) return

    const selection = document.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (contentEditableRef.current.contains(range.commonAncestorContainer)) {
        // Get selected text
        const selectedText = selection.toString()

        if (selectedText) {
          // Wrap selected text in code block
          const codeBlock = `\`\`\`\n${selectedText}\n\`\`\``
          document.execCommand("insertText", false, codeBlock)
        } else {
          // Insert an empty code block
          document.execCommand("insertText", false, "```\n\n```")

          // Position cursor inside the code block
          const selection = document.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.setStart(range.startContainer, range.startOffset - 4)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }
      }
    }
  }

  // Update the handleEmojiSelect function to properly insert emojis at the current cursor position
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    if (contentEditableRef.current) {
      // Store the current cursor position before focusing
      const savedSelection = saveSelection(contentEditableRef.current)

      // Focus the input
      contentEditableRef.current.focus()

      if (savedSelection) {
        // Restore the cursor position
        restoreSelection(savedSelection)
      } else {
        // If no saved selection, place cursor at the end
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(contentEditableRef.current)
        range.collapse(false) // collapse to the end
        selection?.removeAllRanges()
        selection?.addRange(range)
      }

      // Insert the emoji at the current cursor position
      document.execCommand("insertText", false, emojiData.emoji)

      // Update the message state with the new content
      setMessage(contentEditableRef.current.innerText)
    }
  }

  // Add these helper functions to save and restore selection (cursor position)
  const saveSelection = (containerEl: HTMLElement) => {
    if (window.getSelection) {
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        if (containerEl.contains(range.commonAncestorContainer)) {
          return range.cloneRange()
        }
      }
    }
    return null
  }

  const restoreSelection = (savedSel: Range) => {
    if (window.getSelection && savedSel) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(savedSel)
      return true
    }
    return false
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

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      setMessage(contentEditableRef.current.innerText)
    }
  }

  // Add this function after the handleContentChange function
  const handleFocus = () => {
    if (contentEditableRef.current) {
      // If there's no content, place cursor at the beginning
      if (!contentEditableRef.current.textContent) {
        const range = document.createRange()
        const selection = window.getSelection()
        range.setStart(contentEditableRef.current, 0)
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 relative">
      {/* Update the formatting buttons to use the improved function */}
      <div className="flex items-center space-x-2 mb-2">
        <Tooltip content="Bold (select text first)">
          <Button color="gray" pill size="xs" onClick={() => applyFormatting("bold")} type="button">
            <span className="font-bold">B</span>
          </Button>
        </Tooltip>

        <Tooltip content="Italic (select text first)">
          <Button color="gray" pill size="xs" onClick={() => applyFormatting("italic")} type="button">
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
        <div className="relative flex-1">
          {/* ContentEditable div for rich text editing */}
          <div
            ref={contentEditableRef}
            className="w-full min-h-[40px] max-h-[200px] border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-auto"
            contentEditable
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-placeholder={getPlaceholderText()}
            style={{ outline: "none" }}
            dangerouslySetInnerHTML={{ __html: initialContent }}
          />

          {/* Placeholder text */}
          {!message && (
            <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">{getPlaceholderText()}</div>
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
