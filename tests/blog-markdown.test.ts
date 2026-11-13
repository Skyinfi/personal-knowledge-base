import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '@/lib/blog/markdown'

describe('renderMarkdown', () => {
  it('渲染标题、强调、列表、链接和代码', () => {
    const html = renderMarkdown('# 标题\n\n**粗**\n\n- 一项\n\n[文档](https://example.com)\n\n```js\nconst a = 1\n```')
    expect(html).toContain('<h1>')
    expect(html).toContain('<strong>')
    expect(html).toContain('<li>')
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('<code')
  })

  it('不执行原文里的 HTML', () => {
    const html = renderMarkdown('<script>alert(1)</script>')
    expect(html).not.toContain('<script')
    expect(html).toContain('alert(1)')
  })

  it('不把图片语法渲染成图片', () => {
    const html = renderMarkdown('![封面](https://example.com/a.png)')
    expect(html).not.toContain('<img')
    expect(html).toContain('封面')
  })

  it('丢掉 javascript 链接', () => {
    const html = renderMarkdown('[点我](javascript:alert(1))')
    expect(html).not.toContain('javascript:')
    expect(html).toContain('点我')
  })
})
