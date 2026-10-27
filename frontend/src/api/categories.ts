import { api } from './axios'
import type {
  Category,
  CategoryData,
  UpdateCategoryData,
} from '@/types/category'

export const getCategories = async () => {
  const response = await api.get<Category[]>('/categories')

  return response.data
}

export const createCategory = async (data: CategoryData) => {
  const response = await api.post<Category>('/categories', data)

  return response.data
}

export const updateCategory = async (id: string, data: UpdateCategoryData) => {
  const response = await api.patch<Category>(`/categories/${id}`, data)

  return response.data
}
