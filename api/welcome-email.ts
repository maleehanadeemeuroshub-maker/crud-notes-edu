/**
 * Sends a welcome email through Resend right after a new user registers.
 * Runs as a Vercel Function so the Resend API key never reaches the browser.
 *
 * The caller proves it just authenticated by passing its Supabase access token — this
 * endpoint verifies that token against Supabase (rather than trusting a client-supplied
 * email) before sending, so it can't be used as an open relay to spam arbitrary addresses.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body: { accessToken?: string }
  try {
    body = (await request.json()) as { accessToken?: string }
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const { accessToken } = body
  if (!accessToken) return new Response('Missing accessToken', { status: 400 })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  const resendApiKey = process.env.RESEND_API_KEY
  const resendDomain = process.env.RESEND_EMAIL_DOMAIN

  if (!supabaseUrl || !supabaseAnonKey || !resendApiKey || !resendDomain) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${accessToken}` },
  })
  if (!userRes.ok) return new Response('Invalid session', { status: 401 })

  const user = (await userRes.json()) as { email?: string; user_metadata?: { full_name?: string } }
  const email = user.email
  if (!email) return new Response('No email on account', { status: 400 })
  const fullName = user.user_metadata?.full_name || 'there'

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `CRUD Notes <welcome@${resendDomain}>`,
      to: [email],
      subject: 'Welcome to CRUD Notes!',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="font-size: 20px;">Welcome, ${fullName} 👋</h1>
          <p>Your CRUD Notes account is ready. You can now:</p>
          <ul>
            <li>Create and organize notes with tags, colors, and categories</li>
            <li>Set reminders on any note</li>
            <li>Share a note with a public link</li>
          </ul>
          <p>Jump back in whenever you're ready.</p>
        </div>
      `,
    }),
  })

  if (!emailRes.ok) {
    console.error('Resend error:', await emailRes.text())
    return new Response('Failed to send email', { status: 502 })
  }

  return new Response(null, { status: 204 })
}
