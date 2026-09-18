'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useStudyData } from '@/hooks/useStudyData'
import { computeStats } from '@/lib/stats'
import { Card, PageTitle, Skeleton, pct } from '@/components/ui'
import { CategoryBars, Sparkline } from '@/components/charts'
import { QUESTION_TYPE_LABEL, type QuestionType } from '@/lib/types'

export function Dashboard() {
  const data = useStudyData()
  // data が null の間は計算しない（初回描画は必ずスケルトン）
  const stats = useMemo(() => (data ? computeStats(data.progress, data.questions, data.now) : null), [data])

  if (!data || !stats) {
    return (
      <>
        <PageTitle>ダッシュボード</PageTitle>
        <Skeleton lines={4} />
      </>
    )
  }

  const typeCounts = new Map<QuestionType, number>()
  for (const q of data.questions) typeCounts.set(q.type, (typeCounts.get(q.type) ?? 0) + 1)
  const weak = stats.byCategory.filter((c) => c.accuracy !== null && c.accuracy < 0.6)

  return (
    <>
      <PageTitle sub="CVS / VES / VEリーダー 受験対策">ダッシュボード</PageTitle>

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
        <h2 className="font-semibold mb-2">分野別正答率</h2>
        <CategoryBars stats={stats.byCategory} />
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
