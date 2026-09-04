// Session token signing for the admin login. Uses the Web Crypto API
// (globalThis.crypto.subtle) rather than Node's `crypto` module because
// middleware.ts runs on the Edge runtime, where only Web Crypto is
// available.

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days, in seconds

function getSigningSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken(): Promise<string> {
  const secret = getSigningSecret()
  const expires = Date.now() + SESSION_MAX_AGE * 1000
  const payload = String(expires)
  const sig = await hmacHex(secret, payload)
  return `${payload}.${sig}`
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false
  const secret = getSigningSecret()
  if (!secret) return false

  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false

  const expected = await hmacHex(secret, payload)
  if (sig.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i)
  if (diff !== 0) return false

  const expires = Number(payload)
  if (!Number.isFinite(expires) || Date.now() > expires) return false
  return true
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USER ?? ''
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ''
  if (!expectedUser || !expectedPassword) return false
  return username === expectedUser && password === expectedPassword
}
