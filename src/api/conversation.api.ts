import axios from '../config/httpRequest'

export const createDirectConversation = async (workspaceId: string, participants: string[]) => {
  const response = await axios.post('/conversations', {
    type: 'direct',
    workspaceId,
    participants
  })
  return response.data
}

export const getConversation = async (conversationId: string) => {
  const response = await axios.get(`/conversations/${conversationId}`)
  return response.data
}
