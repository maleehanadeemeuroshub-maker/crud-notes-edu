import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, RotateCcw, X } from 'lucide-react'
import { QUIZ_QUESTIONS } from '@/data/quizQuestions'
import { Button } from '@/components/ui/Button'
import clsx from 'clsx'

export function QuizApp() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const question = QUIZ_QUESTIONS[index]
  const isLast = index === QUIZ_QUESTIONS.length - 1

  function handleSelect(choiceIndex: number) {
    if (selected !== null) return
    setSelected(choiceIndex)
    if (choiceIndex === question.correctIndex) setScore((s) => s + 1)
  }

  function handleNext() {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  function handleRestart() {
    setIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
  }

  if (finished) {
    const percent = Math.round((score / QUIZ_QUESTIONS.length) * 100)
    return (
      <div className="panel mx-auto max-w-lg rounded-2xl p-8 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-emerald-600">Quiz complete</p>
        <p className="mt-2 text-4xl font-bold text-slate-900">
          {score}/{QUIZ_QUESTIONS.length}
        </p>
        <p className="mt-1 text-sm text-slate-900/50">You scored {percent}%</p>
        <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-slate-900/8">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${percent}%` }} />
        </div>
        <Button onClick={handleRestart} className="mt-6" variant="secondary">
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between text-xs text-slate-900/40">
        <span>
          Question {index + 1} of {QUIZ_QUESTIONS.length}
        </span>
        <span className="font-mono">Score: {score}</span>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-900/8">
        <motion.div
          className="h-full rounded-full bg-emerald-400"
          animate={{ width: `${((index + (selected !== null ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="panel rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold leading-snug text-slate-900">{question.question}</h3>
          <div className="mt-4 space-y-2">
            {question.choices.map((choice, i) => {
              const isSelected = selected === i
              const isCorrect = i === question.correctIndex
              const showFeedback = selected !== null

              return (
                <button
                  key={choice}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={clsx(
                    'focus-ring flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                    !showFeedback && 'border-slate-900/10 bg-slate-900/[0.02] text-slate-900/75 hover:border-slate-900/25 hover:bg-slate-900/[0.05]',
                    showFeedback && isCorrect && 'border-emerald-400/50 bg-emerald-400/10 text-emerald-700',
                    showFeedback && isSelected && !isCorrect && 'border-rose-400/50 bg-rose-400/10 text-rose-700',
                    showFeedback && !isSelected && !isCorrect && 'border-slate-900/8 bg-slate-900/[0.02] text-slate-900/35',
                  )}
                >
                  {choice}
                  {showFeedback && isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                  {showFeedback && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0 text-rose-600" />}
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="mt-4 rounded-lg border border-slate-900/8 bg-slate-900/[0.02] p-3 text-sm leading-relaxed text-slate-900/55">
                  {question.explanation}
                </p>
                <Button onClick={handleNext} className="mt-4 w-full">
                  {isLast ? 'See results' : 'Next question'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
