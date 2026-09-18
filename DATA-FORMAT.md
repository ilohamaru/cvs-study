# 問題データの追加・差し替え手順

正誤表・用語解説・説明問題・計算問題を後から流し込むための形式です。
アプリを再ビルドせずに、**画面上のインポートだけ**で追加できます。

## 手順

1. アプリを開く → 上部メニュー **「管理」** → **「データ」** タブ
2. 「エクスポート」で現在の中身を JSON として書き出す（バックアップ兼、形式の実例）
3. 下記の形式で JSON を用意する
4. 「インポート」で読み込む。既存データと**マージ**されます（同じ `id` は上書き）

> 標準搭載の問題はアプリに同梱されています。インポートした問題は「自作問題」として
> ブラウザ内に保存され、標準問題と一緒に出題されます。

## JSON の形（`schemaVersion: 2`）

エクスポートと同じ形です。問題だけ追加したい場合は `progress` を省略してください。

```json
{
  "app": "cvs-study",
  "schemaVersion": 2,
  "exportedAt": 1700000000000,
  "progress": { "schemaVersion": 2, "records": {}, "sessions": [] },
  "custom": {
    "schemaVersion": 2,
    "questions": [ ... ],
    "overrides": { "tf-012": ["CVS", "VES"] }
  }
}
```

| 項目 | 説明 |
|---|---|
| `progress` | 学習記録。省略可。取り込み時は新しい方を残してマージされます |
| `custom.questions` | 自作問題の配列（下記の形式） |
| `custom.overrides` | 標準問題の **試験区分の振り直し**（問題 `id` → 区分の配列）。省略可。「管理 → 一覧 → 一括再タグ」で行った振り直しがここに入ります |

簡易形式として、トップレベルに `questions` を置くだけでも取り込めます:

```json
{ "schemaVersion": 2, "questions": [ ... ] }
```

### 旧形式（`schemaVersion: 1`）の JSON

以前のバージョンでエクスポートした JSON（`schemaVersion: 1`、`exams` なし）もそのまま取り込めます。
`exams` が無い問題には **`["VES"]` が自動で補完**されます。学習記録はそのまま引き継がれます。

## 試験区分（`exams`）— 必須

すべての問題に `exams` が必須です。値は次の3つの配列で、**複数指定できます**（空配列は不可）。

| 値 | 意味 |
|---|---|
| `"CVS"` | CVS（Certified Value Specialist） |
| `"VES"` | VES（Value Engineering Specialist） |
| `"VEL"` | VEリーダー |

```json
"exams": ["CVS", "VES"]
```

演習画面では選択した区分に含まれる問題だけが出題されます。
同梱の VES 対策ノート由来の問題（213問）はすべて `["VES"]` で、
CVS 基本問題は `["CVS"]` です。区分を変えたい場合は再ビルド不要で、
「管理 → 一覧」の **一括再タグ** から振り直せます（結果は `overrides` として保存されます）。

## 問題1件あたりの形式

すべての問題に共通の項目:

| 項目 | 型 | 説明 |
|---|---|---|
| `id` | string | 一意のID。既存と被ると上書きされます。例 `tf-custom-001` |
| `type` | string | `term` / `truefalse` / `choice` / `short` / `calc` |
| `category` | string | 次の8つのいずれか（他の値はエラー）<br>`VE基礎` `機能定義` `機能評価` `代替案作成` `発想技法` `TRIZ` `VE適用段階` `推進・組織` |
| `exams` | string[] | 試験区分。`CVS` / `VES` / `VEL` を1つ以上（上記参照） |
| `tags` | string[] | 検索用。空配列可 |
| `source` | string | 出典。例 `対策資料 p.12` |
| `difficulty` | 1 \| 2 \| 3 | 難易度 |

### 用語解説（`term`）

```json
{
  "id": "term-c-001", "type": "term", "category": "機能評価", "exams": ["VES"],
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
  "id": "tf-c-001", "type": "truefalse", "category": "VE基礎", "exams": ["CVS", "VES"],
  "tags": ["価値の式"], "source": "対策資料 問3", "difficulty": 1,
  "statement": "機能を下げてコストを下げる行為もVEに含まれる。",
  "answer": false,
  "explanation": "VEは必要な機能を確実に達成することが前提。機能を下げるコストダウンはVEではない。"
}
```
`answer` は `true`（正しい記述）/ `false`（誤った記述）。
`explanation` を空文字列 `""` にすると、解説ブロックは表示されません（正解表示だけで完結します）。

### 選択問題（`choice`）

```json
{
  "id": "ch-c-001", "type": "choice", "category": "発想技法", "exams": ["VES"],
  "tags": ["ブレーンストーミング"], "source": "対策資料 問7", "difficulty": 2,
  "stem": "ブレーンストーミングの4原則に含まれないものはどれか。",
  "options": ["批判厳禁", "自由奔放", "量を求める", "結論を急ぐ"],
  "answerIndex": 3,
  "explanation": "4原則は 批判厳禁・自由奔放・量を求める・改善結合。"
}
```
`answerIndex` は **0 始まり**です（上の例は4番目が正解）。
選択肢は毎回シャッフルして出題されるので、正解の位置が偏っても問題ありません。
`explanation` は空文字列でも構いません（解説ブロック非表示）。

### 説明問題（`short`）

問題文を読んで自分の解答をテキストエリアに書き、「解答を見る」で模範解答と見比べて
「書けた / 書けなかった」で自己採点します。

```json
{
  "id": "sh-c-001", "type": "short", "category": "機能定義", "exams": ["CVS"],
  "tags": [], "source": "対策資料 説明1", "difficulty": 3,
  "prompt": "機能定義における「名詞＋他動詞」表現の狙いを述べよ。",
  "modelAnswer": "…",
  "keywords": ["抽象化", "発想の幅", "ものの立場"]
}
```
`keywords` は空配列でも構いません（空なら表示しません）。

### 計算問題（`calc`）

数値を入力して判定します。`tolerance`（許容誤差）の範囲内なら正解、未指定なら完全一致です。

```json
{
  "id": "ca-c-001", "type": "calc", "category": "機能評価", "exams": ["CVS"],
  "tags": ["価値"], "source": "対策資料 計算2", "difficulty": 2,
  "prompt": "機能評価値80万円、現状コスト100万円のときの価値を求めよ。",
  "answer": 0.8, "unit": "", "tolerance": 0.01,
  "solution": "V = F / C = 80 / 100 = 0.8"
}
```
`unit` と `tolerance` は任意です。

数値で判定しにくい問題（式を示せ、手順を述べよ など）は、**`answer` を `0` にして `tags` に `"記述式"` を入れる**と、
説明問題と同じ自己採点 UI になり、`solution` が模範解答として表示されます。

## Excel / スプレッドシートから作る場合

列を `id, type, category, exams, tags, source, difficulty, ...` の順に並べ、
CSV で書き出してから JSON に変換するのが簡単です。変換が必要なら依頼してください。

## 注意

- データはブラウザ内（localStorage）に保存されます。**別の端末やブラウザには引き継がれません。**
  端末を移すときは「エクスポート」した JSON を新しい端末で「インポート」してください。
- ブラウザの閲覧データを消すと学習記録も消えます。定期的にエクスポートを推奨します。
- 標準問題の区分の振り直し（`overrides`）もブラウザ内に保存されます。エクスポートに含まれます。
