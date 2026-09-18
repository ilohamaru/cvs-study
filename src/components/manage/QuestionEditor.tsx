'use client'

import { useState } from 'react'
import type { Category, Difficulty, Question, QuestionType } from '@/lib/types'
import { CATEGORIES, IMPLEMENTED_TYPES, QUESTION_TYPE_LABEL } from '@/lib/types'
import { Button, Card } from '@/components/ui'

interface Props {
  initial: Question | null
  existingIds: Set<string>
  onSave: (q: Question) => void
  onCancel: () => void
}

interface Draft {
  type: QuestionType
  category: Category
  difficulty: Difficulty
  tags: string
  source: string
  term: string
  definition: string
  note: string
  statement: string
  answer: boolean
  stem: string
  options: string[]
  answerIndex: number
  explanation: string
}

const input = 'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm'
const label = 'block text-xs text-muted mb-1'

function toDraft(q: Question | null): Draft {
  const d: Draft = {
    type: 'truefalse', category: 'VE基礎', difficulty: 2, tags: '', source: '自作',
    term: '', definition: '', note: '', statement: '', answer: true,
    stem: '', options: ['', '', '', ''], answerIndex: 0, explanation: '',
  }
  if (!q) return d
  d.type = q.type
  d.category = q.category
  d.difficulty = q.difficulty
  d.tags = q.tags.join(', ')
  d.source = q.source
  if (q.type === 'term') {
    d.term = q.term
    d.definition = q.definition
    d.note = q.note ?? ''
  } else if (q.type === 'truefalse') {
    d.statement = q.statement
    d.answer = q.answer
    d.explanation = q.explanation
  } else if (q.type === 'choice') {
    d.stem = q.stem
    d.options = [...q.options, '', '', '', ''].slice(0, Math.max(4, q.options.length))
    d.answerIndex = q.answerIndex
    d.explanation = q.explanation
  }
  return d
}

const toCategory = (v: string): Category => CATEGORIES.find((c) => c === v) ?? 'VE基礎'
const toType = (v: string): QuestionType => IMPLEMENTED_TYPES.find((t) => t === v) ?? 'truefalse'
const toDifficulty = (v: string): Difficulty => (v === '1' ? 1 : v === '3' ? 3 : 2)

function newId(existing: Set<string>): string {
  let n = 1
  while (existing.has(`custom-${String(n).padStart(3, '0')}`)) n++
  return `custom-${String(n).padStart(3, '0')}`
}

/** ドラフトを検証して Question にする。エラーがあれば文字列を返す */
function build(d: Draft, id: string): Question | string {
  const base = {
    id,
    category: d.category,
    difficulty: d.difficulty,
    tags: d.tags.split(/[,、\s]+/).map((t) => t.trim()).filter(Boolean),
    source: d.source.trim() || '自作',
  }
  switch (d.type) {
    case 'term':
      if (!d.term.trim() || !d.definition.trim()) return '用語と定義は必須です。'
      return { ...base, type: 'term', term: d.term.trim(), definition: d.definition.trim(), note: d.note.trim() || undefined }
    case 'truefalse':
      if (!d.statement.trim()) return '設問文は必須です。'
      if (!d.explanation.trim()) return '解説は必須です。'
      return { ...base, type: 'truefalse', statement: d.statement.trim(), answer: d.answer, explanation: d.explanation.trim() }
    case 'choice': {
      const options = d.options.map((o) => o.trim()).filter(Boolean)
      if (!d.stem.trim()) return '設問文は必須です。'
      if (options.length < 2) return '選択肢は2つ以上必要です。'
      const correct = d.options[d.answerIndex]?.trim()
      const answerIndex = correct ? options.indexOf(correct) : -1
      if (answerIndex < 0) return '正解の選択肢を選んでください。'
      if (!d.explanation.trim()) return '解説は必須です。'
      return { ...base, type: 'choice', stem: d.stem.trim(), options, answerIndex, explanation: d.explanation.trim() }
    }
    default:
      return 'この形式はまだ作成できません。'
  }
}

