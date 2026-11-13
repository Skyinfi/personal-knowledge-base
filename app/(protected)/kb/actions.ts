'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { followUp } from '@/lib/blog/follow-up'
import {
  createCommentRecord,
  createPostRecord,
  deleteCommentRecord,
  deletePostRecord,
  updatePostRecord,
} from '@/lib/blog/records'
import { createSupabaseBlogDb } from '@/lib/blog/supabase-db'
import type { FormState, RecordFail } from '@/lib/blog/types'
import { createClient } from '@/lib/supabase/server'

async function context() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : ''
  if (error || !userId) redirect('/login')
  return { db: createSupabaseBlogDb(supabase), userId }
}

async function finish(result: { ok: true; href: string } | RecordFail): Promise<FormState> {
  const next = followUp(result)
  if (next.type === 'not_found') notFound()
  if (next.type === 'error') return { error: next.error }
  revalidatePath('/', 'layout')
  redirect(next.href)
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  const { db, userId } = await context()
  const result = await createPostRecord(db, userId, {
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body_md') ?? ''),
  })
  if (!result.ok) return finish(result)
  return finish({ ok: true, href: `/kb/${result.post.id}` })
}

export async function updatePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const { db, userId } = await context()
  const result = await updatePostRecord(db, userId, String(formData.get('id') ?? ''), {
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body_md') ?? ''),
  })
  if (!result.ok) return finish(result)
  return finish({ ok: true, href: `/kb/${result.post.id}` })
}

export async function deletePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const { db, userId } = await context()
  const result = await deletePostRecord(db, userId, String(formData.get('id') ?? ''))
  if (!result.ok) return finish(result)
  return finish({ ok: true, href: '/kb' })
}

export async function createComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const postId = String(formData.get('post_id') ?? '')
  const { db, userId } = await context()
  const result = await createCommentRecord(db, userId, {
    postId,
    body: String(formData.get('body') ?? ''),
  })
  if (!result.ok) return finish(result)
  return finish({ ok: true, href: `/kb/${postId}` })
}

export async function deleteComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const postId = String(formData.get('post_id') ?? '')
  const { db, userId } = await context()
  const result = await deleteCommentRecord(db, userId, String(formData.get('id') ?? ''))
  if (!result.ok) return finish(result)
  return finish({ ok: true, href: `/kb/${postId}` })
}
