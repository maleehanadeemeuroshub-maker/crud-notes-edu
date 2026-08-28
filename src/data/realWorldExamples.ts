import type { RealWorldExample } from '@/types/crud'

export const REAL_WORLD_EXAMPLES: RealWorldExample[] = [
  {
    id: 'ecommerce',
    title: 'E-commerce Store',
    icon: 'shopping-cart',
    description: 'Every product listing and order in an online store is driven by CRUD.',
    operations: [
      { operation: 'create', action: 'A seller adds a new product, or a shopper places an order.' },
      { operation: 'read', action: 'A shopper browses the catalog or checks an order\'s status.' },
      { operation: 'update', action: 'A seller changes a price, or stock is decremented after a sale.' },
      { operation: 'delete', action: 'A seller removes a discontinued product from the catalog.' },
    ],
  },
  {
    id: 'blog',
    title: 'Blogging Platform',
    icon: 'newspaper',
    description: 'Publishing and managing articles is a textbook CRUD workflow.',
    operations: [
      { operation: 'create', action: 'A writer publishes a new blog post.' },
      { operation: 'read', action: 'A reader opens the post, or the homepage lists recent articles.' },
      { operation: 'update', action: 'The author fixes a typo or updates the content.' },
      { operation: 'delete', action: 'The author removes a post they no longer want public.' },
    ],
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: 'users',
    description: 'Almost every application needs to manage accounts using CRUD.',
    operations: [
      { operation: 'create', action: 'Someone registers for a new account.' },
      { operation: 'read', action: 'An admin views a list of registered users.' },
      { operation: 'update', action: 'A user edits their profile or resets their password.' },
      { operation: 'delete', action: 'A user closes their account, or an admin bans a user.' },
    ],
  },
  {
    id: 'task-management',
    title: 'Task Manager',
    icon: 'check-square',
    description: 'To-do and project tools are built entirely around CRUD operations.',
    operations: [
      { operation: 'create', action: 'A user adds a new task to their board.' },
      { operation: 'read', action: 'The board loads and displays all of today\'s tasks.' },
      { operation: 'update', action: 'A user marks a task complete or reassigns it.' },
      { operation: 'delete', action: 'A user removes a task they no longer need.' },
    ],
  },
]
