import { create } from 'zustand'
import { properties as mockProperties } from '../data/properties'
import { listProperties } from '../services/propertyService'
import {
  buildPropertyQueryParams,
  dedupeProperties,
  mapPropertyFromApi
} from '../utils/propertyMapper'

export const usePropertyStore = create((set, get) => ({
  listings: mockProperties,
  favorites: [],
  isLoading: false,
  loadError: null,
  useMockFallback: false,

  fetchListings: async (filters) => {
    const activeFilters = filters || get().filters
    set({ isLoading: true, loadError: null })
    try {
      // Set a strict 2-second timeout to fall back to mock data if the backend is hung on MongoDB connections
      const apiCall = listProperties(buildPropertyQueryParams(activeFilters))
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API Response Timeout')), 2000)
      )

      const data = await Promise.race([apiCall, timeoutPromise])
      const mapped = dedupeProperties(data.map(mapPropertyFromApi))
      set({
        listings: mapped.length ? mapped : [],
        isLoading: false,
        useMockFallback: mapped.length === 0
      })
      if (mapped.length === 0) {
        set({ listings: mockProperties, useMockFallback: true })
      }
    } catch (error) {
      set({
        listings: mockProperties,
        isLoading: false,
        loadError: error.message,
        useMockFallback: true
      })
    }
  },


  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((fav) => fav !== id)
        : [...state.favorites, id]
    })),

  filters: {
    query: '',
    location: 'All',
    type: 'All',
    bhk: 'All',
    furnished: 'All',
    pgGender: 'Any',
    budget: 'Any',
    sortBy: 'Popularity',
    features: []
  },
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } }))
}))
