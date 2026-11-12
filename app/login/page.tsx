import { Suspense } from 'react'
import { KnowledgeLogin } from '@/components/knowledge-login'

export const metadata = {
  title: '登录 | Personal Knowledge Base',
  description: '私人知识库登录',
}

const errorMessages: Record<string, string> = {
  missing: '请输入邮箱和密码。',
  invalid: '登录失败，请检查账号、密码或邮箱确认状态。',
}

type SearchParams = Promise<{ error?: string }>

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<KnowledgeLogin errorMessage={null} />}>
      <LoginError searchParams={searchParams} />
    </Suspense>
  )
}

async function LoginError({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams
  const errorMessage = error ? (errorMessages[error] ?? '登录失败，请稍后重试。') : null

  return <KnowledgeLogin errorMessage={errorMessage} />
}
