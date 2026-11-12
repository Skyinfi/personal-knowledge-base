# Personal Knowledge Base

使用 Next.js 和 Supabase Auth 的私人知识库入口。目前包含登录、受保护的 `/kb` 占位页；笔记与学习面板导航尚未接入。

## 开发环境

- Node.js **22.13.0 或更新版本**（`@astryxdesign/cli` 的最低要求）。
- pnpm **10.33.0**；仓库使用 `pnpm-lock.yaml` 作为唯一依赖锁文件。
- 一个 Supabase 项目及可登录账号。

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
```

在 `.env.local` 中填写：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
# 目前留空；子路径配置仅供测试，尚未完成认证路径适配
NEXT_PUBLIC_BASE_PATH=
```

`NEXT_PUBLIC_` 变量会包含在浏览器代码中，**只填写项目 URL 和 publishable key**，不要填写 secret key 或 service-role key。`.env.local` 已被 Git 忽略。

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

## 自托管说明

`NEXT_PUBLIC_BASE_PATH` 为空时应用位于域名根路径。配置支持在构建时设置子路径（例如 `/private`），但**目前仅供测试，不应直接用于生产部署**：现有认证确认路由在部分情况下会跳转到不含前缀的 `/auth/error`，注册和密码重置链接也使用域名根路径。需要先在后续代码阶段适配并验证这些流程。该值编入构建产物，修改后需要重新构建；构建和运行时应使用相同配置。单独保管真实环境文件，不要提交到仓库。

生产部署时将 Next.js 服务监听在服务器本机地址，并使用 HTTPS 反向代理。Supabase 的 Site URL 和重定向白名单应按最终域名与实际启用的登录流程配置；尚未部署时不需要修改线上设置。

## 当前边界

- 登录后页面仍为占位页，未自动连接 Obsidian 或 `study`。
- Supabase 注册和访问授权策略需要结合项目后台设置单独确认；代码中仍保留原有注册入口和逻辑。
- `eslint.config.mjs` 对旧版主题切换组件保留了一项局部 lint 例外，后续可独立重构组件。
