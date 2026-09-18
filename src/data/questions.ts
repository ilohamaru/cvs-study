// 標準問題（全形式・全区分をまとめたもの）
import type { Question } from '@/lib/types'
import { TERMS } from './terms'
import { TRUEFALSE } from './truefalse'
import { CHOICES } from './choices'
import { CVS_QUESTIONS } from './cvs'
import { VEL_QUESTIONS } from './vel'

/**
 * 標準問題一覧と試験区分（exams）について
 *
 * - terms-*.ts / truefalse-*.ts / choices-*.ts の 213 問は、すべて
 *   VES 試験対策の学習ノート（ve-exam-notes.md）が出典なので `exams: ['VES']` としている。
 *   区分は内容から推測して振り分けていない。正しい振り分けは利用者が
 *   「管理 → 一覧 → 一括再タグ」で行い、その結果は localStorage の overrides に保存される
 *   （出題時に applyOverrides でマージされるため、再ビルドは不要）。
 * - cvs*.ts は CVS 認定試験の基本問題（正誤・選択・用語・計算・説明）で、全問 `exams: ['CVS']`。
 *   これらのファイルは別担当が管理しているため、ここでは import して束ねるだけにする。
 * - vel*.ts は VEリーダー(VEL)認定試験の模擬試験4回分（正誤・選択・空欄補充・対応付け・用語選択）で、
 *   全問 `exams: ['VEL']`。出典は「おぎの改善実践塾 VEリーダー認定試験受験講座」の模擬試験。
 */
export const STANDARD_QUESTIONS: Question[] = [...TERMS, ...TRUEFALSE, ...CHOICES, ...CVS_QUESTIONS, ...VEL_QUESTIONS]

export const STANDARD_IDS = new Set(STANDARD_QUESTIONS.map((q) => q.id))
