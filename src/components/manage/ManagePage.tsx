'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { useStudyData } from '@/hooks/useStudyData'
import type { Question } from '@/lib/types'
import { STANDARD_IDS } from '@/data/questions'
import { PageTitle, Skeleton } from '@/components/ui'
import { QuestionList } from './QuestionList'
import { QuestionEditor } from './QuestionEditor'
import { DataPanel } from './DataPanel'

type Tab = 'list' | 'editor' | 'data'

export function ManagePage() {
  const data = useStudyData()
  const [tab, setTab] = useState<Tab>('list')
  const [editing, setEditing] = useState<Question | null>(null)

  if (!data) {
    return (
      <>
        <PageTitle>問題管理</PageTitle>
        <Skeleton lines={4} />
      </>
    )
  }

  const saveCustom = (q: Question) => {
    const others = data.custom.questions.filter((x) => x.id !== q.id)
    data.updateCustom({ ...data.custom, questions: [...others, q] })
    setEditing(null)
    setTab('list')
  }

  const deleteCustom = (id: string) => {
    if (!window.confirm('この自作問題を削除しますか？')) return
    data.updateCustom({ ...data.custom, questions: data.custom.questions.filter((x) => x.id !== id) })
    if (editing?.id === id) setEditing(null)
  }

  const startEdit = (q: Question) => {
    setEditing(q)
    setTab('editor')
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'list', label: `一覧（${data.questions.length}）` },
    { key: 'editor', label: editing ? '編集中' : '自作問題を追加' },
    { key: 'data', label: 'データ' },
  ]

  return (
    <>
      <PageTitle>問題管理</PageTitle>
      <div className="flex gap-1 mb-4 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={clsx(
              'px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
              tab === t.key ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'list' && (
        <QuestionList
          questions={data.questions}
          progress={data.progress}
          now={data.now}
          isCustom={(id) => !STANDARD_IDS.has(id) || data.custom.questions.some((q) => q.id === id)}
          onEdit={startEdit}
          onDelete={deleteCustom}
        />
      )}
      {tab === 'editor' && (
        <QuestionEditor
          key={editing?.id ?? 'new'}
          initial={editing}
          existingIds={new Set(data.questions.map((q) => q.id))}
          onSave={saveCustom}
          onCancel={() => {
            setEditing(null)
            setTab('list')
          }}
        />
      )}
      {tab === 'data' && <DataPanel data={data} />}
    </>
  )
}
