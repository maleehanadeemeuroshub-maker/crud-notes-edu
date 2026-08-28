import { QuizApp } from '@/components/quiz/QuizApp'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

export function Quiz() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="Test yourself"
          title="CRUD Quiz"
          description="Eight quick questions covering CRUD, SQL, and HTTP methods. See how much stuck."
          align="center"
        />
      </Reveal>
      <div className="mt-10">
        <QuizApp />
      </div>
    </div>
  )
}
