import { render, screen, fireEvent } from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'
import Collage from '../components/Collage'

// jsdom doesn't implement matchMedia — provide a minimal stub
function mockMatchMedia(matches) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

beforeEach(() => {
  mockMatchMedia(false) // desktop by default
})

describe('Collage', () => {
  it('renders all 35 photos', () => {
    render(<Collage />)
    expect(screen.getAllByRole('img').length).toBe(35)
  })

  it('opens modal when a photo is clicked', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    expect(document.querySelector('.modal-overlay')).toBeTruthy()
  })

  it('closes modal on overlay click', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    fireEvent.click(document.querySelector('.modal-overlay'))
    expect(document.querySelector('.modal-overlay')).toBeNull()
  })

  it('renders 35 photos on mobile layout with 2-column positions', () => {
    mockMatchMedia(true) // simulate mobile
    render(<Collage />)
    expect(screen.getAllByRole('img').length).toBe(35)
    // In the 2-column layout, max left position is ~62% (60% base + 2% jitter)
    // In the 5-column layout it goes to ~87% (82% base + 5% jitter)
    const photos = document.querySelectorAll('.collage-photo')
    const leftValues = [...photos].map(p => parseFloat(p.style.left))
    expect(Math.max(...leftValues)).toBeLessThan(65)
  })
})
