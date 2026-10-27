import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from 'cn'
import type { CategoryTreeItem } from '@/types/category'
import {
  ACCENT_COLOR,
  DEFAULT_ICON_COLOR,
  getCategoryIcon,
} from './category-card.utils'

interface CategoryTreeNodeProps {
  category: CategoryTreeItem
}

export function CategoryTreeNode({ category }: CategoryTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const children = category.subcategories ?? []
  const hasChildren = children.length > 0
  const Icon = getCategoryIcon(category.icon)

  return (
    <div className="min-w-0">
      <div
        className={cn(
          'group flex min-w-0 items-center gap-2',
          'rounded-lg px-2 py-2',
          'transition-colors duration-200',
          'hover:bg-white/[0.04]',
        )}
      >
        <button
          type="button"
          disabled={!hasChildren}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={
            isExpanded
              ? `Свернуть ${category.name}`
              : `Раскрыть ${category.name}`
          }
          className={cn(
            'flex size-4 shrink-0 items-center justify-center',
            'rounded transition-colors duration-200',
            hasChildren ? 'text-white/35 hover:text-white/80' : 'invisible',
          )}
        >
          <ChevronRight
            size={13}
            className={cn(
              'transition-transform duration-200',
              isExpanded && 'rotate-90 text-[#a99eff]',
            )}
          />
        </button>

        <Icon
          size={15}
          strokeWidth={1.7}
          className="shrink-0"
          style={{ color: category.color ?? DEFAULT_ICON_COLOR }}
        />

        <span className="min-w-0 flex-1 truncate text-[13px] text-white/65 transition-colors group-hover:text-white/90">
          {category.name}
        </span>

        {hasChildren && (
          <span
            className={cn(
              'shrink-0 text-[10px] tabular-nums',
              'text-white/30 transition-colors',
              isExpanded && 'text-[#a99eff]',
            )}
          >
            {children.length}
          </span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div
          className="ml-[15px] border-l py-0.5 pl-3"
          style={{ borderColor: `${ACCENT_COLOR}30` }}
        >
          {children.map((child) => (
            <CategoryTreeNode key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  )
}
