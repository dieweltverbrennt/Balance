import { Route, Routes } from 'react-router-dom'

import { AppLayout } from './AppLayout'
import { AuthLayout } from './AuthLayout'

import { Main } from '@/pages/Main/Main'
import { Accounts } from '@/pages/Accounts/Accounts'
import { Transactions } from '@/pages/Transactions/Transactions'
import { Categories } from '@/pages/Categories/Categories'
import { Analytics } from '@/pages/Analytics/Analytics'
import { Settings } from '@/pages/Settings/Settings'
import { Auth } from '@/pages/Auth/Auth'

import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import './App.scss'

export const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Main />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </>
  )
}

export default App
