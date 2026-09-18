'use client'

import { useRef, useState } from 'react'
import type { StudyData } from '@/hooks/useStudyData'
import { buildExport, importBundle } from '@/lib/storage'
import { Button, Card } from '@/components/ui'

export function DataPanel({ data }: { data: StudyData }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const exportJson = () => {
    const bundle = buildExport()
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const d = new Date(bundle.exportedAt)
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    a.href = url
    a.download = `cvs-study-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = (json: string) => {
    const result = importBundle(json)
    if (result.ok) {
      data.reload()
      setMessage({
        ok: true,
        text: `取り込みました: 学習記録 ${result.imported.records} 件 / セッション ${result.imported.sessions} 件 / 自作問題 ${result.imported.custom} 件`,
      })
      setText('')
    } else {
      setMessage({ ok: false, text: result.error })
    }
  }

  const onFile = (file: File | undefined) => {
    if (!file) return
    file.text().then(doImport).catch(() => setMessage({ ok: false, text: 'ファイルを読み取れませんでした。' }))
    if (fileRef.current) fileRef.current.value = ''
  }

  const reset = () => {
    if (!window.confirm('学習記録（回答履歴・復習スケジュール・セッション履歴）をすべて削除します。自作問題は残ります。よろしいですか？')) return
    data.resetProgress()
    setMessage({ ok: true, text: '学習記録をリセットしました。' })
  }

  const recordCount = Object.keys(data.progress.records).length

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-semibold mb-1">エクスポート</h2>
        <p className="text-sm text-muted mb-3 leading-relaxed">
          学習記録（{recordCount} 件 / セッション {data.progress.sessions.length} 件）と自作問題（{data.custom.questions.length} 件）を JSON ファイルとして保存します。
        </p>
        <Button variant="primary" onClick={exportJson}>
          JSON をダウンロード
        </Button>
      </Card>

      <Card>
        <h2 className="font-semibold mb-1">インポート</h2>
        <p className="text-sm text-muted mb-3 leading-relaxed">
          エクスポートした JSON を取り込みます。学習記録は新しい方を残してマージ、自作問題は同じ ID を上書きします。
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={(e) => onFile(e.target.files?.[0])}
          className="block w-full text-sm mb-3"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="または JSON をここに貼り付け"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono mb-2"
        />
        <Button disabled={!text.trim()} onClick={() => doImport(text)}>
          貼り付けた JSON を取り込む
        </Button>
      </Card>

      <Card>
        <h2 className="font-semibold mb-1">学習記録をリセット</h2>
        <p className="text-sm text-muted mb-3 leading-relaxed">回答履歴・復習スケジュール・セッション履歴を削除します。自作問題は削除されません。</p>
        <Button variant="danger" onClick={reset}>
          学習記録をリセット
        </Button>
      </Card>

      {message && (
        <p className={`text-sm ${message.ok ? 'text-success' : 'text-danger'}`} role="status">
          {message.text}
        </p>
      )}
    </div>
  )
}
