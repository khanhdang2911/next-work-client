import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "react-router-dom"
import ChatHeader from "./ChatHeader"
import MessageItem from "./MessageItem"
import MessageInput from "./MessageInput"
import type { IMessage, IChannel, IDirectMessage } from "../../interfaces/Workspace"
import {
  getMessagebyConversationId,
  getChannelsByWorkspaceId,
  getAllDmConversationsOfUser,
  updateMessage,
  deleteMessage,
  reactToMessage,
} from "../../api/auth.api"
import { createChatbotMessage } from "../../api/conversation.api"
import { toast } from "react-toastify"
import { ErrorMessage } from "../../config/constants"
import useSocket from "../../hooks/useSocket"
import {
  sendMessage,
  editMessage as socketEditMessage,
  deleteMessage as socketDeleteMessage,
  reactMessage as socketReactMessage,
} from "../../config/socket"
import { useSelector } from "react-redux"
import { getAuthSelector } from "../../redux/selectors"
import { SkeletonChatHeader, SkeletonChatInput, SkeletonChatMessage } from "../Skeleton/SkeletonLoaders"

const ChatArea: React.FC = () => {
  const { directMessageId, conversationId, workspaceId } = useParams<{
    directMessageId: string
    conversationId: string
    workspaceId: string
  }>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentChannel, setCurrentChannel] = useState<IChannel | null>(null)
  const [currentDirectMessage, setCurrentDirectMessage] = useState<IDirectMessage | null>(null)
  const [isChatbotConversation, setIsChatbotConversation] = useState(false)
  const [isChatbotTyping, setIsChatbotTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [loadingStates, setLoadingStates] = useState({
    channel: true,
    directMessage: true,
    messages: true
  });

  // Socket integration
  const { isConnected, onlineUsers, setupChatListeners } = useSocket()

  // Then add this inside the component, near the other state declarations
  const auth: any = useSelector(getAuthSelector)

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" }) // Use "auto" for instant scrolling
  }, [])

  useEffect(() => {
    // Kiểm tra khi tất cả các loading state đều false
    if (!loadingStates.channel && !loadingStates.directMessage && !loadingStates.messages) {
      setIsLoading(false);
    }
  }, [loadingStates.channel, loadingStates.directMessage, loadingStates.messages]);
  
  useEffect(() => {
    const isViewingChatbot = window.location.pathname.includes(`/workspace/${workspaceId}/conversation/`);
    if (isViewingChatbot) {
      setIsChatbotConversation(true);
    } else {
      setIsChatbotConversation(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    scrollToBottom() // Scroll to the bottom whenever messages change
  }, [messages, scrollToBottom])

  // Fetch current channel details
  useEffect(() => {
    const fetchCurrentChannel = async () => {
      if (!workspaceId || !conversationId) return

      try {
        const res = await getChannelsByWorkspaceId(workspaceId)
        if (res.status === "success") {
          const channel = res.data.find((ch: IChannel) => ch.conversationId === conversationId)
          if (channel) {
            setCurrentChannel(channel)
            setIsChatbotConversation(false)
          } else {
            // If not found in channels, it might be a direct message or chatbot
            setCurrentChannel(null)
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      } finally {
        setLoadingStates(prev => ({ ...prev, channel: false }));
      }
    }

    fetchCurrentChannel()
  }, [workspaceId, conversationId])

  // Fetch current direct message details
  useEffect(() => {
    const fetchCurrentDirectMessage = async () => {
      if (!conversationId) return

      try {
        const res = await getAllDmConversationsOfUser(workspaceId || "")
        if (res.status === "success") {
          const dm = res.data.find((dm: IDirectMessage) => dm.conversationId === conversationId)
          if (dm) {
            setCurrentDirectMessage(dm)
            setIsChatbotConversation(false)
          } else {
            setCurrentDirectMessage(null)
            // If not found in direct messages and not in channels, it might be a chatbot conversation
            if (!currentChannel) {
              setIsChatbotConversation(true)
            }
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
      } finally {
        setLoadingStates(prev => ({ ...prev, directMessage: false }));
      }
    }

    fetchCurrentDirectMessage()
  }, [conversationId, workspaceId, currentChannel])
  

  const fetchMessages = useCallback(
    async (showLoadingState = true) => {
      if (!conversationId) return

      if (showLoadingState) {
        setIsLoading(true)
      }

      try {
        const res = await getMessagebyConversationId(conversationId)
        if (res.status === "success") {
          setMessages(res.data)
          setTimeout(scrollToBottom, 100)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
        setMessages([])
      } finally {
        setLoadingStates(prev => ({ ...prev, messages: false }));
      }
    },
    [conversationId],
  )

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Setup socket listeners for real-time messages
  useEffect(() => {
    if (!isConnected || !conversationId) return

    const cleanup = setupChatListeners(
      // Handle new message
      (newMessage) => {
        if (newMessage.conversationId === conversationId) {
          setMessages((prev) => [...prev, newMessage])
          setTimeout(scrollToBottom, 100)
        }
      },
      // Handle edited message
      (updatedMessage) => {
        if (updatedMessage.conversationId === conversationId) {
          setMessages((prev) => prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg)))
        }
      },
      // Handle deleted message
      (deletedMessage) => {
        if (deletedMessage.conversationId === conversationId) {
          setMessages((prev) => prev.filter((msg) => msg._id !== deletedMessage._id))
        }
      },
      // Handle reaction to message
      (reactedMessage) => {
        if (reactedMessage.conversationId === conversationId) {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg._id === reactedMessage._id) {
                // Preserve the sender object structure
                if (typeof msg.senderId !== "string" && typeof reactedMessage.senderId === "string") {
                  reactedMessage.senderId = msg.senderId
                }
                return reactedMessage
              }
              return msg
            }),
          )
        }
      },
    )

    return cleanup
  }, [isConnected, conversationId, setupChatListeners])
// gỡ bỏ html
  const sanitizeMessageContent = (raw: string): string => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = raw
    const textContent = tempDiv.textContent || tempDiv.innerText || ""
  
    return textContent.trim()
  }

  // Handle sending a new message
  const handleSendMessage = useCallback(
    async (messageOrContent: string | IMessage) => {
      // If it's a string (from editing), convert to IMessage
      if (typeof messageOrContent === "string") {
        // This case is for editing messages
        return
      }

      // It's an IMessage object
      const message = messageOrContent as IMessage

      // Pre-enrich the message with the current user's information to avoid "Unknown User" flash
      const currentUser = auth.user
      const enrichedMessage = {
        ...message,
        senderId: {
          _id: currentUser._id,
          name: currentUser.name,
          avatar: currentUser.avatar || "",
        },
      }

      // Add message to local state immediately for better UX
      setMessages((prev) => [...prev, enrichedMessage])

      // If this is a chatbot conversation, handle it differently
      if (isChatbotConversation) {
        try {
          setIsChatbotTyping(true)
          // Send the message to the chatbot API
          const cleanContent = sanitizeMessageContent(message.content)
          const response = await createChatbotMessage(conversationId!, cleanContent)

          if (response.status === "success") {
            // Add the chatbot's response to the messages
            const chatbotMessage = {
              ...response.data,
              isChatbot: true,
              senderId: {
                _id: "chatbot",
                name: "AI Assistant",
                avatar: "",
              },
            }
            setMessages((prev) => [...prev, chatbotMessage])
            setTimeout(scrollToBottom, 100)
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message ?? ErrorMessage)
        } finally {
          setIsChatbotTyping(false)
        }
      } else {
        // For regular conversations, send via socket
        sendMessage(message)
      }

      // Scroll to bottom
      setTimeout(scrollToBottom, 100)
    },
    [auth.user, isChatbotConversation, conversationId],
  )

  const handleAttachFile = useCallback(() => {}, [currentChannel?._id, directMessageId])

  const handleEditMessage = useCallback((messageId: string) => {
    setEditingMessageId(messageId)
  }, [])

  const handleUpdateMessage = useCallback(
    async (content: string) => {
      try {
        const messageToUpdate = messages.find((msg) => msg._id === editingMessageId)
        if (!messageToUpdate) return

        const res = await updateMessage(editingMessageId!, content)
        if (res.status === "success") {
          const updatedMessage = {
            ...messageToUpdate,
            content,
            updatedAt: res.updatedAt ?? new Date().toISOString(),
            isEdited: true, // Make sure we set isEdited to true
          }

          // Update in local state
          setMessages((prev) => prev.map((message) => (message._id === editingMessageId ? updatedMessage : message)))

          // Send via socket
          socketEditMessage(updatedMessage)

          setEditingMessageId(null)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage)
      }
    },
    [editingMessageId, messages],
  )

  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const messageToDelete = messages.find((msg) => msg._id === messageId)
        if (!messageToDelete) return

        const res = await deleteMessage(messageId)
        if (res.status === "success") {
          // Remove from local state
          setMessages((prev) => prev.filter((message) => message._id !== messageId))

          // Send via socket
          socketDeleteMessage(messageToDelete)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage)
      }
    },
    [messages],
  )

  const handleReactToMessage = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        const messageToReact = messages.find((msg) => msg._id === messageId)
        if (!messageToReact) return

        // Call the API to react to the message
        const res = await reactToMessage(messageId, emoji)

        if (res.status === "success") {
          // Get the updated message with new reaction data
          const updatedMessage = res.data

          // Preserve the sender object structure if it exists
          if (typeof messageToReact.senderId !== "string" && typeof updatedMessage.senderId === "string") {
            updatedMessage.senderId = messageToReact.senderId
          }

          // Update in local state
          setMessages((prev) => prev.map((message) => (message._id === messageId ? updatedMessage : message)))

          // Send via socket
          socketReactMessage(updatedMessage)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || ErrorMessage)
      }
    },
    [messages],
  )

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <SkeletonChatHeader />
        <div className="flex-1 overflow-y-auto p-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <SkeletonChatMessage key={i} />
            ))}
        </div>
        <SkeletonChatInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader
        channel={currentChannel}
        directMessage={currentDirectMessage}
        onlineUsers={onlineUsers}
        isChatbot={isChatbotConversation}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          {currentChannel?.description && (
            <div className="px-4 pb-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Channel Description</h3>
                <p className="text-gray-600 dark:text-gray-300">{currentChannel.description}</p>
              </div>
            </div>
          )}

          {isChatbotConversation && messages.length === 0 && (
            <div className="px-4 pb-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">AI Assistant</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hello! I'm your AI assistant. How can I help you today?
                </p>
              </div>
            </div>
          )}

          {messages.length > 0 ? (
            messages.map((message) => {
              if (editingMessageId === message._id) {
                return (
                  <div key={message._id} className="py-2 px-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold">
                        {typeof message.senderId === "string" ? "Unknown User" : message.senderId.name}
                      </span>
                    </div>
                    <MessageInput
                      onSendMessage={(content) => {
                        if (typeof content === "string") {
                          handleUpdateMessage(content)
                        }
                      }}
                      isEditing={true}
                      initialContent={message.content}
                      onCancelEdit={() => setEditingMessageId(null)}
                    />
                  </div>
                )
              }

              // Use ChatbotMessageItem for chatbot conversations
              
              if (isChatbotConversation) {
                return <MessageItem
                key={message._id}
                message={message}
                user={message.senderId}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReact={handleReactToMessage}
                isChatbot={true}
              />
              }

              return (
                <MessageItem
                  key={message._id}
                  message={message}
                  user={message.senderId}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  onReact={handleReactToMessage}
                  isOnline={typeof message.senderId !== "string" && onlineUsers.includes(message.senderId._id)}
                />
              )
            })
          ) : ( !isChatbotConversation &&
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">No messages yet</p>
                <p className="text-sm">Be the first to send a message!</p>
              </div>
            </div>
          )}

          {isChatbotTyping && (
            <div className="px-4 py-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs">AI</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-sm">AI Assistant</span>
                  </div>
                  <div className="text-sm">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {!editingMessageId && (
        <MessageInput
          onSendMessage={handleSendMessage}
          onAttachFile={handleAttachFile}
          onMessageSent={() => fetchMessages(false)}
          conversationId={conversationId}
          channelName={currentChannel?.name}
          directMessageName={currentDirectMessage?.name}
          isChatbot={isChatbotConversation}
        />
      )}
    </div>
  )
}

export default ChatArea
