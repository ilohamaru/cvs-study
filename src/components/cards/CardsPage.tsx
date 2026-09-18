'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStudyData } from '@/hooks/useStudyData'
import type { Category, ExamLevel, TermQ } from '@/lib/types'
import { CATEGORIES, EXAM_LEVELS } from '@/lib/types'
import { isShaky, shuffle } from '@/lib/srs'
import { countByExam, inExams } from '@/lib/exams'
import { Button, Card, Chip, ExamChips, PageTitle, Skeleton, Toggle } from '@/components/ui'
import { FlipCard } from './FlipCard'

export function CardsPage() {
  const data = useStudyData()
  const [exams, setExams] = useState<ExamLevel[]>([...EXAM_LEVELS])
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [shakyOnly, setShakyOnly] = useState(false)
  const [deck, setDeck] = useState<TermQ[] | null>(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [tally, setTally] = useState({ known: 0, shaky: 0 })
  const [startedAt, setStartedAt] = useState(0)

  const allTerms = useMemo(() => (data ? data.questions.filter((q): q is TermQ => q.type === 'term') : []), [data])
  const examCounts = useMemo(() => countByExam(allTerms), [allTerms])
  const terms = useMemo(() => allTerms.filter((t) => inExams(t, exams)), [allTerms, exams])
  const shakyCount = useMemo(
    () => (data ? terms.filter((t) => isShaky(data.progress.records[t.id])).length : 0),
    [data, terms],
  )
  const filtered = useMemo(() => {
    if (!data) return []
    return terms.filter((t) => (category === 'all' || t.category === category) && (!shakyOnly || isShaky(data.progress.records[t.id])))
  }, [data, terms, category, shakyOnly])

  const startDeck = useCallback(() => {
    setDeck(shuffle(filtered))
    setIndex(0)
    setFlipped(false)
    setTally({ known: 0, shaky: 0 })
    setStartedAt(Date.now())
  }, [filtered])

  const endDeck = useCallback(
    (finalTally: { known: number; shaky: number }) => {
      if (!data || !deck) return
      const total = finalTally.known + finalTally.shaky
      if (total > 0) {
        data.addSession({
          startedAt,
          endedAt: Date.now(),
          total,
          correct: finalTally.known,
          categories: [...new Set(deck.map((d) => d.category))],
        })
      }
      setDeck(null)
    },
    [data, deck, startedAt],
  )

  const grade = useCallback(
    (known: boolean) => {
      if (!data || !deck) return
      const cur = deck[index]
      if (!cur) return
      data.recordAnswer(cur.id, known)
      const nextTally = { known: tally.known + (known ? 1 : 0), shaky: tally.shaky + (known ? 0 : 1) }
      setTally(nextTally)
      if (index >= deck.length - 1) {
        endDeck(nextTally)
      } else {
        setFlipped(false)
        setIndex(index + 1)
      }
    },
    [data, deck, index, tally, endDeck],
  )

  // キーボード: Space/Enter=反転, 1=覚えた, 2=あやふや
  useEffect(() => {
    if (!deck) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === '1') grade(true)
      else if (e.key === '2') grade(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [deck, grade])

  if (!data) {
    return (
      <>
        <PageTitle>用語カード</PageTitle>
        <Skeleton lines={3} />
      </>
    )
  }

  if (deck) {
    const cur = deck[index]
    return (
      <>
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>
            {index + 1} / {deck.length}　覚えた {tally.known}・あやふや {tally.shaky}
          </span>
          <Button size="sm" variant="ghost" onClick={() => endDeck(tally)}>
            終了
          </Button>
        </div>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden mb-4">
          <div className="h-full bg-accent transition-all" style={{ width: `${(index / deck.length) * 100}%` }} />
        </div>
        {cur && <FlipCard term={cur} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="primary" size="lg" onClick={() => grade(true)}>
            覚えた
          </Button>
          <Button variant="danger" size="lg" onClick={() => grade(false)}>
            あやふや
          </Button>
        </div>
        <p className="text-xs text-muted mt-3 text-center">タップで反転 / Space=反転 1=覚えた 2=あやふや</p>
      </>
    )
  }

  return (
    <>
      <PageTitle sub="タップで用語と定義を反転。自己採点は学習記録に反映されます">用語カード</PageTitle>
      <Card className="mb-3">
        <h2 className="font-semibold mb-2">試験区分</h2>
        <ExamChips selected={exams} onChange={setExams} counts={examCounts} />
      </Card>
      <Card className="mb-3">
        <h2 className="font-semibold mb-2">分野</h2>
        <div className="flex flex-wrap gap-2">
          <Chip active={category === 'all'} onClick={() => setCategory('all')}>
            すべて
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </Card>
      <Card className="mb-3">
        <Toggle checked={shakyOnly} onChange={setShakyOnly} label={`「あやふや」だけを周回（${shakyCount} 枚）`} />
      </Card>
      <p className="text-sm text-muted mb-3">
        対象: <span className="font-medium text-foreground">{filtered.length}</span> 枚
      </p>
      <Button variant="primary" size="lg" className="w-full" disabled={filtered.length === 0} onClick={startDeck}>
        カードを始める
      </Button>
    </>
  )
}
