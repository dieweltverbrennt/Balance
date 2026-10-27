import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { queryClient } from '@/lib/query-client'

interface AuthResponse {
  name: string
  accessToken: string
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshRequest: Promise<AuthResponse> | null = null

export const requestNewAccessToken = (): Promise<AuthResponse> => {
  if (!refreshRequest) {
    refreshRequest = api
      .post<AuthResponse>('/auth/refresh')
      .then(({ data }) => data)
      .finally(() => {
        refreshRequest = null
      })
  }

  return refreshRequest
}

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const request = error.config as RetriableRequestConfig | undefined
    if (!request) return Promise.reject(error)

    const isAuthEndpoint = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/logout',
    ].some((path) => request.url?.includes(path))

    if (isAuthEndpoint) return Promise.reject(error)

    if (request._retry) {
      useAuthStore.getState().clearAuth()
      queryClient.clear()
      if (window.location.pathname !== '/auth') {
        window.location.assign('/auth')
      }
      return Promise.reject(error)
    }

    request._retry = true

    try {
      const authResponse = await requestNewAccessToken()
      useAuthStore.getState().setAuthData(
        authResponse.accessToken,
        authResponse.name,
      )
      request.headers.Authorization = `Bearer ${authResponse.accessToken}`
      return api(request)
    } catch (refreshError) {
      useAuthStore.getState().clearAuth()
      queryClient.clear()
      if (window.location.pathname !== '/auth') {
        window.location.assign('/auth')
      }
      return Promise.reject(refreshError)
    }
  },
)
