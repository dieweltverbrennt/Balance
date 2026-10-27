import type { ComponentProps } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import type { LucideIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

interface AuthFieldProps {
  icon: LucideIcon
  type: ComponentProps<'input'>['type']
  placeholder: string
  registration: UseFormRegisterReturn
  error?: string
}

export const AuthField = ({
  icon: Icon,
  type,
  placeholder,
  registration,
  error,
}: AuthFieldProps) => (
  <div className="auth__input">
    <Icon className="auth__icon" />
    <Input
      className="w-full"
      type={type}
      placeholder={placeholder}
      {...registration}
    />
    {error && <span className="auth__error">{error}</span>}
  </div>
)
