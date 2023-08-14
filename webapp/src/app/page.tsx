import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PokerCardsAnimation from '@components/poker-cards-animation'

export default async function Home() {
  return (
    <main className="px-8 md:px-16 mt-12 md:mt-20">
      <section className="flex flex-col-reverse md:flex-row gap-x-32 pb-8 md:pb-0">
        <div className="w-full md:w-3/5">
          <h1 className="text-4xl md:text-7xl font-bold text-black dark:text-white">
            <span className="text2xl md:text-5xl text-gray-600">
              Iteration Planning Meetings
            </span>
            <br /> Poker
          </h1>
          <p className="text-md md:text-lg mt-8 md:mt-16">
            In planning poker, members of the group make estimates{' '}
            <span className="text-black dark:text-white font-semibold">
              by playing numbered cards face-down
            </span>{' '}
            to the table, instead of speaking them aloud. The cards are
            revealed, and the{' '}
            <span className="text-black dark:text-white font-semibold">
              estimates are then discussed
            </span>{' '}
            [
            <Link
              className="hover:underline text-blue-500"
              href="https://en.wikipedia.org/wiki/Planning_poker"
              target="_blank"
              title="More detail from wikipedia"
            >
              wikipedia
            </Link>
            ].
          </p>

          <Link
            href="/rooms"
            className="w-full md:w-fit inline-flex items-center text-2xl md:text-4xl mt-8 md:mt-16 dark:text-white hover:text-black dark:hover:text-yellow-500 hover:border-black dark:hover:border-yellow-500 border-4 px-16 py-4 rounded-2xl"
          >
            Get started <ArrowRight className="ml-4" />
          </Link>
        </div>
        <PokerCardsAnimation />
      </section>
    </main>
  )
}
