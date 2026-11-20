const supabaseUrlKey = "NEXT_PUBLIC_SUPABASE_URL"
const supabaseKeyKey = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

// 用变量下标读取，避免 Next 在构建时把空值写进产物。
// 云托管的环境变量只在容器启动后注入。
export function getSupabasePublicEnv() {
  const url = process.env[supabaseUrlKey]
  const key = process.env[supabaseKeyKey]
  if (!url || !key) {
    throw new Error("缺少 Supabase 环境变量")
  }
  return { url, key }
}
