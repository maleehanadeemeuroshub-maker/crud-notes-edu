import { PlaygroundApp } from '@/components/playground/PlaygroundApp'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

export function Playground() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="Hands-on"
          title="CRUD Playground"
          description="A fully working demo backed by a sample Users dataset. Create, edit, search, filter, and delete — every change persists in your browser via localStorage."
        />
      </Reveal>
      <div className="mt-8">
        <PlaygroundApp />
      </div>
    </div>
  )
}
