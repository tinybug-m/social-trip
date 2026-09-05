import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClientServer } from '@/src/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(new URL('/', request.url))

  const supabase = createClientServer({
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle()

  if (!existingProfile) {
    const metadata = data.user.user_metadata
    const username =
      metadata?.username ||
      metadata?.full_name ||
      metadata?.name ||
      data.user.email?.split('@')[0] ||
      'user'

    await supabase.from('profiles').upsert({
      id: data.user.id,
      username,
      avatar_url: metadata?.avatar_url || metadata?.picture || null,
      updated_at: new Date().toISOString(),
    })
  }

  return response
}
