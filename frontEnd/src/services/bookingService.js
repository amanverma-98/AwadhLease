import apiClient from '../api/client'

/**
 * @param {import('../api/types').BookingCreate} payload
 * @returns {Promise<import('../api/types').BookingOut>}
 */
export async function createBooking(payload) {
  const { data } = await apiClient.post('/bookings', payload)
  return data
}

/**
 * @param {Record<string, unknown>} params
 * @returns {Promise<import('../api/types').BookingOut[]>}
 */
export async function listBookings(params = {}) {
  const { data } = await apiClient.get('/bookings', { params })
  return data
}
