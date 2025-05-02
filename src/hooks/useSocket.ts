import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAuthSelector } from '../redux/selectors'
import { useParams } from 'react-router-dom'
import {
  initSocket,
  joinConversation,
  leaveConversation,
  joinWorkspaceOnline,
  setupMessageListeners,
  setupOnlineUsersListeners
} from '../config/socket'
import type { IMessage, ISender } from '../interfaces/Workspace'
import { getUserById } from '../api/auth.api'

export const useSocket = () => {
  const { workspaceId, conversationId } = useParams<{ workspaceId: string; conversationId: string }>()
  const auth: any = useSelector(getAuthSelector)
  const userId = auth?.user?._id
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return

    const socket = initSocket()

    const handleConnect = () => {
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    // Set initial connection state
    setIsConnected(socket.connected)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [userId])

  // Join workspace for online users tracking
  useEffect(() => {
    if (!workspaceId || !userId || !isConnected) return

    joinWorkspaceOnline(workspaceId, userId)

    const cleanupOnlineListeners = setupOnlineUsersListeners(
      // Handle initial list of online users
      (userIds) => {
        console.log('Users online:', userIds)
        setOnlineUsers(userIds)
      },
      // Handle user coming online
      (newUserId) => {
        console.log('User online:', newUserId)
        setOnlineUsers((prev) => {
          if (prev.includes(newUserId)) return prev
          return [...prev, newUserId]
        })
      },
      // Handle user going offline
      (offlineUserId) => {
        console.log('User offline:', offlineUserId)
        setOnlineUsers((prev) => prev.filter((id) => id !== offlineUserId))
      }
    )

    return () => {
      if (cleanupOnlineListeners) cleanupOnlineListeners()
    }
  }, [workspaceId, userId, isConnected])

  // Join conversation when conversationId changes
  useEffect(() => {
    if (!conversationId || !userId || !isConnected) return

    joinConversation(conversationId, userId)

    return () => {
      if (conversationId && userId) {
        leaveConversation(conversationId, userId)
      }
    }
  }, [conversationId, userId, isConnected])

  // Helper function to enrich message with user data
  const enrichMessageWithUserData = async (message: IMessage): Promise<IMessage> => {
    if (typeof message.senderId === 'string') {
      try {
        const response = await getUserById(message.senderId)
        if (response.status === 'success') {
          return {
            ...message,
            senderId: {
              _id: message.senderId,
              name: response.data.name,
              avatar: response.data.avatar || ''
            } as ISender
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    return message
  }

  // Setup message listeners
  const setupChatListeners = (
    onReceiveMessage: (message: IMessage) => void,
    onEditMessage: (message: IMessage) => void,
    onDeleteMessage: (message: IMessage) => void
  ) => {
    if (!isConnected) return undefined

    // Create wrapped handlers that enrich messages with user data
    const handleReceiveMessage = async (message: IMessage) => {
      const enrichedMessage = await enrichMessageWithUserData(message)
      onReceiveMessage(enrichedMessage)
    }

    const handleEditMessage = async (message: IMessage) => {
      const enrichedMessage = await enrichMessageWithUserData(message)
      onEditMessage(enrichedMessage)
    }

    const handleDeleteMessage = async (message: IMessage) => {
      const enrichedMessage = await enrichMessageWithUserData(message)
      onDeleteMessage(enrichedMessage)
    }

    return setupMessageListeners(handleReceiveMessage, handleEditMessage, handleDeleteMessage)
  }

  return {
    isConnected,
    onlineUsers,
    setupChatListeners
  }
}

export default useSocket
