import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  categorySchema,
  type CategoryFormData,
} from '@/features/auth/schemas/category.schema'
import { X } from 'lucide-react'
import { IconPicker } from '../IconPicker'
import { ColorPicker } from '../ColorPicker'
import { CategorySubFields } from './CategorySubFields'
import { cn } from 'cn'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '@/api/categories'
import {
  IncomeExpenseSwitch,
  type TransactionType,
} from '@/components/IncomeExpenseSwitch'

interface CategoryFormProps {
  onClose: () => void
}

export const CategoryForm = ({ onClose }: CategoryFormProps) => {
  const [type, setType] = useState<TransactionType>('expense')
  const [icon, setIcon] = useState('ShoppingCart')
  const [color, setColor] = useState('#248eff')
  const [subcategories, setSubcategories] = useState<string[]>([])

  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  const queryClient = useQueryClient()

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
    },
  })

  const onAdd = async (data: CategoryFormData) => {
    createCategoryMutation.mutate({
      name: data.name,
      type,
      icon,
      color,
      subcategories,
    })

    onClose()
  }

  return (
    <div
      className={cn(
        'form',
        '[scrollbar-width:thin]',
        '[scrollbar-color:rgba(255,255,255,0.18)_transparent]',
      )}
    >
      <div className="form__header">
        <h2>Новая категория</h2>

        <Button
          variant="ghost"
          className="form__close"
          type="button"
          size="lg"
          onClick={onClose}
        >
          <X size={50} />
        </Button>
      </div>
      <form
        className="form__container"
        onSubmit={categoryForm.handleSubmit(onAdd)}
      >
        <div className="form__item">
          <label>
            <div className="mb-2 ml-1">Название категории</div>
            <Input
              type="text"
              placeholder="Введите название"
              {...categoryForm.register('name')}
            />
            {categoryForm.formState.errors.name && (
              <span className="auth__error">
                {categoryForm.formState.errors.name.message}
              </span>
            )}
          </label>
        </div>

        <div className="form__item">
          <div className="mb-2 ml-1">Тип</div>
          <IncomeExpenseSwitch value={type} onChange={setType} />
        </div>

        <div className="form__item">
          <div className="mb-2 ml-1">Иконка</div>
          <IconPicker value={icon} onChange={setIcon} />
        </div>

        <div className="form__item">
          <div className="mb-2 ml-1">Цвет</div>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <div className="form__item">
          <div className="mb-2 ml-1">Подкатегории</div>
          <CategorySubFields
            value={subcategories}
            onChange={setSubcategories}
          />
        </div>

        <Button
          type="submit"
          className="form__accept mt-5"
          size="lg"
          disabled={createCategoryMutation.isPending}
        >
          {createCategoryMutation.isPending
            ? 'Создание...'
            : 'Добавить категорию'}
        </Button>
      </form>
    </div>
  )
}
