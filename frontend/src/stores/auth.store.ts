import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  name: string | null
  setAuthData: (accessToken: string, name: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      name: null,

      setAuthData: (accessToken, name) => {
        set({ accessToken, name })
      },

      clearAuth: () => {
        set({ accessToken: null, name: null })
      },
    }),
    {
      name: 'auth',
    },
  ),
)
