'use client'

import { useState, type ReactNode } from 'react'
import type { Question } from '@/lib/types'
import { CATEGORIES, IMPLEMENTED_TYPES, QUESTION_TYPE_LABEL } from '@/lib/types'
import { Button, Card, ExamChips } from '@/components/ui'
import { build, newId, toCategory, toDifficulty, toDraft, toType, type Draft } from './editorDraft'

interface Props {
  initial: Question | null
  existingIds: Set<string>
  onSave: (q: Question) => void
  onCancel: () => void
}

const input = 'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm'
const label = 'block text-xs text-muted mb-1'

function Field({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <label className={label}>{name}</label>
      {children}
    </div>
  )
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

      <div className="mb-3">
        <label className={label}>試験区分（必須・複数可）</label>
        <ExamChips selected={d.exams} onChange={(exams) => set('exams', exams)} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field name="形式">
          <select className={input} value={d.type} onChange={(e) => set('type', toType(e.target.value))} disabled={!!initial}>
            {IMPLEMENTED_TYPES.map((t) => (
              <option key={t} value={t}>
                {QUESTION_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field name="分野">
          <select className={input} value={d.category} onChange={(e) => set('category', toCategory(e.target.value))}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field name="難易度">
          <select className={input} value={d.difficulty} onChange={(e) => set('difficulty', toDifficulty(e.target.value))}>
            <option value={1}>1（易）</option>
            <option value={2}>2</option>
            <option value={3}>3（難）</option>
          </select>
        </Field>
        <Field name="出典">
          <input className={input} value={d.source} onChange={(e) => set('source', e.target.value)} />
        </Field>
        <div className="col-span-2">
          <Field name="タグ（カンマ区切り）">
            <input className={input} value={d.tags} onChange={(e) => set('tags', e.target.value)} />
          </Field>
        </div>
      </div>

      {d.type === 'term' && (
        <div className="space-y-3 mb-3">
          <Field name="用語">
            <input className={input} value={d.term} onChange={(e) => set('term', e.target.value)} />
          </Field>
          <Field name="定義">
            <textarea className={input} rows={4} value={d.definition} onChange={(e) => set('definition', e.target.value)} />
          </Field>
          <Field name="補足（任意）">
            <input className={input} value={d.note} onChange={(e) => set('note', e.target.value)} />
          </Field>
        </div>
      )}

      {d.type === 'truefalse' && (
        <div className="space-y-3 mb-3">
          <Field name="設問文">
            <textarea className={input} rows={3} value={d.statement} onChange={(e) => set('statement', e.target.value)} />
          </Field>
          <Field name="正解">
            <div className="flex gap-2">
              <Button variant={d.answer ? 'primary' : 'secondary'} onClick={() => set('answer', true)}>○ 正しい</Button>
              <Button variant={!d.answer ? 'primary' : 'secondary'} onClick={() => set('answer', false)}>× 誤り</Button>
            </div>
          </Field>
        </div>
      )}

      {d.type === 'choice' && (
        <div className="space-y-3 mb-3">
          <Field name="設問文">
            <textarea className={input} rows={3} value={d.stem} onChange={(e) => set('stem', e.target.value)} />
          </Field>
          <Field name="選択肢（ラジオで正解を指定）">
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
          </Field>
        </div>
      )}

      {(d.type === 'truefalse' || d.type === 'choice') && (
        <div className="mb-3">
          <Field name="解説（任意。空なら解説ブロックを表示しない）">
            <textarea className={input} rows={3} value={d.explanation} onChange={(e) => set('explanation', e.target.value)} />
          </Field>
        </div>
      )}

      {d.type === 'short' && (
        <div className="space-y-3 mb-3">
          <Field name="問題文">
            <textarea className={input} rows={3} value={d.prompt} onChange={(e) => set('prompt', e.target.value)} />
          </Field>
          <Field name="模範解答">
            <textarea className={input} rows={4} value={d.modelAnswer} onChange={(e) => set('modelAnswer', e.target.value)} />
          </Field>
          <Field name="キーワード（カンマ区切り・任意）">
            <input className={input} value={d.keywords} onChange={(e) => set('keywords', e.target.value)} />
          </Field>
        </div>
      )}

      {d.type === 'calc' && (
        <div className="space-y-3 mb-3">
          <Field name="問題文">
            <textarea className={input} rows={3} value={d.prompt} onChange={(e) => set('prompt', e.target.value)} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field name="答え（数値）">
              <input className={input} inputMode="decimal" value={d.calcAnswer} onChange={(e) => set('calcAnswer', e.target.value)} />
            </Field>
            <Field name="単位（任意）">
              <input className={input} value={d.unit} onChange={(e) => set('unit', e.target.value)} />
            </Field>
            <Field name="許容誤差（任意）">
              <input className={input} inputMode="decimal" value={d.tolerance} onChange={(e) => set('tolerance', e.target.value)} placeholder="0" />
            </Field>
          </div>
          <Field name="解法">
            <textarea className={input} rows={4} value={d.solution} onChange={(e) => set('solution', e.target.value)} />
          </Field>
          <p className="text-xs text-muted leading-relaxed">
            数値で判定しにくい問題は、答えを 0 にしてタグに「記述式」を入れると、説明問題と同じ自己採点になります。
          </p>
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
