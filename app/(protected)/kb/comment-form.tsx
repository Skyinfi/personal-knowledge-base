'use client'

import { Button } from '@astryxdesign/core/Button'
import { VStack } from '@astryxdesign/core/Layout'
import { TextArea } from '@astryxdesign/core/TextArea'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { createComment } from './actions'
import type { FormState } from '@/lib/blog/types'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button type="submit" label="发送" variant="primary" isLoading={pending} />
}

export function CommentForm({ postId }: { postId: string }) {
  const [state, formAction] = useActionState(createComment, { error: null } satisfies FormState)
  const [body, setBody] = useState('')

  return (
    <form action={formAction}>
      <VStack gap={2}>
        {state.error ? (
          <p style={{ color: 'var(--color-text-critical, #b42318)', margin: 0 }}>{state.error}</p>
        ) : null}
        <input type="hidden" name="post_id" value={postId} />
        <TextArea label="评论" value={body} onChange={setBody} htmlName="body" rows={4} width="100%" />
        <SubmitButton />
      </VStack>
    </form>
  )
}
