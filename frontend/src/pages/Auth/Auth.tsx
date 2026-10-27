import { useState } from 'react'

import { Button } from '@/components/ui/button'
import logo from '@/assets/logo.png'
import { LoginForm } from '@/components/Auth/LoginForm'
import { RegisterForm } from '@/components/Auth/RegisterForm'
import './Auth.scss'

type AuthMode = 'login' | 'register'

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const isLogin = mode === 'login'

  return (
    <div className="auth">
      <div className="auth__title">
        <img src={logo} className="auth__logo" alt="logo" />
        <p className="auth__text">Balance</p>
      </div>

      <h1>
        {isLogin
          ? 'Добро пожаловать обратно!'
          : 'Создайте аккаунт'}
      </h1>

      <p>
        {isLogin
          ? 'Войдите в свой аккаунт, чтобы продолжить'
          : 'Начните свой путь в финансовой осознанности'}
      </p>

      {isLogin ? <LoginForm /> : <RegisterForm />}

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
