import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),

  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов'),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Введите имя')
      .min(2, 'Имя должно содержать минимум 2 символа'),

    email: z.string().min(1, 'Введите email').email('Некорректный email'),

    password: z
      .string()
      .min(1, 'Введите пароль')
      .min(8, 'Пароль должен содержать минимум 8 символов'),

    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
