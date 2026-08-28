import type { LearningStep } from '@/types/crud'

export const LEARNING_PATH: LearningStep[] = [
  {
    id: 'understand-crud',
    order: 1,
    title: 'Understand CRUD',
    description: 'Learn what Create, Read, Update, and Delete mean and why nearly every app is built around them.',
    linkTo: '/learn',
  },
  {
    id: 'learn-databases',
    order: 2,
    title: 'Learn Databases',
    description: 'Understand what a database is, and how it stores the records your CRUD operations act on.',
    linkTo: '/database',
  },
  {
    id: 'learn-sql',
    order: 3,
    title: 'Learn SQL',
    description: 'Write INSERT, SELECT, UPDATE, and DELETE statements — the SQL equivalent of CRUD.',
    linkTo: '/sql',
  },
  {
    id: 'learn-rest',
    order: 4,
    title: 'Learn REST APIs',
    description: 'See how HTTP methods like GET, POST, PUT, PATCH, and DELETE expose CRUD over a network.',
    linkTo: '/api',
  },
  {
    id: 'build-crud-apis',
    order: 5,
    title: 'Build CRUD APIs',
    description: 'Design endpoints, validate input, and return the right status codes for each operation.',
    linkTo: '/api',
  },
  {
    id: 'connect-frontend',
    order: 6,
    title: 'Connect the Frontend',
    description: 'Call your API from a real interface: forms for Create, lists for Read, and confirmations for Delete.',
    linkTo: '/playground',
  },
  {
    id: 'build-full-app',
    order: 7,
    title: 'Build a Full CRUD Application',
    description: 'Put it all together — try the interactive playground to practice every operation hands-on.',
    linkTo: '/playground',
  },
]
