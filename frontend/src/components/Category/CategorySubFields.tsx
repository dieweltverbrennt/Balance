import { Plus, X } from 'lucide-react'

import { cn } from 'cn'

interface CategorySubFieldsProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export const CategorySubFields = ({
  value,
  onChange,
  placeholder = 'Название подкатегории',
}: CategorySubFieldsProps) => {
  const addSubcategory = () => {
    onChange([...value, ''])
  }

  const updateSubcategory = (index: number, name: string) => {
    onChange(value.map((item, i) => (i === index ? name : item)))
  }

  const removeSubcategory = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((subcategory, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={subcategory}
            onChange={(event) => updateSubcategory(index, event.target.value)}
            placeholder={placeholder}
            className={cn(
              'h-10 min-w-0 flex-1 rounded-xl px-3',
              'border border-white/[0.08]',
              'bg-white/[0.045]',
              'text-sm text-white placeholder:text-white/30',
              'outline-none transition-colors',
              'focus:border-white/20 focus:bg-white/[0.07]',
            )}
          />

          <button
            type="button"
            onClick={() => removeSubcategory(index)}
            aria-label="Удалить подкатегорию"
            className={cn(
              'flex size-9 shrink-0 items-center justify-center',
              'rounded-lg text-white/35',
              'transition-colors hover:bg-white/[0.07]',
              'hover:text-red-300',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-white/20',
              'cursor-pointer',
            )}
          >
            <X size={16} strokeWidth={1.7} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSubcategory}
        className={cn(
          'flex h-10 w-full items-center justify-center gap-2',
          'rounded-xl border border-dashed border-white/[0.12]',
          'text-sm text-white/45',
          'transition-colors hover:border-white/25',
          'hover:bg-white/[0.035] hover:text-white/75',
          'cursor-pointer',
        )}
      >
        <Plus size={16} strokeWidth={1.8} />
        <span>Добавить подкатегорию</span>
      </button>
    </div>
  )
}
