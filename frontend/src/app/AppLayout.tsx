import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar/Sidebar'

export const AppLayout = () => {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <div className="app">
      <Sidebar />

      <main className="app__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
