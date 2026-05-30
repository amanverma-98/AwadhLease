import apiClient from '../api/client'

/**
 * @param {string} message
 * @param {string | null} conversationId
 * @returns {Promise<import('../api/types').ChatResponse>}
 */
export async function sendChatMessage(message, conversationId = null) {
  const response = await apiClient.post('/chat', {
    message,
    conversation_id: conversationId
  })
  return response.data
}
