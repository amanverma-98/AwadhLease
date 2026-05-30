import apiClient from '../api/client'

/**
 * @param {Record<string, unknown>} params
 * @returns {Promise<import('../api/types').MaintenanceOut[]>}
 */
export async function listMaintenance(params = {}) {
  const { data } = await apiClient.get('/maintenance', { params })
  return data
}

/**
 * @param {import('../api/types').MaintenanceCreate} payload
 * @returns {Promise<import('../api/types').MaintenanceOut>}
 */
export async function createMaintenance(payload) {
  const { data } = await apiClient.post('/maintenance', payload)
  return data
}

/**
 * @param {string} ticketId
 * @param {import('../api/types').MaintenanceUpdate} payload
 * @returns {Promise<import('../api/types').MaintenanceOut>}
 */
export async function updateMaintenance(ticketId, payload) {
  const { data } = await apiClient.patch(`/maintenance/${ticketId}`, payload)
  return data
}
