import type { RecordFail } from '@/lib/blog/types'

export type FollowUp =
  | { type: 'redirect'; href: string }
  | { type: 'not_found' }
  | { type: 'error'; error: string }

export function followUp(result: { ok: true; href: string } | RecordFail): FollowUp {
  if (result.ok) return { type: 'redirect', href: result.href }
  if (result.code === 'not_found') return { type: 'not_found' }
  return { type: 'error', error: result.error }
}
