import { COMMENT_MISSING } from '@/lib/blog/messages'
import type { BlogDb, Comment, Post, RecordFail } from '@/lib/blog/types'
import { isUuid } from '@/lib/blog/uuid'
import { validateComment, validatePost } from '@/lib/blog/validate'

function dbError(error: unknown): RecordFail {
  const message = error instanceof Error && error.message ? error.message : String(error)
  return { ok: false, code: 'db', error: message }
}

export async function createPostRecord(
  db: BlogDb,
  userId: string,
  raw: { title: string; body: string },
): Promise<{ ok: true; post: Post } | RecordFail> {
  const validated = validatePost(raw)
  if (!validated.ok) return { ok: false, code: 'invalid', error: validated.error }
  try {
    const post = await db.insertPost(userId, { title: validated.title, body_md: validated.body })
    return { ok: true, post }
  } catch (error) {
    return dbError(error)
  }
}

export async function updatePostRecord(
  db: BlogDb,
  userId: string,
  id: string,
  raw: { title: string; body: string },
): Promise<{ ok: true; post: Post } | RecordFail> {
  if (!isUuid(id)) return { ok: false, code: 'not_found', error: '文章不存在。' }
  const validated = validatePost(raw)
  if (!validated.ok) return { ok: false, code: 'invalid', error: validated.error }
  try {
    const post = await db.updatePost(userId, id, { title: validated.title, body_md: validated.body })
    if (!post) return { ok: false, code: 'not_found', error: '文章不存在。' }
    return { ok: true, post }
  } catch (error) {
    return dbError(error)
  }
}

export async function deletePostRecord(
  db: BlogDb,
  userId: string,
  id: string,
): Promise<{ ok: true } | RecordFail> {
  if (!isUuid(id)) return { ok: false, code: 'not_found', error: '文章不存在。' }
  try {
    const deleted = await db.deletePost(userId, id)
    if (!deleted) return { ok: false, code: 'not_found', error: '文章不存在。' }
    return { ok: true }
  } catch (error) {
    return dbError(error)
  }
}

export async function createCommentRecord(
  db: BlogDb,
  userId: string,
  raw: { postId: string; body: string },
): Promise<{ ok: true; comment: Comment } | RecordFail> {
  if (!isUuid(raw.postId)) return { ok: false, code: 'not_found', error: '文章不存在。' }
  const validated = validateComment(raw.body)
  if (!validated.ok) return { ok: false, code: 'invalid', error: validated.error }
  try {
    const post = await db.getPost(userId, raw.postId)
    if (!post) return { ok: false, code: 'not_found', error: '文章不存在。' }
    const comment = await db.insertComment(userId, { post_id: raw.postId, body: validated.body })
    if (!comment) return { ok: false, code: 'not_found', error: '文章不存在。' }
    return { ok: true, comment }
  } catch (error) {
    return dbError(error)
  }
}

export async function deleteCommentRecord(
  db: BlogDb,
  userId: string,
  id: string,
): Promise<{ ok: true } | RecordFail> {
  if (!isUuid(id)) return { ok: false, code: 'not_found', error: COMMENT_MISSING }
  try {
    const deleted = await db.deleteComment(userId, id)
    if (!deleted) return { ok: false, code: 'not_found', error: COMMENT_MISSING }
    return { ok: true }
  } catch (error) {
    return dbError(error)
  }
}
