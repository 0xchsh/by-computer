import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Design Agent Platform')
  })

  it('renders call-to-action buttons', () => {
    render(<Home />)
    
    const signUpButton = screen.getByRole('link', { name: /start free trial/i })
    const signInButton = screen.getByRole('link', { name: /sign in/i })
    
    expect(signUpButton).toBeInTheDocument()
    expect(signInButton).toBeInTheDocument()
  })
})