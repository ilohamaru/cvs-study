'use client'

import type { Category, ExamLevel, Progress, QuestionType, StudyConfig } from '@/lib/types'
import { EXAM_LABEL, IMPLEMENTED_TYPES, QUESTION_TYPE_LABEL } from '@/lib/types'
import { Button, Card, Chip, ExamChips, Toggle } from '@/components/ui'
import clsx from 'clsx'

interface Props {
  config: StudyConfig
  onChange: (c: StudyConfig) => void
  poolSize: number
  onStart: () => void
  progress: Progress
  now: number
  /** 区分ごとの収録数（チップに表示） */
  examCounts: Record<ExamLevel, number>
  /** 選択中の区分に存在する分野だけ */
  availableCategories: Category[]
}

const ALL_TYPES: QuestionType[] = ['truefalse', 'choice', 'term', 'short', 'calc']
const COUNTS: StudyConfig['count'][] = [10, 20, 30]

export function SessionSetup({ config, onChange, poolSize, onStart, progress, now, examCounts, availableCategories }: Props) {
  const allSelected = availableCategories.length > 0 && availableCategories.every((c) => config.categories.includes(c))
  const dueCount = Object.values(progress.records).filter((r) => r.dueAt <= now && r.correct + r.wrong > 0).length
  const emptyExams = config.exams.filter((e) => examCounts[e] === 0)

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
        <h2 className="font-semibold mb-2">試験区分</h2>
        <ExamChips selected={config.exams} onChange={(exams) => onChange({ ...config, exams })} counts={examCounts} />
        {config.exams.length === 0 && <p className="text-xs text-danger mt-2">区分を1つ以上選んでください。</p>}
        {emptyExams.length > 0 && (
          <p className="text-xs text-muted mt-2 leading-relaxed">
            {emptyExams.map((e) => EXAM_LABEL[e]).join('・')} は該当0問です。「管理」画面で問題を追加するか、既存問題の区分を振り直してください。
          </p>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">分野</h2>
          <Button size="sm" variant="ghost" onClick={() => onChange({ ...config, categories: allSelected ? [] : [...availableCategories] })}>
            {allSelected ? '全解除' : '全選択'}
          </Button>
        </div>
        {availableCategories.length === 0 ? (
          <p className="text-xs text-muted">選択中の区分に問題がありません。</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((c) => (
              <Chip key={c} active={config.categories.includes(c)} onClick={() => toggleCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">形式</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.filter((t) => IMPLEMENTED_TYPES.includes(t)).map((t) => (
            <Chip key={t} active={config.types.includes(t)} onClick={() => toggleType(t)}>
              {QUESTION_TYPE_LABEL[t]}
            </Chip>
          ))}
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
        キーボード: 正誤問題は <kbd>1</kbd>=○ <kbd>2</kbd>=×、選択問題は <kbd>1</kbd>〜<kbd>4</kbd>、説明・計算（記述式）は解答を見た後 <kbd>1</kbd>=書けた <kbd>2</kbd>=書けなかった、<kbd>Enter</kbd>=次へ
      </p>
    </div>
  )
}
