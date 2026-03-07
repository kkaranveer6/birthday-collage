import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PhotoSlot from '../components/PhotoSlot'

describe('PhotoSlot', () => {
  it('renders an img when filename is provided', () => {
    render(<PhotoSlot filename="01.jpg" caption="Summer" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/images/01.jpg')
    expect(img).toHaveAttribute('alt', 'Summer')
  })

  it('renders placeholder when filename is null', () => {
    render(<PhotoSlot filename={null} caption="?" slotNumber={3} />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders caption text', () => {
    render(<PhotoSlot filename="01.jpg" caption="At the beach" />)
    expect(screen.getByText('At the beach')).toBeInTheDocument()
  })

  it('renders no caption element when caption is empty string', () => {
    const { container } = render(<PhotoSlot filename="01.jpg" caption="" />)
    expect(container.querySelector('.photo-caption')).toBeNull()
  })
})
