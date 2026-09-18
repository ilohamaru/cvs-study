// 間隔反復（ライトナー方式）のロジック
import type { Box, Progress, QuestionRecord, Question } from './types'

/** box → 次回復習までの日数。box 5 で正解し続けた場合は index 6 (30日) を使う */
export const INTERVAL_DAYS = [0, 1, 2, 4, 7, 15, 30] as const

const DAY_MS = 24 * 60 * 60 * 1000

export function emptyRecord(now: number): QuestionRecord {
  return { box: 0, dueAt: now, correct: 0, wrong: 0, lastAnsweredAt: 0 }
}

/** 回答結果を反映した新しいレコードを返す（純粋関数） */
export function applyAnswer(prev: QuestionRecord | undefined, correct: boolean, now: number): QuestionRecord {
  const base = prev ?? emptyRecord(now)
  if (correct) {
    const wasMax = base.box === 5
    const nextBox: Box = wasMax ? 5 : ((base.box + 1) as Box)
    const days = wasMax ? INTERVAL_DAYS[6] : INTERVAL_DAYS[nextBox]
    return {
      box: nextBox,
      dueAt: now + days * DAY_MS,
      correct: base.correct + 1,
      wrong: base.wrong,
      lastAnsweredAt: now,
    }
  }
  return {
    box: 0,
    dueAt: now + INTERVAL_DAYS[0] * DAY_MS,
    correct: base.correct,
    wrong: base.wrong + 1,
    lastAnsweredAt: now,
  }
}

export function isDue(record: QuestionRecord | undefined, now: number): boolean {
  return !!record && record.dueAt <= now
}

/** 正答率（未回答は null） */
export function accuracyOf(record: QuestionRecord | undefined): number | null {
  if (!record) return null
  const n = record.correct + record.wrong
  if (n === 0) return null
  return record.correct / n
}

/** 「あやふや」= 直近で不正解になり box が 0 に落ちているもの */
export function isShaky(record: QuestionRecord | undefined): boolean {
  return !!record && record.box === 0 && record.wrong > 0
}

/** シャッフル（Fisher–Yates） */
export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * 出題順を決める。
 * prioritizeWeak が true のとき: 復習期限超過 → 未回答 → それ以外 の順に並べ、
 * 各グループ内は正答率の低い順（同率はランダム）。
 */
export function orderQuestions(
  questions: readonly Question[],
  progress: Progress,
  prioritizeWeak: boolean,
  now: number,
): Question[] {
  const shuffled = shuffle(questions)
  if (!prioritizeWeak) return shuffled
  const group = (q: Question): number => {
    const r = progress.records[q.id]
    if (!r) return 1
    if (r.dueAt <= now) return 0
    return 2
  }
  const acc = (q: Question): number => accuracyOf(progress.records[q.id]) ?? 0.5
  return shuffled.sort((a, b) => {
    const g = group(a) - group(b)
    if (g !== 0) return g
    return acc(a) - acc(b)
  })
}
