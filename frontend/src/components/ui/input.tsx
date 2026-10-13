import * as React from 'react'

import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from 'cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'h-auto w-full min-w-0 rounded-[14px] border border-white/5 bg-white/[0.093] px-3 py-3 text-base font-light text-[var(--text)] outline-none transition-colors',
        'placeholder:text-[var(--text)] placeholder:opacity-50 placeholder:font-light',
        'focus-visible:border-white/10 focus-visible:ring-0',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
