// Supabase Edge Function: sends a real "Welcome to CRUD Notes" email via Resend
// whenever a new row is inserted into auth.users. Triggered by a Postgres trigger
// (see supabase/welcome-email-trigger.sql) using pg_net, not by the browser —
// deployed with --no-verify-jwt, so it never runs client-side and never sees the anon key.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface AuthUserRow {
  id: string
  email: string
  raw_user_meta_data?: { full_name?: string }
}

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json()
    const user: AuthUserRow = payload.record ?? payload

    if (!user?.email) {
      return new Response(JSON.stringify({ skipped: 'no email on payload' }), { status: 200 })
    }
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), { status: 500 })
    }

    const firstName = (user.raw_user_meta_data?.full_name ?? 'there').split(' ')[0]

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: '"CRUD Notes" <onboarding@resend.dev>',
        to: [user.email],
        subject: 'Welcome to CRUD Notes 🎉',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Welcome, ${firstName}! 👋</h2>
            <p>Your CRUD Notes account is ready. Start capturing notes, pin the important ones, and organize everything with categories, tags, and colors.</p>
            <p style="margin-top: 24px;">
              <a href="https://crud-notes-edu.vercel.app/dashboard" style="background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">Open your dashboard</a>
            </p>
            <p style="margin-top: 24px; color: #888; font-size: 13px;">If you didn't create this account, you can safely ignore this email.</p>
          </div>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.text()
      return new Response(JSON.stringify({ error: 'Resend request failed', detail: errorBody }), { status: 502 })
    }

    return new Response(JSON.stringify({ sent: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 })
  }
})
