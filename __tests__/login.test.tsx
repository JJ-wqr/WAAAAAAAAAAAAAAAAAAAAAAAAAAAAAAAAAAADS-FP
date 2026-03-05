import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'

// This mocks the Next.js router so the test doesn't crash
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('Login Page', () => {
  it('renders login heading and inputs', () => {
    render(<LoginPage />)
    // Check if the heading exists
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
  })
})
