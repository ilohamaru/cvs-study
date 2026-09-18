import type { TermQ } from '@/lib/types'

// 用語カード（後半）: 代替案作成 / 発想技法 / TRIZ / VE適用段階 / 推進・組織
export const TERMS_2: TermQ[] = [
  {
    id: 'term-032', type: 'term', category: '代替案作成', difficulty: 1, tags: ['実施手順'], source: 've-exam-notes 論述9',
    term: '代替案作成',
    definition: 'VE実施手順の基本ステップの3番目。ターゲット機能を中心にアイデア発想を行い、評価・具体化・洗練を繰り返し目標達成できる代替案を作成する。詳細ステップは⑦アイデア発想 ⑧概略評価 ⑨具体化 ⑩詳細評価。',
  },
  {
    id: 'term-033', type: 'term', category: '代替案作成', difficulty: 2, tags: ['実施手順'], source: 've-exam-notes 論述9',
    term: '概略評価',
    definition: '代替案作成の詳細ステップ⑧。出されたアイデアをふるい分ける。可能性の高いアイデアしか残さないと目標達成の可能性を下げるため、可能性の低いアイデアも組み合わせて育てる事が重要。',
  },
  {
    id: 'term-034', type: 'term', category: '代替案作成', difficulty: 2, tags: ['実施手順'], source: 've-exam-notes 論述8',
    term: '具体化',
    definition: '代替案作成の詳細ステップ⑨。アイデアを実現可能な案に洗練させる。利点欠点分析を行い、欠点克服にTRIZの矛盾マトリクス表を活用すると有効。',
  },
  {
    id: 'term-035', type: 'term', category: '代替案作成', difficulty: 1, tags: ['マイルズ'], source: 've-exam-notes 用語2',
    term: 'Blast-Create-Refine',
    definition: '米国GE社のマイルズ氏が提唱したVEの基本的な考え方。従来の考え方を破棄（Blast）し、達成すべき機能に焦点をあてて優れたアイデアを創造（Create）し、洗練（Refine）させ、価値の高い代替案に育てあげること。',
  },
  {
    id: 'term-036', type: 'term', category: '代替案作成', difficulty: 2, tags: ['提案'], source: 've-exam-notes 論述9 / 付録 選択1-2',
    term: '提案',
    definition: '具体化した代替案を活動の責任者に提案するステップ。提案の方法には記述（提案書）と口述（プレゼンテーション）がある。',
  },
  {
    id: 'term-037', type: 'term', category: '発想技法', difficulty: 1, tags: ['関所'], source: 've-exam-notes 用語1',
    term: 'アイデアを阻む3つの関所',
    definition: '無意識に3つの関所ができてしまうため、アイデア発想の障害となる。①認識の関 ②文化の関 ③感情の関。',
  },
  {
    id: 'term-038', type: 'term', category: '発想技法', difficulty: 1, tags: ['関所'], source: 've-exam-notes 用語1',
    term: '認識の関',
    definition: '問題の存在に気づけない、問題を誤ってとらえる障害。ブレーンストーミングの「量を求める」「改善結合」により機能本位で考えることで取り除く。',
  },
  {
    id: 'term-039', type: 'term', category: '発想技法', difficulty: 1, tags: ['関所'], source: 've-exam-notes 用語4',
    term: '文化の関',
    definition: '日常生活などの習慣、法律、宗教等の文化社会の枠にとらわれ、枠を超えた発想が困難になること。「型にはめたがる」「黒白をつけたがる」「統計をうのみにする」など。ブレストの「自由奔放」で取り除く。',
  },
  {
    id: 'term-040', type: 'term', category: '発想技法', difficulty: 1, tags: ['関所'], source: 've-exam-notes 用語1',
    term: '感情の関',
    definition: '人間の感情や性格による考え方の固定化による障害。ブレーンストーミングの「批判厳禁」で取り除く。',
  },
  {
    id: 'term-041', type: 'term', category: '発想技法', difficulty: 1, tags: ['ブレスト'], source: 've-exam-notes 用語5',
    term: 'ブレーンストーミング法',
    definition: '数人のグループにおいて会議形式で集団の効果を活かし、アイデアの連鎖反応を起こし、自由奔放なアイデア発想をする方法。アメリカのオズボーンが開発。4つの原則を定め、3つの関所を排除して多くのアイデアを生み出す。',
  },
  {
    id: 'term-042', type: 'term', category: '発想技法', difficulty: 1, tags: ['ブレスト'], source: 've-exam-notes 短文8',
    term: 'ブレーンストーミングの4つの原則',
    definition: '①批判厳禁 ②自由奔放 ③質より量を求める ④アイデアの改善結合。③が目的で、①②④はどう行動すべきかの方法を示す。①→感情の関、②→文化の関、③④→認識の関を取り除く。',
  },
  {
    id: 'term-043', type: 'term', category: '発想技法', difficulty: 2, tags: ['列挙法'], source: 've-exam-notes 用語6',
    term: '欠点列挙法',
    definition: '対象テーマに対する不平不満、不便などを列挙し、その欠点を解決するためのアイデアを発想する着想を得る。現状の課題をベースとしているので、誰もが取り組みやすい技法。',
  },
  {
    id: 'term-044', type: 'term', category: '発想技法', difficulty: 1, tags: ['列挙法'], source: 've-exam-notes 用語7',
    term: '希望点列挙法',
    definition: '「こうあってほしい」「こうなったらよい」などの理想や希望を出し、それをヒントにアイデア発想を行う技法。本来の目的である理想や希望に焦点を合わせ、その達成に向けた発想を行うことができる。',
  },
  {
    id: 'term-045', type: 'term', category: '発想技法', difficulty: 1, tags: ['チェックリスト'], source: 've-exam-notes 用語9',
    term: 'チェックリスト法',
    definition: 'ある問題に対して、予めチェックすべき項目をリスト化し、抜け・漏れのないように項目ごとに考えていく方法。全く新しいものを創造するというより、今あるものを改善するのに適する。5W1Hやオズボーンのチェックリストが有名。',
  },
  {
    id: 'term-046', type: 'term', category: '発想技法', difficulty: 2, tags: ['列挙法'], source: 've-exam-notes 短文3〜7',
    term: '特性列挙法',
    definition: '問題は小さくすればするほどアイデアが出やすくなることと、色々なものには特性があるという考え方を組み合わせた方法。ものを「名詞的特性」「形容詞的特性」「動詞的特性」に分析しながらアイデア発想を行う。',
  },
  {
    id: 'term-047', type: 'term', category: '発想技法', difficulty: 1, tags: ['類比'], source: 've-exam-notes 用語3',
    term: 'シネクティクス法',
    definition: '一見関連のない要素を結びつける3つの類比テクニックを用いてアイデア発想を行う。ギリシャ語由来。①直接的類比 ②象徴的類比 ③人格的類比。',
  },
  {
    id: 'term-048', type: 'term', category: '発想技法', difficulty: 2, tags: ['類比'], source: 've-exam-notes 用語3',
    term: '直接的類比',
    definition: 'シネクティクスの類比の1つ。直接似たものを探して、それをヒントに発想する。',
  },
  {
    id: 'term-049', type: 'term', category: '発想技法', difficulty: 2, tags: ['類比'], source: 've-exam-notes 用語3',
    term: '象徴的類比',
    definition: 'シネクティクスの類比の1つ。象徴的なイメージを手掛かりに発想する。',
  },
  {
    id: 'term-050', type: 'term', category: '発想技法', difficulty: 2, tags: ['類比'], source: 've-exam-notes 用語3',
    term: '人格的類比',
    definition: 'シネクティクスの類比の1つ。自分がその要素になりきって発想する。',
  },
  {
    id: 'term-051', type: 'term', category: 'TRIZ', difficulty: 1, tags: ['理想性'], source: 'SKILL.md 骨子 / ve-exam-notes 短文9',
    term: 'TRIZの理想性',
    definition: 'I（理想性）＝UF（有益機能）／HE（有害作用）。HEにはコストも含む。TRIZは理想性の向上を目指し、VEは価値（V=F/C）の向上を目指す。',
  },
  {
    id: 'term-052', type: 'term', category: 'TRIZ', difficulty: 1, tags: ['矛盾'], source: 've-exam-notes 用語10',
    term: '技術的矛盾',
    definition: '問題解決にあたり、2つの特性がトレードオフの関係にあること。特性Aの改善に伴い特性Bが悪化する場合をいう。「矛盾マトリクス」「40の発明原理」を活用し、妥協することなく解決する事を目指す。',
  },
  {
    id: 'term-053', type: 'term', category: 'TRIZ', difficulty: 1, tags: ['矛盾'], source: 've-exam-notes 用語11',
    term: '物理的矛盾',
    definition: '問題解決にあたり、単一の特性が要件に応じてトレードオフの関係にあること。機能Cには特性Aの増加、機能Dには特性Aの低下が必要な場合など。「時間」「空間」「部分と全体」「状況」の観点で要件を分離して解決する。',
  },
  {
    id: 'term-054', type: 'term', category: 'TRIZ', difficulty: 1, tags: ['分離'], source: 've-exam-notes 用語12',
    term: '分離の法則',
    definition: '物理的矛盾を解決するための4つの切り口。①空間による分離 ②時間による分離 ③部分と全体の分離 ④状況による分離。',
  },
  {
    id: 'term-055', type: 'term', category: 'TRIZ', difficulty: 2, tags: ['矛盾'], source: 've-exam-notes 用語10',
    term: '矛盾マトリクスと40の発明原理',
    definition: '技術的矛盾を解決するためのTRIZのツール。改善する特性と悪化する特性の組合せから、適用すべき発明原理を導く。VEでは具体化ステップの欠点克服に活用できる。',
  },
  {
    id: 'term-056', type: 'term', category: 'TRIZ', difficulty: 2, tags: ['慣性'], source: 've-exam-notes 用語8',
    term: '心理的慣性',
    definition: 'TRIZでは、一般的技術者は心理的慣性で革新的な問題（矛盾）を解決できないとされる。今までと違った見方をすることで従来と違った発想が生まれる。VEでいう3つの関所（認識・文化・感情の関）と同様に考えられている。',
  },
  {
    id: 'term-057', type: 'term', category: 'TRIZ', difficulty: 3, tags: ['Effects'], source: 've-exam-notes 論述8',
    term: 'Effects（エフェクツ）',
    definition: 'TRIZのツールの1つで、自然科学の法則（効果）を用いて発想する。VEの代替案作成ステップ⑦アイデア発想で活用できる。',
  },
  {
    id: 'term-058', type: 'term', category: 'TRIZ', difficulty: 3, tags: ['物質-場'], source: 've-exam-notes 短文9',
    term: '物質－場分析モデル',
    definition: 'TRIZのアイデア発想ツールの1つ。問題を物質と場の相互作用としてモデル化し、矛盾解決の観点から発想する。',
  },
  {
    id: 'term-059', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['適用段階'], source: 've-exam-notes 短文1',
    term: '0 Look / 1st Look / 2nd Look VE',
    definition: 'VE対象の特性や適用段階（開発、製造、使用）による実施方法の工夫。企画段階の0 Look VE、開発設計段階の1st Look VE、製造（量産）段階の2nd Look VEに分けられる。',
  },
  {
    id: 'term-060', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['開発段階'], source: 've-exam-notes 論述3',
    term: '開発設計型VE',
    definition: '開発段階でのVEの1つで、開発プロセスそのものをVE実施手順で運用するもの。もう1つの「開発設計支援型」と対比される。',
  },
  {
    id: 'term-061', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['開発段階'], source: 've-exam-notes 論述3',
    term: '開発設計支援型VE',
    definition: '開発段階でのVEの1つで、必要な時にVE活動を企画するもの。デザインレビューで課題を確認し必要な場合にVE活動チームを立上げる。既にあるアウトプットをベースに活動するのでVE実施手順をそのまま適用しやすいが、製品全体の抜本的な見直しにはつながらない。',
  },
  {
    id: 'term-062', type: 'term', category: 'VE適用段階', difficulty: 1, tags: ['開発段階'], source: 've-exam-notes 論述4',
    term: 'コンカレントエンジニアリング',
    definition: '複数プロセスを同時並行で進める開発プロセス。開発の効率化・期間短縮・開発費削減ができ、フロントローディングにより開発品質が向上する。問題点は「図面がないのにVE活動を開始できるのか」という点。',
  },
  {
    id: 'term-063', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['開発段階'], source: 've-exam-notes 論述4',
    term: 'ウォーターフォール型開発',
    definition: '従来型の、順番に進む開発プロセス。開発終了後に製造上の問題が発生し手戻りが多い、VE提案があっても手遅れで織り込めない、開発期間の長期化、図面が出る前は設計部門のみのVE活動になりがち、といった問題点がある。',
  },
  {
    id: 'term-064', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['開発段階'], source: 've-exam-notes 論述4',
    term: 'フロントローディング',
    definition: '開発の前段階に資源・検討を集中させること。コンカレントエンジニアリングによりフロントローディングが実現し、開発品質が向上する。',
  },
  {
    id: 'term-065', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['開発段階'], source: 've-exam-notes 論述4',
    term: '図面検討会',
    definition: '全ての形状・寸法の理由を設計者が、作り方・作りづらさを作り手が説明し、アイデアを全員で発想する会。「図面がない」段階のVE活動の対策として有効。',
  },
  {
    id: 'term-066', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['開発段階'], source: 've-exam-notes 論述4 / 論述5',
    term: 'コストテーブル',
    definition: '部品ごと・部品群ごとにコスト査定を可能にする表。作成により原価査定力を高め、高値掴みを防ぐ。機能との関係を分析し、サプライヤーと共有する。',
  },
  {
    id: 'term-067', type: 'term', category: 'VE適用段階', difficulty: 1, tags: ['製造段階'], source: 've-exam-notes 論述8',
    term: '製造段階のVE',
    definition: '市場にでている製品の果たすべき機能を再認識し、その機能をもとにより価値の高い代替案を作成する過程でのVE。VE実施手順（機能定義→機能評価→代替案作成）に従って進める。',
  },
  {
    id: 'term-068', type: 'term', category: 'VE適用段階', difficulty: 2, tags: ['開発段階'], source: 've-exam-notes 論述3 / 付録 選択2-2',
    term: 'デザインレビュー',
    definition: '開発プロジェクトの各ゲートで技術・品質・コストなどの課題を確認する審査。開発設計支援型VEでは、ここで必要な場合にVE活動チームを立上げる。',
  },
  {
    id: 'term-069', type: 'term', category: '推進・組織', difficulty: 2, tags: ['テアダウン'], source: 've-exam-notes 論述5',
    term: '分析型テアダウン',
    definition: '競合他社の製品を分解・比較分析する手法。競合他社の新型発売時に実施し、戦略的VE活動に反映させる。実施組織の常設化が対策として挙げられる。',
  },
  {
    id: 'term-070', type: 'term', category: '推進・組織', difficulty: 2, tags: ['管理'], source: 've-exam-notes 論述9',
    term: 'VE基本管理',
    definition: 'VEを効果的に実施するために、コスト削減を目標にするのではなく、価値向上のために定義・基本原則・実施手順に則った適切な管理を行うこと。',
  },
  {
    id: 'term-071', type: 'term', category: '推進・組織', difficulty: 3, tags: ['開発段階'], source: 've-exam-notes 論述5',
    term: '常時VE検討（戦略的VE活動）',
    definition: 'プロジェクト発生後に対応するのではなく常時VE検討を行い、評価機会を利用して提案・採用されるよう活動を転換すること。開発設計VEでVE提案が採用されない問題への対策の1つ。',
  },
  {
    id: 'term-072', type: 'term', category: '推進・組織', difficulty: 3, tags: ['開発段階'], source: 've-exam-notes 論述5',
    term: '評価機会の分配',
    definition: '評価機会の分配、次の機会までの期間の長短でVE案を分けて考え、戦略的・計画的にVE活動を組み立てること。変更規模が大きいほど早いタイミングで試作品が必要になるため。',
  },
]
