import type { CategoryStat } from '@/lib/stats'

/** 分野別正答率の横棒グラフ（自前SVG）。60% 未満は警告色 */
export function CategoryBars({ stats }: { stats: CategoryStat[] }) {
  const rowH = 30
  const labelW = 92
  const valueW = 44
  const width = 360
  const barW = width - labelW - valueW - 8
  const height = stats.length * rowH

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      role="img"
      aria-label="分野別正答率"
      fontFamily="inherit"
    >
      {stats.map((s, i) => {
        const y = i * rowH
        const ratio = s.accuracy ?? 0
        const w = Math.max(0, Math.round(barW * ratio))
        const fill = s.accuracy === null ? 'var(--border)' : s.accuracy < 0.6 ? 'var(--warn)' : 'var(--accent)'
        return (
          <g key={s.category} transform={`translate(0, ${y})`}>
            <text x={labelW - 8} y={rowH / 2 + 4} textAnchor="end" fontSize="12" fill="var(--foreground)">
              {s.category}
            </text>
            <rect x={labelW} y={8} width={barW} height={rowH - 16} rx={4} fill="var(--surface-2)" />
            {w > 0 && <rect x={labelW} y={8} width={w} height={rowH - 16} rx={4} fill={fill} />}
            <text x={labelW + barW + 8} y={rowH / 2 + 4} fontSize="12" fill="var(--muted)">
              {s.accuracy === null ? '—' : `${Math.round(s.accuracy * 100)}%`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** 直近14日の学習数（縦棒スパークライン） */
export function Sparkline({ days }: { days: { label: string; count: number }[] }) {
  const width = 360
  const height = 80
  const padB = 16
  const gap = 4
  const n = days.length
  const barW = (width - gap * (n - 1)) / n
  const max = Math.max(1, ...days.map((d) => d.count))
  const chartH = height - padB

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="直近14日の学習数">
      {days.map((d, i) => {
        const h = d.count === 0 ? 2 : Math.max(3, Math.round((d.count / max) * (chartH - 4)))
        const x = i * (barW + gap)
        const y = chartH - h
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={h} rx={2} fill={d.count === 0 ? 'var(--border)' : 'var(--accent)'}>
              <title>{`${d.label}: ${d.count}問`}</title>
            </rect>
            {(i === 0 || i === n - 1 || i % 4 === 0) && (
              <text x={x + barW / 2} y={height - 3} textAnchor="middle" fontSize="9" fill="var(--muted)">
                {d.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
