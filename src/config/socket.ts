import { io, type Socket } from 'socket.io-client'
import { toast } from 'react-toastify'
import type { IMessage } from '../interfaces/Workspace'

// Create a singleton socket instance
let socket: Socket | null = null

// Initialize socket connection
export const initSocket = (): Socket => {
  if (!socket) {
    const SOCKET_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8099'

    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    // Setup connection event handlers
    socket.on('connect', () => {})

    socket.on('connect_error', () => {
      toast.error('Failed to connect to chat server. Retrying...')
    })

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, reconnect manually
        socket?.connect()
      }
    })
  }

  return socket
}

// Join a conversation
export const joinConversation = (conversationId: string, userId: string) => {
  if (!socket) return
  socket.emit('join-conversation', conversationId, userId)
}

// Leave a conversation
export const leaveConversation = (conversationId: string, userId: string) => {
  if (!socket) return
  socket.emit('leave-conversation', conversationId, userId)
}

// Send a message
export const sendMessage = (message: IMessage) => {
  if (!socket) return
  socket.emit('send-message', message)
}

// Edit a message
export const editMessage = (message: IMessage) => {
  if (!socket) return
  socket.emit('edit-message', message)
}

// Delete a message
export const deleteMessage = (message: IMessage) => {
  if (!socket) return
  socket.emit('delete-message', message)
}

// Join workspace to track online users
export const joinWorkspaceOnline = (workspaceId: string, userId: string) => {
  if (!socket) return
  socket.emit('join-workspace-online', workspaceId, userId)
}

// React to a message
export const reactMessage = (message: IMessage) => {
  if (!socket) return
  socket.emit('react-message', message)
}

// Setup message listeners
export const setupMessageListeners = (
  onReceiveMessage: (message: IMessage) => void,
  onEditMessage: (message: IMessage) => void,
  onDeleteMessage: (message: IMessage) => void,
  onReactMessage: (message: IMessage) => void // Add this parameter
) => {
  if (!socket) return

  // Remove any existing listeners to prevent duplicates
  socket.off('receive-message')
  socket.off('receive-edit-message')
  socket.off('receive-delete-message')
  socket.off('receive-react-message') // Add this line

  // Add new listeners
  socket.on('receive-message', (message) => {
    onReceiveMessage(message)
  })

  socket.on('receive-edit-message', (message) => {
    onEditMessage(message)
  })

  socket.on('receive-delete-message', (message) => {
    onDeleteMessage(message)
  })

  // Add reaction listener
  socket.on('receive-react-message', (message) => {
    onReactMessage(message)
  })

  return () => {
    socket?.off('receive-message')
    socket?.off('receive-edit-message')
    socket?.off('receive-delete-message')
    socket?.off('receive-react-message') // Add this line
  }
}

// Setup online users listeners
export const setupOnlineUsersListeners = (
  onUsersOnline: (userIds: string[]) => void,
  onUserOnline: (userId: string) => void,
  onUserOffline: (userId: string) => void
) => {
  if (!socket) return

  // Remove any existing listeners to prevent duplicates
  socket.off('users-online')
  socket.off('user-online')
  socket.off('user-offline')

  // Add new listeners
  socket.on('users-online', onUsersOnline)
  socket.on('user-online', onUserOnline)
  socket.on('user-offline', onUserOffline)

  return () => {
    socket?.off('users-online')
    socket?.off('user-online')
    socket?.off('user-offline')
  }
}

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log('Socket disconnected')
  }
}

export default socket
