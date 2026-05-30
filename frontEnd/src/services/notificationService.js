import apiClient from '../api/client'

/**
 * @returns {Promise<import('../api/types').NotificationOut[]>}
 */
export async function listNotifications() {
  const { data } = await apiClient.get('/notifications')
  return data
}

/**
 * @param {string} notificationId
 * @returns {Promise<import('../api/types').NotificationOut>}
 */
export async function markNotificationRead(notificationId) {
  const { data } = await apiClient.post(`/notifications/${notificationId}/read`)
  return data
}

/**
 * @param {import('../api/types').NotificationBroadcastRequest} payload
 * @returns {Promise<import('../api/types').NotificationOut[]>}
 */
export async function broadcastNotification(payload) {
  const { data } = await apiClient.post('/notifications/broadcast', payload)
  return data
}
