import type { UseFormReturn } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import type { CategoryFormData } from '@/schemas/category.schema'
import type { CategorySubcategoryForm, TransactionType } from '@/types/category'
import { CategorySubFields } from '../CategorySubFields'
import { ColorPicker } from '../ColorPicker'
import { IconPicker } from '../IconPicker'
import { IncomeExpenseSwitch } from '../IncomeExpenseSwitch'

interface CategoryFormFieldsProps {
  form: UseFormReturn<CategoryFormData>
  type: TransactionType
  onTypeChange: (value: TransactionType) => void
  icon: string
  onIconChange: (value: string) => void
  color: string
  onColorChange: (value: string) => void
  subcategories: CategorySubcategoryForm[]
  onSubcategoriesChange: (value: CategorySubcategoryForm[]) => void
}

export const CategoryFormFields = ({
  form,
  type,
  onTypeChange,
  icon,
  onIconChange,
  color,
  onColorChange,
  subcategories,
  onSubcategoriesChange,
}: CategoryFormFieldsProps) => (
  <>
    <div className="form__item">
      <label>
        <div className="mb-2 ml-1">Название категории</div>
        <Input
          type="text"
          placeholder="Введите название"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <span className="auth__error">{form.formState.errors.name.message}</span>
        )}
      </label>
    </div>

    <div className="form__item">
      <div className="mb-2 ml-1">Тип</div>
      <IncomeExpenseSwitch value={type} onChange={onTypeChange} />
    </div>

    <div className="form__item">
      <div className="mb-2 ml-1">Иконка</div>
      <IconPicker value={icon} onChange={onIconChange} />
    </div>

    <div className="form__item">
      <div className="mb-2 ml-1">Цвет</div>
      <ColorPicker value={color} onChange={onColorChange} />
    </div>

    <div className="form__item">
      <div className="mb-2 ml-1">Подкатегории</div>
      <CategorySubFields
        value={subcategories}
        onChange={onSubcategoriesChange}
      />
    </div>
  </>
)
