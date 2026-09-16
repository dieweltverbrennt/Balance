import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRound, Mail, Lock, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from '@/features/auth/schemas/auth.schema'

import logo from '@/assets/logo.png'
import { login, register } from '@/api/auth'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'
import './Auth.scss'

type AuthMode = 'login' | 'register'

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login')

  const isLogin = mode === 'login'

  const setAccessToken = useAuthStore((state) => state.setAuthData)

  const navigate = useNavigate()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onLogin = async (data: LoginFormData) => {
    try {
      const response = await login(data)

      if (!response.accessToken || !response.name) {
        throw new Error('Не удалось войти в аккаунт')
      }

      setAccessToken(response.accessToken, response.name)
      navigate('/')
    } catch (error) {
      toast.error('Не удалось войти в аккаунт')
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data

      const response = await register(registerData)

      if (!response.accessToken || !response.name) {
        throw new Error('Не удалось зарегистрироваться')
      }

      setAccessToken(response.accessToken, response.name)
      navigate('/')
    } catch (error) {
      toast.error('Не удалось зарегистрироваться')
    }
  }

  return (
    <div className="auth">
      <div className="auth__title">
        <img src={logo} className="auth__logo" alt="logo" />
        <p className="auth__text">Balance</p>
      </div>

      <h1>{isLogin ? 'Добро пожаловать обратно!' : 'Создайте аккаунт'}</h1>

      <p>
        {isLogin
          ? 'Войдите в свой аккаунт, чтобы продолжить'
          : 'Начните свой путь в финансовой осознанности'}
      </p>

      {isLogin ? (
        <form className="auth__form" onSubmit={loginForm.handleSubmit(onLogin)}>
          <div className="auth__input">
            <Mail className="auth__icon" />

            <input
              className="w-full"
              type="email"
              placeholder="Email"
              {...loginForm.register('email')}
            />

            {loginForm.formState.errors.email && (
              <span className="auth__error">
                {loginForm.formState.errors.email.message}
              </span>
            )}
          </div>

          <div className="auth__input">
            <Lock className="auth__icon" />

            <input
              className="w-full"
              type="password"
              placeholder="Пароль"
              {...loginForm.register('password')}
            />

            {loginForm.formState.errors.password && (
              <span className="auth__error">
                {loginForm.formState.errors.password.message}
              </span>
            )}
          </div>

          <button type="submit" className="auth__submit">
            Войти
          </button>
        </form>
      ) : (
        <form
          className="auth__form"
          onSubmit={registerForm.handleSubmit(onRegister)}
        >
          <div className="auth__input">
            <UserRound className="auth__icon" />

            <input
              className="w-full"
              type="text"
              placeholder="Имя"
              {...registerForm.register('name')}
            />
            {registerForm.formState.errors.name && (
              <span className="auth__error">
                {registerForm.formState.errors.name.message}
              </span>
            )}
          </div>

          <div className="auth__input">
            <Mail className="auth__icon" />

            <input
              className="w-full"
              type="email"
              placeholder="Email"
              {...registerForm.register('email')}
            />
            {registerForm.formState.errors.email && (
              <span className="auth__error">
                {registerForm.formState.errors.email.message}
              </span>
            )}
          </div>

          <div className="auth__input">
            <Lock className="auth__icon" />

            <input
              className="w-full"
              type="password"
              placeholder="Пароль"
              {...registerForm.register('password')}
            />
            {registerForm.formState.errors.password && (
              <span className="auth__error">
                {registerForm.formState.errors.password.message}
              </span>
            )}
          </div>

          <div className="auth__input">
            <LockKeyhole className="auth__icon" />

            <input
              className="w-full"
              type="password"
              placeholder="Повторите пароль"
              {...registerForm.register('confirmPassword')}
            />
            {registerForm.formState.errors.confirmPassword && (
              <span className="auth__error">
                {registerForm.formState.errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button type="submit" className="auth__submit">
            Зарегистрироваться
          </button>
        </form>
      )}

      <div className="auth__switch">
        {isLogin ? (
          <>
            <span>Нет аккаунта?</span>

            <Button
              variant="ghost"
              className="auth__switch-btn"
              type="button"
              onClick={() => setMode('register')}
            >
              Зарегистрироваться
            </Button>
          </>
        ) : (
          <>
            <span>Уже есть аккаунт?</span>

            <Button
              variant="ghost"
              className="auth__switch-btn"
              type="button"
              onClick={() => setMode('login')}
            >
              Вход
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
