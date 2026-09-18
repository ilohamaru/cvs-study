'use client'

import type { Category, Progress, QuestionType, StudyConfig } from '@/lib/types'
import { CATEGORIES, IMPLEMENTED_TYPES, QUESTION_TYPE_LABEL } from '@/lib/types'
import { Button, Card, Chip, Toggle } from '@/components/ui'
import clsx from 'clsx'

interface Props {
  config: StudyConfig
  onChange: (c: StudyConfig) => void
  poolSize: number
  onStart: () => void
  progress: Progress
  now: number
}

const ALL_TYPES: QuestionType[] = ['truefalse', 'choice', 'term', 'short', 'calc']
const COUNTS: StudyConfig['count'][] = [10, 20, 30]

export function SessionSetup({ config, onChange, poolSize, onStart, progress, now }: Props) {
  const allSelected = config.categories.length === CATEGORIES.length
  const dueCount = Object.values(progress.records).filter((r) => r.dueAt <= now && r.correct + r.wrong > 0).length

  const toggleCategory = (c: Category) => {
    const has = config.categories.includes(c)
    const next = has ? config.categories.filter((x) => x !== c) : [...config.categories, c]
    onChange({ ...config, categories: next })
  }
  const toggleType = (t: QuestionType) => {
    const has = config.types.includes(t)
    const next = has ? config.types.filter((x) => x !== t) : [...config.types, t]
    onChange({ ...config, types: next })
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">分野</h2>
          <Button size="sm" variant="ghost" onClick={() => onChange({ ...config, categories: allSelected ? [] : [...CATEGORIES] })}>
            {allSelected ? '全解除' : '全選択'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c} active={config.categories.includes(c)} onClick={() => toggleCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">形式</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((t) => {
            const implemented = IMPLEMENTED_TYPES.includes(t)
            if (!implemented) {
              return (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border text-muted opacity-70"
                  title="今後追加予定"
                >
                  {QUESTION_TYPE_LABEL[t]}（準備中）
                </span>
              )
            }
            return (
              <Chip key={t} active={config.types.includes(t)} onClick={() => toggleType(t)}>
                {QUESTION_TYPE_LABEL[t]}
              </Chip>
            )
          })}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">出題数</h2>
        <div className="grid grid-cols-3 gap-2">
          {COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ ...config, count: n })}
              className={clsx(
                'py-2 rounded-lg border text-sm font-medium transition-colors',
                config.count === n ? 'bg-accent text-accent-fg border-accent' : 'bg-surface border-border hover:bg-surface-2',
              )}
            >
              {n}問
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <Toggle
          checked={config.prioritizeWeak}
          onChange={(v) => onChange({ ...config, prioritizeWeak: v })}
          label="苦手・復習優先（期限超過 → 正答率の低い順）"
        />
        <p className="text-xs text-muted mt-2">現在の復習対象: {dueCount} 問</p>
      </Card>

      <div className="text-sm text-muted">
        該当する問題: <span className="font-medium text-foreground">{poolSize}</span> 問
        {poolSize > 0 && poolSize < config.count && `（${config.count}問に満たないため ${poolSize} 問出題します）`}
      </div>

      <Button variant="primary" size="lg" className="w-full" disabled={poolSize === 0} onClick={onStart}>
        開始する
      </Button>
      <p className="text-xs text-muted leading-relaxed">
        キーボード: 正誤問題は <kbd>1</kbd>=○ <kbd>2</kbd>=×、選択問題は <kbd>1</kbd>〜<kbd>4</kbd>、<kbd>Enter</kbd>=次へ
      </p>
    </div>
  )
}
