import '../styles/global.css'
import Image from 'next/image'
import Link from 'next/link'
import authOptions from '@lib/auth-options'
import { getServerSession } from 'next-auth'
import LoginWithGoogleLink from '@components/login-with-google-link'
import DarkModeSwitcher from '@components/dark-mode-switcher'

export const metadata = {
  title: 'IPM poker',
  description: 'A man`s got to play the hand',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = (await getServerSession(authOptions)) as
    | { user?: User }
    | undefined

  return (
    <html lang="en" className="dark">
      <body className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-open-sans">
        <header className="relative flex item-center p-4 md:px-16 md:py-8">
          <Link className="flex-1" href={'/'} title="Go to home page /">
            <Image
              className="dark:invert-0 invert hidden md:block"
              src={'/assets/images/logo.svg'}
              alt="ipm.poker"
              width={350 * 0.6}
              height={144 * 0.6}
            />
            <Image
              className="dark:invert-0 invert block md:hidden"
              src={'/assets/images/logo.svg'}
              alt="ipm.poker"
              width={350 * 0.4}
              height={144 * 0.4}
            />
          </Link>
          <div className="flex items-center">
            <nav className="hidden md:flex md:gap-4 font-semibold">
              <Link
                href={'/rooms'}
                className="dark:hover:text-white hover:text-black"
                title="Join a room"
              >
                Join a room
              </Link>
              <Link
                href={'/rooms/create'}
                className="dark:hover:text-white hover:text-black"
                title="Create a room"
              >
                Create a room
              </Link>
              <LoginWithGoogleLink
                className="dark:hover:text-white hover:text-black cursor-pointer"
                session={session}
              />
              <div className="divide-x" />
            </nav>
            <DarkModeSwitcher className="flex gap-4 items-center border-l border-slate-200 ml-3 pl-6 dark:border-slate-800" />
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
