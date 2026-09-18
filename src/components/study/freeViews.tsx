'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { CalcQ, ShortQ } from '@/lib/types'
import { isDescriptiveCalc } from '@/lib/types'
import { Button } from '@/components/ui'
import { Key, optionClass, type Answered } from './views'

const textarea = 'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-relaxed'

/** 「書けた / 書けなかった」の自己採点ボタン（1 / 2 キーにも対応） */
function SelfGradeButtons({ answered, onAnswer }: { answered: Answered; onAnswer: (v: boolean) => void }) {
  useEffect(() => {
    if (answered) return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === '1') onAnswer(true)
      else if (e.key === '2') onAnswer(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [answered, onAnswer])

  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" disabled={!!answered} onClick={() => onAnswer(true)} className={clsx(optionClass(answered ? (answered.correct ? 'correct' : 'dim') : 'idle'), 'justify-center')}>
        <Key>1</Key>書けた
      </button>
      <button type="button" disabled={!!answered} onClick={() => onAnswer(false)} className={clsx(optionClass(answered ? (!answered.correct ? 'wrong' : 'dim') : 'idle'), 'justify-center')}>
        <Key>2</Key>書けなかった
      </button>
    </div>
  )
}

/**
 * 自由記述 → 模範解答を見て自己採点する共通ビュー。
 * short（説明問題）と、数値判定に向かない calc（記述式）で使う。
 */
function SelfGradeView({
  prompt, modelAnswer, answered, onAnswer,
}: { prompt: string; modelAnswer: string; answered: Answered; onAnswer: (v: boolean) => void }) {
  const [text, setText] = useState('')
  const [revealed, setRevealed] = useState(false)

  return (
    <div>
      <p className="text-base leading-relaxed break-words whitespace-pre-line mb-4">{prompt}</p>
      <label className="block text-xs text-muted mb-1">自分の解答</label>
      <textarea
        className={textarea}
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={revealed}
        placeholder="ここに書いてから「解答を見る」を押す（空でも可）"
      />
      {!revealed ? (
        <Button variant="primary" size="lg" className="w-full mt-3" onClick={() => setRevealed(true)}>
          解答を見る
        </Button>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-success bg-success-soft p-3">
            <p className="text-xs font-medium text-success mb-1">模範解答</p>
            <p className="text-sm leading-relaxed break-words whitespace-pre-line">{modelAnswer}</p>
          </div>
          <SelfGradeButtons answered={answered} onAnswer={onAnswer} />
        </div>
      )}
    </div>
  )
}

export function ShortView({ q, answered, onAnswer }: { q: ShortQ; answered: Answered; onAnswer: (v: boolean) => void }) {
  return <SelfGradeView prompt={q.prompt} modelAnswer={q.modelAnswer} answered={answered} onAnswer={onAnswer} />
}

/** 計算問題: 数値入力 → 判定。記述式（answer 0 + '記述式' タグ）は自己採点にフォールバック */
export function CalcView({ q, answered, onAnswer }: { q: CalcQ; answered: Answered; onAnswer: (v: number | boolean) => void }) {
  const [text, setText] = useState('')
  if (isDescriptiveCalc(q)) {
    return <SelfGradeView prompt={q.prompt} modelAnswer={q.solution} answered={answered} onAnswer={onAnswer} />
  }
  const value = Number(text.replace(/,/g, '').trim())
  const valid = text.trim() !== '' && Number.isFinite(value)
  const submit = () => {
    if (valid && !answered) onAnswer(value)
  }
  const state = answered ? (answered.correct ? 'border-success bg-success-soft' : 'border-danger bg-danger-soft') : 'border-border bg-surface'

  return (
    <div>
      <p className="text-base leading-relaxed break-words whitespace-pre-line mb-4">{q.prompt}</p>
      <label className="block text-xs text-muted mb-1">
        答え{q.tolerance !== undefined && q.tolerance > 0 && `（許容誤差 ±${q.tolerance}）`}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          className={clsx('flex-1 min-w-0 rounded-lg border px-3 py-2 text-base tabular-nums', state)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
          disabled={!!answered}
          placeholder="数値を入力"
          aria-label="答えの数値"
        />
        {q.unit && <span className="text-sm text-muted shrink-0">{q.unit}</span>}
      </div>
      {!answered && (
        <Button variant="primary" size="lg" className="w-full mt-3" disabled={!valid} onClick={submit}>
          判定する
        </Button>
      )}
    </div>
  )
}
