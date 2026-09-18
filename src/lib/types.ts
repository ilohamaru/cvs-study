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

export type QuestionType = 'term' | 'truefalse' | 'choice' | 'short' | 'calc'

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  term: '用語',
  truefalse: '正誤',
  choice: '選択',
  short: '短文記述',
  calc: '計算',
}

/** 現在 UI が実装済みの出題形式。short / calc は型と分岐のみ用意 */
export const IMPLEMENTED_TYPES: readonly QuestionType[] = ['truefalse', 'choice', 'term'] as const

export type Difficulty = 1 | 2 | 3

interface Base {
  id: string
  type: QuestionType
  category: Category
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
  explanation: string
}

export interface ChoiceQ extends Base {
  type: 'choice'
  stem: string
  options: string[]
  answerIndex: number
  explanation: string
}

/** 短文記述（未実装・型だけ） */
export interface ShortQ extends Base {
  type: 'short'
  prompt: string
  modelAnswer: string
  keywords: string[]
}

/** 計算問題（未実装・型だけ） */
export interface CalcQ extends Base {
  type: 'calc'
  prompt: string
  answer: number
  unit?: string
  tolerance?: number
  solution: string
}

export type Question = TermQ | TFQ | ChoiceQ | ShortQ | CalcQ

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

export interface Progress {
  schemaVersion: 1
  records: Record<string, QuestionRecord>
  sessions: Session[]
}

// ---- 自作問題 ----

export interface CustomQuestionStore {
  schemaVersion: 1
  questions: Question[]
}

/** エクスポート / インポートで扱う JSON の形 */
export interface ExportBundle {
  app: 'cvs-study'
  schemaVersion: 1
  exportedAt: number
  progress: Progress
  custom: CustomQuestionStore
}

// ---- 演習セッション ----

export interface StudyConfig {
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
