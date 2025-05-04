export interface IWorkspace {
  _id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface IChannel {
  _id: string
  name: string
  workspaceId: string
  description?: string
  createdAt: string
  updatedAt: string
  unreadCount?: number
  conversationId: string
}

// Cập nhật interface ISender và IMessage để hỗ trợ cả string và object
export interface ISender {
  _id: string
  name: string
  avatar?: string
}

export interface IMessage {
  _id: string
  content: string
  senderId: ISender | string // Có thể là object hoặc string ID
  conversationId: string
  reactions?: IReaction[]
  attachments?: IAttachment[]
  createdAt: string
  updatedAt: string
}

export interface IReaction {
  id: string
  emoji: string
  count: number
  users: string[]
  messageId: string
}

export interface IAttachment {
  id: string
  name: string
  type: string
  size: string
  url: string
  messageId: string
}

export interface IDirectMessage {
  _id: string
  name: string
  avatar: string
  status: string
  unreadCount?: number
  conversationId: string
}

export interface IMessageCreateResponse {
  status: string
  message: string
  data: IMessage
}
