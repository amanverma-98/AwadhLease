import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  role: null,
  login: ({ name, email, role }) => set({ user: { name, email }, role }),
  logout: () => set({ user: null, role: null })
}))
