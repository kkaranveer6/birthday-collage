import { render, screen } from '@testing-library/react'
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
