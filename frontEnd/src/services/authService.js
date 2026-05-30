import apiClient from '../api/client'

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('../api/types').TokenResponse>}
 */
export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

/**
 * @param {import('../api/types').RegisterLandlordRequest} payload
 * @returns {Promise<import('../api/types').TokenResponse>}
 */
export async function registerLandlord(payload) {
  const { data } = await apiClient.post('/auth/register', payload)
  return data
}

/**
 * @param {string} refreshToken
 * @returns {Promise<import('../api/types').TokenResponse>}
 */
export async function refreshTokens(refreshToken) {
  const { data } = await apiClient.post('/auth/refresh', { refresh_token: refreshToken })
  return data
}

/**
 * @returns {Promise<import('../api/types').UserMeResponse>}
 */
export async function getMe() {
  const { data } = await apiClient.get('/auth/me')
  return data
}

/**
 * @returns {Promise<'landlord' | 'tenant'>}
 */
export async function detectUserRole() {
  try {
    await apiClient.get('/tenants', { params: { limit: 1 } })
    return 'landlord'
  } catch (error) {
    if (error?.response?.status === 403) return 'tenant'
    throw error
  }
}

/**
 * @param {string} email
 * @returns {Promise<import('../api/types').ForgotPasswordResponse>}
 */
export async function requestPasswordReset(email) {
  const { data } = await apiClient.post('/auth/forgot-password', { email })
  return data
}

/**
 * @param {string} token
 * @param {string} password
 * @returns {Promise<import('../api/types').ResetPasswordResponse>}
 */
export async function resetPassword(token, password) {
  const { data } = await apiClient.post('/auth/reset-password', { token, password })
  return data
}

/**
 * @param {import('../api/types').UserUpdate} payload
 * @returns {Promise<import('../api/types').UserMeResponse>}
 */
export async function updateMe(payload) {
  const { data } = await apiClient.put('/auth/me', payload)
  return data
}
