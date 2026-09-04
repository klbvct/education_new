import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from './lib/session'

export async function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASSWORD

  if (!user || !password) {
    return new NextResponse('Адмін-доступ не налаштовано (ADMIN_USER/ADMIN_PASSWORD)', {
      status: 500,
    })
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const authed = await verifySessionToken(token)
  if (authed) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Потрібна авторизація' }, { status: 401 })
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
