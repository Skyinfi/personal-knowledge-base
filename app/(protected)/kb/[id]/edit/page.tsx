import { InternationalizationProvider } from '@astryxdesign/core/i18n'
import { Text } from '@astryxdesign/core/Text'
import zhCN from '@astryxdesign/core/locales/zh-CN.generated.js'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createSupabaseBlogDb } from '@/lib/blog/supabase-db'
import { isUuid } from '@/lib/blog/uuid'
import { createClient } from '@/lib/supabase/server'
import { updatePost } from '../../actions'
import { BlogFrame } from '../../blog-frame'
import { PostForm } from '../../post-form'

export const metadata = { title: '修改文章 | Personal Knowledge Base' }

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <EditPost params={params} />
    </Suspense>
  )
}

async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isUuid(id)) notFound()

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  const userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : ''
  if (error || !userId) return null

  const post = await createSupabaseBlogDb(supabase).getPost(userId, id)
  if (!post) notFound()

  return (
    <InternationalizationProvider locale="zh-CN" messages={{ 'zh-CN': zhCN }}>
      <BlogFrame>
        <Text type="display-1" as="h1">
          修改文章
        </Text>
        <PostForm
          action={updatePost}
          postId={post.id}
          initialTitle={post.title}
          initialBody={post.body_md}
          submitLabel="保存"
          cancelHref={`/kb/${post.id}`}
        />
      </BlogFrame>
    </InternationalizationProvider>
  )
}
