import { create } from 'zustand'

export const useDashboardStore = create((set) => ({
  setKpis: (kpis) => set({ kpis }),
  kpis: [
    { id: 'kpi-1', label: 'Monthly Revenue', value: 'INR 5.4L', delta: '+8.4%' },
    { id: 'kpi-2', label: 'Occupancy Rate', value: '94%', delta: '+3.1%' },
    { id: 'kpi-3', label: 'Pending Payments', value: 'INR 1.2L', delta: '-4.8%' },
    { id: 'kpi-4', label: 'Active Tickets', value: '18', delta: '+2' },
    { id: 'kpi-5', label: 'Delayed Payments', value: '6', delta: '-1' },
    { id: 'kpi-6', label: 'Available Units', value: '9', delta: '+3' }
  ]
}))
