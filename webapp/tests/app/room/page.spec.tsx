import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Room from '@app/rooms/page'

describe('Room', () => {
  it('should render data-testid=["room"]', () => {
    render(<Room />)

    expect(screen.getByTestId('room')).toBeInTheDocument()
    expect(screen.getByTitle(/create a room/i)).toBeInTheDocument()
    expect(
      (screen.getByTitle(/create a room/i) as HTMLAnchorElement).href,
    ).toBe('http://localhost/room/create')
  })
})
