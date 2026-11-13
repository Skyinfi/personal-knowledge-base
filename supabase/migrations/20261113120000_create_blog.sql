create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body_md text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_title_len check (char_length(title) between 1 and 120),
  constraint posts_body_len check (char_length(body_md) <= 50000)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint comments_body_len check (char_length(body) between 1 and 2000)
);

create index posts_user_created_idx on public.posts (user_id, created_at desc);
create index comments_post_created_idx on public.comments (post_id, created_at asc);

revoke all on public.posts from anon, public;
revoke all on public.comments from anon, public;
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, delete on public.comments to authenticated;

alter table public.posts enable row level security;
alter table public.comments enable row level security;

create policy posts_select on public.posts
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy posts_insert on public.posts
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy posts_update on public.posts
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy posts_delete on public.posts
  for delete to authenticated
  using (user_id = (select auth.uid()));

create policy comments_select on public.comments
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy comments_insert on public.comments
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.posts
      where posts.id = comments.post_id
        and posts.user_id = (select auth.uid())
    )
  );

create policy comments_delete on public.comments
  for delete to authenticated
  using (user_id = (select auth.uid()));
