import clsx from 'clsx'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import type { Category, QuestionType } from '@/lib/types'
import { QUESTION_TYPE_LABEL } from '@/lib/types'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-xl border border-border bg-surface shadow-sm p-4', className)}>{children}</div>
  )
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-bold break-words">{children}</h1>
      {sub && <p className="text-sm text-muted mt-1 leading-relaxed">{sub}</p>}
    </div>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'secondary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        size === 'sm' && 'px-2.5 py-1 text-xs',
        size === 'md' && 'px-3.5 py-2 text-sm',
        size === 'lg' && 'px-5 py-3 text-base',
        variant === 'primary' && 'bg-accent text-accent-fg hover:bg-accent-hover',
        variant === 'secondary' && 'bg-surface border border-border hover:bg-surface-2',
        variant === 'danger' && 'bg-danger-soft text-danger border border-danger/30 hover:opacity-90',
        variant === 'ghost' && 'text-muted hover:bg-surface-2',
        className,
      )}
    />
  )
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse" aria-busy>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-surface-2" />
      ))}
    </div>
  )
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-block rounded-md bg-accent-soft text-accent px-2 py-0.5 text-xs font-medium whitespace-nowrap">
      {category}
    </span>
  )
}

export function TypeBadge({ type }: { type: QuestionType }) {
  return (
    <span className="inline-block rounded-md bg-surface-2 text-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap">
      {QUESTION_TYPE_LABEL[type]}
    </span>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors shrink-0',
          checked ? 'bg-accent' : 'bg-border',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  )
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'px-3 py-1.5 rounded-full text-sm border transition-colors',
        active ? 'bg-accent text-accent-fg border-accent' : 'bg-surface border-border text-muted hover:bg-surface-2',
      )}
    >
      {children}
    </button>
  )
}

export function pct(n: number | null): string {
  return n === null ? '—' : `${Math.round(n * 100)}%`
}
