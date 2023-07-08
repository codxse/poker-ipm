import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { useSession, SessionProvider } from 'next-auth/react'
import Provider from '@components/provider'

jest.mock('next-auth/react')

function ComponentMock() {
  return (
    <Provider>
      <h1>I am logged in</h1>
    </Provider>
  )
}

describe('Provider', () => {
  describe('when session is loading', () => {
    it('should render loading component', () => {
      ;(useSession as jest.Mock).mockReturnValueOnce({ status: 'loading' })
      ;(SessionProvider as jest.Mock).mockImplementation((props) => (
        <>{props.children}</>
      ))

      render(<ComponentMock />)

      expect(screen.getByTestId('session/loading')).toBeInTheDocument()
    })
  })

  describe('when session does not authenticated', () => {
    it('should render not authenticated component', () => {
      ;(useSession as jest.Mock).mockReturnValueOnce({
        status: 'unauthenticated',
      })
      ;(SessionProvider as jest.Mock).mockImplementation((props) => (
        <>{props.children}</>
      ))

      render(<ComponentMock />)

      expect(screen.getByTestId('session/unauthenticated')).toBeInTheDocument()
      expect(screen.getByTitle(/login/i)).toBeInTheDocument()
      expect((screen.getByTitle(/login/i) as HTMLAnchorElement).href).toBe(
        'http://localhost/login',
      )
    })
  })

  describe('when session is exist', () => {
    it('should render child component', () => {
      ;(useSession as jest.Mock).mockReturnValueOnce({
        status: 'authenticated',
      })
      ;(SessionProvider as jest.Mock).mockImplementation((props) => (
        <>{props.children}</>
      ))

      render(<ComponentMock />)

      expect(screen.getByText('I am logged in')).toBeInTheDocument()
    })
  })
})

jest.clearAllMocks()
