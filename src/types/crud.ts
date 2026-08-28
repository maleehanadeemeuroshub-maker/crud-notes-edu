export type OperationId = 'create' | 'read' | 'update' | 'delete'

export interface CodeExample {
  sql: string
  javascript: string
  rest: string
}

export interface OperationDetail {
  id: OperationId
  label: string
  verb: string
  tagline: string
  meaning: string
  dbAction: string
  sqlKeyword: string
  httpMethods: string[]
  primaryHttpMethod: string
  whenToUse: string
  realWorldExample: string
  flow: string[]
  code: CodeExample
  commonMistake?: string
  proTip?: string
}

export interface ApiEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  operation: OperationId
  purpose: string
  requestExample?: string
  responseExample: string
  statusCodes: { code: number; meaning: string }[]
}

export interface RealWorldExample {
  id: string
  title: string
  icon: string
  description: string
  operations: { operation: OperationId; action: string }[]
}

export interface LearningStep {
  id: string
  order: number
  title: string
  description: string
  linkTo: string
}