export function QuestionEditor({ initial, existingIds, onSave, onCancel }: Props) {
  const [d, setD] = useState<Draft>(() => toDraft(initial))
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }))

  const submit = () => {
    const id = initial?.id ?? newId(existingIds)
    const result = build(d, id)
    if (typeof result === 'string') {
      setError(result)
      return
    }
    setError(null)
    onSave(result)
  }

  return (
    <Card>
      <h2 className="font-semibold mb-3">{initial ? `自作問題を編集（${initial.id}）` : '自作問題を追加'}</h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={label}>形式</label>
          <select className={input} value={d.type} onChange={(e) => set('type', toType(e.target.value))} disabled={!!initial}>
            {IMPLEMENTED_TYPES.map((t) => (
              <option key={t} value={t}>
                {QUESTION_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>分野</label>
          <select className={input} value={d.category} onChange={(e) => set('category', toCategory(e.target.value))}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>難易度</label>
          <select className={input} value={d.difficulty} onChange={(e) => set('difficulty', toDifficulty(e.target.value))}>
            <option value={1}>1（易）</option>
            <option value={2}>2</option>
            <option value={3}>3（難）</option>
          </select>
        </div>
        <div>
          <label className={label}>出典</label>
          <input className={input} value={d.source} onChange={(e) => set('source', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={label}>タグ（カンマ区切り）</label>
          <input className={input} value={d.tags} onChange={(e) => set('tags', e.target.value)} />
        </div>
      </div>

      {d.type === 'term' && (
        <div className="space-y-3 mb-3">
          <div>
            <label className={label}>用語</label>
            <input className={input} value={d.term} onChange={(e) => set('term', e.target.value)} />
          </div>
          <div>
            <label className={label}>定義</label>
            <textarea className={input} rows={4} value={d.definition} onChange={(e) => set('definition', e.target.value)} />
          </div>
          <div>
            <label className={label}>補足（任意）</label>
            <input className={input} value={d.note} onChange={(e) => set('note', e.target.value)} />
          </div>
        </div>
      )}

      {d.type === 'truefalse' && (
        <div className="space-y-3 mb-3">
          <div>
            <label className={label}>設問文</label>
            <textarea className={input} rows={3} value={d.statement} onChange={(e) => set('statement', e.target.value)} />
          </div>
          <div>
            <label className={label}>正解</label>
            <div className="flex gap-2">
              <Button variant={d.answer ? 'primary' : 'secondary'} onClick={() => set('answer', true)}>○ 正しい</Button>
              <Button variant={!d.answer ? 'primary' : 'secondary'} onClick={() => set('answer', false)}>× 誤り</Button>
            </div>
          </div>
        </div>
      )}

      {d.type === 'choice' && (
        <div className="space-y-3 mb-3">
          <div>
            <label className={label}>設問文</label>
            <textarea className={input} rows={3} value={d.stem} onChange={(e) => set('stem', e.target.value)} />
          </div>
          <div>
            <label className={label}>選択肢（ラジオで正解を指定）</label>
            <div className="space-y-2">
              {d.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="answerIndex" checked={d.answerIndex === i} onChange={() => set('answerIndex', i)} aria-label={`選択肢${i + 1}を正解にする`} />
                  <input
                    className={input}
                    value={o}
                    placeholder={`選択肢 ${i + 1}`}
                    onChange={(e) => set('options', d.options.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(d.type === 'truefalse' || d.type === 'choice') && (
        <div className="mb-3">
          <label className={label}>解説（2〜4文）</label>
          <textarea className={input} rows={3} value={d.explanation} onChange={(e) => set('explanation', e.target.value)} />
        </div>
      )}

      {error && <p className="text-sm text-danger mb-3">{error}</p>}
      <div className="flex gap-2">
        <Button variant="primary" onClick={submit}>
          保存
        </Button>
        <Button onClick={onCancel}>キャンセル</Button>
      </div>
    </Card>
  )
}
