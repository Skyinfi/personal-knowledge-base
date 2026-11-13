import { describe, expect, it } from 'vitest'
import { excerpt } from '@/lib/blog/excerpt'
import { formatPostDate } from '@/lib/blog/format-date'
import {
  BODY_TOO_LONG,
  COMMENT_REQUIRED,
  COMMENT_TOO_LONG,
  TITLE_REQUIRED,
  TITLE_TOO_LONG,
} from '@/lib/blog/messages'
import { validateComment, validatePost } from '@/lib/blog/validate'

describe('validatePost', () => {
  it('去掉标题空白并保留正文', () => {
    expect(validatePost({ title: '  笔记  ', body: ' 第一行\n第二行' })).toEqual({
      ok: true,
      title: '笔记',
      body: ' 第一行\n第二行',
    })
  })

  it('拒绝空标题', () => {
    expect(validatePost({ title: '   ', body: '' })).toEqual({ ok: false, error: TITLE_REQUIRED })
  })

  it('拒绝超过 120 个字符的标题', () => {
    expect(validatePost({ title: '题'.repeat(121), body: '' })).toEqual({
      ok: false,
      error: TITLE_TOO_LONG,
    })
  })

  it('一个汉字算一个字符，120 个汉字可以通过', () => {
    expect(validatePost({ title: '题'.repeat(120), body: '' }).ok).toBe(true)
  })

  it('拒绝超过 50000 个字符的正文', () => {
    expect(validatePost({ title: '笔记', body: '文'.repeat(50001) })).toEqual({
      ok: false,
      error: BODY_TOO_LONG,
    })
  })
})

describe('validateComment', () => {
  it('去掉评论空白', () => {
    expect(validateComment('  好的  ')).toEqual({ ok: true, body: '好的' })
  })

  it('拒绝空评论', () => {
    expect(validateComment('  ')).toEqual({ ok: false, error: COMMENT_REQUIRED })
  })

  it('拒绝超过 2000 个字符的评论', () => {
    expect(validateComment('评'.repeat(2001))).toEqual({ ok: false, error: COMMENT_TOO_LONG })
  })
})

describe('excerpt', () => {
  it('取第一行', () => {
    expect(excerpt('第一行\n第二行')).toBe('第一行')
  })

  it('正文为空时没有摘录', () => {
    expect(excerpt('')).toBeNull()
  })

  it('第一行为空时没有摘录', () => {
    expect(excerpt('\n后面')).toBeNull()
  })

  it('第一行超过 80 个字符时只取前 80 个', () => {
    expect(excerpt(`${'字'.repeat(81)}\n下一行`)).toBe('字'.repeat(80))
  })
})

describe('formatPostDate', () => {
  it('按上海时区显示中文日期', () => {
    expect(formatPostDate('2026-11-13T00:00:00.000Z')).toBe('2026年11月13日')
  })
})
