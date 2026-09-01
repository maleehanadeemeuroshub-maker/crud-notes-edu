import { useEffect, useRef } from 'react'
import type { AppNote } from '@/types/appNote'
import { useToast } from '@/context/ToastContext'

const CHECK_INTERVAL_MS = 20_000

/** Polls active notes for a due reminder and fires a toast + browser notification (once per reminder value). */
export function useReminderNotifications(notes: AppNote[]): void {
  const { showToast } = useToast()
  const notifiedFor = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    function check() {
      const now = Date.now()
      for (const note of notes) {
        if (!note.reminderAt) continue
        if (notifiedFor.current.get(note.id) === note.reminderAt) continue
        if (new Date(note.reminderAt).getTime() > now) continue

        notifiedFor.current.set(note.id, note.reminderAt)
        showToast(`Reminder: ${note.title}`, 'info')
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(note.title, { body: note.content.slice(0, 120) || 'Reminder', tag: note.id })
        }
      }
    }

    check()
    const interval = window.setInterval(check, CHECK_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [notes, showToast])
}
