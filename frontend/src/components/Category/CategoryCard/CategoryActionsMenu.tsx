import { useEffect, useRef, useState } from 'react'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Category } from '@/types/category'
import { cn } from 'cn'

interface CategoryActionsMenuProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete?: (category: Category) => void
}

export function CategoryActionsMenu({
  category,
  onEdit,
  onDelete,
}: CategoryActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Действия категории ${category.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Ellipsis size={18} />
      </Button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 bottom-full z-50 mt-2 w-48',
            'rounded-xl border border-white/[0.1]',
            'bg-[#25252f]/95 p-1.5 shadow-xl',
            'backdrop-blur-xl',
          )}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              closeMenu()
              onEdit(category)
            }}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg',
              'px-3 py-2.5 text-left text-sm',
              'text-white/75 transition-colors',
              'hover:bg-white/[0.07] hover:text-white',
            )}
          >
            <Pencil size={15} className="text-white/50" />
            Редактировать
          </button>

          {onDelete && (
            <>
              <div className="my-1 border-t border-white/[0.07]" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  closeMenu()
                  onDelete(category)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg',
                  'px-3 py-2.5 text-left text-sm',
                  'text-red-300/80 transition-colors',
                  'hover:bg-red-400/10 hover:text-red-300',
                )}
              >
                <Trash2 size={15} />
                Удалить
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
