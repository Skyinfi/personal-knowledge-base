import { InternationalizationProvider } from '@astryxdesign/core/i18n'
import { Text } from '@astryxdesign/core/Text'
import zhCN from '@astryxdesign/core/locales/zh-CN.generated.js'
import { createPost } from '../actions'
import { BlogFrame } from '../blog-frame'
import { PostForm } from '../post-form'

export const metadata = { title: '写文章 | Personal Knowledge Base' }

export default function NewPostPage() {
  return (
    <InternationalizationProvider locale="zh-CN" messages={{ 'zh-CN': zhCN }}>
      <BlogFrame>
        <Text type="display-1" as="h1">
          写文章
        </Text>
        <PostForm
          action={createPost}
          initialTitle=""
          initialBody=""
          submitLabel="保存"
          cancelHref="/kb"
        />
      </BlogFrame>
    </InternationalizationProvider>
  )
}
