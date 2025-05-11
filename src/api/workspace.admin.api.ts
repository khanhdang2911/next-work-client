import axios from "../config/httpRequest"


// workspace admin channels api
const getAllChannelsAdmin = async (workspaceId: string, page = 1, limit = 15) => {
  const response = await axios.get(`/workspace/admin/${workspaceId}?limit=${limit}&page=${page}`)
  return response.data
}

const searchChannelsAdmin = async (workspaceId: string, query: string, page = 1, limit = 15) => {
  const response = await axios.get(`/workspace/admin/${workspaceId}?query=${query}&limit=${limit}&page=${page}`)
  return response.data
}

const updateChannelAdmin = async (workspaceId: string, channelId: string, data: { name: string; description: string }) => {
  const response = await axios.patch(`/workspace/admin/${workspaceId}/${channelId}`, data)
  return response.data
}

const deleteChannelAdmin = async (workspaceId: string, channelId: string) => {
  const response = await axios.delete(`/workspace/admin/${workspaceId}/${channelId}`)
  return response.data
}

// workspace admin users api
const getAllWorkspaceUsers = async (workspaceId: string, page = 1, limit = 15) => {
  const response = await axios.get(`/workspace/admin/${workspaceId}/users?limit=${limit}&page=${page}`)
  return response.data
}

const searchWorkspaceUsers = async (workspaceId: string, query: string, page = 1, limit = 15) => {
  const response = await axios.get(`/workspace/admin/${workspaceId}/users?query=${query}&limit=${limit}&page=${page}`)
  return response.data
}

const deleteUserFromWorkspace = async (workspaceId: string, userId: string) => {
  const response = await axios.delete(`/workspace/admin/${workspaceId}/users/${userId}`)
  return response.data
}

export { 
  getAllChannelsAdmin,
  searchChannelsAdmin,
  updateChannelAdmin,
  deleteChannelAdmin,
  getAllWorkspaceUsers,
  searchWorkspaceUsers,
  deleteUserFromWorkspace
}

