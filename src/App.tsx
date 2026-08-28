import type { ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastProvider } from '@/context/ToastContext'
import { ProgressProvider } from '@/context/ProgressContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { Home } from '@/pages/Home'
import { Learn } from '@/pages/Learn'
import { Database } from '@/pages/Database'
import { Api } from '@/pages/Api'
import { Sql } from '@/pages/Sql'
import { Playground } from '@/pages/Playground'
import { Quiz } from '@/pages/Quiz'
import { Notes } from '@/pages/Notes'
import { NotFound } from '@/pages/NotFound'

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/learn" element={<PageTransition><Learn /></PageTransition>} />
        <Route path="/database" element={<PageTransition><Database /></PageTransition>} />
        <Route path="/api" element={<PageTransition><Api /></PageTransition>} />
        <Route path="/sql" element={<PageTransition><Sql /></PageTransition>} />
        <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
        <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
        <Route path="/notes" element={<PageTransition><Notes /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ToastProvider>
      <ProgressProvider>
        <div className="flex min-h-screen flex-col bg-[#0a0d0e]">
          <ScrollToTop />
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </ProgressProvider>
    </ToastProvider>
  )
}

export default App
