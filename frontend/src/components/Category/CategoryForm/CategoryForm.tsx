import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { CategoryToEdit } from '@/types/category'
import { CategoryFormFields } from './CategoryFormFields'
import { useCategoryForm } from './useCategoryForm'

interface CategoryFormProps {
  onClose: () => void
  category?: CategoryToEdit
}

export const CategoryForm = ({ onClose, category }: CategoryFormProps) => {
  const {
    form,
    isEditing,
    type,
    setType,
    icon,
    setIcon,
    color,
    setColor,
    subcategories,
    setSubcategories,
    onSubmit,
    isPending,
    isError,
  } = useCategoryForm({ category, onClose })

  return (
    <div className="form">
      <div className="form__scroll scroll">
        <div className="form__header">
          <h2>
            {isEditing ? (
              <>Редактирование категории</>
            ) : (
              <>Новая категория</>
            )}
          </h2>

          <Button
            variant="ghost"
            className="form__close"
            type="button"
            size="lg"
            onClick={onClose}
            aria-label="Закрыть форму"
          >
            <X size={24} />
          </Button>
        </div>

        <form
          className="form__container"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CategoryFormFields
            form={form}
            type={type}
            onTypeChange={setType}
            icon={icon}
            onIconChange={setIcon}
            color={color}
            onColorChange={setColor}
            subcategories={subcategories}
            onSubcategoriesChange={setSubcategories}
          />

          {isError && (
            <p className="auth__error" role="alert">
              Не удалось сохранить категорию. Попробуйте ещё раз.
            </p>
          )}

          <Button
            type="submit"
            className="form__accept mt-5"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>Сохранение...</>
            ) : isEditing ? (
              <>Сохранить изменения</>
            ) : (
              <>Добавить категорию</>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
