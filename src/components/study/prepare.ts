// 出題前の前処理（選択肢のシャッフル、用語問題の4択化など）
import type { CalcQ, ChoiceQ, Question, TermQ } from '@/lib/types'
import { isDescriptiveCalc } from '@/lib/types'
import { shuffle } from '@/lib/srs'

/** 選択式（choice / term）の出題時の選択肢と正解位置。セッション中は固定 */
export interface PreparedOptions {
  options: string[]
  answerIndex: number
}

/** 選択問題は毎回選択肢をシャッフルする（正解位置の偏りをなくす） */
export function prepareChoice(q: ChoiceQ): PreparedOptions {
  const correct = q.options[q.answerIndex]
  const options = shuffle(q.options)
  return { options, answerIndex: options.indexOf(correct) }
}

/** 用語カードを「定義 → 用語を選ぶ」4択に変換する。同分野の用語を優先してダミーを選ぶ */
export function prepareTerm(q: TermQ, all: readonly Question[]): PreparedOptions {
  const others = all.filter((x): x is TermQ => x.type === 'term' && x.id !== q.id && x.term !== q.term)
  const same = shuffle(others.filter((x) => x.category === q.category))
  const rest = shuffle(others.filter((x) => x.category !== q.category))
  const picked: string[] = []
  for (const x of [...same, ...rest]) {
    if (picked.length >= 3) break
    if (!picked.includes(x.term)) picked.push(x.term)
  }
  const options = shuffle([q.term, ...picked])
  return { options, answerIndex: options.indexOf(q.term) }
}

export function prepareAll(questions: readonly Question[], all: readonly Question[]): Map<string, PreparedOptions> {
  const m = new Map<string, PreparedOptions>()
  for (const q of questions) {
    if (q.type === 'choice') m.set(q.id, prepareChoice(q))
    else if (q.type === 'term') m.set(q.id, prepareTerm(q, all))
  }
  return m
}

/** 自己採点（書けた / 書けなかった）で判定する形式か */
export function isSelfGraded(q: Question): boolean {
  return q.type === 'short' || (q.type === 'calc' && isDescriptiveCalc(q))
}

/** 計算問題の数値判定。tolerance の範囲内なら正解、未指定なら完全一致 */
export function isCalcCorrect(q: CalcQ, value: number): boolean {
  const tol = q.tolerance ?? 0
  return Math.abs(value - q.answer) <= tol + Number.EPSILON
}

export function isCorrectAnswer(q: Question, prepared: PreparedOptions | undefined, choice: number | boolean): boolean {
  switch (q.type) {
    case 'truefalse':
      return typeof choice === 'boolean' && choice === q.answer
    case 'choice':
    case 'term':
      return typeof choice === 'number' && !!prepared && choice === prepared.answerIndex
    case 'short':
      // 自己採点（true=書けた, false=書けなかった）
      return typeof choice === 'boolean' && choice
    case 'calc':
      if (isDescriptiveCalc(q)) return typeof choice === 'boolean' && choice
      return typeof choice === 'number' && isCalcCorrect(q, choice)
  }
}
