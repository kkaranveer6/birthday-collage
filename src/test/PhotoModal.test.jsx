import { render, screen, fireEvent } from '@testing-library/react'
import PhotoModal from '../components/PhotoModal'

test('shows edited image by default', () => {
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} />)
  const img = screen.getByRole('img')
  expect(img.getAttribute('src')).toContain('/images/edited/01.jpg')
})

test('clicking rotate button shows original image', () => {
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} />)
  const btn = screen.getByRole('button', { name: /rotate/i })
  fireEvent.click(btn)
  const img = screen.getByRole('img')
  expect(img.getAttribute('src')).toContain('/images/original/01.jpg')
})

test('clicking rotate button again returns to edited image', () => {
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} />)
  const btn = screen.getByRole('button', { name: /rotate/i })
  fireEvent.click(btn)
  fireEvent.click(btn)
  const img = screen.getByRole('img')
  expect(img.getAttribute('src')).toContain('/images/edited/01.jpg')
})
