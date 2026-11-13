import { Button } from '@astryxdesign/core/Button'
import { InternationalizationProvider } from '@astryxdesign/core/i18n'
import { HStack, VStack } from '@astryxdesign/core/Layout'
import { Text } from '@astryxdesign/core/Text'
import zhCN from '@astryxdesign/core/locales/zh-CN.generated.js'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { formatPostDate } from '@/lib/blog/format-date'
import { renderMarkdown } from '@/lib/blog/markdown'
import { createSupabaseBlogDb } from '@/lib/blog/supabase-db'
import { isUuid } from '@/lib/blog/uuid'
import { createClient } from '@/lib/supabase/server'
import { BlogFrame } from '../blog-frame'
import { CommentForm } from '../comment-form'
import { ConfirmDelete, DeleteCommentButton } from '../delete-controls'

export const metadata = { title: '文章 | Personal Knowledge Base' }

export default function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ confirm?: string }>
}) {
  return (
    <Suspense fallback={null}>
      <Article params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function Article({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ confirm?: string }>
}) {
  const { id } = await params
  const { confirm } = await searchParams
  if (!isUuid(id)) notFound()

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : ''
  if (error || !userId) return null

  const db = createSupabaseBlogDb(supabase)
  const post = await db.getPost(userId, id)
  if (!post) notFound()
  const comments = await db.listComments(userId, post.id)

  return (
    <InternationalizationProvider locale="zh-CN" messages={{ 'zh-CN': zhCN }}>
      <BlogFrame>
        <Text type="display-1" as="h1">
          {post.title}
        </Text>
        <Text type="body" color="secondary">
          {formatPostDate(post.created_at)}
        </Text>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body_md) }} />
        <HStack gap={2}>
          <Button label="编辑" href={`/kb/${post.id}/edit`} variant="secondary" />
          <Button label="删除" href={`/kb/${post.id}?confirm=delete`} variant="destructive" />
        </HStack>
        {confirm === 'delete' ? <ConfirmDelete postId={post.id} /> : null}
        <Text type="body" weight="bold">
          评论
        </Text>
        <VStack gap={3}>
          {comments.map((comment) => (
            <article key={comment.id}>
              <VStack gap={1}>
                <Text type="body">{comment.body}</Text>
                <Text type="body" color="secondary">
                  {formatPostDate(comment.created_at)}
                </Text>
                <DeleteCommentButton postId={post.id} commentId={comment.id} />
              </VStack>
            </article>
          ))}
        </VStack>
        <CommentForm postId={post.id} />
      </BlogFrame>
    </InternationalizationProvider>
  )
}
