import apiClient from '../api/client'

/**
 * @param {Record<string, unknown>} params
 * @returns {Promise<import('../api/types').TenantOut[]>}
 */
export async function listTenants(params = {}) {
  const { data } = await apiClient.get('/tenants', { params })
  return data
}

/**
 * @param {import('../api/types').TenantCreate} payload
 * @returns {Promise<import('../api/types').TenantCreateResponse>}
 */
export async function createTenant(payload) {
  const { data } = await apiClient.post('/tenants', payload)
  return data
}

/**
 * @param {string} tenantId
 * @param {import('../api/types').TenantUpdate} payload
 * @returns {Promise<import('../api/types').TenantOut>}
 */
export async function updateTenant(tenantId, payload) {
  const { data } = await apiClient.put(`/tenants/${tenantId}`, payload)
  return data
}

/**
 * @param {string} tenantId
 * @returns {Promise<Record<string, unknown>>}
 */
export async function deleteTenant(tenantId) {
  const { data } = await apiClient.delete(`/tenants/${tenantId}`)
  return data
}
