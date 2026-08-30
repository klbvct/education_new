import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')
  const user = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASSWORD

  if (!user || !password) {
    return new NextResponse('Адмін-доступ не налаштовано (ADMIN_USER/ADMIN_PASSWORD)', {
      status: 500,
    })
  }

  if (auth) {
    const [scheme, encoded] = auth.split(' ')
    if (scheme === 'Basic' && encoded) {
      const [providedUser, providedPassword] = Buffer.from(encoded, 'base64')
        .toString('utf-8')
        .split(':')
      if (providedUser === user && providedPassword === password) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse('Потрібна авторизація', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
