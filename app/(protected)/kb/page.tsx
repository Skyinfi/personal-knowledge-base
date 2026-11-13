import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/Layout'
import { Suspense } from 'react'
import Link from 'next/link'
import { excerpt } from '@/lib/blog/excerpt'
import { formatPostDate } from '@/lib/blog/format-date'
import { createSupabaseBlogDb } from '@/lib/blog/supabase-db'
import { createClient } from '@/lib/supabase/server'
import { BlogFrame } from './blog-frame'

export const metadata = { title: '知识库 | Personal Knowledge Base' }

export default function KnowledgeBasePage() {
  return (
    <Suspense fallback={null}>
      <PostList />
    </Suspense>
  )
}

async function PostList() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : ''
  if (error || !userId) return null

  const posts = await createSupabaseBlogDb(supabase).listPosts(userId)

  return (
    <BlogFrame>
      <Text type="display-1" as="h1">
        我的知识库
      </Text>
      {posts.length === 0 ? <Text type="body">还没有文章</Text> : null}
      <VStack gap={3}>
        {posts.map((post) => {
          const summary = excerpt(post.body_md)
          return (
            <article key={post.id}>
              <VStack gap={1}>
                <Link href={`/kb/${post.id}`}>{post.title}</Link>
                <Text type="body" color="secondary">
                  {formatPostDate(post.created_at)}
                </Text>
                {summary ? (
                  <Text type="body" color="secondary">
                    {summary}
                  </Text>
                ) : null}
              </VStack>
            </article>
          )
        })}
      </VStack>
    </BlogFrame>
  )
}
