import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Admin 경로 보호
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 로그인 페이지는 제외
    if (request.nextUrl.pathname === '/admin/login') {
      // 이미 로그인되어 있으면 대시보드로 리다이렉트
      if (user) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return response
    }

    // 로그인하지 않았으면 로그인 페이지로 리다이렉트
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

