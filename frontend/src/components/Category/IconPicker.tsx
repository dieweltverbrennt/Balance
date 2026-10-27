import {
  Car,
  Coffee,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Laptop,
  Music,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Utensils,
  Wallet,
  HeartPulse,
  Atom,
  Astroid,
  Puzzle,
  Armchair,
  BriefcaseBusiness,
  BanknoteArrowUp,
  Shirt,
  GraduationCap,
  Ellipsis,
  type LucideIcon,
} from 'lucide-react'

import { cn } from 'cn'

const icons: Record<string, LucideIcon> = {
  ShoppingCart,
  ShoppingBag,
  Utensils,
  Coffee,
  Home,
  Car,
  Plane,
  Wallet,
  Gift,
  Heart,
  Gamepad2,
  Music,
  Smartphone,
  Laptop,
  HeartPulse,
  Atom,
  Astroid,
  Puzzle,
  Armchair,
  BriefcaseBusiness,
  BanknoteArrowUp,
  Shirt,
  GraduationCap,
  Ellipsis,
}

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  return (
    <div
      className={cn(
        'scroll h-[220px] w-full overflow-y-auto',
        'rounded-[14px] border border-white/5',
        'bg-white/[0.093] p-3',
      )}
    >
      <div
        className="grid grid-cols-6 gap-2"
        role="group"
        aria-label="Выбор иконки категории"
      >
        {Object.entries(icons).map(([iconName, Icon]) => {
          const isSelected = value === iconName

          return (
            <button
              key={iconName}
              type="button"
              title={iconName}
              aria-label={`Иконка ${iconName}`}
              aria-pressed={isSelected}
              onClick={() => onChange(iconName)}
              className={cn(
                'flex aspect-square cursor-pointer items-center justify-center',
                'rounded-xl border border-transparent',
                'text-[var(--text)]',
                'transition-all duration-150',
                'hover:bg-white/[0.08]',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-white/20',
                isSelected && [
                  'border-white/10',
                  'bg-white/[0.14]',
                  'text-white',
                  'shadow-[0_4px_20px_rgba(0,0,0,0.12)]',
                ],
              )}
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
