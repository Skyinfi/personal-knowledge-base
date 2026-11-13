'use client'

import { Button } from '@astryxdesign/core/Button'
import { HStack } from '@astryxdesign/core/Layout'
import { useActionState } from 'react'
import { deleteComment, deletePost } from './actions'
import type { FormState } from '@/lib/blog/types'

const errorStyle = { color: 'var(--color-text-critical, #b42318)', margin: 0 } as const

export function ConfirmDelete({ postId }: { postId: string }) {
  const [state, formAction] = useActionState(deletePost, { error: null } satisfies FormState)
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={postId} />
      {state.error ? <p style={errorStyle}>{state.error}</p> : null}
      <HStack gap={2}>
        <Button type="submit" label="确认删除" variant="destructive" />
        <Button label="取消" href={`/kb/${postId}`} variant="secondary" />
      </HStack>
    </form>
  )
}

export function DeleteCommentButton({ postId, commentId }: { postId: string; commentId: string }) {
  const [state, formAction] = useActionState(deleteComment, { error: null } satisfies FormState)
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={commentId} />
      <input type="hidden" name="post_id" value={postId} />
      {state.error ? <p style={errorStyle}>{state.error}</p> : null}
      <Button type="submit" label="删除评论" variant="ghost" />
    </form>
  )
}
