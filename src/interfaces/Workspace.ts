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

// Admin interfaces
export interface IWorkspaceAdmin {
  _id: string
  name: string
  description: string
  admin: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  numberOfChannels: number
  numberOfMembers: number
  isLocked?: boolean
}

export interface WorkspaceAdminApiResponse {
  status: string
  data: IWorkspaceAdmin[]
  currentPage: number
  totalPages: number
}

// Workspace Admin interfaces
export interface IChannelAdmin {
  _id: string
  name: string
  description: string
  isActive: boolean
  workspaceId: string
  admin: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  members: number
}

export interface ChannelAdminApiResponse {
  status: string
  data: {
    channels: IChannelAdmin[]
    currentPage: number
    totalPages: number
  }
}

// Workspace User interfaces
export interface IWorkspaceUser {
  _id: string
  name: string
  email: string
  avatar?: string
  joinedAt: string
  isWorkspaceAdmin: boolean
}

export interface WorkspaceUserApiResponse {
  status: string
  data: {
    users: IWorkspaceUser[]
    currentPage: number
    totalPages: number
  }
}
