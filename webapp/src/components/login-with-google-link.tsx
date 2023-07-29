'use client'

import { useSearchParams } from 'next/navigation'
import useAuth from '@lib/hook/use-auth'
import { signOut } from 'next-auth/react'
import { ReactNode } from 'react'

export default function LoginWithGoogleLink({
  session,
  ...props
}: {
  className?: string
  session?: { user?: User }
  children?: ReactNode
  signOutComponent?: (signOutFn) => any
}) {
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('access_token')

  useAuth({ accessToken })

  if (session?.user?.id) {
    if (props.signOutComponent) {
      return props.signOutComponent(signOut)
    }

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
      {props.children ? props.children : 'Login with Google'}
    </a>
  )
}
