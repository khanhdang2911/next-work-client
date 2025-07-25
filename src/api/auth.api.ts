import axios, { normalInstance, refreshInstance } from '../config/httpRequest'
import type { IUserRegister, IUserLogin } from '../interfaces/User'

const register = async (data: IUserRegister) => {
  const response = await axios.post('/auth/register', data)
  return response.data
}

const login = async (data: IUserLogin) => {
  const response = await axios.post('/auth/login', data)
  return response.data
}

const getAllWorkspaces = async () => {
  const response = await axios.get('/workspaces')
  return response.data
}

const createWorkspaces = async (data: { name: string; description: string }) => {
  const response = await axios.post('/workspaces', data)
  return response.data
}

const getChannelsByWorkspaceId = async (_id: string) => {
  const response = await axios.get(`/channels/${_id}`)
  return response.data
}

const getAllDmConversationsOfUser = async (workspaceId: string) => {
  const response = await axios.get(`/conversations/dm/${workspaceId}`)
  return response.data
}

const getMessagebyConversationId = async (conversationId: string) => {
  const response = await axios.get(`/messages/${conversationId}`)
  return response.data
}

const updateMessage = async (messageId: string, newMessage: string) => {
  const response = await axios.patch(`/messages/${messageId}`, {
    content: newMessage
  })
  return response.data
}

const deleteMessage = async (messageId: string) => {
  const response = await axios.delete(`/messages/${messageId}`)
  return response.data
}

const deleteMemberChannel = async (channelId: string, userId: string) => {
  const response = await axios.delete(`/channels/${channelId}/members/${userId}`)
  return response.data
}

const loginWithAuth0 = async (data: any, accessToken: string) => {
  const response = await normalInstance.post('/auth/login-auth0', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.data
}

const logout = async () => {
  const response = await refreshInstance.get('/auth/logout')
  return response.data
}

const refreshToken = async () => {
  const response = await refreshInstance.post(
    '/auth/refresh-token',
    {},
    {
      withCredentials: true
    }
  )
  return response.data
}

const getUserById = async (userId: string) => {
  const response = await axios.get(`/users/${userId}`)
  return response.data
}

const updateUserProfile = async (formData: FormData) => {
  const response = await axios.patch(`/users`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

const getChannelMembers = async (channelId: string) => {
  const response = await axios.get(`/channels/${channelId}/members`)
  return response.data
}

const createChannel = async (workspaceId: string, channelName: string, channelDescription: string) => {
  const response = await axios.post(`/channels/${workspaceId}`, {
    name: channelName,
    description: channelDescription
  })

  return response.data
}
const createMessage = async (conversationId: string, content: string, files?: File[]) => {
  const formData = new FormData()
  formData.append('conversationId', conversationId)
  formData.append('content', content)

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

  const response = await axios.post('/messages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

const inviteUserToWorkspace = async (workspaceId: string, email: string, channelIds: string[]) => {
  const response = await axios.post(`/workspaces/${workspaceId}/invite`, {
    email,
    channels: channelIds
  })
  return response.data
}

const acceptWorkspaceInvitation = async (workspaceId: string, token: string) => {
  const response = await axios.get(`/workspaces/${workspaceId}/accept-invitation/${token}`)
  return response.data
}

const inviteUserToChannel = async (workspaceId: string, channelId: string, email: string) => {
  const response = await axios.post(`/channels/${workspaceId}/${channelId}/invite`, {
    email
  })
  return response.data
}

export const reactToMessage = async (messageId: string, emoji: string) => {
  const response = await axios.put(`/messages/${messageId}/react`, { emoji })
  return response.data
}

// Function to leave a channel
export const leaveChannel = async (channelId: string) => {
  const response = await axios.delete(`/channels/leave/${channelId}`)
  return response.data
}

// Function to leave a workspace
export const leaveWorkspace = async (workspaceId: string) => {
  const response = await axios.delete(`/workspaces/leave/${workspaceId}`)
  return response.data
}

export {
  register,
  login,
  logout,
  refreshToken,
  loginWithAuth0,
  getAllWorkspaces,
  createWorkspaces,
  getChannelsByWorkspaceId,
  getAllDmConversationsOfUser,
  getMessagebyConversationId,
  getUserById,
  updateUserProfile,
  getChannelMembers,
  createMessage,
  inviteUserToWorkspace,
  acceptWorkspaceInvitation,
  inviteUserToChannel,
  updateMessage,
  deleteMessage,
  deleteMemberChannel,
  createChannel
}
