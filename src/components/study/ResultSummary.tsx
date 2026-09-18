'use client'

import Link from 'next/link'
import type { AnswerResult, Category, Question } from '@/lib/types'
import { CATEGORIES, isDescriptiveCalc } from '@/lib/types'
import { Button, Card, CategoryBadge, ExamBadges, PageTitle, TypeBadge, pct } from '@/components/ui'

interface Props {
  questions: Question[]
  results: AnswerResult[]
  onRetryWrong: () => void
  onBack: () => void
}

function questionText(q: Question): string {
  switch (q.type) {
    case 'truefalse':
      return q.statement
    case 'choice':
      return q.stem
    case 'term':
      return `${q.term} — ${q.definition}`
    case 'short':
    case 'calc':
      return q.prompt
  }
}

function correctText(q: Question): string {
  switch (q.type) {
    case 'truefalse':
      return q.answer ? '○ 正しい' : '× 誤り'
    case 'choice':
      return q.options[q.answerIndex] ?? ''
    case 'term':
      return q.term
    case 'short':
      return q.modelAnswer
    case 'calc':
      return isDescriptiveCalc(q) ? q.solution : `${q.answer}${q.unit ?? ''}`
  }
}

export function ResultSummary({ questions, results, onRetryWrong, onBack }: Props) {
  const byId = new Map(questions.map((q) => [q.id, q]))
  const total = results.length
  const correct = results.filter((r) => r.correct).length
  const wrong = results.filter((r) => !r.correct)

  const perCat = new Map<Category, { c: number; n: number }>()
  for (const r of results) {
    const q = byId.get(r.questionId)
    if (!q) continue
    const cur = perCat.get(q.category) ?? { c: 0, n: 0 }
    cur.n++
    if (r.correct) cur.c++
    perCat.set(q.category, cur)
  }

  return (
    <>
      <PageTitle>結果</PageTitle>
      <Card className="mb-4 text-center">
        <div className="text-sm text-muted">正答率</div>
        <div className="text-4xl font-bold tabular-nums my-1">{pct(total ? correct / total : null)}</div>
        <div className="text-sm text-muted">
          {correct} / {total} 問正解
        </div>
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold mb-2">分野別</h2>
        <ul className="divide-y divide-border text-sm">
          {CATEGORIES.filter((c) => perCat.has(c)).map((c) => {
            const s = perCat.get(c)
            if (!s) return null
            const acc = s.c / s.n
            return (
              <li key={c} className="flex items-center justify-between py-1.5">
                <span>{c}</span>
                <span className={acc < 0.6 ? 'text-warn font-medium' : 'text-muted'}>
                  {s.c}/{s.n}（{pct(acc)}）
                </span>
              </li>
            )
          })}
        </ul>
      </Card>

      {wrong.length > 0 && (
        <Card className="mb-4">
          <h2 className="font-semibold mb-2">間違えた問題（{wrong.length}）</h2>
          <ul className="space-y-3">
            {wrong.map((r) => {
              const q = byId.get(r.questionId)
              if (!q) return null
              return (
                <li key={r.questionId} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <ExamBadges exams={q.exams} />
                    <CategoryBadge category={q.category} />
                    <TypeBadge type={q.type} />
                  </div>
                  <p className="leading-relaxed break-words mb-1">{questionText(q)}</p>
                  <p className="text-success font-medium break-words whitespace-pre-line">正解: {correctText(q)}</p>
                  {(q.type === 'truefalse' || q.type === 'choice') && q.explanation.trim() && (
                    <p className="text-muted leading-relaxed break-words mt-1">{q.explanation}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {wrong.length > 0 && (
          <Button variant="primary" size="lg" className="flex-1" onClick={onRetryWrong}>
            間違えた問題だけもう一度
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={onBack}>
          設定に戻る
        </Button>
        <Link href="/" className="flex-1 inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-base font-medium hover:bg-surface-2">
          ダッシュボードへ
        </Link>
      </div>
    </>
  )
}
