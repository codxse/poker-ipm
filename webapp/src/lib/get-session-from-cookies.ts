import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export default function getSessionFromCookies(cookies: ReadonlyRequestCookies) {
  const cookie1 = cookies.get('__Secure-next-auth.session-token')?.value
  const cookie2 = cookies.get('next-auth.session-token')?.value

  return cookie1 || cookie2
}
