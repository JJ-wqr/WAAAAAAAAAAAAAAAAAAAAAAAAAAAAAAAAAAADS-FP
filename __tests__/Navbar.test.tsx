import { render, screen } from '@testing-library/react'
import Navbar from '@/components/Navbar'

describe('Navbar Component', () => {
  it('renders the navbar correctly', () => {
    render(<Navbar />)
    // Adjust 'Linguiny' to whatever text is actually in your Navbar
    const brandName = screen.getByText(/Linguiny/i) 
    expect(brandName).toBeInTheDocument()
  })
})
