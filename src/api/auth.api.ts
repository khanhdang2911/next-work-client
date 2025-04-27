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

const getAllDmConversationsOfUser = async () => {
  const response = await axios.get('/conversations/dm')
  return response.data
}

const getMessagebyConversationId = async (conversationId: string) => {
  const response = await axios.get(`/messages/${conversationId}`)
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

const updateUserProfile = async (userId: string, formData: FormData) => {
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
  inviteUserToWorkspace
}
