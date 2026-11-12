import { Button } from '@astryxdesign/core/Button'
import { Text } from '@astryxdesign/core/Text'
import { HStack, VStack } from '@astryxdesign/core/Layout'
import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import { signOut } from './signout'

export const metadata = { title: '知识库 | Personal Knowledge Base' }

export default function KnowledgeBaseHome() {
  return (
    <Theme theme={neutralTheme} mode="light">
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-background-body)',
          padding: 'var(--spacing-8) var(--spacing-6)',
        }}
      >
        <div style={{ maxWidth: 960, marginInline: 'auto' }}>
          <header>
            <HStack gap={3} vAlign="center">
              <Text type="body" weight="bold">
                Personal Knowledge Base
              </Text>
              <form action={signOut} style={{ marginLeft: 'auto' }}>
                <Button type="submit" label="退出登录" variant="secondary" />
              </form>
            </HStack>
          </header>
          <section style={{ paddingTop: 'var(--spacing-10)' }}>
            <VStack gap={3}>
              <Text type="display-1" as="h1">
                我的知识库
              </Text>
              <Text type="body" color="secondary">
                登录已经完成。笔记还没有接入，这里会用来存放你的私人内容。
              </Text>
            </VStack>
          </section>
        </div>
      </main>
    </Theme>
  )
}
