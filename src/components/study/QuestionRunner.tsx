'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { AnswerResult, Question } from '@/lib/types'
import { Button, Card, CategoryBadge, TypeBadge } from '@/components/ui'
import { isCorrectAnswer, prepareAll, type PreparedOptions } from './prepare'
import { ChoiceView, Explanation, PlaceholderView, TFView, TermQuizView } from './views'

interface Props {
  questions: Question[]
  allQuestions: Question[]
  onAnswer: (questionId: string, correct: boolean) => void
  onFinish: (results: AnswerResult[]) => void
  onAbort: () => void
}

type Answered = { choice: number | boolean; correct: boolean } | null

export function QuestionRunner({ questions, allQuestions, onAnswer, onFinish, onAbort }: Props) {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState<Answered>(null)
  const [results, setResults] = useState<AnswerResult[]>([])

  // 選択肢のシャッフルと用語問題の 4 択化（セッション中は固定）
  const prepared = useMemo(() => prepareAll(questions, allQuestions), [questions, allQuestions])

  const q = questions[index]
  const quiz = q ? prepared.get(q.id) : undefined
  const total = questions.length
  const isLast = index >= total - 1

  const answer = useCallback(
    (choice: number | boolean) => {
      if (!q || answered) return
      const correct = isCorrectAnswer(q, quiz, choice)
      setAnswered({ choice, correct })
      onAnswer(q.id, correct)
      setResults((prev) => [...prev, { questionId: q.id, correct, answeredAt: Date.now() }])
    },
    [q, quiz, answered, onAnswer],
  )

  const next = useCallback(() => {
    if (!answered) return
    if (isLast) {
      onFinish(results)
      return
    }
    setIndex((i) => i + 1)
    setAnswered(null)
  }, [answered, isLast, onFinish, results])

  // キーボード操作
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'Enter') {
        if (answered) {
          e.preventDefault()
          next()
        }
        return
      }
      if (answered || !q) return
      const n = Number(e.key)
      if (!Number.isInteger(n) || n < 1) return
      if (q.type === 'truefalse' || q.type === 'short' || q.type === 'calc') {
        if (n === 1) answer(true)
        else if (n === 2) answer(false)
      } else if (quiz && n <= quiz.options.length) {
        answer(n - 1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [answered, q, quiz, answer, next])

  if (!q) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span>
          {index + 1} / {total} 問（残り {total - index - 1}）
        </span>
        <Button size="sm" variant="ghost" onClick={onAbort}>
          中断
        </Button>
      </div>
      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
        <div className="h-full bg-accent transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <CategoryBadge category={q.category} />
          <TypeBadge type={q.type} />
          <span className="text-xs text-muted">難易度 {'★'.repeat(q.difficulty)}</span>
        </div>
        <QuestionBody q={q} quiz={quiz} answered={answered} onAnswer={answer} />
      </Card>

      {answered && (
        <Card className={clsx('border-2', answered.correct ? 'border-success' : 'border-danger')}>
          <div className={clsx('font-bold mb-2', answered.correct ? 'text-success' : 'text-danger')}>
            {answered.correct ? '正解' : '不正解'}
          </div>
          <Explanation q={q} />
          <p className="text-xs text-muted mt-2">出典: {q.source}</p>
          <Button variant="primary" size="lg" className="w-full mt-3" onClick={next}>
            {isLast ? '結果を見る' : '次へ（Enter）'}
          </Button>
        </Card>
      )}
    </div>
  )
}

/** 出題ルータ: 形式ごとにビューを切り替える。short / calc はプレースホルダ */
function QuestionBody({
  q, quiz, answered, onAnswer,
}: { q: Question; quiz?: PreparedOptions; answered: Answered; onAnswer: (v: number | boolean) => void }) {
  switch (q.type) {
    case 'truefalse':
      return <TFView q={q} answered={answered} onAnswer={onAnswer} />
    case 'choice':
      return quiz ? <ChoiceView q={q} prepared={quiz} answered={answered} onAnswer={onAnswer} /> : null
    case 'term':
      return quiz ? <TermQuizView q={q} prepared={quiz} answered={answered} onAnswer={onAnswer} /> : null
    case 'short':
    case 'calc':
      return <PlaceholderView q={q} answered={answered} onAnswer={onAnswer} />
  }
}
