// 保存層。localStorage へのアクセスはこのファイルに閉じ込める。
//
// マイグレーション方針（非破壊）:
// - 保存キーは v1 から変えない（キーを変えると旧データが見えなくなるため）。
// - 読み込み時に schemaVersion 1 のデータをメモリ上で 2 に正規化する。
//   学習記録（records / sessions）は一切加工せずそのまま引き継ぐ。
//   自作問題に exams が無ければ ['VES'] を補い、overrides が無ければ {} を補う。
// - 読み込みだけでは書き戻さない（次に保存が起きた時点で v2 として保存される）。
import type {
  Category,
  CustomQuestionStore,
  ExamLevel,
  ExamOverrides,
  ExportBundle,
  Progress,
  Question,
  QuestionRecord,
  Session,
} from './types'
import { CATEGORIES, EXAM_LEVELS, SCHEMA_VERSION } from './types'

export const PROGRESS_KEY = 'cvs-study:v1'
export const CUSTOM_KEY = 'cvs-study:custom:v1'

/** exams が無い旧データに補う既定の区分（既存213問はすべて VES 対策ノートが出典） */
export const DEFAULT_EXAMS: readonly ExamLevel[] = ['VES'] as const

const hasWindow = (): boolean => typeof window !== 'undefined'

function readJson(key: string): unknown {
  if (!hasWindow()) return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as unknown) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  if (!hasWindow()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 容量超過などは黙って無視（UI 側で必要なら再取得する）
  }
}

// ---- 型ガード ----

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isStr = (v: unknown): v is string => typeof v === 'string'
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr)
const isCategory = (v: unknown): v is Category => isStr(v) && (CATEGORIES as readonly string[]).includes(v)
const isExam = (v: unknown): v is ExamLevel => isStr(v) && (EXAM_LEVELS as readonly string[]).includes(v)
const isExamArr = (v: unknown): v is ExamLevel[] => Array.isArray(v) && v.every(isExam)
const isKnownVersion = (v: unknown): boolean => v === 1 || v === SCHEMA_VERSION

function isRecord(v: unknown): v is QuestionRecord {
  return (
    isObj(v) &&
    isNum(v.box) && v.box >= 0 && v.box <= 5 &&
    isNum(v.dueAt) && isNum(v.correct) && isNum(v.wrong) && isNum(v.lastAnsweredAt)
  )
}

function isSession(v: unknown): v is Session {
  return isObj(v) && isNum(v.startedAt) && isNum(v.endedAt) && isNum(v.total) && isNum(v.correct) && Array.isArray(v.categories)
}

/**
 * 保存済み / インポートされた学習記録を v2 に正規化する。
 * 学習記録は捨てない: 個々に壊れたレコードだけを除き、残りは全て引き継ぐ。
 */
export function normalizeProgress(v: unknown): Progress | null {
  if (!isObj(v) || !isKnownVersion(v.schemaVersion) || !isObj(v.records) || !Array.isArray(v.sessions)) return null
  const records: Record<string, QuestionRecord> = {}
  for (const [id, rec] of Object.entries(v.records)) {
    if (isRecord(rec)) records[id] = rec
  }
  const sessions = v.sessions.filter(isSession)
  return { schemaVersion: SCHEMA_VERSION, records, sessions }
}

function baseOk(v: Record<string, unknown>): boolean {
  return isStr(v.id) && isCategory(v.category) && isStrArr(v.tags) && isStr(v.source) &&
    (v.difficulty === 1 || v.difficulty === 2 || v.difficulty === 3)
}

/** exams を検証して返す。無い / 空なら既定値を補う。型が合わなければ null */
function examsOf(v: Record<string, unknown>): ExamLevel[] | null {
  if (v.exams === undefined || (Array.isArray(v.exams) && v.exams.length === 0)) return [...DEFAULT_EXAMS]
  return isExamArr(v.exams) ? [...new Set(v.exams)] : null
}

/** 問題1件を検証し、exams を補った Question を返す。不正なら null */
export function normalizeQuestion(v: unknown): Question | null {
  if (!isObj(v) || !baseOk(v)) return null
  const exams = examsOf(v)
  if (!exams) return null
  const base = {
    id: v.id as string,
    category: v.category as Category,
    exams,
    tags: v.tags as string[],
    source: v.source as string,
    difficulty: v.difficulty as 1 | 2 | 3,
  }
  switch (v.type) {
    case 'term':
      if (!isStr(v.term) || !isStr(v.definition)) return null
      return { ...base, type: 'term', term: v.term, definition: v.definition, ...(isStr(v.note) ? { note: v.note } : {}) }
    case 'truefalse':
      if (!isStr(v.statement) || typeof v.answer !== 'boolean' || !isStr(v.explanation)) return null
      return { ...base, type: 'truefalse', statement: v.statement, answer: v.answer, explanation: v.explanation }
    case 'choice':
      if (!isStr(v.stem) || !isStrArr(v.options) || !isNum(v.answerIndex) || !isStr(v.explanation)) return null
      return { ...base, type: 'choice', stem: v.stem, options: v.options, answerIndex: v.answerIndex, explanation: v.explanation }
    case 'short':
      if (!isStr(v.prompt) || !isStr(v.modelAnswer) || !isStrArr(v.keywords)) return null
      return { ...base, type: 'short', prompt: v.prompt, modelAnswer: v.modelAnswer, keywords: v.keywords }
    case 'calc':
      if (!isStr(v.prompt) || !isNum(v.answer) || !isStr(v.solution)) return null
      return {
        ...base, type: 'calc', prompt: v.prompt, answer: v.answer, solution: v.solution,
        ...(isStr(v.unit) ? { unit: v.unit } : {}),
        ...(isNum(v.tolerance) ? { tolerance: v.tolerance } : {}),
      }
    default:
      return null
  }
}

