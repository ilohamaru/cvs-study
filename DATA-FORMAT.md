# 問題データの追加・差し替え手順

正誤表・用語解説を後から流し込むための形式です。
アプリを再ビルドせずに、**画面上のインポートだけ**で追加できます。

## 手順

1. アプリを開く → 上部メニュー **「管理」** → **「データ」** タブ
2. 「エクスポート」で現在の中身を JSON として書き出す（バックアップ兼、形式の実例）
3. 下記の形式で JSON を用意する
4. 「インポート」で読み込む。既存データと**マージ**されます（同じ `id` は上書き）

> 標準搭載の213問はアプリに同梱されています。インポートした問題は「自作問題」として
> ブラウザ内に保存され、標準問題と一緒に出題されます。

## JSON の形

```json
{
  "schemaVersion": 1,
  "questions": [ ... ],
  "progress": { "schemaVersion": 1, "records": {}, "sessions": [] }
}
```

`progress` は学習記録です。問題だけ追加したい場合は `progress` を省略してください。

## 問題1件あたりの形式

すべての問題に共通の項目:

| 項目 | 型 | 説明 |
|---|---|---|
| `id` | string | 一意のID。既存と被ると上書きされます。例 `tf-custom-001` |
| `type` | string | `term` / `truefalse` / `choice` / `short` / `calc` |
| `category` | string | 次の8つのいずれか（他の値はエラー）<br>`VE基礎` `機能定義` `機能評価` `代替案作成` `発想技法` `TRIZ` `VE適用段階` `推進・組織` |
| `tags` | string[] | 検索用。空配列可 |
| `source` | string | 出典。例 `対策資料 p.12` |
| `difficulty` | 1 \| 2 \| 3 | 難易度 |

### 用語解説（`term`）

```json
{
  "id": "term-c-001", "type": "term", "category": "機能評価",
  "tags": ["機能評価値"], "source": "教科書 第4章", "difficulty": 2,
  "term": "機能評価値",
  "definition": "その機能を果たすために必要な最低限のコスト。F/C の F にあたる。",
  "note": "実績価値標準・アイデア想定・機能の重要度比較の3方法で求める。"
}
```
`note` は任意です。

### 正誤問題（`truefalse`）＝ 正誤表はこれに当たります

```json
{
  "id": "tf-c-001", "type": "truefalse", "category": "VE基礎",
  "tags": ["価値の式"], "source": "対策資料 問3", "difficulty": 1,
  "statement": "機能を下げてコストを下げる行為もVEに含まれる。",
  "answer": false,
  "explanation": "VEは必要な機能を確実に達成することが前提。機能を下げるコストダウンはVEではない。"
}
```
`answer` は `true`（正しい記述）/ `false`（誤った記述）。

### 選択問題（`choice`）

```json
{
  "id": "ch-c-001", "type": "choice", "category": "発想技法",
  "tags": ["ブレーンストーミング"], "source": "対策資料 問7", "difficulty": 2,
  "stem": "ブレーンストーミングの4原則に含まれないものはどれか。",
  "options": ["批判厳禁", "自由奔放", "量を求める", "結論を急ぐ"],
  "answerIndex": 3,
  "explanation": "4原則は 批判厳禁・自由奔放・量を求める・改善結合。"
}
```
`answerIndex` は **0 始まり**です（上の例は4番目が正解）。
選択肢は毎回シャッフルして出題されるので、正解の位置が偏っても問題ありません。

### 短文記述（`short`）・計算（`calc`）— 型のみ用意済み

現時点では出題 UI が未実装です（「準備中」表示）。データを入れておくことはできます。

```json
{
  "id": "sh-c-001", "type": "short", "category": "機能定義",
  "tags": [], "source": "対策資料 短文1", "difficulty": 3,
  "prompt": "機能定義における「名詞＋他動詞」表現の狙いを述べよ。",
  "modelAnswer": "…",
  "keywords": ["抽象化", "発想の幅", "ものの立場"]
}
```

```json
{
  "id": "ca-c-001", "type": "calc", "category": "機能評価",
  "tags": ["価値"], "source": "対策資料 計算2", "difficulty": 2,
  "prompt": "機能評価値80万円、現状コスト100万円のときの価値を求めよ。",
  "answer": 0.8, "unit": "", "tolerance": 0.01,
  "solution": "V = F / C = 80 / 100 = 0.8"
}
```

出題 UI を有効にするときは `src/lib/types.ts` の `IMPLEMENTED_TYPES` に
`'short'` / `'calc'` を追加し、`QuestionBody` の該当 case を実装します。

## Excel / スプレッドシートから作る場合

列を `id, type, category, tags, source, difficulty, ...` の順に並べ、
CSV で書き出してから JSON に変換するのが簡単です。変換が必要なら依頼してください。

## 注意

- データはブラウザ内（localStorage）に保存されます。**別の端末やブラウザには引き継がれません。**
  端末を移すときは「エクスポート」した JSON を新しい端末で「インポート」してください。
- ブラウザの閲覧データを消すと学習記録も消えます。定期的にエクスポートを推奨します。
