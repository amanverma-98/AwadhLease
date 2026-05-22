import { create } from 'zustand'
import { properties as mockProperties } from '../data/properties'

export const usePropertyStore = create((set) => ({
  listings: mockProperties,
  favorites: [],
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((fav) => fav !== id)
        : [...state.favorites, id]
    })),
  filters: {
    query: '',
    location: 'Lucknow',
    type: 'All',
    budget: 60000
  },
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } }))
}))
