'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Room() {
  const { data: session, status } = useSession()

  // console.log({ session, status })

  return (
    <div>
      <h1>2 in 1</h1>
      <Link href={'/login'}>Login</Link>
    </div>
  )
}
