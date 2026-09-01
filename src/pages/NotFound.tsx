import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/[0.05]">
        <Compass className="h-7 w-7 text-ink/40" />
      </span>
      <h1 className="text-3xl font-bold text-ink">404</h1>
      <p className="text-sm text-ink/45">This page doesn't exist. Let's get you back to the notes.</p>
      <Link to="/">
        <Button>Return home</Button>
      </Link>
    </div>
  )
}
