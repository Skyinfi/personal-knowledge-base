'use client'

import { Button } from '@astryxdesign/core/Button'
import { HStack, VStack } from '@astryxdesign/core/Layout'
import { TextArea } from '@astryxdesign/core/TextArea'
import { TextInput } from '@astryxdesign/core/TextInput'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import type { FormState } from '@/lib/blog/types'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return <Button type="submit" label={label} variant="primary" isLoading={pending} />
}

export function PostForm({
  action,
  postId,
  initialTitle,
  initialBody,
  submitLabel,
  cancelHref,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  postId?: string
  initialTitle: string
  initialBody: string
  submitLabel: string
  cancelHref: string
}) {
  const [state, formAction] = useActionState(action, { error: null })
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)

  return (
    <form action={formAction}>
      <VStack gap={3}>
        {state.error ? (
          <p style={{ color: 'var(--color-text-critical, #b42318)', margin: 0 }}>{state.error}</p>
        ) : null}
        {postId ? <input type="hidden" name="id" value={postId} /> : null}
        <TextInput
          label="标题"
          value={title}
          onChange={setTitle}
          htmlName="title"
          width="100%"
        />
        <TextArea
          label="正文"
          value={body}
          onChange={setBody}
          htmlName="body_md"
          rows={16}
          width="100%"
        />
        <HStack gap={2}>
          <SubmitButton label={submitLabel} />
          <Button label="返回" href={cancelHref} variant="secondary" />
        </HStack>
      </VStack>
    </form>
  )
}
