import { api, requestNewAccessToken } from './axios'
import { useAuthStore } from '@/stores/auth.store'
import { queryClient } from '@/lib/query-client'

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  name: string
  accessToken: string
}

export const register = async (data: RegisterData) => {
  const response = await api.post<AuthResponse>('/auth/register', data)
  queryClient.clear()

  return response.data
}

export const login = async (data: LoginData) => {
  const response = await api.post<AuthResponse>('/auth/login', data)
  queryClient.clear()

  return response.data
}

export const getProfile = async () => {
  const response = await api.get<string>('/auth/profile')

  return response.data
}

export const refreshSession = requestNewAccessToken

let initializationPromise: Promise<void> | null = null

export const initializeAuthSession = (): Promise<void> => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      localStorage.removeItem('auth')

      try {
        const response = await refreshSession()
        useAuthStore.getState().setAuthData(response.accessToken, response.name)
      } catch {
        useAuthStore.getState().clearAuth()
        queryClient.clear()
      } finally {
        useAuthStore.getState().finishInitialization()
      }
    })()
  }

  return initializationPromise
}

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout')
  } finally {
    useAuthStore.getState().clearAuth()
    queryClient.clear()
  }
}
