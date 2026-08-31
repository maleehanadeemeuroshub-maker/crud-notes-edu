import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

/**
 * The app has no real backend, so `/api/*` requests made with fetch/axios
 * are intercepted at the network layer by a mock service worker and served
 * from a localStorage-backed "database" (see src/mocks). This keeps auth
 * and notes CRUD wired up to genuine HTTP requests instead of a client-side
 * shim — open devtools → Network to see them.
 */
async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
