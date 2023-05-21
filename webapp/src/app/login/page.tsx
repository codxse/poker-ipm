'use client'

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

  useEffect(() => {
    if (accessToken && refreshToken) {
      signIn(
        'credentials',
        { redirect: false },
        {
          accessToken,
          refreshToken,
        },
      ).then((resp) => {
        // console.log({ resp })
      })
    }
  }, [accessToken, refreshToken])

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
