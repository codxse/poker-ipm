import '../styles/global.css'
import Image from 'next/image'
import Link from 'next/link'
import Provider from '@components/provider'
import DarkModeSwitcher from '@components/dark-mode-switcher'
import NavigationHeader from '@components/navigation-header'
import authOptions from '@lib/auth-options'
import { getServerSession } from 'next-auth'

export const metadata = {
  title: 'IPM poker',
  description: 'A man`s got to play the hand',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session: { user: User } | null = await getServerSession(authOptions)

  return (
    <html lang="en" className="dark">
      <body className="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-open-sans h-screen flex flex-col">
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
          <Provider skipAuth={true} skipLoading={true} session={session}>
            <div className="flex items-center">
              <NavigationHeader />
              <DarkModeSwitcher className="flex gap-4 items-center border-l border-slate-200 ml-3 pl-6 dark:border-slate-800" />
            </div>
          </Provider>
        </header>
        {children}
      </body>
    </html>
  )
}
