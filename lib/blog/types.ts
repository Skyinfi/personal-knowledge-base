export type Post = {
  id: string
  title: string
  body_md: string
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  post_id: string
  body: string
  created_at: string
}

export type FormState = { error: string | null }

export type RecordFail = {
  ok: false
  code: 'invalid' | 'not_found' | 'db'
  error: string
}

export type BlogDb = {
  listPosts(userId: string): Promise<Post[]>
  getPost(userId: string, id: string): Promise<Post | null>
  insertPost(userId: string, input: { title: string; body_md: string }): Promise<Post>
  updatePost(
    userId: string,
    id: string,
    input: { title: string; body_md: string },
  ): Promise<Post | null>
  deletePost(userId: string, id: string): Promise<boolean>
  listComments(userId: string, postId: string): Promise<Comment[]>
  insertComment(userId: string, input: { post_id: string; body: string }): Promise<Comment | null>
  deleteComment(userId: string, id: string): Promise<boolean>
}
