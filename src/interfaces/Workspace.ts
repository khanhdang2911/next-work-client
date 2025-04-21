export interface IWorkspace {
  _id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface IChannel {
  id: string
  name: string
  workspaceId: string
  description?: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
  unreadCount?: number
}

export interface IMessage {
  id: string
  content: string
  userId: string
  channelId?: string
  workspaceId: string
  directMessageId?: string
  createdAt: string
  updatedAt: string
  reactions?: IReaction[]
  attachments?: IAttachment[]
  isEdited?: boolean
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
  id: string
  participants: string[]
  workspaceId: string
  createdAt: string
  updatedAt: string
  unreadCount?: number
}
