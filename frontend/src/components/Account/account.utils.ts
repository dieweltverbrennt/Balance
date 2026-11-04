import { Banknote, CreditCard, PiggyBank, Wallet, type LucideIcon } from 'lucide-react'

import type { AccountType } from '@/types/account'

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: 'Наличные',
  debit: 'Дебетовая карта',
  credit: 'Кредитная карта',
  savings: 'Накопительный счёт',
}

export const ACCOUNT_TYPE_ICONS: Record<AccountType, LucideIcon> = {
  cash: Banknote,
  debit: CreditCard,
  credit: Wallet,
  savings: PiggyBank,
}

export const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
  cash: '#69d7c6',
  debit: '#a58bff',
  credit: '#f17c9c',
  savings: '#65b9ff',
}

const toTenThousandths = (amount: string | number) => {
  const [wholePart = '0', fractionPart = ''] = String(amount).split('.')
  const negative = wholePart.startsWith('-')
  const whole = BigInt(wholePart.replace('-', '') || '0')
  const fraction = BigInt(fractionPart.padEnd(4, '0').slice(0, 4) || '0')
  const value = whole * 10_000n + fraction

  return negative ? -value : value
}

export const formatAccountAmount = (amount: string | number, currency: string) => {
  const value = toTenThousandths(amount)
  const absoluteCents = (value < 0n ? -value : value) + 50n
  const roundedCents = absoluteCents / 100n
  const whole = roundedCents / 100n
  const fraction = roundedCents % 100n
  const sign = value < 0n && roundedCents > 0n ? '−' : ''
  const formattedWhole = new Intl.NumberFormat('ru-RU').format(whole)
  const formattedFraction = fraction === 0n ? '' : `,${fraction.toString().padStart(2, '0')}`

  return `${sign}${formattedWhole}${formattedFraction} ${currency.trim()}`
}

const fromTenThousandths = (value: bigint) => {
  const sign = value < 0n ? '-' : ''
  const absoluteValue = value < 0n ? -value : value
  const whole = absoluteValue / 10_000n
  const fraction = (absoluteValue % 10_000n).toString().padStart(4, '0')

  return `${sign}${whole}.${fraction}`
}

export const getCurrencyTotals = <
  T extends { initialBalance: string; currencyCode: string; isArchived: boolean },
>(accounts: T[]) => {
  const totals = new Map<string, bigint>()

  for (const account of accounts) {
    if (account.isArchived) continue
    totals.set(
      account.currencyCode,
      (totals.get(account.currencyCode) ?? 0n) +
        toTenThousandths(account.initialBalance),
    )
  }

  return [...totals.entries()].map(([currency, total]) => ({
    currency,
    total: fromTenThousandths(total),
  }))
}
