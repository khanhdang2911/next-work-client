import axios from '../config/httpRequest'

const searchUsersInChannel = async (query: string, channelId: string) => {
  const response = await axios.get(`/users/search/${query}/${channelId}`)
  return response.data
}

const updateRoleWorkspace = async (workspaceId: string, data: any) => {
  const response = await axios.patch(`/workspace/admin/${workspaceId}/users/role`, data)
  return response.data
}

const updateRoleChannel = async (channelId: string, data: any) => {
  const response = await axios.patch(`/channels/${channelId}/members/role`, data)
  return response.data
}

export { 
  searchUsersInChannel,
  updateRoleWorkspace,
  updateRoleChannel
}
