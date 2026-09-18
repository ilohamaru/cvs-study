'use client'

import { useCallback, useMemo, useState } from 'react'
import { useStudyData } from '@/hooks/useStudyData'
import type { AnswerResult, Question, StudyConfig } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import { orderQuestions } from '@/lib/srs'
import { PageTitle, Skeleton } from '@/components/ui'
import { SessionSetup } from './SessionSetup'
import { QuestionRunner } from './QuestionRunner'
import { ResultSummary } from './ResultSummary'

type Phase =
  | { kind: 'setup' }
  | { kind: 'running'; questions: Question[]; startedAt: number }
  | { kind: 'result'; questions: Question[]; results: AnswerResult[]; startedAt: number; endedAt: number }

const DEFAULT_CONFIG: StudyConfig = {
  categories: [...CATEGORIES],
  types: ['truefalse', 'choice', 'term'],
  count: 10,
  prioritizeWeak: true,
}

export function StudyPage() {
  const data = useStudyData()
  const [config, setConfig] = useState<StudyConfig>(DEFAULT_CONFIG)
  const [phase, setPhase] = useState<Phase>({ kind: 'setup' })

  const pool = useMemo(() => {
    if (!data) return []
    return data.questions.filter((q) => config.categories.includes(q.category) && config.types.includes(q.type))
  }, [data, config])

  const start = useCallback(() => {
    if (!data || pool.length === 0) return
    const ordered = orderQuestions(pool, data.progress, config.prioritizeWeak, Date.now())
    setPhase({ kind: 'running', questions: ordered.slice(0, config.count), startedAt: Date.now() })
  }, [data, pool, config])

  const finish = useCallback(
    (results: AnswerResult[]) => {
      if (phase.kind !== 'running' || !data) return
      const endedAt = Date.now()
      const cats = [...new Set(phase.questions.map((q) => q.category))]
      data.addSession({
        startedAt: phase.startedAt,
        endedAt,
        total: results.length,
        correct: results.filter((r) => r.correct).length,
        categories: cats,
      })
      setPhase({ kind: 'result', questions: phase.questions, results, startedAt: phase.startedAt, endedAt })
    },
    [phase, data],
  )

  if (!data) {
    return (
      <>
        <PageTitle>演習</PageTitle>
        <Skeleton lines={4} />
      </>
    )
  }

  if (phase.kind === 'setup') {
    return (
      <>
        <PageTitle sub="分野・形式・出題数を選んで開始">演習</PageTitle>
        <SessionSetup config={config} onChange={setConfig} poolSize={pool.length} onStart={start} progress={data.progress} now={data.now} />
      </>
    )
  }

  if (phase.kind === 'running') {
    return (
      <QuestionRunner
        key={phase.startedAt}
        questions={phase.questions}
        allQuestions={data.questions}
        onAnswer={data.recordAnswer}
        onFinish={finish}
        onAbort={() => setPhase({ kind: 'setup' })}
      />
    )
  }

  return (
    <ResultSummary
      questions={phase.questions}
      results={phase.results}
      onRetryWrong={() => {
        const wrongIds = new Set(phase.results.filter((r) => !r.correct).map((r) => r.questionId))
        const wrongQs = phase.questions.filter((q) => wrongIds.has(q.id))
        if (wrongQs.length === 0) return
        setPhase({ kind: 'running', questions: wrongQs, startedAt: Date.now() })
      }}
      onBack={() => setPhase({ kind: 'setup' })}
    />
  )
}
