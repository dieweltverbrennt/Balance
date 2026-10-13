import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CategoryCardProps {
  name: string
  color: string
  icon: string
  subcategories?: {
    id: string
    name: string
    color: string
    icon: string
  }[]
}

export const CategoryCard = ({
  name,
  color,
  icon,
  subcategories,
}: CategoryCardProps) => {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  const Icon = icons[icon] ?? LucideIcons.CircleHelp

  return (
    <div className="category">
      <div className="category__header">
        <div className="category__title">
          <div
            className="category__icon"
            style={{
              backgroundColor: `${color}20`,
              borderColor: `${color}`,
              color,
            }}
          >
            <Icon size={20} />
          </div>
          <span>{name}</span>
        </div>

        <Button variant="ghost">
          <Ellipsis />
        </Button>
      </div>
      {/* <span>{color}</span>
      <span>{icon}</span>
      <span>{type}</span> */}
    </div>
  )
}
