import axios from 'axios'

import { useAuthStore } from '@/stores/auth.store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/auth'
    ) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/auth'
    }

    return Promise.reject(error)
  },
)
