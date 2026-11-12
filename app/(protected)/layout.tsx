import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// The protected layout checks an authenticated, signature-verified JWT.
// Do NOT store sensitive content in /public or statically generated assets.
export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={null}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  )
}

async function AuthGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) redirect('/login')
  return children
}
