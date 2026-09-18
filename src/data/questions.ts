// 標準問題（全形式をまとめたもの）
import type { Question } from '@/lib/types'
import { TERMS } from './terms'
import { TRUEFALSE } from './truefalse'
import { CHOICES } from './choices'

/**
 * 標準問題一覧。
 * 短文記述（short）・計算（calc）は型のみ用意しており、
 * データを追加すればここに並べるだけで出題ルータに乗る。
 */
export const STANDARD_QUESTIONS: Question[] = [...TERMS, ...TRUEFALSE, ...CHOICES]

export const STANDARD_IDS = new Set(STANDARD_QUESTIONS.map((q) => q.id))
