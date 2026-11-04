import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import type { AccountType } from '@/types/account'
import { ACCOUNT_TYPE_COLORS, ACCOUNT_TYPE_ICONS } from './account.utils'

const ACCOUNT_TYPE_OPTIONS: {
  value: AccountType
  label: string
}[] = [
  {
    value: 'debit',
    label: 'Дебетовая карта',
  },
  {
    value: 'savings',
    label: 'Накопительный счёт',
  },
  {
    value: 'credit',
    label: 'Кредитная карта',
  },
  {
    value: 'cash',
    label: 'Наличные',
  },
]

interface AccountTypeSelectProps {
  value: AccountType
  onChange: (value: AccountType) => void
}

export const AccountTypeSelect = ({
  value,
  onChange,
}: AccountTypeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selectedOption = ACCOUNT_TYPE_OPTIONS.find(
    (option) => option.value === value,
  )!
  const SelectedIcon = ACCOUNT_TYPE_ICONS[value]

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isOpen])

  return (
    <div
      ref={rootRef}
      className="account-type-select"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.stopPropagation()
          setIsOpen(false)
        }
      }}
    >
      <button
        type="button"
        className="account-type-select__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span
          className="account-type-select__icon"
          style={{ '--account-type-color': ACCOUNT_TYPE_COLORS[value] } as CSSProperties}
        >
          <SelectedIcon size={18} aria-hidden="true" />
        </span>
        <span className="account-type-select__selected-label">
          {selectedOption.label}
        </span>
        <ChevronDown
          className={`account-type-select__chevron${isOpen ? ' is-open' : ''}`}
          size={17}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="account-type-select__menu" role="menu">
          {ACCOUNT_TYPE_OPTIONS.map((option) => {
            const Icon = ACCOUNT_TYPE_ICONS[option.value]
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                className={`account-type-select__option${isSelected ? ' is-selected' : ''}`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                <span
                  className="account-type-select__icon"
                  style={{ '--account-type-color': ACCOUNT_TYPE_COLORS[option.value] } as CSSProperties}
                >
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span className="account-type-select__option-text">
                  {option.label}
                </span>
                {isSelected && <Check size={17} aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
