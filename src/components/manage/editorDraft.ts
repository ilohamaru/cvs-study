// 自作問題エディタのドラフト（フォーム状態）と Question への変換
import type { Category, Difficulty, ExamLevel, Question, QuestionType } from '@/lib/types'
import { CATEGORIES, IMPLEMENTED_TYPES } from '@/lib/types'

export interface Draft {
  type: QuestionType
  category: Category
  exams: ExamLevel[]
  difficulty: Difficulty
  tags: string
  source: string
  // term
  term: string
  definition: string
  note: string
  // truefalse
  statement: string
  answer: boolean
  // choice
  stem: string
  options: string[]
  answerIndex: number
  explanation: string
  // short / calc
  prompt: string
  modelAnswer: string
  keywords: string
  calcAnswer: string
  unit: string
  tolerance: string
  solution: string
}

export function toDraft(q: Question | null): Draft {
  const d: Draft = {
    type: 'truefalse', category: 'VE基礎', exams: [], difficulty: 2, tags: '', source: '自作',
    term: '', definition: '', note: '', statement: '', answer: true,
    stem: '', options: ['', '', '', ''], answerIndex: 0, explanation: '',
    prompt: '', modelAnswer: '', keywords: '', calcAnswer: '', unit: '', tolerance: '', solution: '',
  }
  if (!q) return d
  d.type = q.type
  d.category = q.category
  d.exams = [...q.exams]
  d.difficulty = q.difficulty
  d.tags = q.tags.join(', ')
  d.source = q.source
  switch (q.type) {
    case 'term':
      d.term = q.term
      d.definition = q.definition
      d.note = q.note ?? ''
      break
    case 'truefalse':
      d.statement = q.statement
      d.answer = q.answer
      d.explanation = q.explanation
      break
    case 'choice':
      d.stem = q.stem
      d.options = [...q.options, '', '', '', ''].slice(0, Math.max(4, q.options.length))
      d.answerIndex = q.answerIndex
      d.explanation = q.explanation
      break
    case 'short':
      d.prompt = q.prompt
      d.modelAnswer = q.modelAnswer
      d.keywords = q.keywords.join(', ')
      break
    case 'calc':
      d.prompt = q.prompt
      d.calcAnswer = String(q.answer)
      d.unit = q.unit ?? ''
      d.tolerance = q.tolerance === undefined ? '' : String(q.tolerance)
      d.solution = q.solution
      break
  }
  return d
}

export const toCategory = (v: string): Category => CATEGORIES.find((c) => c === v) ?? 'VE基礎'
export const toType = (v: string): QuestionType => IMPLEMENTED_TYPES.find((t) => t === v) ?? 'truefalse'
export const toDifficulty = (v: string): Difficulty => (v === '1' ? 1 : v === '3' ? 3 : 2)

export function newId(existing: Set<string>): string {
  let n = 1
  while (existing.has(`custom-${String(n).padStart(3, '0')}`)) n++
  return `custom-${String(n).padStart(3, '0')}`
}

const splitList = (s: string): string[] => s.split(/[,、\s]+/).map((t) => t.trim()).filter(Boolean)

/** ドラフトを検証して Question にする。エラーがあれば文字列を返す */
export function build(d: Draft, id: string): Question | string {
  if (d.exams.length === 0) return '試験区分を1つ以上選んでください。'
  const base = {
    id,
    category: d.category,
    exams: d.exams,
    difficulty: d.difficulty,
    tags: splitList(d.tags),
    source: d.source.trim() || '自作',
  }
  switch (d.type) {
    case 'term':
      if (!d.term.trim() || !d.definition.trim()) return '用語と定義は必須です。'
      return { ...base, type: 'term', term: d.term.trim(), definition: d.definition.trim(), note: d.note.trim() || undefined }
    case 'truefalse':
      if (!d.statement.trim()) return '設問文は必須です。'
      return { ...base, type: 'truefalse', statement: d.statement.trim(), answer: d.answer, explanation: d.explanation.trim() }
    case 'choice': {
      const options = d.options.map((o) => o.trim()).filter(Boolean)
      if (!d.stem.trim()) return '設問文は必須です。'
      if (options.length < 2) return '選択肢は2つ以上必要です。'
      const correct = d.options[d.answerIndex]?.trim()
      const answerIndex = correct ? options.indexOf(correct) : -1
      if (answerIndex < 0) return '正解の選択肢を選んでください。'
      return { ...base, type: 'choice', stem: d.stem.trim(), options, answerIndex, explanation: d.explanation.trim() }
    }
    case 'short':
      if (!d.prompt.trim()) return '問題文は必須です。'
      if (!d.modelAnswer.trim()) return '模範解答は必須です。'
      return { ...base, type: 'short', prompt: d.prompt.trim(), modelAnswer: d.modelAnswer.trim(), keywords: splitList(d.keywords) }
    case 'calc': {
      if (!d.prompt.trim()) return '問題文は必須です。'
      const answer = Number(d.calcAnswer.trim())
      if (d.calcAnswer.trim() === '' || !Number.isFinite(answer)) return '答え（数値）は必須です。'
      const tol = d.tolerance.trim() === '' ? undefined : Number(d.tolerance.trim())
      if (tol !== undefined && (!Number.isFinite(tol) || tol < 0)) return '許容誤差は 0 以上の数値で指定してください。'
      if (!d.solution.trim()) return '解法は必須です。'
      return {
        ...base, type: 'calc', prompt: d.prompt.trim(), answer, solution: d.solution.trim(),
        ...(d.unit.trim() ? { unit: d.unit.trim() } : {}),
        ...(tol !== undefined ? { tolerance: tol } : {}),
      }
    }
  }
}
