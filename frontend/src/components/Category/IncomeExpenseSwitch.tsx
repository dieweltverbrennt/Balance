import { cn } from 'cn'

import type { TransactionType } from '@/types/category'

interface IncomeExpenseSwitchProps {
  value: TransactionType
  onChange: (value: TransactionType) => void
  className?: string
}

export function IncomeExpenseSwitch({
  value,
  onChange,
  className,
}: IncomeExpenseSwitchProps) {
  const isExpense = value === 'expense'

  return (
    <div
      className={cn(
        'relative grid h-12 w-[280px] grid-cols-2 p-1',
        'rounded-2xl border border-white/[0.12]',
        'bg-[#4a4a5a] backdrop-blur-md',
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.12)]',
        className,
      )}
      role="group"
      aria-label="Тип операции"
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-1 left-1 z-0',
          'w-[calc(50%-4px)] rounded-xl',
          'bg-[#8375F2]',
          'shadow-[0_6px_24px_rgba(131,117,242,0.30)]',
          'transition-transform duration-300 ease-out',
          isExpense && 'translate-x-full',
        )}
      />

      <button
        type="button"
        aria-pressed={value === 'income'}
        onClick={() => onChange('income')}
        className={cn(
          'relative z-10 h-full w-full cursor-pointer rounded-xl',
          'text-sm font-medium transition-colors duration-200',
          value === 'income'
            ? 'text-white'
            : 'text-white/45 hover:text-white/75',
        )}
      >
        Доходы
      </button>

      <button
        type="button"
        aria-pressed={isExpense}
        onClick={() => onChange('expense')}
        className={cn(
          'relative z-10 h-full w-full cursor-pointer rounded-xl',
          'text-sm font-medium transition-colors duration-200',
          isExpense ? 'text-white' : 'text-white/45 hover:text-white/75',
        )}
      >
        Расходы
      </button>
    </div>
  )
}
