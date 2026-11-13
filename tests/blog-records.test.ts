import { describe, expect, it } from 'vitest'
import { TITLE_REQUIRED, COMMENT_REQUIRED, COMMENT_MISSING } from '@/lib/blog/messages'
import {
  createCommentRecord,
  createPostRecord,
  deleteCommentRecord,
  deletePostRecord,
  updatePostRecord,
} from '@/lib/blog/records'
import { followUp } from '@/lib/blog/follow-up'
import { createMemoryDb } from './memory-db'

function clock() {
  let seconds = 0
  return () => new Date(Date.UTC(2026, 0, 1, 0, 0, seconds++))
}

describe('post records', () => {
  it('新文章排在列表最上面，修改标题不改变顺序', async () => {
    const db = createMemoryDb(clock())
    const first = await createPostRecord(db, 'user-a', { title: '先写', body: '甲' })
    const second = await createPostRecord(db, 'user-a', { title: '后写', body: '乙' })
    expect(first.ok && second.ok).toBe(true)
    if (!first.ok || !second.ok) return

    let titles = (await db.listPosts('user-a')).map((post) => post.title)
    expect(titles).toEqual(['后写', '先写'])

    const updated = await updatePostRecord(db, 'user-a', first.post.id, { title: '改过', body: '甲' })
    expect(updated.ok).toBe(true)
    titles = (await db.listPosts('user-a')).map((post) => post.title)
    expect(titles).toEqual(['后写', '改过'])
    expect((await db.listPosts('user-a'))[1]?.created_at).toBe(first.post.created_at)
  })

  it('空标题不产生文章', async () => {
    const db = createMemoryDb(clock())
    const result = await createPostRecord(db, 'user-a', { title: '  ', body: '正文' })
    expect(result).toEqual({ ok: false, code: 'invalid', error: TITLE_REQUIRED })
    expect(await db.listPosts('user-a')).toEqual([])
  })

  it('删除文章时评论一起消失', async () => {
    const db = createMemoryDb(clock())
    const created = await createPostRecord(db, 'user-a', { title: '笔记', body: '' })
    if (!created.ok) throw new Error('expected post')
    await createCommentRecord(db, 'user-a', { postId: created.post.id, body: '一条' })
    expect(await deletePostRecord(db, 'user-a', created.post.id)).toEqual({ ok: true })
    expect(await db.getPost('user-a', created.post.id)).toBeNull()
    expect(await db.listComments('user-a', created.post.id)).toEqual([])
  })

  it('读不到别人的文章', async () => {
    const db = createMemoryDb(clock())
    const created = await createPostRecord(db, 'user-a', { title: '私人', body: '内容' })
    if (!created.ok) throw new Error('expected post')
    expect(await db.listPosts('user-b')).toEqual([])
    expect(await db.getPost('user-b', created.post.id)).toBeNull()
  })
})

describe('comment records', () => {
  it('新评论排在最后，删除只影响那一条', async () => {
    const db = createMemoryDb(clock())
    const created = await createPostRecord(db, 'user-a', { title: '笔记', body: '' })
    if (!created.ok) throw new Error('expected post')
    const first = await createCommentRecord(db, 'user-a', { postId: created.post.id, body: '先评' })
    const second = await createCommentRecord(db, 'user-a', { postId: created.post.id, body: '后评' })
    if (!first.ok || !second.ok) throw new Error('expected comments')
    expect((await db.listComments('user-a', created.post.id)).map((comment) => comment.body)).toEqual([
      '先评',
      '后评',
    ])
    expect(await deleteCommentRecord(db, 'user-a', first.comment.id)).toEqual({ ok: true })
    expect((await db.listComments('user-a', created.post.id)).map((comment) => comment.body)).toEqual(['后评'])
  })

  it('空评论不产生记录', async () => {
    const db = createMemoryDb(clock())
    const created = await createPostRecord(db, 'user-a', { title: '笔记', body: '' })
    if (!created.ok) throw new Error('expected post')
    const result = await createCommentRecord(db, 'user-a', { postId: created.post.id, body: '  ' })
    expect(result).toEqual({ ok: false, code: 'invalid', error: COMMENT_REQUIRED })
    expect(await db.listComments('user-a', created.post.id)).toEqual([])
  })

  it('删除不存在的评论返回缺失', async () => {
    const db = createMemoryDb(clock())
    const result = await deleteCommentRecord(db, 'user-a', '550e8400-e29b-41d4-a716-446655440000')
    expect(result).toEqual({ ok: false, code: 'not_found', error: COMMENT_MISSING })
  })
})

describe('followUp', () => {
  it('成功时跳转', () => {
    expect(followUp({ ok: true, href: '/kb/1' })).toEqual({ type: 'redirect', href: '/kb/1' })
  })

  it('找不到时交给 404', () => {
    expect(followUp({ ok: false, code: 'not_found', error: '文章不存在。' })).toEqual({ type: 'not_found' })
  })

  it('其他失败把错误留在表单', () => {
    expect(followUp({ ok: false, code: 'invalid', error: TITLE_REQUIRED })).toEqual({
      type: 'error',
      error: TITLE_REQUIRED,
    })
  })
})
