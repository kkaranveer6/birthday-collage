import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import BirthdayHero from '../components/BirthdayHero'

test('renders birthday greeting with name', () => {
  render(<BirthdayHero />)
  expect(screen.getByText(/Happy Birthday,/i)).toBeInTheDocument()
  expect(screen.getByText(/Dipu/i)).toBeInTheDocument()
})

test('renders scroll hint', () => {
  render(<BirthdayHero />)
  expect(screen.getByText(/scroll down/i)).toBeInTheDocument()
})

test('section has accessible label', () => {
  render(<BirthdayHero />)
  expect(screen.getByRole('region', { name: /birthday greeting/i })).toBeInTheDocument()
})

describe('scroll hint interaction', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    const target = document.createElement('div')
    target.id = 'collage'
    document.body.appendChild(target)
  })

  afterEach(() => {
    document.getElementById('collage')?.remove()
  })

  test('clicking scroll hint scrolls to collage', () => {
    render(<BirthdayHero />)
    fireEvent.click(screen.getByRole('button', { name: /scroll down/i }))
    expect(document.getElementById('collage').scrollIntoView)
      .toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})
