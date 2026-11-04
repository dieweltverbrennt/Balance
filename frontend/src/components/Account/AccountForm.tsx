import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { accountSchema, type AccountFormData } from '@/schemas/account.schema'
import type { Account, CreateAccountData } from '@/types/account'
import { AccountTypeSelect } from './AccountTypeSelect'

interface AccountFormProps {
  account?: Account
  isPending: boolean
  onClose: () => void
  onSubmit: (data: CreateAccountData) => Promise<void>
}

export const AccountForm = ({
  account,
  isPending,
  onClose,
  onSubmit,
}: AccountFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name ?? '',
      bankName: account?.bankName ?? '',
      type: account?.type ?? 'debit',
      currencyCode: account?.currencyCode ?? '₽',
      initialBalance: account?.initialBalance ?? '0',
      isDefault: account?.isDefault ?? false,
    },
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isPending, onClose])

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit({
        ...values,
        bankName: values.bankName.trim() || null,
        currencyCode: values.currencyCode.trim(),
      })
    } catch {
      // The page mutation reports the API error and keeps the form open.
    }
  })

  return (
    <motion.div
      className="accounts-form__backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose()
      }}
    >
      <motion.section
        className="accounts-form account-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-form-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <header className="accounts-form__header">
          <div>
            <span className="accounts-page__eyebrow">
              {account ? 'НАСТРОЙКИ СЧЁТА' : 'НОВЫЙ СЧЁТ'}
            </span>
            <h2 id="account-form-title">
              {account ? 'Редактировать счёт' : 'Добавить счёт'}
            </h2>
          </div>
          <button
            className="accounts-form__close"
            type="button"
            aria-label="Закрыть форму"
            disabled={isPending}
            onClick={onClose}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        <form className="accounts-form__body" onSubmit={(event) => void submit(event)}>
          <label className="accounts-form__field">
            <span>Название счёта</span>
            <input
              placeholder="Например, Основная карта"
              maxLength={100}
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
            {errors.name && <small role="alert">{errors.name.message}</small>}
          </label>

          <label className="accounts-form__field">
            <span>Банк <em>необязательно</em></span>
            <input placeholder="Например, Т-Банк" maxLength={100} {...register('bankName')} />
          </label>

          <div className="accounts-form__row">
            <div className="accounts-form__field">
              <span>Тип счёта</span>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <AccountTypeSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <label className="accounts-form__field accounts-form__field--currency">
              <span>Валюта</span>
              <input
                maxLength={3}
                aria-invalid={Boolean(errors.currencyCode)}
                {...register('currencyCode')}
              />
              {errors.currencyCode && (
                <small role="alert">{errors.currencyCode.message}</small>
              )}
            </label>
          </div>

          <label className="accounts-form__field">
            <span>Начальный баланс</span>
            <input
              inputMode="decimal"
              placeholder="0"
              aria-invalid={Boolean(errors.initialBalance)}
              {...register('initialBalance')}
            />
            {errors.initialBalance && (
              <small role="alert">{errors.initialBalance.message}</small>
            )}
          </label>

          <div className="accounts-form__options">
            <label className="accounts-form__checkbox">
              <input type="checkbox" {...register('isDefault')} />
              <span>Основной счёт</span>
            </label>
          </div>
          {errors.isDefault && (
            <small className="accounts-form__form-error" role="alert">
              {errors.isDefault.message}
            </small>
          )}

          <footer className="accounts-form__footer">
            <button
              type="button"
              className="accounts-form__cancel"
              disabled={isPending}
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="accounts-form__save" disabled={isPending}>
              {isPending ? 'Сохраняем…' : account ? 'Сохранить' : 'Добавить счёт'}
            </button>
          </footer>
        </form>
      </motion.section>
    </motion.div>
  )
}
