"use client"

import React, { useState, useMemo, useRef } from "react"
import { Avatar, Button, Dropdown } from "flowbite-react"
import { HiDotsVertical, HiPencil, HiTrash, HiEmojiHappy, HiEye, HiX } from "react-icons/hi"
import { formatTime } from "../../utils/formatUtils"
import type { IMessage, ISender } from "../../interfaces/Workspace"
import { useNavigate } from "react-router-dom"
import { getAuthSelector } from "../../redux/selectors"
import { useSelector } from "react-redux"
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog"
import { toast } from "react-toastify"
import EmojiPicker from "emoji-picker-react"
import type { EmojiClickData } from "emoji-picker-react"

interface MessageItemProps {
  message: IMessage
  user: ISender | string
  onEdit: (messageId: string) => void
  onDelete: (messageId: string) => void
  onReact: (messageId: string, emoji: string) => void
  onViewProfile?: (userId: string) => void
  isOnline?: boolean
}

const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ message, user, onEdit, onDelete, onReact, isOnline = false }) => {
    const [showActions, setShowActions] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [zoomedImage, setZoomedImage] = useState<string | null>(null)
    const emojiPickerRef = useRef<HTMLDivElement>(null)
    const emojiButtonRef = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate()
    const auth: any = useSelector(getAuthSelector)

    // Check if user is a string or an object
    const isUserObject = typeof user !== "string"

    const formattedContent = useMemo(() => {
      // First replace newlines with <br> tags
      let content = message.content.replace(/\n/g, "<br>")

      // Check for code blocks and process them
      const codeBlockRegex = /```([\s\S]*?)```/g
      content = content.replace(
        codeBlockRegex,
        '<pre class="bg-gray-800 text-green-400 p-3 rounded-md my-2 overflow-x-auto font-mono text-sm max-w-[50%]">$1</pre>',
      )

      // Replace **text** with <strong>text</strong> for bold
      content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Replace *text* or _text_ with <em>text</em> for italic
      content = content.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>")

      // Replace `text` with <code>text</code> for inline code
      content = content.replace(
        /`([^`]+)`/g,
        "<code class='bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'>$1</code>",
      )

      // Replace list items (- item) with proper list formatting
      content = content.replace(/^- (.*)$/gm, "• $1")

      // Fix numbered list items - use a div with flex instead of spans to avoid unwanted spacing
      content = content.replace(
        /(\d+)\. (.*?)(?=<br>\d+\.|<br>$|$)/g,
        '<div class="flex items-start mb-1"><span class="mr-2 flex-shrink-0">$1.</span><div>$2</div></div>',
      )

      return content
    }, [message.content])

    // Use the isEdited field directly instead of comparing timestamps
    const isEdited = message.isEdited === true

    // Safely determine if current user is the message sender
    const isCurrentUser = isUserObject && user._id === auth?.user?._id
    const messageTime = formatTime(message.createdAt)

    // Close emoji picker when clicking outside
    React.useEffect(() => {
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

    // Update the handleEmojiSelect function to call onReact directly
    const handleEmojiSelect = (emojiData: EmojiClickData) => {
      onReact(message._id, emojiData.emoji)
      setShowEmojiPicker(false)
    }

    const handleViewProfile = () => {
      if (!isUserObject) {
        toast.error("Can not view profile of unknown user")
        return
      }

      if (isCurrentUser) {
        navigate("/profile")
      } else {
        navigate(`/profile/${user._id}`)
      }
    }

    // Check if a file is an image
    const isImageFile = (type: string) => {
      return type.startsWith("image/")
    }

    // Handle image click for zoom
    const handleImageClick = (imageUrl: string) => {
      setZoomedImage(imageUrl)
    }

    // Close zoomed image
    const closeZoomedImage = () => {
      setZoomedImage(null)
    }

    // If user is not an object, render a simplified message
    if (!isUserObject) {
      return (
        <div className="py-2 px-4 hover:bg-gray-100 flex relative">
          <div className="mr-3">
            <Avatar rounded size="md" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-semibold text-gray-500">Người dùng không xác định</span>
              <span className="text-gray-500 text-xs ml-2">{messageTime}</span>
            </div>
            <div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        </div>
      )
    }

    return (
      <div
        className="py-2 px-4 hover:bg-gray-100 flex relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="cursor-pointer relative" onClick={handleViewProfile}>
          <Avatar img={user.avatar} rounded size="md" className="mr-3" />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold cursor-pointer hover:underline" onClick={handleViewProfile}>
              {user.name}
            </span>
            <span className="text-gray-500 text-xs ml-2">{messageTime}</span>
            {isEdited && <span className="text-purple-700 text-xs ml-1 font-semibold">(Edited)</span>}

            {showActions && (
              <div className="ml-2 flex">
                <div className="relative">
                  <Button
                    ref={emojiButtonRef}
                    color="gray"
                    pill
                    size="xs"
                    className="p-1 mr-1"
                    onClick={handleReactionClick}
                  >
                    <HiEmojiHappy className="h-3 w-3" />
                  </Button>

                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute z-50 top-6 left-0"
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
                {isCurrentUser && (
                  <>
                    <Button color="gray" pill size="xs" className="p-1 mr-1" onClick={() => onEdit(message._id)}>
                      <HiPencil className="h-3 w-3" />
                    </Button>
                    <Button color="gray" pill size="xs" className="p-1" onClick={handleDeleteClick}>
                      <HiTrash className="h-3 w-3" />
                    </Button>
                  </>
                )}

                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <div className="p-1 ml-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full h-6 w-6 cursor-pointer">
                      <HiDotsVertical className="h-3 w-3" />
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

          <div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: formattedContent }} />

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="mt-2">
                  {isImageFile(attachment.type) ? (
                    // Display images with click-to-zoom
                    <div key={`image-${attachment.id}`} className="mt-2">
                      <img
                        src={attachment.url || "/placeholder.svg"}
                        alt={attachment.name}
                        className="max-w-md rounded-md border border-gray-200 cursor-pointer transition-transform hover:opacity-90"
                        style={{ maxHeight: "300px" }}
                        onClick={() => handleImageClick(attachment.url || "/placeholder.svg")}
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        {attachment.name} ({attachment.size} MB)
                      </div>
                    </div>
                  ) : attachment.type.startsWith("video/") ? (
                    // Display videos with controls
                    <div key={`video-${attachment.id}`} className="mt-2">
                      <video
                        src={attachment.url}
                        controls
                        className="max-w-md rounded-md border border-gray-200"
                        style={{ maxHeight: "300px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <div className="mt-1 text-xs text-gray-500">
                        {attachment.name} ({attachment.size} MB)
                      </div>
                    </div>
                  ) : (
                    // Display other files as downloadable items
                    <div
                      key={`file-${attachment.id}`}
                      className="border border-gray-200 rounded-md p-3 bg-gray-50 inline-block"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 text-blue-500">
                          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 mr-2">
                          <div className="text-sm font-medium">{attachment.name}</div>
                          <div className="text-xs text-gray-500">{attachment.size} MB</div>
                        </div>
                        <a href={attachment.url} download={attachment.name} target="_blank" rel="noopener noreferrer">
                          <Button color="gray" size="xs" pill>
                            <HiEye className="h-3 w-3" />
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
            <div className="mt-2 flex flex-wrap gap-2">
              {message.reactions.map((reaction) => {
                // Check if current user has reacted with this emoji
                const currentUserId = auth?.user?._id
                const userHasReacted = reaction.users.includes(currentUserId)

                // Create a tooltip title that shows who reacted
                let tooltipTitle = ""
                if (reaction.users.length > 0) {
                  if (userHasReacted) {
                    tooltipTitle = "You"
                    if (reaction.users.length > 1) {
                      tooltipTitle += ` and ${reaction.users.length - 1} other${reaction.users.length > 2 ? "s" : ""}`
                    }
                  } else {
                    tooltipTitle = `${reaction.users.length} user${reaction.users.length > 1 ? "s" : ""}`
                  }
                }

                return (
                  <button
                    key={reaction.id}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      userHasReacted ? "bg-blue-100 hover:bg-blue-200" : "bg-gray-100 hover:bg-gray-200"
                    } transition-all duration-200`}
                    onClick={() => onReact(message._id, reaction.emoji)}
                    title={tooltipTitle}
                  >
                    <span className="mr-1">{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeZoomedImage}
          >
            <div className="relative max-w-4xl max-h-screen p-4">
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200"
                onClick={closeZoomedImage}
              >
                <HiX className="h-6 w-6" />
              </button>
              <img
                src={zoomedImage || "/placeholder.svg"}
                alt="Zoomed image"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    )
  },
)

MessageItem.displayName = "MessageItem"

export default MessageItem
