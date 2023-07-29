'use client'

import LoginWithGoogleLink from '@components/login-with-google-link'
import Image from 'next/image'

interface LoginWithGoogleCardProps {
  session?: { user?: User }
  className?: string
}

export default function LoginWithGoogleCard({
  session,
  className,
}: LoginWithGoogleCardProps) {
  return (
    <div className={className}>
      <LoginWithGoogleLink
        session={session}
        className="inline-block w-3/4"
        signOutComponent={(signOut) => (
          <button onClick={() => signOut()}>
            <span className="text-2xl bg-red-500 hover:bg-red-700 text-white rounded-md px-16 py-2 font-semibold">
              Sign out
            </span>
          </button>
        )}
      >
        <div className="flex items-center gap-4 hover:text-slate-600 bg-white px-4 py-2 border-2 hover:border-slate-600 border-slate-400 rounded-lg">
          <Image
            src="/assets/images/google.svg"
            width={30}
            height={30}
            alt="Google Icon"
          />
          <span className="font-semibold">Sign in with Google</span>
        </div>
      </LoginWithGoogleLink>
    </div>
  )
}
