'use client'

import Link from 'next/link'

export default function Room() {
  return (
    <div data-testid="room">
      <Link href="/room/create" title="create a room">
        Create a Room
      </Link>
      <form>
        <label htmlFor="room/id">Join a Room</label>
        <input type="number" id="room/id" name="room/id" />
        <input type="submit" value="join" />
      </form>
    </div>
  )
}
