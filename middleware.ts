import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 환경 변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    // 환경 변수가 없어도 일반 페이지는 접근 가능하도록
    if (!request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.next()
    }
    // Admin 페이지는 환경 변수가 필요하므로 500 에러 대신 로그인 페이지로
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
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
  } catch (error) {
    console.error('Middleware error:', error)
    // 에러 발생 시 일반 페이지는 통과, Admin 페이지는 로그인으로
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }
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

