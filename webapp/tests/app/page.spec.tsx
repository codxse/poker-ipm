import { render, screen } from '@testing-library/react'
import Home from '@app/page'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('renders homepage unchanged', () => {
    const { container } = render(<Home />)
    expect(container).toMatchSnapshot()
  })

  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /Hello world!/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
