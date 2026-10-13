import { cn } from 'cn'

export type TransactionType = 'income' | 'expense'

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
  return (
    <div
      className={cn(
        'relative grid h-12 w-[280px] grid-cols-2',
        'rounded-2xl border border-white/[0.12]',
        'bg-black/10 p-1',
        'backdrop-blur-2xl backdrop-saturate-150',
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]',
        className,
      )}
    >
      {/* Active pill */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-1 left-1 z-0',
          'w-[calc(50%-4px)] rounded-xl',
          'bg-[#8375F2]',
          'shadow-[0_6px_24px_rgba(131,117,242,0.30)]',
          'transition-transform duration-300 ease-out',
          value === 'expense' && 'translate-x-full',
        )}
      />

      <button
        type="button"
        onClick={() => onChange('income')}
        className={cn(
          'relative z-10 h-full w-full cursor-pointer rounded-xl',
          'text-sm font-medium',
          'transition-colors duration-200',
          value === 'income'
            ? 'text-white'
            : 'text-white/45 hover:text-white/75',
        )}
      >
        Доходы
      </button>

      <button
        type="button"
        onClick={() => onChange('expense')}
        className={cn(
          'relative z-10 h-full w-full cursor-pointer rounded-xl',
          'text-sm font-medium',
          'transition-colors duration-200',
          value === 'expense'
            ? 'text-white'
            : 'text-white/45 hover:text-white/75',
        )}
      >
        Расходы
      </button>
    </div>
  )
}
