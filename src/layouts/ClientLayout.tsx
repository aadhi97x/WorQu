import { Outlet, useLocation } from 'react-router-dom'
import { NavBar } from '@/components/shared/NavBar'
import { AnimatePresence, motion } from 'framer-motion'
import { PortalBackground } from '@/components/ui/PortalBackground'

export function ClientLayout() {
  const location = useLocation()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PortalBackground />
      <NavBar mode="client" />
      <main style={{ flex: 1, paddingTop: 64, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
