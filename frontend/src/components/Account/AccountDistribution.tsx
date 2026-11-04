import type { CSSProperties } from 'react'

import type { Account, AccountType } from '@/types/account'
import {
  ACCOUNT_TYPE_COLORS,
  ACCOUNT_TYPE_LABELS,
} from './account.utils'

interface AccountDistributionProps {
  accounts: Account[]
  isLoading: boolean
}

const ACCOUNT_TYPES: AccountType[] = ['debit', 'savings', 'credit', 'cash']

export const AccountDistribution = ({
  accounts,
  isLoading,
}: AccountDistributionProps) => {
  const activeAccounts = accounts.filter((account) => !account.isArchived)
  const distribution = ACCOUNT_TYPES.map((type) => ({
    type,
    count: activeAccounts.filter((account) => account.type === type).length,
  })).filter((item) => item.count > 0)
  const totalCount = activeAccounts.length

  let angle = 0
  const segments = distribution.map(({ type, count }) => {
    const start = angle
    angle += (count / Math.max(totalCount, 1)) * 360
    return `${ACCOUNT_TYPE_COLORS[type]} ${start}deg ${angle}deg`
  })
  const chartStyle = {
    '--account-chart':
      segments.length > 0
        ? `conic-gradient(${segments.join(', ')})`
        : 'conic-gradient(rgba(255,255,255,.1) 0deg 360deg)',
  } as CSSProperties

  return (
    <section className="accounts-distribution account-panel" aria-labelledby="accounts-distribution-title">
      <div className="accounts-distribution__heading">
        <div>
          <span className="accounts-page__eyebrow">СТРУКТУРА</span>
          <h2 id="accounts-distribution-title">По типам счетов</h2>
        </div>
        <span className="accounts-distribution__count">{totalCount}</span>
      </div>

      {isLoading ? (
        <p className="accounts-distribution__empty" role="status">Загружаем…</p>
      ) : distribution.length === 0 ? (
        <p className="accounts-distribution__empty">Пока нет активных счетов</p>
      ) : (
        <div className="accounts-distribution__content">
          <div className="accounts-distribution__donut" style={chartStyle} aria-hidden="true">
            <span>{totalCount}</span>
          </div>
          <ul className="accounts-distribution__legend">
            {distribution.map(({ type, count }) => (
              <li key={type}>
                <span
                  className="accounts-distribution__dot"
                  style={{ backgroundColor: ACCOUNT_TYPE_COLORS[type] }}
                  aria-hidden="true"
                />
                <span className="accounts-distribution__label">
                  {ACCOUNT_TYPE_LABELS[type]}
                </span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
