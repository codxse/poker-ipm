import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest, response: NextResponse) {
  const accessToken = request.cookies.get('next-auth.session-token')!.value

  return new Response(JSON.stringify({ token: accessToken }))
}
