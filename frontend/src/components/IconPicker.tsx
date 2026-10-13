import { useState } from 'react'
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
}

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const SelectedIcon = icons[value] ?? ShoppingCart

  const handleSelect = (iconName: string) => {
    onChange(iconName)
  }

  return (
    <div
      className={cn(
        'h-[220px] w-full overflow-y-auto',
        'rounded-[14px] border border-white/5',
        'bg-white/[0.093] p-3',
        '[scrollbar-width:thin]',
        '[scrollbar-color:rgba(255,255,255,0.18)_transparent]',
      )}
    >
      <div className="grid grid-cols-6 gap-2">
        {Object.entries(icons).map(([iconName, Icon]) => {
          const isSelected = value === iconName

          return (
            <button
              key={iconName}
              type="button"
              title={iconName}
              onClick={() => onChange(iconName)}
              className={cn(
                'flex aspect-square items-center justify-center',
                'rounded-xl',
                'border border-transparent',
                'text-[var(--text)]',
                'transition-all duration-150',
                'hover:bg-white/[0.08]',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-white/20',
                'cursor-pointer',

                isSelected && [
                  'border-white/10',
                  'bg-white/[0.14]',
                  'text-white',
                  'shadow-[0_4px_20px_rgba(0,0,0,0.12)]',
                ],
              )}
            >
              <Icon className="size-5" strokeWidth={1.7} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
