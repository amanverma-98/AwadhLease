import apiClient from '../api/client'

export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function registerLandlord(payload) {
  const { data } = await apiClient.post('/auth/register', payload)
  return data
}

export async function refreshTokens(refreshToken) {
  const { data } = await apiClient.post('/auth/refresh', { refresh_token: refreshToken })
  return data
}

export async function getMe() {
  const { data } = await apiClient.get('/auth/me')
  return data
}

export async function detectUserRole() {
  try {
    await apiClient.get('/tenants', { params: { limit: 1 } })
    return 'landlord'
  } catch (error) {
    if (error?.response?.status === 403) return 'tenant'
    throw error
  }
}

export async function requestPasswordReset(email) {
  const { data } = await apiClient.post('/auth/forgot-password', { email })
  return data
}

export async function updateMe(payload) {
  const { data } = await apiClient.put('/auth/me', payload)
  return data
}
