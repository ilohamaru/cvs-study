// 学習記録からダッシュボード用の統計を計算する（純粋関数）
import type { Category, Progress, Question } from './types'
import { CATEGORIES } from './types'

export interface CategoryStat {
  category: Category
  answered: number
  correct: number
  wrong: number
  total: number
  accuracy: number | null
}

export interface DashboardStats {
  dueCount: number
  studiedCount: number
  totalCorrect: number
  totalWrong: number
  overallAccuracy: number | null
  byCategory: CategoryStat[]
  last14Days: { date: string; label: string; count: number }[]
}

function dayKey(ts: number): string {
  const d = new Date(ts)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function computeStats(progress: Progress, questions: readonly Question[], now: number): DashboardStats {
  const byId = new Map(questions.map((q) => [q.id, q]))
  let dueCount = 0
  let studiedCount = 0
  let totalCorrect = 0
  let totalWrong = 0
  const cat = new Map<Category, CategoryStat>(
    CATEGORIES.map((c) => [c, { category: c, answered: 0, correct: 0, wrong: 0, total: 0, accuracy: null }]),
  )
  for (const q of questions) {
    const s = cat.get(q.category)
    if (s) s.total++
  }
  for (const [id, r] of Object.entries(progress.records)) {
    const q = byId.get(id)
    if (!q) continue
    if (r.correct + r.wrong === 0) continue
    studiedCount++
    if (r.dueAt <= now) dueCount++
    totalCorrect += r.correct
    totalWrong += r.wrong
    const s = cat.get(q.category)
    if (s) {
      s.answered++
      s.correct += r.correct
      s.wrong += r.wrong
    }
  }
  for (const s of cat.values()) {
    const n = s.correct + s.wrong
    s.accuracy = n === 0 ? null : s.correct / n
  }

  const counts = new Map<string, number>()
  for (const s of progress.sessions) {
    const k = dayKey(s.endedAt)
    counts.set(k, (counts.get(k) ?? 0) + s.total)
  }
  const last14Days: DashboardStats['last14Days'] = []
  for (let i = 13; i >= 0; i--) {
    const ts = now - i * 24 * 60 * 60 * 1000
    const k = dayKey(ts)
    const d = new Date(ts)
    last14Days.push({ date: k, label: `${d.getMonth() + 1}/${d.getDate()}`, count: counts.get(k) ?? 0 })
  }

  const totalAnswers = totalCorrect + totalWrong
  return {
    dueCount,
    studiedCount,
    totalCorrect,
    totalWrong,
    overallAccuracy: totalAnswers === 0 ? null : totalCorrect / totalAnswers,
    byCategory: [...cat.values()],
    last14Days,
  }
}
