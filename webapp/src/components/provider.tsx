'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { SessionProvider, useSession } from 'next-auth/react'

interface Props {
  children: ReactNode
}

enum SessionStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading',
}

function Loading() {
  return (
    <div data-testid="session/loading">
      <h1>Loading...</h1>
    </div>
  )
}

function WrapSession(props: Props) {
  const { status } = useSession()

  if (status === SessionStatus.LOADING) {
    return <Loading />
  }

  if (status === SessionStatus.UNAUTHENTICATED) {
    return (
      <div data-testid="session/unauthenticated">
        <h1>Please login</h1>
        <Link href={'/login'} title="Login">
          Login
        </Link>
      </div>
    )
  }

  return <>{props.children}</>
}

export default function Provider(props: Props) {
  return (
    <SessionProvider>
      <WrapSession>{props.children}</WrapSession>
    </SessionProvider>
  )
}
