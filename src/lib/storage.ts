// 保存層。localStorage へのアクセスはこのファイルに閉じ込める。
import type {
  Category,
  CustomQuestionStore,
  ExportBundle,
  Progress,
  Question,
  QuestionRecord,
} from './types'
import { CATEGORIES } from './types'

export const PROGRESS_KEY = 'cvs-study:v1'
export const CUSTOM_KEY = 'cvs-study:custom:v1'

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

function isRecord(v: unknown): v is QuestionRecord {
  return (
    isObj(v) &&
    isNum(v.box) && v.box >= 0 && v.box <= 5 &&
    isNum(v.dueAt) && isNum(v.correct) && isNum(v.wrong) && isNum(v.lastAnsweredAt)
  )
}

export function isProgress(v: unknown): v is Progress {
  if (!isObj(v) || v.schemaVersion !== 1 || !isObj(v.records) || !Array.isArray(v.sessions)) return false
  return Object.values(v.records).every(isRecord)
}

function baseOk(v: Record<string, unknown>): boolean {
  return isStr(v.id) && isCategory(v.category) && isStrArr(v.tags) && isStr(v.source) &&
    (v.difficulty === 1 || v.difficulty === 2 || v.difficulty === 3)
}

export function isQuestion(v: unknown): v is Question {
  if (!isObj(v) || !baseOk(v)) return false
  switch (v.type) {
    case 'term':
      return isStr(v.term) && isStr(v.definition)
    case 'truefalse':
      return isStr(v.statement) && typeof v.answer === 'boolean' && isStr(v.explanation)
    case 'choice':
      return isStr(v.stem) && isStrArr(v.options) && isNum(v.answerIndex) && isStr(v.explanation)
    case 'short':
      return isStr(v.prompt) && isStr(v.modelAnswer) && isStrArr(v.keywords)
    case 'calc':
      return isStr(v.prompt) && isNum(v.answer) && isStr(v.solution)
    default:
      return false
  }
}

export function isCustomStore(v: unknown): v is CustomQuestionStore {
  return isObj(v) && v.schemaVersion === 1 && Array.isArray(v.questions) && v.questions.every(isQuestion)
}

// ---- Progress ----

export function emptyProgress(): Progress {
  return { schemaVersion: 1, records: {}, sessions: [] }
}

export function loadProgress(): Progress {
  const v = readJson(PROGRESS_KEY)
  return isProgress(v) ? v : emptyProgress()
}

export function saveProgress(p: Progress): void {
  writeJson(PROGRESS_KEY, p)
}

export function resetProgress(): Progress {
  const p = emptyProgress()
  saveProgress(p)
  return p
}

// ---- 自作問題 ----

export function emptyCustomStore(): CustomQuestionStore {
  return { schemaVersion: 1, questions: [] }
}

export function loadCustomQuestions(): CustomQuestionStore {
  const v = readJson(CUSTOM_KEY)
  return isCustomStore(v) ? v : emptyCustomStore()
}

export function saveCustomQuestions(s: CustomQuestionStore): void {
  writeJson(CUSTOM_KEY, s)
}

// ---- エクスポート / インポート ----

export function buildExport(): ExportBundle {
  return {
    app: 'cvs-study',
    schemaVersion: 1,
    exportedAt: Date.now(),
    progress: loadProgress(),
    custom: loadCustomQuestions(),
  }
}

export type ImportResult =
  | { ok: true; progress: Progress; custom: CustomQuestionStore; imported: { records: number; sessions: number; custom: number } }
  | { ok: false; error: string }

/** JSON 文字列を検証して保存する。学習記録はマージ、自作問題は id で上書きマージ */
export function importBundle(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'JSON として読み取れませんでした。' }
  }
  if (!isObj(parsed)) return { ok: false, error: '形式が不正です。' }

  const progressIn = isProgress(parsed.progress) ? parsed.progress : null
  const customIn = isCustomStore(parsed.custom) ? parsed.custom : null
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
  if (customIn) {
    const map = new Map(custom.questions.map((q) => [q.id, q]))
    for (const q of customIn.questions) {
      map.set(q.id, q)
      customCount++
    }
    custom.questions = [...map.values()]
    saveCustomQuestions(custom)
  }

  return { ok: true, progress, custom, imported: { records: recordCount, sessions: sessionCount, custom: customCount } }
}
