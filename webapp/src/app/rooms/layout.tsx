import Provider from '@components/provider'

export const metadata = {
  title: 'IPM poker - Join a room',
  description: 'A man`s got to play the hand',
}
export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <main className="px-4 md:px-16">{children}</main>
    </Provider>
  )
}