function normalizeOverrides(v: unknown): ExamOverrides {
  const out: ExamOverrides = {}
  if (!isObj(v)) return out
  for (const [id, exams] of Object.entries(v)) {
    if (isExamArr(exams) && exams.length > 0) out[id] = [...new Set(exams)]
  }
  return out
}

/** 自作問題ストア（v1 / v2）を v2 に正規化する。不正な問題だけを除き、残りは引き継ぐ */
export function normalizeCustomStore(v: unknown): CustomQuestionStore | null {
  if (!isObj(v) || !isKnownVersion(v.schemaVersion) || !Array.isArray(v.questions)) return null
  const questions: Question[] = []
  for (const q of v.questions) {
    const n = normalizeQuestion(q)
    if (n) questions.push(n)
  }
  return { schemaVersion: SCHEMA_VERSION, questions, overrides: normalizeOverrides(v.overrides) }
}

// ---- Progress ----

export function emptyProgress(): Progress {
  return { schemaVersion: SCHEMA_VERSION, records: {}, sessions: [] }
}

export function loadProgress(): Progress {
  return normalizeProgress(readJson(PROGRESS_KEY)) ?? emptyProgress()
}

export function saveProgress(p: Progress): void {
  writeJson(PROGRESS_KEY, { ...p, schemaVersion: SCHEMA_VERSION })
}

export function resetProgress(): Progress {
  const p = emptyProgress()
  saveProgress(p)
  return p
}

// ---- 自作問題 / 区分の上書き ----

export function emptyCustomStore(): CustomQuestionStore {
  return { schemaVersion: SCHEMA_VERSION, questions: [], overrides: {} }
}

export function loadCustomQuestions(): CustomQuestionStore {
  return normalizeCustomStore(readJson(CUSTOM_KEY)) ?? emptyCustomStore()
}

export function saveCustomQuestions(s: CustomQuestionStore): void {
  writeJson(CUSTOM_KEY, { ...s, schemaVersion: SCHEMA_VERSION })
}

// ---- エクスポート / インポート ----

export function buildExport(): ExportBundle {
  return {
    app: 'cvs-study',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    progress: loadProgress(),
    custom: loadCustomQuestions(),
  }
}

export type ImportResult =
  | {
      ok: true
      progress: Progress
      custom: CustomQuestionStore
      imported: { records: number; sessions: number; custom: number; overrides: number; skipped: number }
    }
  | { ok: false; error: string }

/** インポート JSON から自作問題ストア相当を取り出す（`custom` 直下、または簡易形式の `questions` 直下） */
function pickCustom(parsed: Record<string, unknown>): { store: CustomQuestionStore | null; skipped: number } {
  const src = isObj(parsed.custom) ? parsed.custom : parsed
  if (!Array.isArray(src.questions)) return { store: null, skipped: 0 }
  const total = src.questions.length
  const store = normalizeCustomStore({ ...src, schemaVersion: isKnownVersion(src.schemaVersion) ? src.schemaVersion : 1 })
  return { store, skipped: store ? total - store.questions.length : total }
}

/**
 * JSON 文字列を検証して保存する。
 * 学習記録はマージ（新しい方を残す）、自作問題は id で上書きマージ、区分の上書きは id ごとに置き換え。
 * 旧 schemaVersion 1 の JSON もそのまま取り込める（exams は ['VES'] を補う）。
 */
export function importBundle(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'JSON として読み取れませんでした。' }
  }
  if (!isObj(parsed)) return { ok: false, error: '形式が不正です。' }

  const progressIn = normalizeProgress(parsed.progress)
  const { store: customIn, skipped } = pickCustom(parsed)
  if (!progressIn && !customIn) {
    return { ok: false, error: '学習記録も自作問題も見つかりませんでした。' }
  }

  const progress = loadProgress()
  let recordCount = 0
  let sessionCount = 0
  if (progressIn) {
    for (const [id, rec] of Object.entries(progressIn.records)) {
      const cur = progress.records[id]
      if (!cur || cur.lastAnsweredAt < rec.lastAnsweredAt) {
        progress.records[id] = rec
        recordCount++
      }
    }
    const known = new Set(progress.sessions.map((s) => `${s.startedAt}-${s.endedAt}`))
    for (const s of progressIn.sessions) {
      const k = `${s.startedAt}-${s.endedAt}`
      if (!known.has(k)) {
        progress.sessions.push(s)
        sessionCount++
      }
    }
    progress.sessions.sort((a, b) => a.startedAt - b.startedAt)
    saveProgress(progress)
  }

  const custom = loadCustomQuestions()
  let customCount = 0
  let overrideCount = 0
  if (customIn) {
    const map = new Map(custom.questions.map((q) => [q.id, q]))
    for (const q of customIn.questions) {
      map.set(q.id, q)
      customCount++
    }
    custom.questions = [...map.values()]
    for (const [id, exams] of Object.entries(customIn.overrides)) {
      custom.overrides[id] = exams
      overrideCount++
    }
    saveCustomQuestions(custom)
  }

  return {
    ok: true,
    progress,
    custom,
    imported: { records: recordCount, sessions: sessionCount, custom: customCount, overrides: overrideCount, skipped },
  }
}
