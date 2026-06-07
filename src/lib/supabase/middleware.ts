import { NextRequest, NextResponse } from 'next/server'
import { createClientServer } from '@/src/lib/supabase/server'

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next()

  const supabase = createClientServer({
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/login')

  if (user && isAuthPage) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (!user && !isAuthPage) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}
