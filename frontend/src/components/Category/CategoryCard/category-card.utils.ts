import * as LucideIcons from 'lucide-react'
import { Folder } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons = LucideIcons as unknown as Record<string, LucideIcon>

export const DEFAULT_ICON_COLOR = 'rgba(255,255,255,0.4)'
export const ACCENT_COLOR = '#8375F2'

export function getCategoryIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Folder

  return icons[iconName] ?? Folder
}

export function getCategoryWord(count: number): string {
  const lastTwoDigits = count % 100
  const lastDigit = count % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'подкатегорий'
  }

  if (lastDigit === 1) return 'подкатегория'

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'подкатегории'
  }

  return 'подкатегорий'
}
