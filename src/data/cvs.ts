import type { Question } from '@/lib/types'
import { CVS_TRUEFALSE } from './cvs-truefalse'
import { CVS_CHOICES } from './cvs-choices'
import { CVS_TERMS } from './cvs-terms'
import { CVS_CALC } from './cvs-calc'
import { CVS_SHORT } from './cvs-short'

/** CVS認定試験 基本問題（出典: CVS基本問題 完全対策集 2026-09-18）。解答のみ収録 */
export const CVS_QUESTIONS: Question[] = [
  ...CVS_TRUEFALSE, ...CVS_CHOICES, ...CVS_TERMS, ...CVS_CALC, ...CVS_SHORT,
]
