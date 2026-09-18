'use client'

import { useMemo, useState } from 'react'
import type { Category, ExamLevel, ExamOverrides, Progress, Question, QuestionType } from '@/lib/types'
import { CATEGORIES, EXAM_LABEL, EXAM_LEVELS, QUESTION_TYPE_LABEL } from '@/lib/types'
import { accuracyOf } from '@/lib/srs'
import type { RetagOp, RetagResult } from '@/lib/exams'
import { Button, CategoryBadge, ExamBadges, TypeBadge, pct } from '@/components/ui'
import { RetagPanel } from './RetagPanel'

interface Props {
  questions: Question[]
  progress: Progress
  now: number
  overrides: ExamOverrides
  isCustom: (id: string) => boolean
  onEdit: (q: Question) => void
  onDelete: (id: string) => void
  onRetag: (targets: Question[], op: RetagOp, levels: ExamLevel[]) => RetagResult | null
  onClearOverrides: () => void
}

type AccFilter = 'all' | 'unanswered' | 'low' | 'high' | 'due'
const TYPES: QuestionType[] = ['term', 'truefalse', 'choice', 'short', 'calc']

export function questionSummary(q: Question): string {
  switch (q.type) {
    case 'term':
      return `${q.term}：${q.definition}`
    case 'truefalse':
      return q.statement
    case 'choice':
      return q.stem
    case 'short':
    case 'calc':
      return q.prompt
  }
}

const selectClass = 'rounded-lg border border-border bg-surface px-2 py-2 text-sm w-full'

// <select> の value(string) を型付きの値に戻す（不正値は 'all'）
const toExam = (v: string): ExamLevel | 'all' => EXAM_LEVELS.find((e) => e === v) ?? 'all'
const toCategory = (v: string): Category | 'all' => CATEGORIES.find((c) => c === v) ?? 'all'
const toType = (v: string): QuestionType | 'all' => TYPES.find((t) => t === v) ?? 'all'
const ACC_FILTERS: AccFilter[] = ['all', 'unanswered', 'low', 'high', 'due']
const toAcc = (v: string): AccFilter => ACC_FILTERS.find((a) => a === v) ?? 'all'

export function QuestionList({ questions, progress, now, overrides, isCustom, onEdit, onDelete, onRetag, onClearOverrides }: Props) {
  const [exam, setExam] = useState<ExamLevel | 'all'>('all')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [type, setType] = useState<QuestionType | 'all'>('all')
  const [acc, setAcc] = useState<AccFilter>('all')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(50)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase()
    return questions.filter((q) => {
      if (exam !== 'all' && !q.exams.includes(exam)) return false
      if (category !== 'all' && q.category !== category) return false
      if (type !== 'all' && q.type !== type) return false
      const r = progress.records[q.id]
      const a = accuracyOf(r)
      if (acc === 'unanswered' && a !== null) return false
      if (acc === 'low' && (a === null || a >= 0.6)) return false
      if (acc === 'high' && (a === null || a < 0.6)) return false
      if (acc === 'due' && !(r && r.dueAt <= now && r.correct + r.wrong > 0)) return false
      if (kw) {
        const hay = `${q.id} ${questionSummary(q)} ${q.tags.join(' ')} ${q.source}`.toLowerCase()
        if (!hay.includes(kw)) return false
      }
      return true
    })
  }, [questions, progress, now, exam, category, type, acc, search])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-3">
      <RetagPanel
        questions={questions}
        shown={filtered}
        selected={selected}
        onSelectionChange={setSelected}
        overrideCount={Object.keys(overrides).length}
        onRetag={onRetag}
        onClearOverrides={onClearOverrides}
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="検索（本文・タグ・出典・ID）"
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <select value={exam} onChange={(e) => setExam(toExam(e.target.value))} className={selectClass} aria-label="試験区分">
          <option value="all">全区分</option>
          {EXAM_LEVELS.map((e) => (
            <option key={e} value={e}>
              {EXAM_LABEL[e]}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(toCategory(e.target.value))} className={selectClass} aria-label="分野">
          <option value="all">全分野</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(toType(e.target.value))} className={selectClass} aria-label="形式">
          <option value="all">全形式</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {QUESTION_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <select value={acc} onChange={(e) => setAcc(toAcc(e.target.value))} className={selectClass} aria-label="正答率">
          <option value="all">全正答率</option>
          <option value="unanswered">未回答</option>
          <option value="low">60% 未満</option>
          <option value="high">60% 以上</option>
          <option value="due">復習対象</option>
        </select>
      </div>
      <p className="text-xs text-muted">{filtered.length} 件</p>

      <ul className="space-y-2">
        {filtered.slice(0, limit).map((q) => {
          const r = progress.records[q.id]
          const a = accuracyOf(r)
          const custom = isCustom(q.id)
          const checked = selected.has(q.id)
          return (
            <li key={q.id} className={`rounded-xl border bg-surface p-3 text-sm ${checked ? 'border-accent' : 'border-border'}`}>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(q.id)}
                  aria-label={`${q.id} を選択`}
                  className="mt-1 shrink-0 w-4 h-4 accent-[var(--accent)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <ExamBadges exams={q.exams} />
                    <CategoryBadge category={q.category} />
                    <TypeBadge type={q.type} />
                    {custom && <span className="rounded-md bg-warn-soft text-warn px-2 py-0.5 text-xs">自作</span>}
                    {!custom && overrides[q.id] && <span className="rounded-md bg-accent-soft text-accent px-2 py-0.5 text-xs">再タグ済</span>}
                    <span className="text-xs text-muted ml-auto tabular-nums">
                      {a === null || !r ? '未回答' : `${pct(a)}（${r.correct}/${r.correct + r.wrong}） 箱${r.box}`}
                    </span>
                  </div>
                  <p className="leading-relaxed break-words line-clamp-3">{questionSummary(q)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-muted truncate">{q.id} · {q.source}</span>
                    {custom && (
                      <span className="ml-auto flex gap-1 shrink-0">
                        <Button size="sm" onClick={() => onEdit(q)}>
                          編集
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => onDelete(q.id)}>
                          削除
                        </Button>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {filtered.length > limit && (
        <Button className="w-full" onClick={() => setLimit((n) => n + 50)}>
          さらに表示（残り {filtered.length - limit}）
        </Button>
      )}
    </div>
  )
}
