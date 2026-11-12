'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Center } from '@astryxdesign/core/Center'
import { Grid } from '@astryxdesign/core/Grid'
import { HStack, StackItem, VStack } from '@astryxdesign/core/Layout'
import { Section } from '@astryxdesign/core/Section'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { InternationalizationProvider } from '@astryxdesign/core/i18n'
import { Theme } from '@astryxdesign/core/theme'
import zhCN from '@astryxdesign/core/locales/zh-CN.generated.js'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import { signIn } from '@/app/login/actions'

const COLUMN_MIN_WIDTH = 240

const pageStyle = {
  minHeight: '100vh',
  backgroundColor: 'var(--color-background-body)',
} as const

const cardWrap = {
  width: '100%',
  maxWidth: 1000,
  marginInline: 'auto',
} as const

const LOGIN_SPLIT_CSS = `
.login-split-grid {
  container-type: inline-size;
  container-name: login-split;
  padding: var(--spacing-8);
}
.login-split-brand {
  display: none;
  min-height: 100%;
}
.login-split-mark {
  display: flex;
}
@container login-split (min-width: 512px) {
  .login-split-brand {
    display: block;
  }
  .login-split-mark {
    display: none;
  }
}
`

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      label="登录知识库"
      variant="primary"
      size="lg"
      width="100%"
      isLoading={pending}
    />
  )
}

export function KnowledgeLogin({ errorMessage }: { errorMessage: string | null }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <InternationalizationProvider locale="zh-CN" messages={{ 'zh-CN': zhCN }}>
    <Theme theme={neutralTheme} mode="light">
      <Center axis="both" padding={6} style={pageStyle}>
        <style>{LOGIN_SPLIT_CSS}</style>
        <div style={cardWrap}>
          <Card padding={0} width="100%">
            <Grid
              columns={{ minWidth: COLUMN_MIN_WIDTH, repeat: 'fit' }}
              gap={8}
              align="stretch"
              className="login-split-grid"
            >
              <div className="login-split-brand">
                <Theme theme={neutralTheme} mode="dark">
                <Card variant="transparent" padding={0} width="100%" height="100%">
                  <div
                    style={{
                      backgroundColor: 'var(--color-background-body)',
                      height: '100%',
                      padding: 'var(--spacing-8)',
                    }}
                  >
                    <VStack gap={6} height="100%">
                      <HStack gap={2} vAlign="center">
                        <Text type="body" weight="bold">
                          K
                        </Text>
                        <Text type="body" weight="bold">
                          Personal Knowledge Base
                        </Text>
                      </HStack>
                      <StackItem size="fill">
                        <Center axis="vertical" height="100%">
                          <VStack gap={4}>
                            <Text type="supporting" color="secondary" weight="bold">
                              YOUR SECOND BRAIN
                            </Text>
                            <Text type="display-1" as="h1">
                              让知识沉淀，让思考持续生长。
                            </Text>
                            <Text type="body">
                              一个存放技术笔记、读书思考与长期学习成果的私人空间。
                            </Text>
                            <Text type="supporting" color="primary">
                              个人知识 · 系统学习 · 持续积累
                            </Text>
                          </VStack>
                        </Center>
                      </StackItem>
                      <Text type="supporting" color="secondary">
                        PRIVATE WORKSPACE · SUPABASE AUTH
                      </Text>
                    </VStack>
                  </div>
                </Card>
                </Theme>
              </div>

              <Section variant="transparent" padding={0} height="100%">
                <VStack gap={4} height="100%">
                  <div className="login-split-mark">
                    <HStack gap={2} vAlign="center">
                      <Text type="body" weight="bold">
                        K
                      </Text>
                      <Text type="body" weight="bold">
                        Personal Knowledge Base
                      </Text>
                    </HStack>
                  </div>
                  <StackItem size="fill">
                    <Center axis="vertical" height="100%">
                      <form action={signIn} style={{ width: '100%' }}>
                        <VStack gap={4} hAlign="stretch" width="100%">
                          <VStack gap={1}>
                            <Text type="display-1" as="h2">
                              欢迎回来
                            </Text>
                            <Text type="body" color="secondary" size="sm">
                              请输入你的账号信息，继续访问私人知识库。
                            </Text>
                          </VStack>
                          <TextInput
                            label="电子邮箱"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={setEmail}
                            size="lg"
                            width="100%"
                            htmlName="email"
                            autoComplete="email"
                            isRequired
                          />
                          <TextInput
                            label="密码"
                            type="password"
                            placeholder="输入你的密码"
                            value={password}
                            onChange={setPassword}
                            size="lg"
                            width="100%"
                            htmlName="password"
                            autoComplete="current-password"
                            isRequired
                            status={
                              errorMessage
                                ? { type: 'error', message: errorMessage }
                                : undefined
                            }
                            statusVariant="detached"
                          />
                          <SubmitButton />
                          <Text type="supporting" color="secondary">
                            仅供授权用户访问 · 本站不开放自助注册
                          </Text>
                        </VStack>
                      </form>
                    </Center>
                  </StackItem>
                </VStack>
              </Section>
            </Grid>
          </Card>
        </div>
      </Center>
    </Theme>
    </InternationalizationProvider>
  )
}
