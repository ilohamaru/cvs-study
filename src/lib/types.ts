// 型定義（アプリ全体で共有）

export type Category =
  | 'VE基礎'
  | '機能定義'
  | '機能評価'
  | '代替案作成'
  | '発想技法'
  | 'TRIZ'
  | 'VE適用段階'
  | '推進・組織'

export const CATEGORIES: readonly Category[] = [
  'VE基礎',
  '機能定義',
  '機能評価',
  '代替案作成',
  '発想技法',
  'TRIZ',
  'VE適用段階',
  '推進・組織',
] as const

// ---- 試験区分 ----

export type ExamLevel = 'CVS' | 'VES' | 'VEL'
export const EXAM_LEVELS: readonly ExamLevel[] = ['CVS', 'VES', 'VEL'] as const
export const EXAM_LABEL: Record<ExamLevel, string> = {
  CVS: 'CVS',
  VES: 'VES',
  VEL: 'VEリーダー',
}

export type QuestionType = 'term' | 'truefalse' | 'choice' | 'short' | 'calc'

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  term: '用語',
  truefalse: '正誤',
  choice: '選択',
  short: '説明',
  calc: '計算',
}

/** UI が実装済みの出題形式（すべて実装済み） */
export const IMPLEMENTED_TYPES: readonly QuestionType[] = ['truefalse', 'choice', 'term', 'short', 'calc'] as const

export type Difficulty = 1 | 2 | 3

interface Base {
  id: string
  type: QuestionType
  category: Category
  /** 試験区分。1問が複数区分に属してよい。空配列は禁止 */
  exams: ExamLevel[]
  tags: string[]
  source: string
  difficulty: Difficulty
}

export interface TermQ extends Base {
  type: 'term'
  term: string
  definition: string
  note?: string
}

export interface TFQ extends Base {
  type: 'truefalse'
  statement: string
  answer: boolean
  /** 空文字列なら解説ブロックを表示しない */
  explanation: string
}

export interface ChoiceQ extends Base {
  type: 'choice'
  stem: string
  options: string[]
  answerIndex: number
  /** 空文字列なら解説ブロックを表示しない */
  explanation: string
}

/** 説明問題（自由記述 → 模範解答と見比べて自己採点） */
export interface ShortQ extends Base {
  type: 'short'
  prompt: string
  modelAnswer: string
  keywords: string[]
}

/** 計算問題（数値入力 → tolerance 内なら正解。tolerance 未指定は完全一致） */
export interface CalcQ extends Base {
  type: 'calc'
  prompt: string
  answer: number
  unit?: string
  tolerance?: number
  solution: string
}

export type Question = TermQ | TFQ | ChoiceQ | ShortQ | CalcQ

/**
 * 計算問題のうち数値判定に向かないもの（answer が 0 で '記述式' タグ付き）。
 * この場合は説明問題と同じ自己採点 UI にフォールバックする。
 */
export function isDescriptiveCalc(q: CalcQ): boolean {
  return q.answer === 0 && q.tags.includes('記述式')
}

// ---- 学習記録 ----

export type Box = 0 | 1 | 2 | 3 | 4 | 5

export interface QuestionRecord {
  box: Box
  dueAt: number
  correct: number
  wrong: number
  lastAnsweredAt: number
}

export interface Session {
  startedAt: number
  endedAt: number
  total: number
  correct: number
  categories: Category[]
}

export const SCHEMA_VERSION = 2

export interface Progress {
  schemaVersion: typeof SCHEMA_VERSION
  records: Record<string, QuestionRecord>
  sessions: Session[]
}

// ---- 自作問題 / 区分の上書き ----

/** 標準問題の試験区分をユーザーが振り直した結果（questionId → 区分） */
export type ExamOverrides = Record<string, ExamLevel[]>

export interface CustomQuestionStore {
  schemaVersion: typeof SCHEMA_VERSION
  questions: Question[]
  /** 標準問題（同梱）への再タグ。出題時にマージする */
  overrides: ExamOverrides
}

/** エクスポート / インポートで扱う JSON の形 */
export interface ExportBundle {
  app: 'cvs-study'
  schemaVersion: typeof SCHEMA_VERSION
  exportedAt: number
  progress: Progress
  custom: CustomQuestionStore
}

// ---- 演習セッション ----

export interface StudyConfig {
  exams: ExamLevel[]
  categories: Category[]
  types: QuestionType[]
  count: 10 | 20 | 30
  prioritizeWeak: boolean
}

export interface AnswerResult {
  questionId: string
  correct: boolean
  answeredAt: number
}
