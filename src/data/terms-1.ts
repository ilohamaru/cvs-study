import type { TermQ } from '@/lib/types'

// 用語カード（前半）: VE基礎 / 機能定義 / 機能評価 / 代替案作成
export const TERMS_1: TermQ[] = [
  {
    id: 'term-001', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['定義'], source: 've-exam-notes 論述2',
    term: 'VEの定義',
    definition: '「VEとは最低のライフサイクルコストで、必要な機能を確実に達成するために、製品やサービスの機能的研究に注ぐ、組織的努力である」。前半部分はVEの目的を、後半部分は目的達成方法を定義している。',
    note: '前半＝目的、後半＝達成方法。一字一句そのまま書けるようにする。',
  },
  {
    id: 'term-002', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['価値'], source: 've-exam-notes 論述7',
    term: '価値（V）',
    definition: '満足の度合。V（価値）＝F（機能）／C（コスト）で表される。コスト（C）と機能（F）の両方の表現から価値を定義しており、機能を下げるコストダウンはVEではない。',
  },
  {
    id: 'term-003', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['定義', 'LCC'], source: 've-exam-notes 論述2',
    term: '最低のライフサイクルコスト',
    definition: '製品やサービスには開発、調達、製造、販売、使用、保守、廃棄などの人の一生に似たライフサイクルがあり、VEではライフサイクル全体にかかるコストを対象にし、全コストが最低になる様に考える。',
  },
  {
    id: 'term-004', type: 'term', category: 'VE基礎', difficulty: 2, exams: ['VES'], tags: ['定義'], source: 've-exam-notes 論述2',
    term: '必要な機能を確実に達成する',
    definition: '顧客がモノを買うのはモノが果たす機能が欲しいからであり、要求する機能や達成度を正しく把握する必要がある、という意味。VEの定義の前半（目的）を構成する。',
  },
  {
    id: 'term-005', type: 'term', category: 'VE基礎', difficulty: 2, exams: ['VES'], tags: ['定義'], source: 've-exam-notes 論述2',
    term: '機能的研究',
    definition: '機能を思考の原点にして問題解決をしていくための効果的な手順・方法の体系。定義中の「注ぐ」とは着実に実施することを表す。',
  },
  {
    id: 'term-006', type: 'term', category: 'VE基礎', difficulty: 2, exams: ['VES'], tags: ['定義'], source: 've-exam-notes 論述2',
    term: '組織的努力',
    definition: '各分野の専門家を集めて知識と経験を結集して行う事を表し、相乗効果、組織の壁の打破、活動の柔軟性などの効果が期待できる。',
  },
  {
    id: 'term-007', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['基本原則'], source: 'SKILL.md 骨子 / ve-exam-notes 論述1',
    term: 'VE基本原則（5つ）',
    definition: 'VEを正しく活用するための行動指針。①使用者優先の原則 ②機能本位の原則 ③創造による変更の原則 ④チームデザインの原則 ⑤価値向上の原則。',
  },
  {
    id: 'term-008', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['基本原則'], source: 've-exam-notes 論述1',
    term: '使用者優先の原則',
    definition: '使用者の立場に立って考えるという原則。機能系統図では、顧客にとっての上位機能を繰り返し考えるプロセスを通じて、使用者優先・顧客志向がメンバーに定着する。',
  },
  {
    id: 'term-009', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['基本原則'], source: 've-exam-notes 論述1',
    term: '機能本位の原則',
    definition: '顧客が求めている機能を思考の原点とするという原則。「目的－手段」の関係を何度も問うことで、機能本位へ思考転換する。',
  },
  {
    id: 'term-010', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['基本原則'], source: 've-exam-notes 論述1',
    term: '創造による変更の原則',
    definition: '創造思考を活用し、機能を果たす手段を生み出すという原則。機能系統図では、より上位機能へ視点を移動させ、発散思考へ誘導し、創造力を活発にする。',
  },
  {
    id: 'term-011', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['基本原則'], source: 've-exam-notes 論述1',
    term: 'チームデザインの原則',
    definition: '各分野の専門家の知識と経験を結集するという原則。「目的－手段」をチームで繰り返し議論することで、目的意識を統一できる。',
  },
  {
    id: 'term-012', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['基本原則'], source: 've-exam-notes 論述1',
    term: '価値向上の原則',
    definition: '常に機能とコストの両面で検討し、価値向上を目指すという原則。「何のために」を繰り返し議論することで、「機能だけ」「コストだけ」の固定観念を排除する。',
  },
  {
    id: 'term-013', type: 'term', category: 'VE基礎', difficulty: 2, exams: ['VES'], tags: ['価値'], source: 've-exam-notes 論述7',
    term: '価値向上の4形態',
    definition: '①同じ機能を安いコストで（F→ C↓）②同じコストでより優れた機能を（F↑ C→）③より優れた機能をより安いコストで（F↑ C↓）④コストは上げるがより優れた機能を（F↑↑ C↑）。機能を下げる形態は含まれない。',
  },
  {
    id: 'term-014', type: 'term', category: 'VE基礎', difficulty: 1, exams: ['VES'], tags: ['実施手順'], source: 'SKILL.md 骨子 / ve-exam-notes 論述8',
    term: 'VE実施手順（基本ステップ）',
    definition: '機能定義（①情報収集 ②機能の定義 ③機能の整理）→機能評価（④機能別コスト分析 ⑤機能の評価 ⑥対象分野の選定）→代替案作成（⑦アイデア発想 ⑧概略評価 ⑨具体化 ⑩詳細評価）の3基本ステップ・10詳細ステップ。',
  },
  {
    id: 'term-015', type: 'term', category: 'VE基礎', difficulty: 2, exams: ['VES'], tags: ['実施手順'], source: 've-exam-notes 短文1',
    term: 'VE実施手順を省略すべきでない理由',
    definition: '実施手順は一貫して「価値」という観点から問題を解決する体系であり、数多くの実践経験から帰納的に出来上がったもの。各ステップのアウトプットは次のステップへの重要なインプットとして論理的につながるため、省くと体系的なロジックが崩れる。',
  },
  {
    id: 'term-016', type: 'term', category: '機能定義', difficulty: 1, exams: ['VES'], tags: ['実施手順'], source: 've-exam-notes 論述9',
    term: '機能定義',
    definition: 'VE実施手順の基本ステップの1番目。情報収集に基づき目標を決め、対象の持つ機能を明確にする。詳細ステップは①情報収集 ②機能の定義 ③機能の整理。',
  },
  {
    id: 'term-017', type: 'term', category: '機能定義', difficulty: 1, exams: ['VES'], tags: ['機能の定義'], source: 've-exam-notes 付録 選択1-2',
    term: '機能の定義（表現方法）',
    definition: '対象が果たす働きを「名詞と動詞」の二語で簡潔に表現する。モノ本位ではなく機能本位で考えるための出発点となる。',
  },
  {
    id: 'term-018', type: 'term', category: '機能定義', difficulty: 2, exams: ['VES'], tags: ['情報収集'], source: 've-exam-notes 付録 選択1-2',
    term: '固有情報',
    definition: '情報収集で集める、VE対象そのものに固有の情報（図面、仕様、コスト、使用条件など）。一般情報と対比される。',
  },
  {
    id: 'term-019', type: 'term', category: '機能定義', difficulty: 1, exams: ['VES'], tags: ['機能系統図'], source: 've-exam-notes 論述1',
    term: '機能系統図',
    definition: 'VE実施手順「機能定義」の詳細ステップ「機能の整理」で、対象テーマの果たすべき目標を明確にするために、機能を「目的－手段」の形で整理したもの。',
  },
  {
    id: 'term-020', type: 'term', category: '機能定義', difficulty: 2, exams: ['VES'], tags: ['機能系統図'], source: 've-exam-notes 論述1',
    term: '機能系統図の意義（5つ）',
    definition: '①必要機能・不要機能が明確になる ②モノ本位から機能本位の思考へ発想の転換が図れる ③メンバー間のコミュニケーションが改善される ④欠落していた機能が発見できる ⑤機能表現が修正できる。',
  },
  {
    id: 'term-021', type: 'term', category: '機能定義', difficulty: 2, exams: ['VES'], tags: ['機能系統図'], source: 've-exam-notes 付録 選択1-2',
    term: '上位レベルの機能',
    definition: '機能系統図で「何のために」と問うて得られる目的側の機能。より上位レベルの機能に視点を移すことで発散思考へ誘導され、固定観念（機能は構造に優先）を打破しやすくなる。',
  },
  {
    id: 'term-022', type: 'term', category: '機能評価', difficulty: 1, exams: ['VES'], tags: ['実施手順'], source: 've-exam-notes 短文2 / 論述6',
    term: '機能評価',
    definition: 'VE実施手順の基本ステップの2番目。次の代替案作成に向け、アイデア発想の対象及び裏付けのある目標コストを定めることが目的。詳細ステップは④機能別コスト分析 ⑤機能の評価 ⑥対象分野の選定。',
  },
  {
    id: 'term-023', type: 'term', category: '機能評価', difficulty: 2, exams: ['VES'], tags: ['実施手順'], source: 've-exam-notes 論述6',
    term: '機能別コスト分析',
    definition: '機能評価の詳細ステップの1つ。各機能達成に現在かけているコスト（現行コスト）を明確にする。',
  },
  {
    id: 'term-024', type: 'term', category: '機能評価', difficulty: 2, exams: ['VES'], tags: ['実施手順'], source: 've-exam-notes 論述6',
    term: '機能の評価',
    definition: '機能評価の詳細ステップの1つ。価値の程度を評価する基準（機能評価値）とコスト目標を設定する。',
  },
  {
    id: 'term-025', type: 'term', category: '機能評価', difficulty: 2, exams: ['VES'], tags: ['実施手順'], source: 've-exam-notes 論述6',
    term: '対象分野の選定',
    definition: '機能評価の詳細ステップの1つ。価値の程度の低い機能分野を選定し、価値改善への動機を得る。',
  },
  {
    id: 'term-026', type: 'term', category: '機能評価', difficulty: 1, exams: ['VES'], tags: ['機能評価値'], source: 've-exam-notes 付録 選択1-2',
    term: '機能評価値',
    definition: '必要とする機能を達成するために最低いくらかかるかを示す評価基準。価値の程度＝機能評価値／現行コスト、コスト低減余地＝現行コスト－機能評価値。',
  },
  {
    id: 'term-027', type: 'term', category: '機能評価', difficulty: 1, exams: ['VES'], tags: ['計算'], source: 've-exam-notes 付録 選択1-2',
    term: '価値の程度',
    definition: '機能評価値／現行コスト。1に近いほど価値が高く、低いほど価値改善の余地が大きい。',
  },
  {
    id: 'term-028', type: 'term', category: '機能評価', difficulty: 1, exams: ['VES'], tags: ['計算'], source: 've-exam-notes 付録 選択1-2',
    term: 'コスト低減余地',
    definition: '現行コスト－機能評価値。対象分野の選定において、余地の大きい機能分野が価値改善の対象となる。',
  },
  {
    id: 'term-029', type: 'term', category: '機能評価', difficulty: 2, exams: ['VES'], tags: ['評価方法'], source: 've-exam-notes 論述6',
    term: '実績価値標準',
    definition: '機能評価の3方法の1つ。根拠は世の中のコストレベル。長所は目標達成の動機を得られること、短所は情報収集と精度が手間なこと。機能定義のアウトプットが充実し、メンバーがテーマに精通し、根拠を残したい場合に選択する。',
  },
  {
    id: 'term-030', type: 'term', category: '機能評価', difficulty: 2, exams: ['VES'], tags: ['評価方法'], source: 've-exam-notes 論述6',
    term: 'アイデア想定',
    definition: '機能評価の3方法の1つ。根拠は改善の可能性。長所は短時間で評価できること、短所はコスト見積りが困難なこと。アイデア重視の場合に用い、コスト試算ができるメンバーが必要。',
  },
  {
    id: 'term-031', type: 'term', category: '機能評価', difficulty: 2, exams: ['VES'], tags: ['評価方法'], source: 've-exam-notes 論述6',
    term: '機能の重要度比較',
    definition: '機能評価の3方法の1つ。根拠は重要度。長所は簡便に評価できること、短所は達成可能性とは無関係なこと。FD法、DARE法、マッジ法などが用いられ、開発など経験のない新規テーマに用いる（機能系統図に不安がある場合は避ける）。',
  },
]
