import { z } from 'zod'

export const accountSchema = z
  .object({
    name: z.string().trim().min(1, 'Введите название счёта').max(100),
    bankName: z.string().max(100),
    type: z.enum(['cash', 'debit', 'credit', 'savings']),
    currencyCode: z.string().trim().min(1, 'Укажите валюту').max(3),
    initialBalance: z
      .string()
      .regex(/^-?\d{1,15}(?:\.\d{1,4})?$/, 'Введите сумму с точностью до 4 знаков'),
    isDefault: z.boolean(),
  })

export type AccountFormData = z.infer<typeof accountSchema>
