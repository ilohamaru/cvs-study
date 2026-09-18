'use client'

import clsx from 'clsx'
import type { TermQ } from '@/lib/types'
import { CategoryBadge } from '@/components/ui'

export function FlipCard({ term, flipped, onFlip }: { term: TermQ; flipped: boolean; onFlip: () => void }) {
  return (
    <div className="flip-scene">
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        className={clsx('flip-card w-full min-h-[280px] text-left focus:outline-none', flipped && 'is-flipped')}
      >
        {/* 表: 用語 */}
        <div className="flip-face front rounded-xl border border-border bg-surface shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <CategoryBadge category={term.category} />
            <span className="text-xs text-muted">用語</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl font-bold text-center break-words leading-relaxed">{term.term}</p>
          </div>
          <p className="text-xs text-muted text-center">タップして定義を見る</p>
        </div>
        {/* 裏: 定義 */}
        <div className="flip-face back rounded-xl border border-accent bg-surface shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <CategoryBadge category={term.category} />
            <span className="text-xs text-muted">定義</span>
          </div>
          <p className="font-semibold mb-2 break-words">{term.term}</p>
          <p className="text-sm leading-relaxed break-words flex-1">{term.definition}</p>
          {term.note && <p className="text-xs text-muted leading-relaxed mt-2 break-words">補足: {term.note}</p>}
          <p className="text-[11px] text-muted mt-2">出典: {term.source}</p>
        </div>
      </button>
    </div>
  )
}
