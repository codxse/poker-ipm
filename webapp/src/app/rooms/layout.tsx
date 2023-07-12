import Provider from '@components/provider'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider>
      <h1>Rooms Main Layout</h1>
      {children}
    </Provider>
  )
}
