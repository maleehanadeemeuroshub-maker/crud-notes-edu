import type { ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastProvider } from '@/context/ToastContext'
import { ProgressProvider } from '@/context/ProgressContext'
import { AuthProvider } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { GuestRoute } from '@/components/layout/GuestRoute'
import { AmbientBackground } from '@/components/ui/AmbientBackground'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { Home } from '@/pages/Home'
import { Learn } from '@/pages/Learn'
import { Database } from '@/pages/Database'
import { Api } from '@/pages/Api'
import { Sql } from '@/pages/Sql'
import { Playground } from '@/pages/Playground'
import { Quiz } from '@/pages/Quiz'
import { Notes } from '@/pages/Notes'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { ResetPassword } from '@/pages/ResetPassword'
import { Dashboard } from '@/pages/Dashboard'
import { Settings } from '@/pages/Settings'
import { NotFound } from '@/pages/NotFound'

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.995 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
        <Route
          path="/login"
          element={
            <PageTransition>
              <GuestRoute><Login /></GuestRoute>
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <GuestRoute><Register /></GuestRoute>
            </PageTransition>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PageTransition>
              <GuestRoute><ForgotPassword /></GuestRoute>
            </PageTransition>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PageTransition>
              <GuestRoute><ResetPassword /></GuestRoute>
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <ProtectedRoute><Settings /></ProtectedRoute>
            </PageTransition>
          }
        />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProgressProvider>
          <div className="flex min-h-screen flex-col bg-base">
            <AmbientBackground />
            <CustomCursor />
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </ProgressProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
