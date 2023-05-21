'use client'

import useAuth from '@lib/hook/user-auth'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'

interface LoginSearchParams {
  access_token?: string
  refresh_token?: string
}

export default function App({ searchParams }) {
  const { access_token: accessToken, refresh_token: refreshToken } =
    searchParams as LoginSearchParams

  const response = useAuth({ accessToken })

  console.log(response)

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
