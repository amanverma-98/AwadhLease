import apiClient from '../api/client'

export async function createBooking(payload) {
  const { data } = await apiClient.post('/bookings', payload)
  return data
}

export async function listBookings(params = {}) {
  const { data } = await apiClient.get('/bookings', { params })
  return data
}
