import { ApiExplorer } from '@/components/api/ApiExplorer'
import { FetchVsAxiosDemo } from '@/components/api/FetchVsAxiosDemo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { MethodBadge } from '@/components/ui/MethodBadge'

export function Api() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="REST API"
          title="Exploring a CRUD API endpoint by endpoint"
          description="A REST API exposes CRUD operations over HTTP. Pick an endpoint on the left to see its method, purpose, request, response, and status codes."
        />
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2">
        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
          <MethodBadge key={m} method={m} size="md" />
        ))}
      </div>

      <div className="mt-8">
        <Reveal delay={0.05}>
          <ApiExplorer />
        </Reveal>
      </div>

      <div className="mt-16">
        <Reveal>
          <SectionHeading
            kicker="Live demo"
            title="Try it yourself: fetch() vs. Axios"
            description="Same request, two ways to send it. Pick a method and run each side to see the real response, status code, and timing."
          />
        </Reveal>
        <div className="mt-8">
          <Reveal delay={0.05}>
            <FetchVsAxiosDemo />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
