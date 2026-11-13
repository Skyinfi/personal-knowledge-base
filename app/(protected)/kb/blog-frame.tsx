import { Button } from '@astryxdesign/core/Button'
import { HStack, VStack } from '@astryxdesign/core/Layout'
import { Text } from '@astryxdesign/core/Text'
import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import type { ReactNode } from 'react'
import { signOut } from './signout'

const mainStyle = {
  minHeight: '100vh',
  backgroundColor: 'var(--color-background-body)',
  padding: 'var(--spacing-8) var(--spacing-6)',
} as const

export function BlogFrame({ children }: { children: ReactNode }) {
  return (
    <Theme theme={neutralTheme} mode="light">
      <main style={mainStyle}>
        <div style={{ maxWidth: 960, marginInline: 'auto' }}>
          <header>
            <HStack gap={3} vAlign="center">
              <Text type="body" weight="bold">
                Personal Knowledge Base
              </Text>
              <div style={{ marginLeft: 'auto' }}>
                <HStack gap={2}>
                  <Button label="写文章" href="/kb/new" variant="primary" />
                  <form action={signOut}>
                    <Button type="submit" label="退出登录" variant="secondary" />
                  </form>
                </HStack>
              </div>
            </HStack>
          </header>
          <section style={{ paddingTop: 'var(--spacing-10)' }}>
            <VStack gap={4}>{children}</VStack>
          </section>
        </div>
      </main>
    </Theme>
  )
}
