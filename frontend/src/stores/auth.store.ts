import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  name: string | null
  isInitialized: boolean
  setAuthData: (accessToken: string, name: string) => void
  clearAuth: () => void
  finishInitialization: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  name: null,
  isInitialized: false,

  setAuthData: (accessToken, name) => {
    set({ accessToken, name })
  },

  clearAuth: () => {
    set({ accessToken: null, name: null })
  },

  finishInitialization: () => {
    set({ isInitialized: true })
  },
}))
