'use client'

import { useSearchParams } from 'next/navigation'
import useAuth from '@lib/hook/use-auth'
import { signOut } from 'next-auth/react'

export default function LoginWithGoogleLink({
  session,
  ...props
}: {
  className?: string
  session?: { user?: User }
}) {
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('access_token')

  useAuth({ accessToken })

  if (session?.user?.id) {
    return (
      <a
        {...props}
        onClick={(e) => {
          e.preventDefault()
          signOut()
        }}
        title="Sign out"
      >
        Sign out
      </a>
    )
  }

  return (
    <a
      {...props}
      href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/google`}
      title="Login with Google"
    >
      Login with Google
    </a>
  )
}
