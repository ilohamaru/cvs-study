'use client'

import clsx from 'clsx'
import type { ChoiceQ, TFQ, TermQ, Question } from '@/lib/types'
import { isDescriptiveCalc } from '@/lib/types'
import type { PreparedOptions } from './prepare'

export type Answered = { choice: number | boolean; correct: boolean } | null

export function optionClass(state: 'idle' | 'correct' | 'wrong' | 'dim'): string {
  return clsx(
    'w-full text-left rounded-lg border px-3 py-3 text-sm leading-relaxed break-words transition-colors flex gap-2 items-start',
    state === 'idle' && 'bg-surface border-border hover:bg-surface-2 cursor-pointer',
    state === 'correct' && 'bg-success-soft border-success text-foreground',
    state === 'wrong' && 'bg-danger-soft border-danger text-foreground',
    state === 'dim' && 'bg-surface border-border opacity-60',
  )
}

export function Key({ children }: { children: string }) {
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

/**
 * 解説（形式ごとに出し分け）。
 * explanation が空文字列のときは null を返す（呼び出し側でブロックごと非表示にする）。
 * short は回答ビュー側で模範解答を表示済みなので、ここではキーワードだけを出す。
 */
export function Explanation({ q }: { q: Question }) {
  switch (q.type) {
    case 'truefalse':
    case 'choice':
      return q.explanation.trim() ? <p className="text-sm leading-relaxed break-words">{q.explanation}</p> : null
    case 'term':
      return (
        <div className="text-sm leading-relaxed break-words">
          <p className="font-medium mb-1">正解: {q.term}</p>
          {q.note && <p className="text-muted">{q.note}</p>}
        </div>
      )
    case 'short':
      return q.keywords.length > 0 ? <p className="text-sm text-muted leading-relaxed break-words">キーワード: {q.keywords.join('、')}</p> : null
    case 'calc':
      // 記述式は回答ビュー側で solution を模範解答として表示済み
      if (isDescriptiveCalc(q)) return null
      return (
        <div className="text-sm leading-relaxed break-words">
          <p className="font-medium mb-1">
            答え: {q.answer}
            {q.unit ?? ''}
          </p>
          {q.solution.trim() && <p className="whitespace-pre-line">{q.solution}</p>}
        </div>
      )
  }
}

/** 解説ブロックに表示する内容があるか（無ければブロックごと省く） */
export function hasExplanation(q: Question): boolean {
  switch (q.type) {
    case 'truefalse':
    case 'choice':
      return q.explanation.trim().length > 0
    case 'term':
      return true
    case 'short':
      return q.keywords.length > 0
    case 'calc':
      return !isDescriptiveCalc(q)
  }
}
