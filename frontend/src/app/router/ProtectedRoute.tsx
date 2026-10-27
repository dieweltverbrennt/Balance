import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  if (!isInitialized) {
    return <div role="status">Проверяем сессию…</div>
  }

  if (!accessToken) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}
