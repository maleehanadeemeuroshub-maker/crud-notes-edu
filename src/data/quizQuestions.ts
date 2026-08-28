import type { QuizQuestion } from '@/types/quiz'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What does CRUD stand for?',
    choices: [
      'Create, Read, Update, Delete',
      'Copy, Retrieve, Undo, Deploy',
      'Create, Retrieve, Undo, Destroy',
      'Connect, Read, Upload, Download',
    ],
    correctIndex: 0,
    explanation: 'CRUD stands for Create, Read, Update, and Delete — the four fundamental operations for working with persistent data.',
  },
  {
    id: 'q2',
    question: 'Which HTTP method is most commonly used to create a new resource?',
    choices: ['GET', 'POST', 'DELETE', 'HEAD'],
    correctIndex: 1,
    explanation: 'POST is conventionally used to create a new resource, and a successful response typically returns 201 Created.',
  },
  {
    id: 'q3',
    question: 'Which SQL command retrieves data from a table?',
    choices: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
    correctIndex: 2,
    explanation: 'SELECT is the SQL command used to read (query) data — it never modifies the table.',
  },
  {
    id: 'q4',
    question: 'What is the main purpose of the PATCH method?',
    choices: [
      'To delete a resource',
      'To replace an entire resource',
      'To apply a partial update to a resource',
      'To create a new resource',
    ],
    correctIndex: 2,
    explanation: 'PATCH applies a partial modification — you send only the fields that changed, and the rest of the resource stays untouched.',
  },
  {
    id: 'q5',
    question: 'In CRUD terms, what does the "Delete" operation typically map to in SQL?',
    choices: ['DROP TABLE', 'DELETE FROM', 'REMOVE', 'TRUNCATE'],
    correctIndex: 1,
    explanation: 'DELETE FROM removes rows that match a condition. DROP TABLE removes the entire table structure, which is a very different (and far more destructive) operation.',
  },
  {
    id: 'q6',
    question: 'Which status code should a successful DELETE request typically return?',
    choices: ['200 OK with a body', '201 Created', '204 No Content', '404 Not Found'],
    correctIndex: 2,
    explanation: '204 No Content signals success with nothing left to return, since the resource no longer exists.',
  },
  {
    id: 'q7',
    question: 'What is the key difference between PUT and PATCH?',
    choices: [
      'PUT is for reading, PATCH is for creating',
      'PUT replaces the whole resource, PATCH updates part of it',
      'They are exactly the same',
      'PATCH is only used for deleting resources',
    ],
    correctIndex: 1,
    explanation: 'PUT conventionally replaces a resource\'s full representation; PATCH applies a partial change to specific fields.',
  },
  {
    id: 'q8',
    question: 'Which layer typically sits between the frontend and the database in a web application?',
    choices: ['The browser cache', 'The backend / API', 'The DNS server', 'The CSS stylesheet'],
    correctIndex: 1,
    explanation: 'The backend (often exposed as an API) receives requests from the frontend, applies business logic and validation, and talks to the database.',
  },
]
