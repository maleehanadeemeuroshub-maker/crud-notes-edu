export interface QuizQuestion {
  id: string
  question: string
  choices: string[]
  correctIndex: number
  explanation: string
}
