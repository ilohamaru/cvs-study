// localStorage を「外部ストア」として React に見せるための薄い層。
// useSyncExternalStore から使う。サーバー側スナップショットは常に null なので
// SSR / hydration 時は必ずスケルトンが描画され、hydration mismatch が起きない。
import type { CustomQuestionStore, Progress } from './types'
import { loadCustomQuestions, loadProgress, resetProgress, saveCustomQuestions, saveProgress } from './storage'

export interface Snapshot {
  progress: Progress
  custom: CustomQuestionStore
  /** スナップショット作成時刻。描画中に Date.now() を呼ばないための「現在時刻」 */
  now: number
}

let snapshot: Snapshot | null = null
const listeners = new Set<() => void>()

function emit(): void {
  for (const l of listeners) l()
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** クライアント側スナップショット（初回アクセス時に localStorage から読む） */
export function getSnapshot(): Snapshot | null {
  if (typeof window === 'undefined') return null
  if (!snapshot) {
    snapshot = { progress: loadProgress(), custom: loadCustomQuestions(), now: Date.now() }
  }
  return snapshot
}

export function getServerSnapshot(): Snapshot | null {
  return null
}

/** localStorage から読み直す（インポート後など） */
export function reloadSnapshot(): void {
  snapshot = { progress: loadProgress(), custom: loadCustomQuestions(), now: Date.now() }
  emit()
}

export function commitProgress(progress: Progress): void {
  saveProgress(progress)
  const cur = getSnapshot()
  snapshot = { progress, custom: cur?.custom ?? loadCustomQuestions(), now: Date.now() }
  emit()
}

export function commitCustom(custom: CustomQuestionStore): void {
  saveCustomQuestions(custom)
  const cur = getSnapshot()
  snapshot = { progress: cur?.progress ?? loadProgress(), custom, now: Date.now() }
  emit()
}

export function commitReset(): void {
  const progress = resetProgress()
  const cur = getSnapshot()
  snapshot = { progress, custom: cur?.custom ?? loadCustomQuestions(), now: Date.now() }
  emit()
}
