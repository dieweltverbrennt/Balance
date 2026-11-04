import { api } from './axios'
import type {
  Account,
  CreateAccountData,
  DeleteAccountResponse,
  UpdateAccountData,
} from '@/types/account'

export const getAccounts = async () => {
  const response = await api.get<Account[]>('/accounts')

  return response.data
}

export const getAccount = async (id: string) => {
  const response = await api.get<Account>(`/accounts/${id}`)

  return response.data
}

export const createAccount = async (data: CreateAccountData) => {
  const response = await api.post<Account>('/accounts', data)

  return response.data
}

export const updateAccount = async (id: string, data: UpdateAccountData) => {
  const response = await api.patch<Account>(`/accounts/${id}`, data)

  return response.data
}

export const deleteAccount = async (id: string) => {
  const response = await api.delete<DeleteAccountResponse>(`/accounts/${id}`)

  return response.data
}
