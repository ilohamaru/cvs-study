// 試験区分（CVS / VES / VEL）に関する純粋関数
import type { CustomQuestionStore, ExamLevel, ExamOverrides, Progress, Question } from './types'
import { EXAM_LEVELS } from './types'

/** 標準問題に、ユーザーの再タグ（overrides）をマージした一覧を返す */
export function applyOverrides(standard: readonly Question[], overrides: ExamOverrides): Question[] {
  return standard.map((q) => {
    const o = overrides[q.id]
    return o && o.length > 0 ? { ...q, exams: o } : q
  })
}

/** 指定した区分のいずれかを含む問題か */
export function inExams(q: Question, exams: readonly ExamLevel[]): boolean {
  return q.exams.some((e) => exams.includes(e))
}

/** 区分ごとの収録数 */
export function countByExam(questions: readonly Question[]): Record<ExamLevel, number> {
  const out: Record<ExamLevel, number> = { CVS: 0, VES: 0, VEL: 0 }
  for (const q of questions) for (const e of q.exams) out[e]++
  return out
}

/** 区分ごとの学習済み数（1回以上回答した問題） */
export function studiedByExam(questions: readonly Question[], progress: Progress): Record<ExamLevel, number> {
  const out: Record<ExamLevel, number> = { CVS: 0, VES: 0, VEL: 0 }
  for (const q of questions) {
    const r = progress.records[q.id]
    if (!r || r.correct + r.wrong === 0) continue
    for (const e of q.exams) out[e]++
  }
  return out
}

export type RetagOp = 'add' | 'remove' | 'replace'

export const RETAG_OP_LABEL: Record<RetagOp, string> = {
  add: '付与',
  remove: '解除',
  replace: '置換',
}

/** 1問分の区分に操作を適用する。結果が空になる場合は null（禁止） */
export function applyRetag(current: readonly ExamLevel[], op: RetagOp, levels: readonly ExamLevel[]): ExamLevel[] | null {
  let next: ExamLevel[]
  switch (op) {
    case 'add':
      next = [...new Set([...current, ...levels])]
      break
    case 'remove':
      next = current.filter((e) => !levels.includes(e))
      break
    case 'replace':
      next = [...new Set(levels)]
      break
  }
  // 表示順を固定（CVS → VES → VEL）
  next = EXAM_LEVELS.filter((e) => next.includes(e))
  return next.length > 0 ? next : null
}

export interface RetagResult {
  store: CustomQuestionStore
  changed: number
  /** 空配列になるため変更できなかった問題数 */
  rejected: number
}

/**
 * 複数の問題に一括で再タグを適用する。
 * - 自作問題: 問題自体の exams を書き換える
 * - 標準問題: overrides に保存する（元の値と同じになれば overrides から外す）
 */
export function retagQuestions(
  store: CustomQuestionStore,
  standard: readonly Question[],
  targets: readonly Question[],
  op: RetagOp,
  levels: readonly ExamLevel[],
): RetagResult {
  const standardById = new Map(standard.map((q) => [q.id, q]))
  const customIds = new Set(store.questions.map((q) => q.id))
  const overrides: ExamOverrides = { ...store.overrides }
  const customNext = new Map(store.questions.map((q) => [q.id, q]))
  let changed = 0
  let rejected = 0

  for (const q of targets) {
    const next = applyRetag(q.exams, op, levels)
    if (!next) {
      rejected++
      continue
    }
    if (sameExams(q.exams, next)) continue
    changed++
    if (customIds.has(q.id)) {
      const cur = customNext.get(q.id)
      if (cur) customNext.set(q.id, { ...cur, exams: next })
      continue
    }
    const original = standardById.get(q.id)
    if (original && sameExams(original.exams, next)) delete overrides[q.id]
    else overrides[q.id] = next
  }

  return {
    store: { ...store, questions: [...customNext.values()], overrides },
    changed,
    rejected,
  }
}

export function sameExams(a: readonly ExamLevel[], b: readonly ExamLevel[]): boolean {
  if (a.length !== b.length) return false
  const s = new Set(a)
  return b.every((e) => s.has(e))
}
