import apiClient from '../api/client'

/**
 * @returns {Promise<import('../api/types').AnalyticsResponse>}
 */
export async function getAnalytics() {
  const { data } = await apiClient.get('/analytics')
  return data
}
