import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const sql = readFileSync(
  path.join(process.cwd(), 'supabase/migrations/20261113120000_create_blog.sql'),
  'utf8',
)

describe('blog migration', () => {
  it('创建两张表、长度检查、索引和级联删除', () => {
    expect(sql).toContain('create table public.posts')
    expect(sql).toContain('create table public.comments')
    expect(sql).toContain('char_length(title) between 1 and 120')
    expect(sql).toContain('char_length(body_md) <= 50000')
    expect(sql).toContain('char_length(body) between 1 and 2000')
    expect(sql).toContain('posts (user_id, created_at desc)')
    expect(sql).toContain('comments (post_id, created_at asc)')
    expect(sql).toContain('references auth.users (id) on delete cascade')
    expect(sql).toContain('references public.posts (id) on delete cascade')
  })

  it('启用 RLS，并且评论没有更新策略', () => {
    expect(sql).toContain('alter table public.posts enable row level security')
    expect(sql).toContain('alter table public.comments enable row level security')
    expect(sql).toContain('user_id = (select auth.uid())')
    expect(sql).not.toMatch(/create policy comments_update/i)
    expect(sql).not.toMatch(/grant update on public\.comments/i)
  })
})
