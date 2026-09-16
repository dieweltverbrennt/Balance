import { api } from './axios'

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

  return response.data
}

export const login = async (data: LoginData) => {
  const response = await api.post<AuthResponse>('/auth/login', data)

  return response.data
}

export const getProfile = async () => {
  const response = await api.get<string>('/auth/profile')

  return response.data
}
