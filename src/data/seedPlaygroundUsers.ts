import type { PlaygroundUser } from '@/types/playgroundUser'
import { generateId } from '@/utils/id'

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export function seedPlaygroundUsers(): PlaygroundUser[] {
  return [
    { id: generateId(), name: 'Amina Khan', email: 'amina@example.com', role: 'admin', status: 'active', createdAt: daysAgo(30) },
    { id: generateId(), name: 'Farhan Ali', email: 'farhan@example.com', role: 'member', status: 'active', createdAt: daysAgo(21) },
    { id: generateId(), name: 'Sara Malik', email: 'sara@example.com', role: 'member', status: 'invited', createdAt: daysAgo(9) },
    { id: generateId(), name: 'Bilal Ahmed', email: 'bilal@example.com', role: 'viewer', status: 'active', createdAt: daysAgo(4) },
    { id: generateId(), name: 'Hina Raza', email: 'hina@example.com', role: 'member', status: 'suspended', createdAt: daysAgo(2) },
  ]
}
