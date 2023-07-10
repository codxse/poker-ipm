import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest, response: NextResponse) {
  const accessToken = request.cookies.get('next-auth.session-token')!.value
  const body = await request.json()

  return fetch(`${process.env['NEXT_PUBLIC_API_ENDPOINT']}/api/rooms`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
