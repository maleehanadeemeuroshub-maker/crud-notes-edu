import type { OperationDetail } from '@/types/crud'

export const OPERATIONS: OperationDetail[] = [
  {
    id: 'create',
    label: 'Create',
    verb: 'CREATE',
    tagline: 'Add something new that didn\'t exist before.',
    meaning:
      'Create is how an application adds a brand new record to persistent storage. Every time someone signs up, adds a product to a cart, or writes a comment, a Create operation runs behind the scenes to turn that action into a permanent row (or document) in your database.',
    dbAction:
      'At the database layer, Create almost always maps to an INSERT statement (SQL) or an insertOne/insertMany call (NoSQL). The database assigns storage for the new record and, in most designs, generates a unique identifier for it automatically.',
    sqlKeyword: 'INSERT INTO',
    httpMethods: ['POST'],
    primaryHttpMethod: 'POST',
    whenToUse:
      'Use Create whenever the user is submitting information for the first time — registration forms, "Add to cart" buttons, "New post" editors, file uploads, or any action that produces a resource that did not exist a moment ago.',
    realWorldExample:
      'When you sign up for a new account, the app takes your form data, validates it, and inserts a new row into the "users" table. That row now has a permanent ID you can look up later.',
    flow: ['User fills a form', 'Frontend sends POST request', 'Backend validates the data', 'Database runs INSERT', 'New record returned to frontend'],
    code: {
      sql: `INSERT INTO users (name, email, role)
VALUES ('Amina Khan', 'amina@example.com', 'member');`,
      javascript: `async function createUser(payload) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Could not create user')
  return response.json()
}`,
      rest: `POST /api/users HTTP/1.1
Content-Type: application/json

{
  "name": "Amina Khan",
  "email": "amina@example.com",
  "role": "member"
}

→ 201 Created`,
    },
    commonMistake:
      'Returning a 200 OK instead of 201 Created — or worse, not returning the newly created resource (including its generated ID) in the response body, forcing the client to make a second request just to find out what it created.',
    proTip:
      'Always validate on the server, even if you already validate on the frontend. Client-side validation is for user experience; server-side validation is what actually protects your data.',
  },
  {
    id: 'read',
    label: 'Read',
    verb: 'READ',
    tagline: 'Retrieve data that already exists.',
    meaning:
      'Read is how an application fetches existing data so it can be displayed, searched, or used in a calculation. It is the only CRUD operation that does not change anything — a Read should always be safe to repeat without side effects.',
    dbAction:
      'At the database layer, Read maps to a SELECT statement (SQL) or a find/findOne query (NoSQL). Reads can target a single record by ID, a filtered subset of records, or an entire table.',
    sqlKeyword: 'SELECT',
    httpMethods: ['GET'],
    primaryHttpMethod: 'GET',
    whenToUse:
      'Use Read for anything that displays information back to the user: loading a profile page, listing products, searching, filtering, pagination, and generating reports.',
    realWorldExample:
      'When you open your order history, the app sends a GET request that queries the "orders" table for every row where user_id matches you, and returns them sorted by date.',
    flow: ['User opens a page or searches', 'Frontend sends GET request', 'Backend builds a query (with filters, if any)', 'Database runs SELECT', 'Matching records returned to frontend'],
    code: {
      sql: `SELECT id, name, email, role
FROM users
WHERE role = 'member'
ORDER BY created_at DESC;`,
      javascript: `async function getUsers(role) {
  const url = role ? \`/api/users?role=\${role}\` : '/api/users'
  const response = await fetch(url)

  if (!response.ok) throw new Error('Could not load users')
  return response.json()
}`,
      rest: `GET /api/users?role=member HTTP/1.1

→ 200 OK
[
  { "id": 12, "name": "Amina Khan", "role": "member" },
  { "id": 15, "name": "Farhan Ali", "role": "member" }
]`,
    },
    commonMistake:
      'Fetching an entire table when only a handful of fields or rows are actually needed. Unbounded reads are one of the most common causes of slow pages as an app\'s data grows.',
    proTip:
      'A GET request should never modify data. If a "read" endpoint has a side effect (like incrementing a counter), that surprises other developers and breaks caching — model the side effect as its own operation instead.',
  },
  {
    id: 'update',
    label: 'Update',
    verb: 'UPDATE',
    tagline: 'Change something that already exists.',
    meaning:
      'Update is how an application modifies an existing record without deleting it. Editing your profile bio, marking a task as complete, or changing a product\'s price are all Update operations — the record keeps its identity, but its data changes.',
    dbAction:
      'At the database layer, Update maps to an UPDATE statement (SQL) or an updateOne/updateMany call (NoSQL). The database locates the target row by its identifier and rewrites the specified fields.',
    sqlKeyword: 'UPDATE',
    httpMethods: ['PUT', 'PATCH'],
    primaryHttpMethod: 'PATCH',
    whenToUse:
      'Use Update whenever the user is editing something that already exists: profile settings, task status, an item\'s quantity in a cart, or an admin correcting a typo in a listing.',
    realWorldExample:
      'When you change your display name in account settings, the frontend sends a PATCH request with just the new name, and the backend updates only that one column for your existing user row.',
    flow: ['User edits a field', 'Frontend sends PUT or PATCH request', 'Backend validates the change', 'Database runs UPDATE on the matching row', 'Updated record returned to frontend'],
    code: {
      sql: `UPDATE users
SET role = 'admin'
WHERE id = 42;`,
      javascript: `async function updateUser(id, changes) {
  const response = await fetch(\`/api/users/\${id}\`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  })

  if (!response.ok) throw new Error('Could not update user')
  return response.json()
}`,
      rest: `PATCH /api/users/42 HTTP/1.1
Content-Type: application/json

{ "role": "admin" }

→ 200 OK`,
    },
    commonMistake:
      'Confusing PUT and PATCH. PUT is conventionally used to replace a resource\'s full representation, while PATCH applies a partial change. Sending a PUT with only one field can unintentionally wipe out every other field the client didn\'t include.',
    proTip:
      'If your frontend form only ever edits a couple of fields at a time, PATCH is almost always the better fit — it says exactly what changed and leaves everything else alone.',
  },
  {
    id: 'delete',
    label: 'Delete',
    verb: 'DELETE',
    tagline: 'Remove something so it no longer exists.',
    meaning:
      'Delete is how an application removes a record permanently (or marks it as removed) from storage. Deleting a comment, canceling an order, or closing an account are all Delete operations — and unlike the other three, this one is usually irreversible.',
    dbAction:
      'At the database layer, Delete maps to a DELETE statement (SQL) or a deleteOne/deleteMany call (NoSQL). Many production systems use a "soft delete" instead — setting a deleted_at timestamp rather than physically removing the row — so data can be recovered or audited later.',
    sqlKeyword: 'DELETE FROM',
    httpMethods: ['DELETE'],
    primaryHttpMethod: 'DELETE',
    whenToUse:
      'Use Delete when the user explicitly wants a record gone: removing an item from a cart, deleting a draft post, or an admin banning a spam account.',
    realWorldExample:
      'When you delete a note in an app, the frontend sends a DELETE request with that note\'s ID, and the backend either removes the row entirely or flags it as deleted so it disappears from your view.',
    flow: ['User confirms deletion', 'Frontend sends DELETE request', 'Backend checks permissions', 'Database runs DELETE (or soft-delete flag)', 'Confirmation returned to frontend'],
    code: {
      sql: `DELETE FROM users
WHERE id = 42;`,
      javascript: `async function deleteUser(id) {
  const response = await fetch(\`/api/users/\${id}\`, {
    method: 'DELETE',
  })

  if (!response.ok) throw new Error('Could not delete user')
}`,
      rest: `DELETE /api/users/42 HTTP/1.1

→ 204 No Content`,
    },
    commonMistake:
      'Deleting a record with no confirmation step and no way to recover it. A single misclick can destroy data a user spent hours creating.',
    proTip:
      'Prefer soft deletes for anything a user might regret losing. A deleted_at column costs almost nothing and turns "it\'s gone forever" into "it\'s recoverable for 30 days."',
  },
]

export const OPERATION_MAP: Record<string, OperationDetail> = OPERATIONS.reduce(
  (acc, op) => ({ ...acc, [op.id]: op }),
  {},
)
