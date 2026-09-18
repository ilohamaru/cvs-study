import type { Question } from '@/lib/types'
import { VEL_TRUEFALSE } from './vel-truefalse'
import { VEL_CHOICES } from './vel-choices'
import { VEL_FILL } from './vel-fill'

/** VEリーダー(VEL)認定試験 模擬試験4回分（出典: おぎの改善実践塾 VEリーダー認定試験受験講座） */
export const VEL_QUESTIONS: Question[] = [...VEL_TRUEFALSE, ...VEL_CHOICES, ...VEL_FILL]
