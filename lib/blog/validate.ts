import {
  BODY_TOO_LONG,
  COMMENT_REQUIRED,
  COMMENT_TOO_LONG,
  TITLE_REQUIRED,
  TITLE_TOO_LONG,
} from '@/lib/blog/messages'

function chars(value: string): number {
  return Array.from(value).length
}

export function validatePost(raw: { title: string; body: string }):
  | { ok: true; title: string; body: string }
  | { ok: false; error: string } {
  const title = raw.title.trim()
  const body = raw.body
  if (chars(title) === 0) return { ok: false, error: TITLE_REQUIRED }
  if (chars(title) > 120) return { ok: false, error: TITLE_TOO_LONG }
  if (chars(body) > 50000) return { ok: false, error: BODY_TOO_LONG }
  return { ok: true, title, body }
}

export function validateComment(raw: string):
  | { ok: true; body: string }
  | { ok: false; error: string } {
  const body = raw.trim()
  if (chars(body) === 0) return { ok: false, error: COMMENT_REQUIRED }
  if (chars(body) > 2000) return { ok: false, error: COMMENT_TOO_LONG }
  return { ok: true, body }
}
