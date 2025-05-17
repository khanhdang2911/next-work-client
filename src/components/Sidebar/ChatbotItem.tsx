import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { getAuthSelector } from "../../redux/selectors"
import { createChatbotConversation } from "../../api/conversation.api"
import { toast } from "react-toastify"
import { ErrorMessage } from "../../config/constants"
import { Avatar } from "flowbite-react"
const logo = '/favicon.svg'

interface ChatbotItemProps {
  workspaceId: string
}

const ChatbotItem: React.FC<ChatbotItemProps> = ({ workspaceId }) => {
  const navigate = useNavigate()
  const { conversationId: currentConversationId } = useParams<{ conversationId: string }>()
  const auth: any = useSelector(getAuthSelector)
  const [chatbotConversationId, setChatbotConversationId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleChatbotClick = async () => {
    try {
      // If we already have a chatbot conversation ID, navigate to it
      if (chatbotConversationId) {
        navigate(`/workspace/${workspaceId}/conversation/${chatbotConversationId}`)
        return
      }

      // Otherwise, create a new chatbot conversation
      setIsLoading(true)
      const response = await createChatbotConversation(workspaceId, [auth.user._id])

      if (response.status === "success") {
        const newConversationId = response.data._id || response.data.conversationId
        setChatbotConversationId(newConversationId)
        navigate(`/workspace/${workspaceId}/conversation/${newConversationId}`)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? ErrorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isActive = chatbotConversationId === currentConversationId

  return (
    <div
      className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
        isActive ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-gray-700"
      }`}
      onClick={handleChatbotClick}
    >
      <div className="flex items-center">
        <Avatar img={logo} rounded size="sm" alt="AI Assistant" />
        <span className="truncate">AI Assistant</span>
      </div>
      {isLoading && (
        <div className="ml-auto">
          <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default ChatbotItem
