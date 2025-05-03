import axios from '../config/httpRequest'

const searchUsersInChannel = async (query: string, channelId: string) => {
  const response = await axios.get(`/users/search/${query}/${channelId}`)
  return response.data
}

export { searchUsersInChannel }
