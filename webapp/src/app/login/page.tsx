import LoginWithGoogleCard from '@components/login-with-google-card'
import authOptions from '@lib/auth-options'
import { getServerSession } from 'next-auth'

export default async function LoginPage({ searchParams }) {
  const session = (await getServerSession(authOptions)) as
    | { user?: User }
    | undefined

  return (
    <main className="px-0 md:px-16 mt-12 md:mt-20 w-3/4 mx-auto">
      <section className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-5xl font-semibold text-stale-900 dark:text-white">
            <span className={session?.user ? 'line-through' : ''}>Sign in</span>{' '}
            to your account
          </h2>
          <p className="pt-4 md:pt-8 text-md">
            In planning poker, members of the group make estimates by playing
            numbered cards face-down to the table, instead of speaking them
            aloud.
          </p>
        </div>
        <LoginWithGoogleCard
          className="w-full md:w-1/2 bg-slate-400 dark:bg-slate-200 drop-shadow-2xl rounded-xl border-2 border-gray-500 dark:border-gray-300 h-40 md:h-80 flex flex-col items-center justify-center p-2 md:p-8 lg:p-16"
          session={session}
        />
      </section>
    </main>
  )
}
