import axios from 'axios'
import { clearAuth, loadAuth, saveAuth } from '../utils/authStorage'
import { getApiErrorMessage } from '../utils/apiError'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000' 

// if (!baseURL) {
//   throw new Error('VITE_API_URL is not set. Define it in your .env file.')
// }

const apiClient = axios.create({
  baseURL,
  timeout: 30000
})

async function refreshTokens(refreshToken) {
  const { data } = await axios.post(`${baseURL}/auth/refresh`, {
    refresh_token: refreshToken
  })
  return data
}

let refreshPromise = null

apiClient.interceptors.request.use((config) => {
  const auth = loadAuth()
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error?.response?.status

    if (status === 401 && original && !original._retry) {
      const auth = loadAuth()
      if (auth?.refreshToken) {
        original._retry = true
        try {
          if (!refreshPromise) {
            refreshPromise = refreshTokens(auth.refreshToken).finally(() => {
              refreshPromise = null
            })
          }
          const tokens = await refreshPromise
          saveAuth({
            ...auth,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token
          })
          original.headers.Authorization = `Bearer ${tokens.access_token}`
          return apiClient(original)
        } catch {
          clearAuth()
        }
      }
    }

    const wrappedError = new Error(getApiErrorMessage(error))
    wrappedError.response = error?.response
    wrappedError.status = error?.response?.status
    return Promise.reject(wrappedError)
  }
)

export default apiClient
