import type { IWorkspace, IChannel, IMessage, IDirectMessage, IAttachment } from '../interfaces/Workspace'
import type { IUser } from '../interfaces/User'
export const mockUsers: IUser[] = [
  {
    id: 'user1',
    name: 'You',
    email: 'you@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'online'
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'online',
    lastSeen: new Date().toISOString()
  },
  {
    id: 'user3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'user4',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'away',
    lastSeen: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'user5',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'busy',
    lastSeen: new Date().toISOString()
  }
]

export const mockWorkspaces: IWorkspace[] = [
  {
    id: '1',
    name: 'Acme Inc',
    icon: 'A',
    ownerId: 'user1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Startup Co',
    icon: 'S',
    ownerId: 'user1',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Tech Team',
    icon: 'T',
    ownerId: 'user2',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const mockChannels: IChannel[] = [
  {
    id: 'channel1',
    name: 'general',
    workspaceId: '1',
    description: 'General discussions',
    isPrivate: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 2
  },
  {
    id: 'channel2',
    name: 'random',
    workspaceId: '1',
    description: 'Random topics',
    isPrivate: false,
    createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  },
  {
    id: 'channel3',
    name: 'announcements',
    workspaceId: '1',
    description: 'Important announcements',
    isPrivate: false,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 5
  },
  {
    id: 'channel4',
    name: 'development',
    workspaceId: '1',
    description: 'Development discussions',
    isPrivate: false,
    createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  },
  {
    id: 'channel5',
    name: 'design',
    workspaceId: '1',
    description: 'Design discussions',
    isPrivate: false,
    createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 3
  },
  {
    id: 'channel6',
    name: 'marketing',
    workspaceId: '1',
    description: 'Marketing discussions',
    isPrivate: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 1
  },
  {
    id: 'channel7',
    name: 'general',
    workspaceId: '2',
    description: 'General discussions',
    isPrivate: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  },
  {
    id: 'channel8',
    name: 'general',
    workspaceId: '3',
    description: 'General discussions',
    isPrivate: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  }
]

export const mockDirectMessages: IDirectMessage[] = [
  {
    id: 'dm1',
    participants: ['user1', 'user2'],
    workspaceId: '1',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 4
  },
  {
    id: 'dm2',
    participants: ['user1', 'user3'],
    workspaceId: '1',
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  },
  {
    id: 'dm3',
    participants: ['user1', 'user4'],
    workspaceId: '1',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 1
  },
  {
    id: 'dm4',
    participants: ['user1', 'user5'],
    workspaceId: '1',
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 0
  }
]

export const mockAttachments: IAttachment[] = [
  {
    id: 'attachment1',
    name: 'Q1_Report.pdf',
    type: 'application/pdf',
    size: '2.4 MB',
    url: '#',
    messageId: 'message4'
  }
]

export const mockMessages: IMessage[] = [
  {
    id: 'message1',
    content: 'This is a test message from me that I can edit or delete.',
    userId: 'user1',
    channelId: 'channel1',
    workspaceId: '1',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    reactions: []
  },
  {
    id: 'message2',
    content: 'Hey team! Just a reminder about our meeting tomorrow at 10am.',
    userId: 'user2',
    channelId: 'channel1',
    workspaceId: '1',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reactions: [
      {
        id: 'reaction1',
        emoji: '👍',
        count: 3,
        users: ['user1', 'user3', 'user4'],
        messageId: 'message2'
      }
    ]
  },
  {
    id: 'message3',
    content: "Thanks for the reminder! I'll prepare the slides for the presentation.",
    userId: 'user4',
    channelId: 'channel1',
    workspaceId: '1',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    reactions: []
  },
  {
    id: 'message4',
    content: "I've shared the Q1 report in the shared drive. Please take a look before the meeting.",
    userId: 'user5',
    channelId: 'channel1',
    workspaceId: '1',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reactions: [
      {
        id: 'reaction2',
        emoji: '👍',
        count: 2,
        users: ['user1', 'user2'],
        messageId: 'message4'
      }
    ],
    attachments: [mockAttachments[0]]
  },
  {
    id: 'message5',
    content: 'Just reviewed it. Great work everyone!',
    userId: 'user3',
    channelId: 'channel1',
    workspaceId: '1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reactions: []
  },
  {
    id: 'message6',
    content: "Hey, how's the project going?",
    userId: 'user2',
    directMessageId: 'dm1',
    workspaceId: '1',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    reactions: []
  }
]

// Helper functions to get data
export const getWorkspaceById = (id: string) => {
  return mockWorkspaces.find((workspace) => workspace.id === id)
}

export const getChannelsByWorkspaceId = (workspaceId: string) => {
  return mockChannels.filter((channel) => channel.workspaceId === workspaceId)
}

export const getChannelById = (id: string) => {
  return mockChannels.find((channel) => channel.id === id)
}

export const getDirectMessagesByWorkspaceId = (workspaceId: string) => {
  return mockDirectMessages.filter((dm) => dm.workspaceId === workspaceId)
}

export const getDirectMessageById = (id: string) => {
  return mockDirectMessages.find((dm) => dm.id === id)
}

export const getUserById = (id: string) => {
  return mockUsers.find((user) => user.id === id)
}

export const getMessagesByChannelId = (channelId: string) => {
  return mockMessages.filter((message) => message.channelId === channelId)
}

export const getMessagesByDirectMessageId = (directMessageId: string) => {
  return mockMessages.filter((message) => message.directMessageId === directMessageId)
}

export const getDirectMessageParticipants = (directMessageId: string) => {
  const dm = getDirectMessageById(directMessageId)
  if (!dm) return []
  return dm.participants.map((userId) => getUserById(userId)).filter(Boolean) as IUser[]
}
