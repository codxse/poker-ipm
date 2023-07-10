import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CreateRoom from '@app/rooms/create/page'

describe('CerateRoom', () => {
  it('should render', () => {
    render(<CreateRoom />)

    expect(screen.getByTestId('room/create')).toBeInTheDocument()
  })
})
