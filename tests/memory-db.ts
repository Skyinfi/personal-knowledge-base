import type { BlogDb, Comment, Post } from '@/lib/blog/types'

type OwnedPost = Post & { user_id: string }
type OwnedComment = Comment & { user_id: string }

export function createMemoryDb(now: () => Date = () => new Date()): BlogDb {
  const posts: OwnedPost[] = []
  const comments: OwnedComment[] = []

  function withoutUser<T extends { user_id: string }>(row: T): Omit<T, 'user_id'> {
    const { user_id: _userId, ...rest } = row
    return rest
  }

  return {
    async listPosts(userId) {
      return posts
        .filter((post) => post.user_id === userId)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .map(withoutUser)
    },
    async getPost(userId, id) {
      const post = posts.find((item) => item.user_id === userId && item.id === id)
      return post ? withoutUser(post) : null
    },
    async insertPost(userId, input) {
      const timestamp = now().toISOString()
      const post: OwnedPost = {
        id: crypto.randomUUID(),
        user_id: userId,
        title: input.title,
        body_md: input.body_md,
        created_at: timestamp,
        updated_at: timestamp,
      }
      posts.push(post)
      return withoutUser(post)
    },
    async updatePost(userId, id, input) {
      const post = posts.find((item) => item.user_id === userId && item.id === id)
      if (!post) return null
      post.title = input.title
      post.body_md = input.body_md
      post.updated_at = now().toISOString()
      return withoutUser(post)
    },
    async deletePost(userId, id) {
      const index = posts.findIndex((item) => item.user_id === userId && item.id === id)
      if (index < 0) return false
      posts.splice(index, 1)
      for (let i = comments.length - 1; i >= 0; i -= 1) {
        if (comments[i].post_id === id) comments.splice(i, 1)
      }
      return true
    },
    async listComments(userId, postId) {
      return comments
        .filter((comment) => comment.user_id === userId && comment.post_id === postId)
        .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
        .map(withoutUser)
    },
    async insertComment(userId, input) {
      const post = posts.find((item) => item.user_id === userId && item.id === input.post_id)
      if (!post) return null
      const comment: OwnedComment = {
        id: crypto.randomUUID(),
        user_id: userId,
        post_id: input.post_id,
        body: input.body,
        created_at: now().toISOString(),
      }
      comments.push(comment)
      return withoutUser(comment)
    },
    async deleteComment(userId, id) {
      const index = comments.findIndex((item) => item.user_id === userId && item.id === id)
      if (index < 0) return false
      comments.splice(index, 1)
      return true
    },
  }
}
