import apiClient from '../api/client'

export async function getAnalytics() {
  const { data } = await apiClient.get('/analytics')
  return data
}
