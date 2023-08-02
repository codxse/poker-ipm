'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LoginWithGoogleLink from '@components/login-with-google-link'
import useSession from '@lib/hook/use-session'

function getLinkClassName(pathname: string, active: string) {
  if (active === pathname) {
    return 'dark:hover:text-white hover:text-black dark:text-white text-black cursor-pointer'
  }
  return 'dark:hover:text-white hover:text-black cursor-pointer'
}

export default function NavigationHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex md:gap-4 font-semibold">
      <Link
        href={'/rooms'}
        className={getLinkClassName(pathname, '/rooms')}
        title="Join a room"
      >
        Join a room
      </Link>
      <Link
        href={'/rooms/create'}
        className={getLinkClassName(pathname, '/rooms/create')}
        title="Create a room"
      >
        Create a room
      </Link>
      {session ? (
        <LoginWithGoogleLink
          className={getLinkClassName(pathname, '/login')}
          session={session}
          signOutComponent={undefined}
        />
      ) : (
        <Link
          href={'/login'}
          className={getLinkClassName(pathname, '/login')}
          title="Create a room"
        >
          Sign in
        </Link>
      )}

      <div className="divide-x" />
    </nav>
  )
}
