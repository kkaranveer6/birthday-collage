import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Page from '../components/Page'

describe('Page', () => {
  const pageData = {
    layout: 'single',
    images: ['01.jpg'],
    captions: ['At the beach'],
  }

  it('renders without crashing', () => {
    const { container } = render(<Page pageData={pageData} startSlot={1} />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders correct number of PhotoSlots for single layout', () => {
    const { container } = render(<Page pageData={pageData} startSlot={1} />)
    expect(container.querySelectorAll('.photo-slot').length).toBe(1)
  })

  it('renders correct number of PhotoSlots for collage layout', () => {
    const collage = { layout: 'collage', images: ['02.jpg', '03.jpg'], captions: ['a', 'b'] }
    const { container } = render(<Page pageData={collage} startSlot={2} />)
    expect(container.querySelectorAll('.photo-slot').length).toBe(2)
  })

  it('renders correct number of PhotoSlots for triple layout', () => {
    const triple = { layout: 'triple', images: ['04.jpg','05.jpg','06.jpg'], captions: ['a','b','c'] }
    const { container } = render(<Page pageData={triple} startSlot={4} />)
    expect(container.querySelectorAll('.photo-slot').length).toBe(3)
  })
})
