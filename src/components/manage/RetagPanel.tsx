'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { Category, ExamLevel, Question } from '@/lib/types'
import { CATEGORIES, EXAM_LABEL } from '@/lib/types'
import { RETAG_OP_LABEL, type RetagOp, type RetagResult } from '@/lib/exams'
import { Button, Card, ExamChips } from '@/components/ui'

interface Props {
  /** 全問題（「分野で選択」用） */
  questions: Question[]
  /** フィルタ後に表示中の問題 */
  shown: Question[]
  selected: Set<string>
  onSelectionChange: (next: Set<string>) => void
  overrideCount: number
  onRetag: (targets: Question[], op: RetagOp, levels: ExamLevel[]) => RetagResult | null
  onClearOverrides: () => void
}

const OPS: RetagOp[] = ['add', 'remove', 'replace']
const selectClass = 'rounded-lg border border-border bg-surface px-2 py-1.5 text-sm'

/** 一括再タグ: 選択した問題の試験区分を 付与 / 解除 / 置換 する */
export function RetagPanel({ questions, shown, selected, onSelectionChange, overrideCount, onRetag, onClearOverrides }: Props) {
  const [op, setOp] = useState<RetagOp>('add')
  const [levels, setLevels] = useState<ExamLevel[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const selectShown = () => onSelectionChange(new Set([...selected, ...shown.map((q) => q.id)]))
  const selectCategory = (c: Category) => {
    onSelectionChange(new Set([...selected, ...questions.filter((q) => q.category === c).map((q) => q.id)]))
  }
  const countOf = (c: Category) => questions.filter((q) => q.category === c).length

  const apply = () => {
    const targets = questions.filter((q) => selected.has(q.id))
    if (targets.length === 0 || levels.length === 0) return
    const labels = levels.map((e) => EXAM_LABEL[e]).join('・')
    const what = op === 'replace' ? `「${labels}」に置換` : op === 'add' ? `「${labels}」を付与` : `「${labels}」を解除`
    if (!window.confirm(`${targets.length}問の区分を${what}します。よろしいですか？\n（標準問題への変更はこのブラウザに保存され、出題時に反映されます）`)) return
    const result = onRetag(targets, op, levels)
    if (!result) return
    let text = `${result.changed}問の区分を変更しました。`
    if (result.rejected > 0) text += `（${result.rejected}問は区分が空になるため変更しませんでした）`
    if (result.changed === 0 && result.rejected === 0) text = '変更はありませんでした（すでに同じ区分です）。'
    setMessage(text)
  }

  const clearAll = () => {
    if (!window.confirm(`標準問題への再タグ（${overrideCount}問）をすべて取り消し、同梱時の区分に戻します。自作問題の区分は変わりません。よろしいですか？`)) return
    onClearOverrides()
    setMessage('再タグをすべて取り消しました。')
  }

  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">一括再タグ（試験区分の振り直し）</h2>
        <span className="text-sm text-muted">
          選択中: <span className="font-medium text-foreground">{selected.size}</span> 問
        </span>
      </div>
      <p className="text-xs text-muted leading-relaxed">
        同梱の問題は出典に合わせてすべて VES としています。CVS / VEリーダーの範囲に当たると判断した問題は、ここで区分を振り直してください。
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        <Button size="sm" onClick={selectShown} disabled={shown.length === 0}>
          表示中をすべて選択（{shown.length}）
        </Button>
        <select
          className={selectClass}
          value=""
          aria-label="分野で選択"
          onChange={(e) => {
            const c = CATEGORIES.find((x) => x === e.target.value)
            if (c) selectCategory(c)
          }}
        >
          <option value="">分野で選択…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}（{countOf(c)}問）
            </option>
          ))}
        </select>
        <Button size="sm" variant="ghost" onClick={() => onSelectionChange(new Set())} disabled={selected.size === 0}>
          選択解除
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {OPS.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOp(o)}
            className={clsx(
              'py-2 rounded-lg border text-sm font-medium transition-colors',
              op === o ? 'bg-accent text-accent-fg border-accent' : 'bg-surface border-border hover:bg-surface-2',
            )}
          >
            {RETAG_OP_LABEL[o]}
          </button>
        ))}
      </div>
      <ExamChips selected={levels} onChange={setLevels} />
      <p className="text-xs text-muted">
        {op === 'add' && '選択した問題に、指定した区分を追加します（元の区分は残ります）。'}
        {op === 'remove' && '選択した問題から、指定した区分を外します（区分が空になる問題は変更しません）。'}
        {op === 'replace' && '選択した問題の区分を、指定した区分だけに置き換えます。'}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" disabled={selected.size === 0 || levels.length === 0} onClick={apply}>
          {selected.size}問に適用
        </Button>
        <Button variant="danger" disabled={overrideCount === 0} onClick={clearAll}>
          再タグをすべて取り消す（{overrideCount}）
        </Button>
      </div>
      {message && (
        <p className="text-sm text-success" role="status">
          {message}
        </p>
      )}
    </Card>
  )
}
