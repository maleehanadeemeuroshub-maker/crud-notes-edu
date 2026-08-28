import type { ApiEndpoint } from '@/types/crud'

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'create-user',
    method: 'POST',
    path: '/api/users',
    operation: 'create',
    purpose: 'Create a brand new user record.',
    requestExample: `{
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "member"
}`,
    responseExample: `{
  "id": 42,
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "member",
  "createdAt": "2026-08-28T09:15:00Z"
}`,
    statusCodes: [
      { code: 201, meaning: 'Created — the user now exists.' },
      { code: 400, meaning: 'Bad Request — required fields are missing or invalid.' },
      { code: 409, meaning: 'Conflict — a user with that email already exists.' },
    ],
  },
  {
    id: 'list-users',
    method: 'GET',
    path: '/api/users',
    operation: 'read',
    purpose: 'Retrieve a list of users, optionally filtered or paginated.',
    responseExample: `[
  { "id": 12, "name": "Amina Khan", "role": "member" },
  { "id": 15, "name": "Farhan Ali", "role": "admin" }
]`,
    statusCodes: [
      { code: 200, meaning: 'OK — returns an array (possibly empty).' },
      { code: 401, meaning: 'Unauthorized — the caller is not signed in.' },
    ],
  },
  {
    id: 'get-user',
    method: 'GET',
    path: '/api/users/:id',
    operation: 'read',
    purpose: 'Retrieve a single user by their unique ID.',
    responseExample: `{
  "id": 42,
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "member"
}`,
    statusCodes: [
      { code: 200, meaning: 'OK — the user was found.' },
      { code: 404, meaning: 'Not Found — no user exists with that ID.' },
    ],
  },
  {
    id: 'replace-user',
    method: 'PUT',
    path: '/api/users/:id',
    operation: 'update',
    purpose: 'Replace the entire user record with a new representation.',
    requestExample: `{
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "admin"
}`,
    responseExample: `{
  "id": 42,
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "admin"
}`,
    statusCodes: [
      { code: 200, meaning: 'OK — the resource was fully replaced.' },
      { code: 400, meaning: 'Bad Request — the body is missing required fields.' },
      { code: 404, meaning: 'Not Found — no user exists with that ID.' },
    ],
  },
  {
    id: 'patch-user',
    method: 'PATCH',
    path: '/api/users/:id',
    operation: 'update',
    purpose: 'Apply a partial update to specific fields on a user.',
    requestExample: `{ "role": "admin" }`,
    responseExample: `{
  "id": 42,
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "admin"
}`,
    statusCodes: [
      { code: 200, meaning: 'OK — the specified fields were updated.' },
      { code: 404, meaning: 'Not Found — no user exists with that ID.' },
    ],
  },
  {
    id: 'delete-user',
    method: 'DELETE',
    path: '/api/users/:id',
    operation: 'delete',
    purpose: 'Permanently remove a user record.',
    responseExample: `// No response body`,
    statusCodes: [
      { code: 204, meaning: 'No Content — the user was deleted.' },
      { code: 404, meaning: 'Not Found — no user exists with that ID.' },
    ],
  },
]
