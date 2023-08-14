'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { SessionProvider, useSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Session } from 'next-auth'

const queryClient = new QueryClient()

interface WrapSessionProps {
  children: ReactNode
  skipLoading?: boolean
  skipAuth?: boolean
  session?: { user: User } | null
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
      className="px-8 md:px-16 mt-12 md:mt-20"
    >
      <h1>Loading...</h1>
    </main>
  )
}

function WrapSession({ skipLoading, skipAuth, children }: WrapSessionProps) {
  const { status } = useSession()

  if (status === SessionStatus.LOADING && !skipLoading) {
    return <Loading />
  }

  if (status === SessionStatus.UNAUTHENTICATED && !skipAuth) {
    return (
      <main
        data-testid="session/unauthenticated"
        className="px-8 md:px-16 mt-12 md:mt-20"
      >
        <h1 className="font-bold text-stale-900 dark:text-white">
          Unauthenticated
        </h1>
        <Link
          className="hover:text-yellow-600"
          href={'/login'}
          title="Login"
          shallow={true}
        >
          Please login here...
        </Link>
      </main>
    )
  }

  return <>{children}</>
}

export default function Provider(props: WrapSessionProps) {
  const session = props.session ? { ...props.session, expires: '' } : undefined
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <WrapSession skipAuth={props.skipAuth} skipLoading={props.skipLoading}>
          {props.children}
        </WrapSession>
      </SessionProvider>
    </QueryClientProvider>
  )
}
