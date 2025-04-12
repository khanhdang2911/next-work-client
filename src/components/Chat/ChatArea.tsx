import type React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ChatHeader from './ChatHeader'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import {
  getChannelById,
  getMessagesByChannelId,
  getUserById,
  getDirectMessageById,
  getMessagesByDirectMessageId,
  getDirectMessageParticipants
} from '../../mockData/workspaces'
import type { IMessage, IAttachment } from '../../interfaces/Workspace'

const ChatArea: React.FC = () => {
  const { channelId, directMessageId } = useParams<{ channelId: string; directMessageId: string }>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)

  const channel = useMemo(() => (channelId ? getChannelById(channelId) : undefined), [channelId])
  const directMessage = useMemo(
    () => (directMessageId ? getDirectMessageById(directMessageId) : undefined),
    [directMessageId]
  )
  const directMessageUser = useMemo(() => {
    if (!directMessageId) return undefined
    const participants = getDirectMessageParticipants(directMessageId)
    return participants.find((user) => user.id !== 'user1')
  }, [directMessageId])

  useEffect(() => {
    if (channelId) {
      setMessages(getMessagesByChannelId(channelId))
    } else if (directMessageId) {
      setMessages(getMessagesByDirectMessageId(directMessageId))
    }
    setEditingMessageId(null)
  }, [channelId, directMessageId])

  const handleSendMessage = useCallback(
    (content: string) => {
      const newMessage: IMessage = {
        id: `message${Date.now()}`,
        content,
        userId: 'user1',
        channelId: channelId,
        directMessageId: directMessageId,
        workspaceId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reactions: []
      }

      setMessages((prev) => [...prev, newMessage])
    },
    [channelId, directMessageId]
  )

  const handleAttachFile = useCallback(
    (file: File) => {
      const attachment: IAttachment = {
        id: `attachment${Date.now()}`,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: '#',
        messageId: `message${Date.now()}`
      }

      const newMessage: IMessage = {
        id: attachment.messageId,
        content: `Attached file: ${file.name}`,
        userId: 'user1',
        channelId: channelId,
        directMessageId: directMessageId,
        workspaceId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reactions: [],
        attachments: [attachment]
      }

      setMessages((prev) => [...prev, newMessage])
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
          message.id === editingMessageId
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
    setMessages((prev) => prev.filter((message) => message.id !== messageId))
  }, [])

  const handleReactToMessage = useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId) return message

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
    return messages.find((message) => message.id === editingMessageId)
  }, [editingMessageId, messages])

  return (
    <div className='flex-1 flex flex-col h-screen'>
      <ChatHeader channel={channel} directMessageUser={directMessageUser} />

      <div className='flex-1 overflow-y-auto'>
        <div className='py-4'>
          {messages.map((message) => {
            const user = getUserById(message.userId)
            if (!user) return null

            if (editingMessageId === message.id) {
              return (
                <div key={message.id} className='py-2 px-4'>
                  <div className='flex items-center mb-2'>
                    <span className='font-semibold'>{user.name}</span>
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
                key={message.id}
                message={message}
                user={user}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReact={handleReactToMessage}
              />
            )
          })}
        </div>
      </div>

      {!editingMessageId && <MessageInput onSendMessage={handleSendMessage} onAttachFile={handleAttachFile} />}
    </div>
  )
}

export default ChatArea
