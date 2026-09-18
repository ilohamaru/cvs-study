import type { ChoiceQ } from '@/lib/types'

// VEリーダー模擬試験 空欄補充・対応付け・用語選択問題（choice型に変換）
export const VEL_FILL_8: ChoiceQ[] = [
  { id: 'vel-fill-155', type: 'choice', category: '機能評価', exams: ['VEL'], tags: ['配布計算'], source: 'VEリーダー模擬試験 第5回 問題5-(5)', difficulty: 1,
    stem: '「機能評価段階」に関係するものはどれか。',
    options: [
      '貢献度評価による配布計算',
      'テストと証明',
      '機会コスト',
      '設計条件',
    ], answerIndex: 0, explanation: '' },
  { id: 'vel-fill-156', type: 'choice', category: '代替案作成', exams: ['VEL'], tags: ['狭義の機能', '広義の機能', '具体化'], source: 'VEリーダー模擬試験 第5回 問題5-(6)', difficulty: 1,
    stem: '「代替案作成」に関係するものはどれか。',
    options: [
      '具体化のサイクル',
      '広義の機能',
      '価値指数',
      '狭義の機能',
    ], answerIndex: 0, explanation: '' },
  { id: 'vel-fill-157', type: 'choice', category: '代替案作成', exams: ['VEL'], tags: ['特有情報', '機能系統図', 'シネクティクス'], source: 'VEリーダー模擬試験 第5回 問題5-(7)', difficulty: 1,
    stem: '「代替案作成」に関係するものはどれか。',
    options: [
      'シネクティクス',
      '目的ー手段',
      '機能系統図',
      '特有情報',
    ], answerIndex: 0, explanation: '' },
  { id: 'vel-fill-158', type: 'choice', category: '代替案作成', exams: ['VEL'], tags: ['基本機能', '二次機能', '配布計算'], source: 'VEリーダー模擬試験 第5回 問題5-(8)', difficulty: 1,
    stem: '「代替案作成」に関係するものはどれか。',
    options: [
      '経常外コスト',
      '機能評価値',
      '消費による配布計算',
      '基本機能と二次機能',
    ], answerIndex: 0, explanation: '' },
  { id: 'vel-fill-159', type: 'choice', category: '代替案作成', exams: ['VEL'], tags: ['一般情報', '狭義の機能', '広義の機能'], source: 'VEリーダー模擬試験 第5回 問題5-(9)', difficulty: 1,
    stem: '「代替案作成」に関係するものはどれか。',
    options: [
      '一般情報',
      '広義の機能',
      '価値指数',
      '狭義の機能',
    ], answerIndex: 0, explanation: '' },
  { id: 'vel-fill-160', type: 'choice', category: '代替案作成', exams: ['VEL'], tags: ['特有情報', '機能系統図'], source: 'VEリーダー模擬試験 第5回 問題5-(10)', difficulty: 1,
    stem: '「代替案作成」に関係するものはどれか。',
    options: [
      '技術的可能性と経済的可能性',
      '目的ー手段',
      '機能系統図',
      '特有情報',
    ], answerIndex: 0, explanation: '' },]
