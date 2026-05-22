import { create } from 'zustand'
import { clearAuth, loadAuth, saveAuth } from '../utils/authStorage'
import * as authApi from '../services/authService'

export const useUserStore = create((set, get) => ({
  user: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  authError: null,

  hydrate: () => {
    const saved = loadAuth()
    if (!saved?.accessToken) return
    set({
      user: saved.user || null,
      role: saved.role || null,
      accessToken: saved.accessToken,
      refreshToken: saved.refreshToken,
      isAuthenticated: true
    })
  },

  _persist: (partial) => {
    const state = { ...get(), ...partial }
    saveAuth({
      user: state.user,
      role: state.role,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken
    })
    set(partial)
  },

  loginWithCredentials: async (email, password) => {
    set({ isLoading: true, authError: null })
    try {
      const tokens = await authApi.login(email, password)
      set({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isAuthenticated: true
      })
      saveAuth({
        user: { email },
        role: null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      })

      const role = await authApi.detectUserRole()
      const user = { email, name: role === 'tenant' ? 'Tenant' : 'Landlord' }
      get()._persist({
        user,
        role,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isAuthenticated: true,
        isLoading: false,
        authError: null
      })
      return role
    } catch (error) {
      set({ isLoading: false, authError: error.message })
      throw error
    }
  },

  registerLandlord: async (payload) => {
    set({ isLoading: true, authError: null })
    try {
      const tokens = await authApi.registerLandlord(payload)
      const user = {
        name: payload.full_name,
        email: payload.email
      }
      get()._persist({
        user,
        role: 'landlord',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isAuthenticated: true,
        isLoading: false,
        authError: null
      })
    } catch (error) {
      set({ isLoading: false, authError: error.message })
      throw error
    }
  },

  login: ({ name, email, role }) => {
    get()._persist({
      user: { name, email },
      role,
      accessToken: get().accessToken,
      refreshToken: get().refreshToken,
      isAuthenticated: true
    })
  },

  logout: () => {
    clearAuth()
    set({
      user: null,
      role: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      authError: null
    })
  }
}))
