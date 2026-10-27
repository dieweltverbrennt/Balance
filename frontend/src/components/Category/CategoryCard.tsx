import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

import type { Category } from '@/types/category'
import { cn } from 'cn'
import { CategoryActionsMenu } from './CategoryCard/CategoryActionsMenu'
import { CategoryTreeNode } from './CategoryCard/CategoryTreeNode'
import {
  DEFAULT_ICON_COLOR,
  getCategoryIcon,
  getCategoryWord,
} from './CategoryCard/category-card.utils'

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete?: (category: Category) => void
}

export const CategoryCard = ({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const subcategories = category.subcategories ?? []
  const hasChildren = subcategories.length > 0
  const Icon = getCategoryIcon(category.icon)
  const iconColor = category.color ?? DEFAULT_ICON_COLOR

  return (
    <article
      className={cn(
        'category overflow-visible rounded-2xl border',
        'border-white/[0.08] bg-white/[0.025]',
        'transition-colors duration-200',
        isExpanded && 'border-white/[0.12]',
      )}
    >
      <header className="mb-4 flex items-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border"
          style={{
            backgroundColor: category.color
              ? `${category.color}18`
              : 'rgba(255,255,255,0.04)',
            borderColor: category.color
              ? `${category.color}55`
              : 'rgba(255,255,255,0.08)',
            color: iconColor,
          }}
        >
          <Icon size={20} />
        </div>

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
          {category.name}
        </span>

        <CategoryActionsMenu
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </header>

      <div className="pb-3">
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2.5 rounded-xl',
            'px-2.5 py-2.5 text-left text-xs',
            'text-white/50 transition-colors duration-200',
            'hover:bg-white/[0.04] hover:text-white/80',
            isExpanded && 'bg-white/[0.025]',
          )}
        >
          <span
            className={cn(
              'flex size-6 shrink-0 items-center justify-center',
              'rounded-lg bg-[#8375F2]/10 text-[#a99eff]',
            )}
          >
            <ChevronRight
              size={14}
              className={cn(
                'transition-transform duration-200',
                isExpanded && 'rotate-90',
              )}
            />
          </span>

          <span className="flex-1">
            {hasChildren
              ? `${subcategories.length} ${getCategoryWord(subcategories.length)}`
              : 'Нет подкатегорий'}
          </span>
        </button>

        {isExpanded && hasChildren && (
          <div className="mt-2 border-t border-white/[0.07] pt-2">
            <div className="rounded-xl bg-black/[0.08] p-1">
              {subcategories.map((subcategory) => (
                <CategoryTreeNode
                  key={subcategory.id}
                  category={subcategory}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
