import { create } from 'zustand'

export const useDashboardStore = create((set) => ({
  setKpis: (kpis) => set({ kpis }),
  kpis: []
}))
