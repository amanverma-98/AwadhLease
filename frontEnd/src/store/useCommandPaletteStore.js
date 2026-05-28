import { create } from 'zustand'

export const useCommandPaletteStore = create((set) => ({
  open: false,
  setOpen: (open) => set({ open })
}))
