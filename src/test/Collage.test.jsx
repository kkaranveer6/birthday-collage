import { render, screen, fireEvent } from '@testing-library/react'
import Collage from '../components/Collage'

describe('Collage', () => {
  it('renders all 26 photos', () => {
    render(<Collage />)
    expect(screen.getAllByRole('img').length).toBe(26)
  })

  it('opens modal when a photo is clicked', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    // modal overlay appears
    expect(document.querySelector('.modal-overlay')).toBeTruthy()
  })

  it('closes modal on overlay click', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    fireEvent.click(document.querySelector('.modal-overlay'))
    expect(document.querySelector('.modal-overlay')).toBeNull()
  })
})
