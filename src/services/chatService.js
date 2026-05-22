import apiClient from '../api/client'

export async function sendChatMessage(message, conversationId = null) {
  const response = await apiClient.post('/chat', {
    message,
    conversation_id: conversationId
  })
  return response.data
}
