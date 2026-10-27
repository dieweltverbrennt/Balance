import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from 'cn'
import type { CategorySubcategoryForm } from '@/types/category'

interface CategorySubFieldsProps {
  value: CategorySubcategoryForm[]
  onChange: (value: CategorySubcategoryForm[]) => void
  placeholder?: string
  level?: number
}

export const CategorySubFields = ({
  value,
  onChange,
  placeholder = 'Название подкатегории',
  level = 0,
}: CategorySubFieldsProps) => {
  const [collapsed, setCollapsed] = useState<number[]>([])

  const updateSubcategory = (
    index: number,
    changes: Partial<CategorySubcategoryForm>,
  ) => {
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...changes } : item)),
    )
  }

  const addSubcategory = () => {
    onChange([
      ...value,
      {
        name: '',
        subcategories: [],
      },
    ])
  }

  const removeSubcategory = (index: number) => {
    onChange(value.filter((_, i) => i !== index))

    setCollapsed((current) =>
      current
        .filter((item) => item !== index)
        .map((item) => (item > index ? item - 1 : item)),
    )
  }

  const toggleCollapsed = (index: number) => {
    setCollapsed((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    )
  }

  const isNested = level > 0

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col',
        isNested ? 'ml-4 border-l border-white/[0.10] pl-3' : 'gap-1',
      )}
    >
      {value.map((subcategory, index) => {
        const isCollapsed = collapsed.includes(index)
        const children = subcategory.subcategories ?? []
        const hasChildren = children.length > 0

        return (
          <div key={index} className="relative min-w-0">
            {isNested && (
              <span
                aria-hidden="true"
                className="absolute -left-3 top-[19px] w-3 border-t border-white/[0.10]"
              />
            )}

            <div
              className={cn(
                'group flex min-w-0 items-center gap-1 rounded-lg py-1 pr-1',
                'transition-colors hover:bg-white/[0.035]',
              )}
            >
              <button
                type="button"
                onClick={() => toggleCollapsed(index)}
                disabled={!hasChildren}
                aria-label={
                  isCollapsed
                    ? 'Развернуть подкатегории'
                    : 'Свернуть подкатегории'
                }
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-md',
                  'text-white/40 transition-colors',
                  'hover:bg-white/[0.07] hover:text-white/80',
                  'disabled:invisible',
                )}
              >
                {isCollapsed ? (
                  <ChevronRight size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}
              </button>

              <input
                value={subcategory.name}
                onChange={(event) =>
                  updateSubcategory(index, {
                    name: event.target.value,
                  })
                }
                placeholder={placeholder}
                aria-label="Название подкатегории"
                className={cn(
                  'h-9 min-w-0 flex-1 rounded-md border border-transparent px-2',
                  'bg-transparent text-sm text-white',
                  'placeholder:text-white/30 outline-none',
                  'transition-colors',
                  'hover:border-white/[0.07]',
                  'focus:border-[#8375F2]/50 focus:bg-white/[0.035]',
                )}
              />

              <button
                type="button"
                onClick={() => {
                  setCollapsed((current) =>
                    current.filter((item) => item !== index),
                  )
                  updateSubcategory(index, {
                    subcategories: [
                      ...children,
                      { name: '', subcategories: [] },
                    ],
                  })
                }}
                aria-label={`Добавить подкатегорию в ${subcategory.name || 'новую категорию'}`}
                title={`Добавить вложенную подкатегорию${subcategory.name ? ` в «${subcategory.name}»` : ''}`}
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-md',
                  'text-white/35 opacity-0 transition-all',
                  'hover:bg-[#8375F2]/15 hover:text-[#b8afff]',
                  'focus-visible:opacity-100 focus-visible:outline-none',
                  'focus-visible:ring-1 focus-visible:ring-[#8375F2]',
                  'group-hover:opacity-100',
                )}
              >
                <Plus size={15} />
              </button>

              <button
                type="button"
                onClick={() => removeSubcategory(index)}
                aria-label={`Удалить подкатегорию ${subcategory.name || ''}`}
                title="Удалить подкатегорию вместе с вложенными"
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-md',
                  'text-white/30 opacity-0 transition-all',
                  'hover:bg-red-400/10 hover:text-red-300',
                  'focus-visible:opacity-100 focus-visible:outline-none',
                  'focus-visible:ring-1 focus-visible:ring-red-300/50',
                  'group-hover:opacity-100',
                )}
              >
                <X size={14} />
              </button>
            </div>

            {!isCollapsed && hasChildren && (
              <CategorySubFields
                value={children}
                onChange={(subcategories) =>
                  updateSubcategory(index, { subcategories })
                }
                placeholder="Название подкатегории"
                level={level + 1}
              />
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={addSubcategory}
        className={cn(
          'group/add mt-1 flex min-h-9 items-center gap-2 rounded-lg px-2',
          'text-sm text-white/40 transition-colors',
          'hover:bg-white/[0.035] hover:text-[#b8afff]',
          isNested ? 'ml-7' : 'ml-8',
        )}
      >
        <Plus
          size={15}
          className="text-[#a99fff]/70 transition-colors group-hover/add:text-[#b8afff]"
        />

        <span>
          {level === 0 ? 'Добавить подкатегорию' : 'Добавить вложенную'}
        </span>
      </button>
    </div>
  )
}
