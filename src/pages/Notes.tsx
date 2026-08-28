import { NotesExplorer } from '@/components/notes/NotesExplorer'
import { ProgressWidget } from '@/components/ui/ProgressWidget'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

export function Notes() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <SectionHeading
            kicker="Developer Notes"
            title="The CRUD Notes knowledge base"
            description="Short, searchable notes covering CRUD basics, SQL, REST APIs, HTTP methods, databases, backend, frontend, authentication, validation, and error handling."
          />
        </Reveal>
        <div className="w-full sm:w-64">
          <ProgressWidget />
        </div>
      </div>
      <div className="mt-10">
        <NotesExplorer />
      </div>
    </div>
  )
}
