import type { KnowledgeNote, NoteCategory } from '@/types/note'

export const CATEGORY_LABELS: Record<NoteCategory, string> = {
  'crud-basics': 'CRUD Basics',
  sql: 'SQL',
  'rest-api': 'REST API',
  'http-methods': 'HTTP Methods',
  databases: 'Databases',
  backend: 'Backend',
  frontend: 'Frontend',
  authentication: 'Authentication',
  validation: 'Validation',
  'error-handling': 'Error Handling',
}

export const NOTES: KnowledgeNote[] = [
  // --- CRUD Basics ---
  {
    id: 'what-is-crud',
    title: 'What CRUD Actually Means',
    category: 'crud-basics',
    summary: 'The four operations every data-driven application is built on.',
    body: [
      'CRUD is an acronym for Create, Read, Update, and Delete — the four basic operations you can perform on persistent data. It isn\'t a technology, a library, or a framework; it\'s a pattern. Almost any feature you can name in a real application eventually reduces to one of these four actions.',
      'Think of any app you use daily. A messaging app creates messages, reads your conversation history, lets you edit (update) a sent message, and lets you delete one. A shopping app creates orders, reads your order history, updates your shipping address, and deletes items from your cart. The interface looks different every time, but underneath, it\'s the same four verbs.',
      'Understanding CRUD is foundational because it gives you a mental model for *any* feature request. When a client asks for "a way to manage employees," you can immediately break that down: Create an employee, Read the employee list, Update an employee\'s details, Delete an employee. That decomposition is often the first step in designing both your database schema and your API.',
    ],
    tags: ['crud', 'basics', 'introduction'],
    calloutType: 'pro-tip',
    callout: 'When you\'re not sure how to start designing a feature, ask "what are the CRUD operations here?" first. It almost always clarifies the data model.',
  },
  {
    id: 'crud-is-a-pattern-not-a-tech',
    title: 'CRUD Is a Pattern, Not a Technology',
    category: 'crud-basics',
    summary: 'CRUD can be implemented with any database, any language, any framework.',
    body: [
      'A common beginner misconception is treating "CRUD" as if it were a specific tool you install. It isn\'t. CRUD is a description of *what* your application does to data, independent of *how* it does it.',
      'You can implement full CRUD with PostgreSQL and Node.js, with MongoDB and Python, with a spreadsheet and VBA macros, or even with plain text files and shell scripts. The operations stay conceptually identical — insert a record, look up a record, change a record, remove a record — even though the underlying commands look completely different.',
      'This is why CRUD shows up in job interviews, system design discussions, and tutorials across every stack. It\'s a shared vocabulary that lets developers talk about data operations without getting bogged down in implementation details first.',
    ],
    tags: ['crud', 'concepts'],
  },
  {
    id: 'crud-vs-rest',
    title: 'CRUD vs. REST — What\'s the Difference?',
    category: 'crud-basics',
    summary: 'CRUD is about data operations; REST is about how a client talks to a server.',
    body: [
      'CRUD and REST are often mentioned in the same breath, which leads people to think they\'re the same thing. They\'re not — they solve different problems.',
      'CRUD describes *what happens to your data*: something is created, read, updated, or deleted. REST (Representational State Transfer) describes *how a client and server communicate* over HTTP — using resources identified by URLs, and a consistent set of HTTP methods to act on them.',
      'They pair up naturally because REST\'s HTTP methods map cleanly onto CRUD\'s four operations (POST → Create, GET → Read, PUT/PATCH → Update, DELETE → Delete). But you could implement CRUD without REST at all — over GraphQL, gRPC, or a raw TCP socket. And you could build a REST API that doesn\'t follow CRUD conventions strictly. They complement each other; neither requires the other.',
    ],
    tags: ['crud', 'rest', 'api'],
    calloutType: 'common-mistake',
    callout: 'Saying "CRUD API" and "REST API" as if they\'re interchangeable. A REST API is one common way to expose CRUD operations — not the only way.',
  },

  // --- SQL ---
  {
    id: 'sql-insert',
    title: 'INSERT — Adding Rows in SQL',
    category: 'sql',
    summary: 'The SQL statement behind every Create operation.',
    body: [
      'INSERT INTO adds a new row to a table. You specify the table, the columns you\'re providing values for, and the values themselves. Any column you don\'t mention will use its default value (or NULL, if no default exists).',
      'Example: INSERT INTO products (name, price, stock) VALUES (\'Wireless Mouse\', 19.99, 120); This creates one new row in the products table with those three values, while any other column (like an auto-incrementing id) is filled in automatically by the database.',
      'Most databases let you insert multiple rows in a single statement by separating value groups with commas, which is far more efficient than running one INSERT per row when you\'re seeding data.',
    ],
    tags: ['sql', 'insert', 'create'],
  },
  {
    id: 'sql-select',
    title: 'SELECT — Querying Data in SQL',
    category: 'sql',
    summary: 'The most-used SQL statement, and the heart of every Read operation.',
    body: [
      'SELECT retrieves rows from one or more tables. In its simplest form, SELECT * FROM users returns every column of every row in the users table — but in real applications you almost always narrow that down.',
      'WHERE filters which rows come back (SELECT * FROM users WHERE role = \'admin\'). ORDER BY controls the sort order. LIMIT caps how many rows you get, which is essential for pagination. Together, these clauses let a single SELECT statement answer very specific questions instead of dumping an entire table.',
      'SELECT is also the only one of the four CRUD-related SQL statements that is safe to run repeatedly without changing anything — which is exactly why Read is considered a "safe" operation.',
    ],
    tags: ['sql', 'select', 'read'],
    calloutType: 'pro-tip',
    callout: 'Avoid SELECT * in production code. Naming the exact columns you need makes queries faster and your code more resilient when the table gains new columns later.',
  },
  {
    id: 'sql-update',
    title: 'UPDATE — Modifying Rows in SQL',
    category: 'sql',
    summary: 'How existing rows get changed without being replaced.',
    body: [
      'UPDATE changes the values of existing rows. You specify the table, a SET clause listing the columns to change, and — critically — a WHERE clause identifying which rows to affect.',
      'Example: UPDATE products SET stock = stock - 1 WHERE id = 7; This decreases the stock count for exactly one product, leaving every other row untouched.',
      'The WHERE clause is not optional in practice, even though SQL allows you to omit it. Running UPDATE products SET price = 0; without a WHERE clause sets every single product\'s price to zero. This is one of the most common — and most damaging — mistakes new developers make while learning SQL.',
    ],
    tags: ['sql', 'update'],
    calloutType: 'common-mistake',
    callout: 'Forgetting the WHERE clause on an UPDATE (or DELETE) statement. Always test your WHERE clause with a SELECT first to see exactly which rows it matches.',
  },
  {
    id: 'sql-delete',
    title: 'DELETE — Removing Rows in SQL',
    category: 'sql',
    summary: 'How rows are permanently removed from a table.',
    body: [
      'DELETE FROM removes rows matching a WHERE clause. Example: DELETE FROM sessions WHERE expires_at < NOW(); removes every expired session row.',
      'DELETE is different from TRUNCATE and DROP TABLE, two commands beginners sometimes confuse it with. DELETE removes specific rows (and can be filtered). TRUNCATE empties an entire table at once. DROP TABLE removes the table structure itself, along with all its data — there\'s no "rows" left to talk about.',
      'Just like UPDATE, a DELETE statement without a WHERE clause affects every row in the table. Many teams require an explicit WHERE clause (or a code review) before any DELETE ships to production.',
    ],
    tags: ['sql', 'delete'],
  },
  {
    id: 'sql-vs-nosql',
    title: 'SQL vs. NoSQL Databases',
    category: 'sql',
    summary: 'Two different ways to store the same kind of data.',
    body: [
      'SQL databases (PostgreSQL, MySQL, SQL Server) store data in tables with a fixed schema — every row in a table has the same columns, and relationships between tables are enforced with foreign keys. They\'re a great fit when your data is highly structured and relationships matter (orders belong to customers, comments belong to posts).',
      'NoSQL databases (MongoDB, DynamoDB, Firestore) store data more flexibly — often as JSON-like documents that don\'t require a fixed schema. They tend to shine when your data is less structured, changes shape often, or needs to scale horizontally across many servers.',
      'Both categories fully support CRUD. The operations map differently (INSERT vs. insertOne, SELECT vs. find), but the underlying pattern — create, read, update, delete — is identical. Choosing SQL or NoSQL is a decision about how your data is shaped and how it needs to scale, not about whether CRUD applies.',
    ],
    tags: ['sql', 'nosql', 'databases'],
  },

  // --- REST API ---
  {
    id: 'what-is-a-rest-api',
    title: 'What Is a REST API?',
    category: 'rest-api',
    summary: 'A set of conventions for exposing resources over HTTP.',
    body: [
      'A REST API lets a client (like a web browser or mobile app) interact with a server\'s data over HTTP, using URLs to identify resources and standard HTTP methods to act on them.',
      'A "resource" is just a noun — a user, a product, an order. REST conventions say each resource gets its own URL (like /api/users/42), and the HTTP method you use against that URL determines what happens: GET reads it, PUT or PATCH updates it, DELETE removes it. Creating a new resource typically POSTs to the collection URL (/api/users), not to a specific ID.',
      'This consistency is REST\'s biggest strength. Once you know the pattern, you can predict how almost any well-designed REST API works without reading its documentation line by line.',
    ],
    tags: ['rest', 'api', 'http'],
  },
  {
    id: 'rest-status-codes',
    title: 'HTTP Status Codes for CRUD Endpoints',
    category: 'rest-api',
    summary: 'What number your API should return, and when.',
    body: [
      'Status codes tell the client how a request went, without them having to parse the response body. 2xx means success, 4xx means the client made a mistake, and 5xx means the server made a mistake.',
      'For CRUD specifically: Create typically returns 201 Created. Read returns 200 OK (or 404 Not Found if the resource doesn\'t exist). Update returns 200 OK with the updated resource. Delete often returns 204 No Content, since there\'s nothing left to send back.',
      '400 Bad Request means the client sent invalid data. 401 Unauthorized means the client isn\'t authenticated. 403 Forbidden means they are authenticated, but not allowed to do this. Getting these right makes your API dramatically easier for other developers (including future you) to work with.',
    ],
    tags: ['rest', 'http', 'status-codes'],
  },
  {
    id: 'rest-resource-naming',
    title: 'Naming REST Endpoints Well',
    category: 'rest-api',
    summary: 'Conventions that make an API predictable.',
    body: [
      'Good REST endpoints use plural nouns for collections (/api/users, not /api/getUser), and rely on the HTTP method to express the action rather than the URL. /api/users with a POST creates a user — you don\'t need a URL like /api/createUser.',
      'Nested resources reflect ownership: /api/users/42/orders reads the orders that belong to user 42. Query parameters handle filtering, sorting, and pagination: /api/products?category=electronics&sort=price&limit=20.',
      'Consistency matters more than any single "correct" convention. Pick a naming style and apply it everywhere — an API that\'s 90% consistent is far easier to use than one that\'s perfectly RESTful in some places and improvised in others.',
    ],
    tags: ['rest', 'api', 'design'],
  },

  // --- HTTP Methods ---
  {
    id: 'http-get',
    title: 'GET — Retrieve Data',
    category: 'http-methods',
    summary: 'The HTTP method behind the Read operation.',
    body: [
      'GET requests ask the server for data without changing anything. Because GET is "safe" and "idempotent" (calling it once or a hundred times has the same effect), browsers cache GET responses, prefetch them, and let you bookmark or share the URL.',
      'GET requests don\'t have a request body — any parameters go in the URL itself, either as path segments (/api/users/42) or query strings (/api/users?role=admin).',
    ],
    tags: ['http', 'get', 'read'],
  },
  {
    id: 'http-post',
    title: 'POST — Create a Resource',
    category: 'http-methods',
    summary: 'The HTTP method behind the Create operation.',
    body: [
      'POST sends data to the server to create something new. Unlike GET, POST is not idempotent by convention — sending the same POST request twice is expected to create two separate resources (imagine submitting an order form twice).',
      'POST requests carry their data in the request body, usually as JSON. The response typically includes the newly created resource, including whatever ID the server generated for it.',
    ],
    tags: ['http', 'post', 'create'],
  },
  {
    id: 'http-put-patch',
    title: 'PUT vs. PATCH — Two Ways to Update',
    category: 'http-methods',
    summary: 'Both update a resource, but they mean different things.',
    body: [
      'PUT conventionally replaces a resource\'s entire representation. You send the full object as you want it to exist after the request — any field you omit is expected to be cleared or reset. PUT is idempotent: sending the same PUT twice leaves the resource in the same final state.',
      'PATCH conventionally applies a partial update. You send only the fields that changed, and everything else on the resource stays exactly as it was. This is usually what a simple "edit this one field" form actually needs.',
      'In practice, many APIs are a little loose about this distinction and use PUT for partial updates too — but understanding the intended difference helps you design (and consume) APIs more predictably, and it\'s a very common interview question.',
    ],
    tags: ['http', 'put', 'patch', 'update'],
    calloutType: 'pro-tip',
    callout: 'CRUD describes what you do with data; HTTP methods describe how clients commonly communicate those operations through REST APIs.',
  },
  {
    id: 'http-delete',
    title: 'DELETE — Remove a Resource',
    category: 'http-methods',
    summary: 'The HTTP method behind the Delete operation.',
    body: [
      'DELETE asks the server to remove a resource. It\'s idempotent by convention: deleting the same resource twice should leave the system in the same state (gone) both times, even if the second request returns 404 instead of 204.',
      'DELETE requests usually don\'t need a request body — the resource is already identified by the URL (DELETE /api/users/42).',
    ],
    tags: ['http', 'delete'],
  },

  // --- Databases ---
  {
    id: 'what-is-a-database',
    title: 'What Is a Database?',
    category: 'databases',
    summary: 'Where your application\'s data actually lives.',
    body: [
      'A database is organized, persistent storage for data — built specifically to hold large amounts of information, retrieve it quickly, and keep it safe even after the application restarts or crashes.',
      'This is different from storing data in a JavaScript variable or a plain file. Variables disappear the moment your program stops running. Databases are designed to survive restarts, handle many simultaneous users, enforce rules about what data is valid, and answer complex queries efficiently — all things CRUD operations rely on.',
    ],
    tags: ['databases', 'basics'],
  },
  {
    id: 'frontend-api-backend-database-flow',
    title: 'The Frontend → API → Backend → Database Flow',
    category: 'databases',
    summary: 'How a single click turns into a saved record.',
    body: [
      'When you click "Save" on a form, four layers cooperate to make that happen. The frontend (the interface you see) collects your input and sends it as an HTTP request to an API endpoint.',
      'The backend receives that request, checks whether it\'s valid and whether you\'re allowed to make it, and translates it into a database operation. The database executes that operation (an INSERT, SELECT, UPDATE, or DELETE) and returns a result. The backend packages that result into a response, and the frontend updates what you see on screen.',
      'Every CRUD action you perform in any app follows this same round trip. Understanding it is often the "aha" moment that makes full-stack development click — the UI is just the visible tip of a chain that ends at a database.',
    ],
    tags: ['databases', 'architecture', 'flow'],
  },
  {
    id: 'crud-across-database-types',
    title: 'CRUD Works the Same Way Across Database Types',
    category: 'databases',
    summary: 'Same four operations, different syntax underneath.',
    body: [
      'It doesn\'t matter whether your data lives in PostgreSQL, MySQL, MongoDB, or something more exotic — every one of these systems exists to support the same four operations. What differs is the syntax and the underlying storage model, not the pattern itself.',
      'In PostgreSQL or MySQL, Create is INSERT INTO. In MongoDB, it\'s insertOne(). In Firestore, it\'s addDoc(). The verb is always "add a new record," even though the code looks nothing alike.',
    ],
    tags: ['databases', 'sql', 'nosql'],
  },

  // --- Backend ---
  {
    id: 'role-of-the-backend',
    title: 'What the Backend Is Actually Responsible For',
    category: 'backend',
    summary: 'The layer between "what the user wants" and "what the database allows."',
    body: [
      'The backend is where business logic lives: validating input, checking permissions, enforcing rules the database alone can\'t (like "a user can only edit their own posts"), and translating requests into database operations.',
      'A well-designed backend never trusts the frontend. Even if your React form validates that an email field looks correct, the backend re-validates it — because anyone can send an HTTP request directly, bypassing your UI entirely.',
    ],
    tags: ['backend', 'architecture'],
  },
  {
    id: 'controllers-and-routes',
    title: 'Routes and Controllers in a CRUD Backend',
    category: 'backend',
    summary: 'How backend code is typically organized around CRUD.',
    body: [
      'Most backend frameworks organize CRUD logic around "routes" (which URL and HTTP method triggers this code) and "controllers" (the function that actually runs). A typical users resource has five routes: list users (GET), get one user (GET /:id), create a user (POST), update a user (PATCH /:id), and delete a user (DELETE /:id).',
      'This five-route pattern repeats for almost every resource in an application, which is why frameworks like Rails, Django, and Laravel offer shortcuts ("resourceful routing") to generate all five at once.',
    ],
    tags: ['backend', 'routes', 'crud'],
  },

  // --- Frontend ---
  {
    id: 'frontend-role-in-crud',
    title: 'How the Frontend Triggers CRUD Operations',
    category: 'frontend',
    summary: 'Buttons, forms, and fetch calls.',
    body: [
      'The frontend\'s job in CRUD is to turn user actions into HTTP requests, and turn responses back into something the user can see. A "Save" button on a form fires a POST or PATCH request. A page load fires a GET request. A "Delete" button (usually after a confirmation) fires a DELETE request.',
      'Modern frontend frameworks (React, Vue, Svelte) manage this with local state: you keep a copy of the data in memory, update it when a request succeeds, and re-render the UI to match — so the interface always reflects what\'s actually true in the database.',
    ],
    tags: ['frontend', 'crud', 'ui'],
  },
  {
    id: 'optimistic-vs-pessimistic-updates',
    title: 'Optimistic vs. Pessimistic UI Updates',
    category: 'frontend',
    summary: 'Two strategies for how fast the UI reacts to a CRUD request.',
    body: [
      'A "pessimistic" update waits for the server to confirm a change before updating the UI — safe, but can feel slow. Click "favorite," wait for the response, then the star fills in.',
      'An "optimistic" update changes the UI immediately, assuming the request will succeed, and quietly reverts it if the server says otherwise. This makes an app feel instant, at the cost of slightly more complex error-handling code.',
    ],
    tags: ['frontend', 'ux', 'crud'],
  },

  // --- Authentication ---
  {
    id: 'authentication-vs-authorization',
    title: 'Authentication vs. Authorization',
    category: 'authentication',
    summary: 'Two different questions your backend has to answer.',
    body: [
      'Authentication answers "who are you?" — logging in with a password, a token, or a session cookie proves your identity to the server.',
      'Authorization answers "are you allowed to do this?" — even once the server knows who you are, it still has to check whether you\'re permitted to perform a specific CRUD operation (can you delete this post, or only its original author?).',
      'CRUD endpoints almost always need both: authenticate the request first, then authorize the specific action against the specific resource.',
    ],
    tags: ['auth', 'security', 'crud'],
  },
  {
    id: 'protecting-crud-endpoints',
    title: 'Protecting CRUD Endpoints',
    category: 'authentication',
    summary: 'Why not every CRUD operation should be public.',
    body: [
      'Read operations are often public (anyone can view a product listing), while Create, Update, and Delete usually require the caller to be signed in — and often to own the resource they\'re modifying.',
      'A common pattern: check authentication first (is there a valid session or token at all?), then check ownership or role (does this specific user have permission to modify this specific record?). Skipping either check is one of the most common security holes in real-world CRUD applications.',
    ],
    tags: ['auth', 'security', 'crud'],
    calloutType: 'beginner-warning',
    callout: 'Never rely on hiding a button in the UI as your only protection. If the DELETE endpoint itself doesn\'t check permissions, anyone can call it directly.',
  },

  // --- Validation ---
  {
    id: 'why-validate-input',
    title: 'Why Every Create and Update Needs Validation',
    category: 'validation',
    summary: 'Bad data in is bad data forever, unless you stop it early.',
    body: [
      'Validation checks that incoming data meets your application\'s rules before it touches the database: required fields are present, emails look like emails, numbers are actually numbers, strings aren\'t absurdly long.',
      'Validation should happen on both the frontend (for instant feedback) and the backend (for actual protection). Frontend validation improves user experience; backend validation is what prevents bad or malicious data from ever reaching your database, since the frontend can always be bypassed.',
    ],
    tags: ['validation', 'crud', 'backend'],
  },
  {
    id: 'validation-vs-sanitization',
    title: 'Validation vs. Sanitization',
    category: 'validation',
    summary: 'Rejecting bad input versus cleaning it up.',
    body: [
      'Validation rejects input that doesn\'t meet your rules — an invalid email returns a 400 error and nothing is saved. Sanitization instead cleans or transforms input into an acceptable form — trimming whitespace, stripping unsafe HTML, or lower-casing an email before it\'s stored.',
      'Most production Create and Update endpoints do both: sanitize first to normalize the data, then validate to make sure what remains is actually acceptable.',
    ],
    tags: ['validation', 'sanitization'],
  },

  // --- Error Handling ---
  {
    id: 'error-handling-in-crud-apis',
    title: 'Handling Errors Gracefully in CRUD APIs',
    category: 'error-handling',
    summary: 'What a good API does when something goes wrong.',
    body: [
      'Every CRUD operation can fail: the record you\'re trying to read doesn\'t exist, the data you\'re trying to create is invalid, or a database connection drops mid-request. A well-designed API anticipates this and returns a clear, consistent error shape instead of crashing or returning nothing.',
      'A typical error response includes an appropriate status code (404 for "not found," 400 for "bad input," 500 for "something broke on our end") and a short, human-readable message explaining what went wrong — without leaking internal details like stack traces or database schema.',
    ],
    tags: ['errors', 'api', 'crud'],
  },
  {
    id: 'frontend-error-states',
    title: 'Designing Frontend Error States',
    category: 'error-handling',
    summary: 'What the user sees when a CRUD request fails.',
    body: [
      'A polished frontend never leaves the user staring at a frozen "Loading..." spinner or a blank screen when a request fails. Every CRUD action should account for three states: loading (request in progress), success (show the result), and error (explain what happened and let the user retry).',
      'For destructive operations like Delete, error handling matters even more — if a delete request fails silently, the user might believe something is gone when it isn\'t, or vice versa.',
    ],
    tags: ['errors', 'frontend', 'ux'],
  },
]
