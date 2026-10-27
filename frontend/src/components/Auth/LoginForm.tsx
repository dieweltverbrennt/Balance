import { useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { login } from '@/api/auth'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { useAuthStore } from '@/stores/auth.store'
import { AuthField } from './AuthField'

export const LoginForm = () => {
  const navigate = useNavigate()
  const setAuthData = useAuthStore((state) => state.setAuthData)
  const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data)
      if (!response.accessToken || !response.name) {
        throw new Error('Login response is incomplete')
      }

      setAuthData(response.accessToken, response.name)
      navigate('/')
    } catch {
      toast.error('Не удалось войти в аккаунт')
    }
  }

  return (
    <form className="auth__form" onSubmit={form.handleSubmit(onSubmit)}>
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

      <button type="submit" className="auth__submit">
        Войти
      </button>
    </form>
  )
}
