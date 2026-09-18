// 出題前の前処理（選択肢のシャッフル、用語問題の4択化など）
import type { ChoiceQ, Question, TermQ } from '@/lib/types'
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

export function isCorrectAnswer(q: Question, prepared: PreparedOptions | undefined, choice: number | boolean): boolean {
  switch (q.type) {
    case 'truefalse':
      return typeof choice === 'boolean' && choice === q.answer
    case 'choice':
    case 'term':
      return typeof choice === 'number' && !!prepared && choice === prepared.answerIndex
    case 'short':
    case 'calc':
      // 未実装形式: 自己採点（true=正解, false=不正解）として扱う
      return typeof choice === 'boolean' && choice
  }
}
