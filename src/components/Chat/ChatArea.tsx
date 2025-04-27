import type React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ChatHeader from './ChatHeader'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import { getChannelById, getDirectMessageById, getDirectMessageParticipants } from '../../mockData/workspaces'
import type { IMessage, IChannel, IDirectMessage } from '../../interfaces/Workspace'
import { getMessagebyConversationId, getChannelsByWorkspaceId, getAllDmConversationsOfUser } from '../../api/auth.api'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../config/constants'

const ChatArea: React.FC = () => {
  const { channelId, directMessageId, conversationId, workspaceId } = useParams<{
    channelId: string
    directMessageId: string
    conversationId: string
    workspaceId: string
  }>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentChannel, setCurrentChannel] = useState<IChannel | null>(null)
  const [currentDirectMessage, setCurrentDirectMessage] = useState<IDirectMessage | null>(null)

  // Fetch current channel details
  useEffect(() => {
    const fetchCurrentChannel = async () => {
      if (!workspaceId || !conversationId) return

      try {
        const res = await getChannelsByWorkspaceId(workspaceId)
        if (res.status === 'success') {
          const channel = res.data.find((ch: IChannel) => ch.conversationId === conversationId)
          if (channel) {
            setCurrentChannel(channel)
          } else {
            // If not found in channels, it might be a direct message
            setCurrentChannel(null)
          }
        }
      } catch (error: any) {
        console.error('Error fetching channel details:', error)
      }
    }

    fetchCurrentChannel()
  }, [workspaceId, conversationId])

  // Fetch current direct message details
  useEffect(() => {
    const fetchCurrentDirectMessage = async () => {
      if (!conversationId) return

      try {
        console.log('Fetching DM details for conversation:', conversationId)
        const res = await getAllDmConversationsOfUser()
        if (res.status === 'success') {
          const dm = res.data.find((dm: IDirectMessage) => dm.conversationId === conversationId)
          if (dm) {
            console.log('Found DM:', dm)
            setCurrentDirectMessage(dm)
          } else {
            console.log('DM not found for conversationId:', conversationId)
            setCurrentDirectMessage(null)
          }
        }
      } catch (error: any) {
        console.error('Error fetching direct message details:', error)
      }
    }

    fetchCurrentDirectMessage()
  }, [conversationId])

  const channel = useMemo(
    () => currentChannel || (channelId ? getChannelById(channelId) : undefined),
    [currentChannel, channelId]
  )

  const directMessage = useMemo(
    () => currentDirectMessage || (directMessageId ? getDirectMessageById(directMessageId) : undefined),
    [currentDirectMessage, directMessageId]
  )

  const directMessageUser = useMemo(() => {
    if (!directMessageId) return undefined
    const participants = getDirectMessageParticipants(directMessageId)
    return participants.find((user) => user._id !== 'user1')
  }, [directMessageId])

  const fetchMessages = useCallback(
    async (showLoadingState = true) => {
      if (!conversationId) return

      if (showLoadingState) {
        setIsLoading(true)
      }

      try {
        console.log('Fetching messages for conversation:', conversationId)
        const res = await getMessagebyConversationId(conversationId)
        if (res.status === 'success') {
          setMessages(res.data)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message ?? ErrorMessage)
        setMessages([])
      } finally {
        if (showLoadingState) {
          setIsLoading(false)
        }
      }
    },
    [conversationId]
  )

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleSendMessage = useCallback(
    (content: string) => {
      // Refresh messages without showing loading state
      fetchMessages(false)
    },
    [fetchMessages]
  )

  const handleAttachFile = useCallback(
    (file: File) => {
      // File handling is now done in the MessageInput component
      // This is kept for backward compatibility
    },
    [channelId, directMessageId]
  )

  const handleEditMessage = useCallback((messageId: string) => {
    setEditingMessageId(messageId)
  }, [])

  const handleUpdateMessage = useCallback(
    (content: string) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === editingMessageId
            ? {
                ...message,
                content,
                updatedAt: new Date().toISOString(),
                isEdited: true
              }
            : message
        )
      )
      setEditingMessageId(null)
    },
    [editingMessageId]
  )

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((message) => message._id !== messageId))
  }, [])

  const handleReactToMessage = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message._id !== messageId) return message

        const existingReaction = message.reactions?.find((r) => r.emoji === emoji)

        if (existingReaction) {
          // Toggle user's reaction
          const userHasReacted = existingReaction.users.includes('user1')

          if (userHasReacted) {
            // Remove user's reaction
            const updatedUsers = existingReaction.users.filter((id) => id !== 'user1')

            if (updatedUsers.length === 0) {
              // Remove the reaction entirely if no users left
              return {
                ...message,
                reactions: message.reactions?.filter((r) => r.emoji !== emoji)
              }
            }

            return {
              ...message,
              reactions: message.reactions?.map((r) =>
                r.emoji === emoji ? { ...r, users: updatedUsers, count: r.count - 1 } : r
              )
            }
          } else {
            // Add user's reaction
            return {
              ...message,
              reactions: message.reactions?.map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      users: [...r.users, 'user1'],
                      count: r.count + 1
                    }
                  : r
              )
            }
          }
        } else {
          // Create new reaction
          const newReaction = {
            id: `reaction${Date.now()}`,
            emoji,
            count: 1,
            users: ['user1'],
            messageId
          }

          return {
            ...message,
            reactions: [...(message.reactions || []), newReaction]
          }
        }
      })
    )
  }, [])

  const editingMessage = useMemo(() => {
    if (!editingMessageId) return null
    return messages.find((message) => message._id === editingMessageId)
  }, [editingMessageId, messages])

  if (isLoading) {
    return (
      <div className='flex-1 flex flex-col h-screen'>
        <ChatHeader channel={channel} directMessage={directMessage} directMessageUser={directMessageUser} />
        <div className='flex-1 flex items-center justify-center'>
          <div className='h-8 w-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col h-screen'>
      <ChatHeader channel={channel} directMessage={directMessage} directMessageUser={directMessageUser} />

      <div className='flex-1 overflow-y-auto'>
        <div className='py-4'>
          {messages.length > 0 ? (
            messages.map((message) => {
              if (editingMessageId === message._id) {
                return (
                  <div key={message._id} className='py-2 px-4'>
                    <div className='flex items-center mb-2'>
                      <span className='font-semibold'>{message.senderId.name}</span>
                    </div>
                    <MessageInput
                      onSendMessage={handleUpdateMessage}
                      isEditing={true}
                      initialContent={message.content}
                      onCancelEdit={() => setEditingMessageId(null)}
                    />
                  </div>
                )
              }

              return (
                <MessageItem
                  key={message._id}
                  message={message}
                  user={message.senderId}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  onReact={handleReactToMessage}
                />
              )
            })
          ) : (
            <div className='flex items-center justify-center h-full p-8'>
              <div className='text-center text-gray-500'>
                <p className='text-lg mb-2'>No messages yet</p>
                <p className='text-sm'>Be the first to send a message!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!editingMessageId && (
        <MessageInput
          onSendMessage={handleSendMessage}
          onAttachFile={handleAttachFile}
          onMessageSent={() => fetchMessages(false)}
        />
      )}
    </div>
  )
}

export default ChatArea
