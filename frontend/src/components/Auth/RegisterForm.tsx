import { useNavigate } from 'react-router-dom'
import { Lock, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { register } from '@/api/auth'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'
import { useAuthStore } from '@/stores/auth.store'
import { AuthField } from './AuthField'

export const RegisterForm = () => {
  const navigate = useNavigate()
  const setAuthData = useAuthStore((state) => state.setAuthData)
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      const { name, email, password } = formData
      const response = await register({ name, email, password })
      if (!response.accessToken || !response.name) {
        throw new Error('Registration response is incomplete')
      }

      setAuthData(response.accessToken, response.name)
      navigate('/')
    } catch {
      toast.error('Не удалось зарегистрироваться')
    }
  }

  return (
    <form className="auth__form" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthField
        icon={UserRound}
        type="text"
        placeholder="Имя"
        registration={form.register('name')}
        error={form.formState.errors.name?.message}
      />
      <AuthField
        icon={Mail}
        type="email"
        placeholder="Email"
        registration={form.register('email')}
        error={form.formState.errors.email?.message}
      />
      <AuthField
        icon={Lock}
        type="password"
        placeholder="Пароль"
        registration={form.register('password')}
        error={form.formState.errors.password?.message}
      />
      <AuthField
        icon={LockKeyhole}
        type="password"
        placeholder="Повторите пароль"
        registration={form.register('confirmPassword')}
        error={form.formState.errors.confirmPassword?.message}
      />

      <button type="submit" className="auth__submit">
        Зарегистрироваться
      </button>
    </form>
  )
}
