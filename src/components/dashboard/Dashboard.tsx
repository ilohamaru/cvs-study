'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useStudyData } from '@/hooks/useStudyData'
import { computeStats } from '@/lib/stats'
import { countByExam, inExams, studiedByExam } from '@/lib/exams'
import { Card, Chip, PageTitle, Skeleton, pct } from '@/components/ui'
import { CategoryBars, Sparkline } from '@/components/charts'
import { EXAM_LABEL, EXAM_LEVELS, QUESTION_TYPE_LABEL, type ExamLevel, type QuestionType } from '@/lib/types'

type ExamFilter = ExamLevel | 'all'

export function Dashboard() {
  const data = useStudyData()
  const [examFilter, setExamFilter] = useState<ExamFilter>('all')

  // data が null の間は計算しない（初回描画は必ずスケルトン）
  const stats = useMemo(() => (data ? computeStats(data.progress, data.questions, data.now) : null), [data])
  const examCounts = useMemo(() => countByExam(data?.questions ?? []), [data])
  const examStudied = useMemo(
    () => (data ? studiedByExam(data.questions, data.progress) : { CVS: 0, VES: 0, VEL: 0 }),
    [data],
  )
  // 分野別正答率は区分で絞り込める
  const filteredStats = useMemo(() => {
    if (!data) return null
    if (examFilter === 'all') return stats
    return computeStats(data.progress, data.questions.filter((q) => inExams(q, [examFilter])), data.now)
  }, [data, stats, examFilter])

  if (!data || !stats || !filteredStats) {
    return (
      <>
        <PageTitle>ダッシュボード</PageTitle>
        <Skeleton lines={4} />
      </>
    )
  }

  const typeCounts = new Map<QuestionType, number>()
  for (const q of data.questions) typeCounts.set(q.type, (typeCounts.get(q.type) ?? 0) + 1)
  const weak = filteredStats.byCategory.filter((c) => c.accuracy !== null && c.accuracy < 0.6)
  const overrideCount = Object.keys(data.custom.overrides).length

  return (
    <>
      <PageTitle sub="CVS / VES / VEリーダー 受験対策">ダッシュボード</PageTitle>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {EXAM_LEVELS.map((e) => (
          <Card key={e} className="p-3">
            <div className="text-[11px] text-muted mb-1">{EXAM_LABEL[e]}</div>
            <div>
              <span className="text-xl font-bold tabular-nums">{examCounts[e]}</span>
              <span className="text-xs text-muted ml-1">問</span>
            </div>
            <div className="text-[11px] text-muted mt-0.5">学習済み {examStudied[e]}</div>
          </Card>
        ))}
      </div>

      {examCounts.CVS === 0 && (
        <div className="rounded-xl border-2 border-warn bg-warn-soft p-4 mb-4 text-sm leading-relaxed break-words" role="alert">
          <p className="font-bold text-warn mb-1">CVS の問題が未登録です</p>
          <p>
            現在の収録問題はすべて VES 対策ノートが出典です。CVS 固有の問題はまだ登録されていません。
            「管理」画面から CVS の問題を追加するか、既存問題の試験区分を振り直してください。
          </p>
          <Link href="/manage" className="inline-block mt-2 font-medium text-accent underline">
            管理画面へ
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat label="今日の復習" value={`${stats.dueCount}`} unit="問" accent={stats.dueCount > 0} />
        <Stat label="学習済み" value={`${stats.studiedCount}`} unit={`/ ${data.questions.length}問`} />
        <Stat label="通算正答率" value={pct(stats.overallAccuracy)} />
      </div>

      <Link
        href="/study"
        className="block w-full text-center rounded-xl bg-accent text-accent-fg font-bold py-3.5 text-base hover:bg-accent-hover transition-colors mb-4"
      >
        学習を始める
      </Link>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="font-semibold">分野別正答率</h2>
          <div className="flex flex-wrap gap-1">
            <Chip active={examFilter === 'all'} onClick={() => setExamFilter('all')}>
              全区分
            </Chip>
            {EXAM_LEVELS.map((e) => (
              <Chip key={e} active={examFilter === e} onClick={() => setExamFilter(e)}>
                {EXAM_LABEL[e]}
              </Chip>
            ))}
          </div>
        </div>
        <CategoryBars stats={filteredStats.byCategory} />
        {weak.length > 0 ? (
          <p className="text-xs text-warn mt-2 leading-relaxed">
            60% 未満: {weak.map((c) => c.category).join('、')} — 演習で「苦手・復習優先」をオンにして重点的に取り組みましょう。
          </p>
        ) : (
          <p className="text-xs text-muted mt-2">60% 未満の分野は警告色で表示されます。</p>
        )}
      </Card>

      <Card className="mb-4">
        <h2 className="font-semibold mb-2">直近14日の学習数</h2>
        <Sparkline days={stats.last14Days} />
        <p className="text-xs text-muted mt-1">
          合計 {stats.last14Days.reduce((a, d) => a + d.count, 0)} 問 / セッション数 {data.progress.sessions.length}
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">問題プール</h2>
        <ul className="text-sm text-muted flex flex-wrap gap-x-4 gap-y-1">
          {[...typeCounts.entries()].map(([t, n]) => (
            <li key={t}>
              {QUESTION_TYPE_LABEL[t]}: <span className="text-foreground font-medium">{n}</span>問
            </li>
          ))}
          {data.custom.questions.length > 0 && (
            <li>
              うち自作: <span className="text-foreground font-medium">{data.custom.questions.length}</span>問
            </li>
          )}
          {overrideCount > 0 && (
            <li>
              区分を振り直した問題: <span className="text-foreground font-medium">{overrideCount}</span>問
            </li>
          )}
        </ul>
      </Card>
    </>
  )
}

function Stat({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: boolean }) {
  return (
    <Card className="p-3">
      <div className="text-[11px] text-muted mb-1">{label}</div>
      <div className={accent ? 'text-accent' : ''}>
        <span className="text-2xl font-bold tabular-nums">{value}</span>
        {unit && <span className="text-xs text-muted ml-1">{unit}</span>}
      </div>
    </Card>
  )
}
