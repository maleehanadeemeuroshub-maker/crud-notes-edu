export interface TrackableTopic {
  id: string
  label: string
}

export const TRACKABLE_TOPICS: TrackableTopic[] = [
  { id: 'op-create', label: 'Create operations' },
  { id: 'op-read', label: 'Read operations' },
  { id: 'op-update', label: 'Update operations' },
  { id: 'op-delete', label: 'Delete operations' },
  { id: 'crud-table', label: 'The CRUD ↔ SQL ↔ HTTP table' },
  { id: 'put-vs-patch', label: 'PUT vs. PATCH' },
  { id: 'crud-vs-rest', label: 'CRUD vs. REST' },
  { id: 'database-flow', label: 'Frontend → API → Backend → Database flow' },
  { id: 'sql-basics', label: 'SQL CRUD statements' },
  { id: 'rest-endpoints', label: 'REST API endpoints' },
  { id: 'real-world-examples', label: 'Real-world CRUD examples' },
  { id: 'playground', label: 'CRUD Playground practice' },
]
