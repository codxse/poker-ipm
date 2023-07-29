'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { SessionProvider, useSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

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
    <main
      data-testid="session/loading"
      className="px-4 md:px-16 mt-12 md:mt-20"
    >
      <h1>Loading...</h1>
    </main>
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
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <WrapSession>{props.children}</WrapSession>
      </SessionProvider>
    </QueryClientProvider>
  )
}
