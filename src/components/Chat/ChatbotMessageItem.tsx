import type React from "react"
import { formatTime } from "../../utils/formatUtils"
import type { IMessage } from "../../interfaces/Workspace"
import { Avatar } from "flowbite-react"
const logo = '/favicon.svg'

interface ChatbotMessageItemProps {
  message: IMessage
}

const ChatbotMessageItem: React.FC<ChatbotMessageItemProps> = ({ message }) => {
  const isUserMessage = !message.isEdited && !message.isChatbot

  return (
    <div className={`py-2 px-4 ${isUserMessage ? "bg-gray-50 dark:bg-gray-800" : ""}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {isUserMessage ? (
            <Avatar
              img={typeof message.senderId !== "string" ? message.senderId.avatar : undefined}
              rounded
              size="sm"
              alt={typeof message.senderId !== "string" ? message.senderId.name : "User"}
            />
          ) : (
            <Avatar img={logo} rounded size="sm" alt="AI Assistant" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className="font-semibold text-sm">
              {isUserMessage ? (typeof message.senderId !== "string" ? message.senderId.name : "User") : "AI Assistant"}
            </span>
            <span className="ml-2 text-xs text-gray-500">{formatTime(message.createdAt)}</span>
          </div>
          <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
        </div>
      </div>
    </div>
  )
}

export default ChatbotMessageItem
