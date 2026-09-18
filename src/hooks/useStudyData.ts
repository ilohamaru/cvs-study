'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { CustomQuestionStore, Progress, Question, Session } from '@/lib/types'
import { applyAnswer } from '@/lib/srs'
import { STANDARD_QUESTIONS } from '@/data/questions'
import { commitCustom, commitProgress, commitReset, getServerSnapshot, getSnapshot, reloadSnapshot, subscribe } from '@/lib/store'

export interface StudyData {
  progress: Progress
  custom: CustomQuestionStore
  /** 標準問題 + 自作問題（自作の id が重複する場合は自作を優先） */
  questions: Question[]
  /** 描画時点の「現在時刻」（描画中に Date.now() を呼ばないため） */
  now: number
  recordAnswer: (questionId: string, correct: boolean) => void
  addSession: (session: Session) => void
  updateCustom: (next: CustomQuestionStore) => void
  resetProgress: () => void
  reload: () => void
}

/**
 * localStorage 由来のデータをまとめて扱うフック。
 * サーバー描画と hydration 中は必ず null（→ 呼び出し側はスケルトンを出す）。
 * localStorage の読み込みはクライアント側スナップショット取得時にのみ行われる。
 */
export function useStudyData(): StudyData | null {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const recordAnswer = useCallback((questionId: string, correct: boolean) => {
    const cur = getSnapshot()
    if (!cur) return
    const now = Date.now()
    commitProgress({
      ...cur.progress,
      records: { ...cur.progress.records, [questionId]: applyAnswer(cur.progress.records[questionId], correct, now) },
    })
  }, [])

  const addSession = useCallback((session: Session) => {
    const cur = getSnapshot()
    if (!cur) return
    commitProgress({ ...cur.progress, sessions: [...cur.progress.sessions, session] })
  }, [])

  const updateCustom = useCallback((next: CustomQuestionStore) => commitCustom(next), [])
  const resetProgress = useCallback(() => commitReset(), [])
  const reload = useCallback(() => reloadSnapshot(), [])

  const questions = useMemo(() => {
    if (!snap) return STANDARD_QUESTIONS
    const map = new Map<string, Question>()
    for (const q of STANDARD_QUESTIONS) map.set(q.id, q)
    for (const q of snap.custom.questions) map.set(q.id, q)
    return [...map.values()]
  }, [snap])

  return useMemo<StudyData | null>(() => {
    if (!snap) return null
    return {
      progress: snap.progress,
      custom: snap.custom,
      questions,
      now: snap.now,
      recordAnswer,
      addSession,
      updateCustom,
      resetProgress,
      reload,
    }
  }, [snap, questions, recordAnswer, addSession, updateCustom, resetProgress, reload])
}
