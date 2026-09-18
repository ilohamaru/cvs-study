'use client'

import clsx from 'clsx'
import type { ChoiceQ, TFQ, TermQ, Question } from '@/lib/types'
import type { PreparedOptions } from './prepare'

type Answered = { choice: number | boolean; correct: boolean } | null

function optionClass(state: 'idle' | 'correct' | 'wrong' | 'dim'): string {
  return clsx(
    'w-full text-left rounded-lg border px-3 py-3 text-sm leading-relaxed break-words transition-colors flex gap-2 items-start',
    state === 'idle' && 'bg-surface border-border hover:bg-surface-2 cursor-pointer',
    state === 'correct' && 'bg-success-soft border-success text-foreground',
    state === 'wrong' && 'bg-danger-soft border-danger text-foreground',
    state === 'dim' && 'bg-surface border-border opacity-60',
  )
}

function Key({ children }: { children: string }) {
  return (
    <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-2 text-muted text-xs font-mono">
      {children}
    </span>
  )
}

export function TFView({ q, answered, onAnswer }: { q: TFQ; answered: Answered; onAnswer: (v: boolean) => void }) {
  const items: { label: string; value: boolean; key: string }[] = [
    { label: '○ 正しい', value: true, key: '1' },
    { label: '× 誤り', value: false, key: '2' },
  ]
  return (
    <div>
      <p className="text-base leading-relaxed break-words mb-4">{q.statement}</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => {
          let state: 'idle' | 'correct' | 'wrong' | 'dim' = 'idle'
          if (answered) {
            if (it.value === q.answer) state = 'correct'
            else if (it.value === answered.choice) state = 'wrong'
            else state = 'dim'
          }
          return (
            <button key={it.key} type="button" disabled={!!answered} onClick={() => onAnswer(it.value)} className={clsx(optionClass(state), 'justify-center text-base font-medium')}>
              <Key>{it.key}</Key>
              {it.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ChoiceView({
  q, prepared, answered, onAnswer,
}: { q: ChoiceQ; prepared: PreparedOptions; answered: Answered; onAnswer: (i: number) => void }) {
  return (
    <div>
      <p className="text-base leading-relaxed break-words mb-4">{q.stem}</p>
      <OptionList options={prepared.options} answerIndex={prepared.answerIndex} answered={answered} onAnswer={onAnswer} />
    </div>
  )
}

export function TermQuizView({
  q, prepared, answered, onAnswer,
}: { q: TermQ; prepared: PreparedOptions; answered: Answered; onAnswer: (i: number) => void }) {
  return (
    <div>
      <p className="text-xs text-muted mb-1">次の説明に該当する用語はどれか。</p>
      <p className="text-base leading-relaxed break-words mb-4">{q.definition}</p>
      <OptionList options={prepared.options} answerIndex={prepared.answerIndex} answered={answered} onAnswer={onAnswer} />
    </div>
  )
}

function OptionList({
  options, answerIndex, answered, onAnswer,
}: { options: string[]; answerIndex: number; answered: Answered; onAnswer: (i: number) => void }) {
  return (
    <div className="space-y-2">
      {options.map((opt, i) => {
        let state: 'idle' | 'correct' | 'wrong' | 'dim' = 'idle'
        if (answered) {
          if (i === answerIndex) state = 'correct'
          else if (i === answered.choice) state = 'wrong'
          else state = 'dim'
        }
        return (
          <button key={i} type="button" disabled={!!answered} onClick={() => onAnswer(i)} className={optionClass(state)}>
            <Key>{String(i + 1)}</Key>
            <span>{opt}</span>
          </button>
        )
      })}
    </div>
  )
}

/** 短文記述・計算問題のプレースホルダ（UI は今後実装）。自己採点で先へ進める */
export function PlaceholderView({ q, answered, onAnswer }: { q: Question; answered: Answered; onAnswer: (v: boolean) => void }) {
  const prompt = q.type === 'short' || q.type === 'calc' ? q.prompt : ''
  return (
    <div>
      <div className="rounded-lg border border-dashed border-border bg-surface-2 p-3 text-sm text-muted mb-3">
        この形式（{q.type === 'short' ? '短文記述' : '計算'}）の回答 UI は準備中です。設問を読み、頭の中で答えてから自己採点してください。
      </div>
      <p className="text-base leading-relaxed break-words mb-4">{prompt}</p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" disabled={!!answered} onClick={() => onAnswer(true)} className={clsx(optionClass(answered ? (answered.correct ? 'correct' : 'dim') : 'idle'), 'justify-center')}>
          <Key>1</Key>できた
        </button>
        <button type="button" disabled={!!answered} onClick={() => onAnswer(false)} className={clsx(optionClass(answered ? (!answered.correct ? 'wrong' : 'dim') : 'idle'), 'justify-center')}>
          <Key>2</Key>できなかった
        </button>
      </div>
    </div>
  )
}

/** 解説（形式ごとに出し分け） */
export function Explanation({ q }: { q: Question }) {
  switch (q.type) {
    case 'truefalse':
    case 'choice':
      return <p className="text-sm leading-relaxed break-words">{q.explanation}</p>
    case 'term':
      return (
        <div className="text-sm leading-relaxed break-words">
          <p className="font-medium mb-1">正解: {q.term}</p>
          {q.note && <p className="text-muted">{q.note}</p>}
        </div>
      )
    case 'short':
      return (
        <div className="text-sm leading-relaxed break-words">
          <p className="font-medium mb-1">模範解答</p>
          <p>{q.modelAnswer}</p>
          {q.keywords.length > 0 && <p className="text-muted mt-1">キーワード: {q.keywords.join('、')}</p>}
        </div>
      )
    case 'calc':
      return (
        <div className="text-sm leading-relaxed break-words">
          <p className="font-medium mb-1">
            答え: {q.answer}
            {q.unit ?? ''}
          </p>
          <p>{q.solution}</p>
        </div>
      )
  }
}
