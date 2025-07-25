import axios from '../config/httpRequest'

//User management
const getAllUsers = async (page = 1, limit = 15) => {
  const response = await axios.get(`admin/users?limit=${limit}&page=${page}`)
  return response.data
}

const updateUser = async (userId: string, data: any) => {
  const response = await axios.patch(`admin/users/${userId}`, data)
  return response.data
}

const lockUser = async (userId: string) => {
  const response = await axios.put(`admin/users/lock/${userId}`)
  return response.data
}

const unlockUser = async (userId: string) => {
  const response = await axios.put(`admin/users/unlock/${userId}`)
  return response.data
}

const searchUsers = async (query: string, page = 1, limit = 15) => {
  const response = await axios.get(`admin/users?query=${query}&limit=${limit}&page=${page}`)
  return response.data
}

//admin management
const getAllWorkspacesAdmin = async (page = 1, limit = 15) => {
  try {
    console.log(`Calling API: admin/workspaces?limit=${limit}&page=${page}`)
    const response = await axios.get(`admin/workspaces?limit=${limit}&page=${page}`)
    console.log('API Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error in getAllWorkspacesAdmin:', error)
    throw error
  }
}

const deleteWorkspaceAdmin = async (workspaceId: string) => {
  const response = await axios.delete(`admin/workspaces/${workspaceId}`)
  return response.data
}

const searchWorkspaces = async (query: string, page = 1, limit = 15) => {
  try {
    console.log(`Calling API: admin/workspaces?query=${query}&limit=${limit}&page=${page}`)
    const response = await axios.get(`admin/workspaces?query=${query}&limit=${limit}&page=${page}`)
    console.log('Search API Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error in searchWorkspaces:', error)
    throw error
  }
}

export {
  getAllUsers,
  updateUser,
  lockUser,
  unlockUser,
  getAllWorkspacesAdmin,
  deleteWorkspaceAdmin,
  searchUsers,
  searchWorkspaces
}
