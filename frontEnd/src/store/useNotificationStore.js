import { create } from 'zustand'
import { listNotifications, markNotificationRead } from '../services/notificationService'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  toasts: [],
  isLoading: false,
  loadNotifications: async () => {
    set({ isLoading: true })
    try {
      const items = await listNotifications()
      set({ notifications: items, isLoading: false })
    } catch {
      set({ notifications: [], isLoading: false })
    }
  },
  markRead: async (id) => {
    try {
      await markNotificationRead(id)
      set({
        notifications: get().notifications.map((item) =>
          item.id === id ? { ...item, status: 'read' } : item
        )
      })
    } catch {
      /* ignore */
    }
  },
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), ...toast }]
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}))
