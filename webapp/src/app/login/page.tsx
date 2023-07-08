'use client'

import useAuth from '@lib/hook/user-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface LoginSearchParams {
  access_token?: string
  refresh_token?: string
}

export default function App({ searchParams }) {
  const { access_token: accessToken } = searchParams as LoginSearchParams

  useAuth({ accessToken })

  return (
    <div>
      <Link href="/room">Room</Link>
      <br />
      <a href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/google`}>
        Login with Google
      </a>
      <br />
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
