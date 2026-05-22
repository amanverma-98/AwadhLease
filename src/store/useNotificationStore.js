import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notifications: [
    { id: 'nt-1', title: 'Rent credited for Skyline Residences', time: '5m ago' },
    { id: 'nt-2', title: 'Vendor assigned to AC ticket', time: '1h ago' },
    { id: 'nt-3', title: 'Lease renewal reminder sent', time: 'Yesterday' }
  ],
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), ...toast }]
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}))
