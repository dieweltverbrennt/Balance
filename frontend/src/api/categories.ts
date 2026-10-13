import { api } from './axios'

export interface Category {
  id: string
  name: string
  type: 'expense' | 'income'
  color: string
  icon: string
  subcategories: {
    id: string
    name: string
    color: string
    icon: string
  }[]
  parentCategoryId: string | null
}
export interface NewCategoryData {}

export const getCategories = async () => {
  const response = await api.get<Category[]>('/categories')

  return response.data
}

export const createCategory = async (data: NewCategoryData) => {
  const response = await api.post<Category[]>('/categories', data)

  return response.data
}
