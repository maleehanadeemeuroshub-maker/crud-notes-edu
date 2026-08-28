import { Reveal } from '@/components/ui/Reveal'
import { MethodBadge } from '@/components/ui/MethodBadge'
import { Callout } from '@/components/ui/Callout'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'

const ORIGINAL_USER = `{
  "id": 42,
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "member"
}`

const PUT_REQUEST = `PUT /api/users/42

{
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "admin"
}

→ Full object replaced.
  Every field must be sent.`

const PATCH_REQUEST = `PATCH /api/users/42

{
  "role": "admin"
}

→ Only "role" changes.
  Every other field is untouched.`

export function PutVsPatch() {
  return (
    <Reveal>
      <div className="panel rounded-2xl p-6">
        <div className="mb-5 rounded-xl border border-slate-900/8 bg-slate-900/[0.02] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-900/35">Starting resource</p>
          <div className="mt-2">
            <CodeBlock code={ORIGINAL_USER} language="json" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <MethodBadge method="PUT" size="md" />
              <p className="text-sm font-semibold text-slate-900">Replace the whole thing</p>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-slate-900/55">
              PUT conventionally represents the resource’s complete new state. Anything you leave out is treated as
              cleared, so the client must send every field — even the ones that didn’t change.
            </p>
            <CodeBlock code={PUT_REQUEST} language="rest" />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <MethodBadge method="PATCH" size="md" />
              <p className="text-sm font-semibold text-slate-900">Change just a piece</p>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-slate-900/55">
              PATCH sends only what changed. The server merges it into the existing resource, leaving every
              untouched field exactly as it was.
            </p>
            <CodeBlock code={PATCH_REQUEST} language="rest" />
          </div>
        </div>

        <div className="mt-5">
          <Callout type="pro-tip">
            CRUD describes what you do with data; HTTP methods describe how clients commonly communicate those
            operations through REST APIs. PUT and PATCH are both "Update" in CRUD terms — they just disagree on how
            much of the resource you need to send.
          </Callout>
        </div>

        <div className="mt-4">
          <TopicCheckbox topicId="put-vs-patch" />
        </div>
      </div>
    </Reveal>
  )
}
