export type NoteCategory =
  | 'crud-basics'
  | 'sql'
  | 'rest-api'
  | 'http-methods'
  | 'databases'
  | 'backend'
  | 'frontend'
  | 'authentication'
  | 'validation'
  | 'error-handling'

export interface KnowledgeNote {
  id: string
  title: string
  category: NoteCategory
  summary: string
  body: string[]
  tags: string[]
  calloutType?: 'pro-tip' | 'common-mistake' | 'beginner-warning'
  callout?: string
}
