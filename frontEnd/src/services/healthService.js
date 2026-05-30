import apiClient from '../api/client'

/**
 * @returns {Promise<import('../api/types').HealthResponse>}
 */
export async function getHealth() {
  const { data } = await apiClient.get('/health')
  return data
}
