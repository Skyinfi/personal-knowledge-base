import type { SupabaseClient } from '@supabase/supabase-js'
import type { BlogDb, Comment, Post } from '@/lib/blog/types'

const postColumns = 'id, title, body_md, created_at, updated_at'
const commentColumns = 'id, post_id, body, created_at'

function raise(message: string): never {
  throw new Error(message)
}

export function createSupabaseBlogDb(supabase: SupabaseClient): BlogDb {
  return {
    async listPosts(userId) {
      const { data, error } = await supabase
        .from('posts')
        .select(postColumns)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) raise(error.message)
      return data as Post[]
    },
    async getPost(userId, id) {
      const { data, error } = await supabase
        .from('posts')
        .select(postColumns)
        .eq('user_id', userId)
        .eq('id', id)
        .maybeSingle()
      if (error) raise(error.message)
      return (data as Post | null) ?? null
    },
    async insertPost(userId, input) {
      const { data, error } = await supabase
        .from('posts')
        .insert({ user_id: userId, title: input.title, body_md: input.body_md })
        .select(postColumns)
        .single()
      if (error) raise(error.message)
      return data as Post
    },
    async updatePost(userId, id, input) {
      const { data, error } = await supabase
        .from('posts')
        .update({ title: input.title, body_md: input.body_md, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('id', id)
        .select(postColumns)
        .maybeSingle()
      if (error) raise(error.message)
      return (data as Post | null) ?? null
    },
    async deletePost(userId, id) {
      const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('user_id', userId)
        .eq('id', id)
        .select('id')
      if (error) raise(error.message)
      return (data ?? []).length > 0
    },
    async listComments(userId, postId) {
      const { data, error } = await supabase
        .from('comments')
        .select(commentColumns)
        .eq('user_id', userId)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      if (error) raise(error.message)
      return data as Comment[]
    },
    async insertComment(userId, input) {
      const { data, error } = await supabase
        .from('comments')
        .insert({ user_id: userId, post_id: input.post_id, body: input.body })
        .select(commentColumns)
        .maybeSingle()
      if (error) raise(error.message)
      return (data as Comment | null) ?? null
    },
    async deleteComment(userId, id) {
      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('user_id', userId)
        .eq('id', id)
        .select('id')
      if (error) raise(error.message)
      return (data ?? []).length > 0
    },
  }
}
