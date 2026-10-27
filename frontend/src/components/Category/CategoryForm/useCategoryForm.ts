import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCategory, updateCategory } from '@/api/categories'
import {
  categorySchema,
  type CategoryFormData,
} from '@/schemas/category.schema'
import type {
  CategorySubcategoryForm,
  CategoryToEdit,
  TransactionType,
  UpdateSubcategoryData,
} from '@/types/category'

interface UseCategoryFormOptions {
  category?: CategoryToEdit
  onClose: () => void
}

const toUpdateSubcategory = (
  subcategory: CategorySubcategoryForm,
): UpdateSubcategoryData => ({
  ...(subcategory.id ? { id: subcategory.id } : {}),
  name: subcategory.name.trim(),
  subcategories: (subcategory.subcategories ?? [])
    .filter((child) => child.name.trim())
    .map(toUpdateSubcategory),
})

export const useCategoryForm = ({ category, onClose }: UseCategoryFormOptions) => {
  const [type, setType] = useState<TransactionType>(category?.type ?? 'expense')
  const [icon, setIcon] = useState(category?.icon ?? 'ShoppingCart')
  const [color, setColor] = useState(category?.color ?? '#248eff')
  const [subcategories, setSubcategories] = useState<CategorySubcategoryForm[]>(
    category?.subcategories ?? [],
  )

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? '' },
  })
  const queryClient = useQueryClient()

  useEffect(() => {
    form.reset({ name: category?.name ?? '' })
    setType(category?.type ?? 'expense')
    setIcon(category?.icon ?? 'ShoppingCart')
    setColor(category?.color ?? '#248eff')
    setSubcategories(category?.subcategories ?? [])
  }, [category, form.reset])

  const mutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      const subcategoryPayload = subcategories
        .filter((subcategory) => subcategory.name.trim())
        .map(toUpdateSubcategory)
      const payload = {
        name: data.name,
        icon,
        color,
        type,
        subcategories: subcategoryPayload,
      }

      return category
        ? updateCategory(category.id, payload)
        : createCategory(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
    },
  })

  const onSubmit = (data: CategoryFormData) => mutation.mutate(data)

  return {
    form,
    isEditing: Boolean(category),
    type,
    setType,
    icon,
    setIcon,
    color,
    setColor,
    subcategories,
    setSubcategories,
    onSubmit,
    isPending: mutation.isPending,
    isError: mutation.isError,
  }
}
