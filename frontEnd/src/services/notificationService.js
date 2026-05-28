import apiClient from '../api/client'

export async function listNotifications() {
  const { data } = await apiClient.get('/notifications')
  return data
}

export async function markNotificationRead(notificationId) {
  const { data } = await apiClient.post(`/notifications/${notificationId}/read`)
  return data
}

export async function broadcastNotification(payload) {
  const { data } = await apiClient.post('/notifications/broadcast', payload)
  return data
}
