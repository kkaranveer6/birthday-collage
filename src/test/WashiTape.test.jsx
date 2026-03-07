import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import WashiTape from '../components/decorations/WashiTape'

describe('WashiTape', () => {
  it('renders a div with washi-tape class', () => {
    const { container } = render(<WashiTape color="#f9c" angle={-15} top="10px" left="20px" />)
    expect(container.querySelector('.washi-tape')).toBeTruthy()
  })

  it('applies inline styles for positioning', () => {
    const { container } = render(<WashiTape color="#abc" angle={10} top="5px" left="30px" />)
    const el = container.querySelector('.washi-tape')
    expect(el.style.top).toBe('5px')
    expect(el.style.left).toBe('30px')
  })
})
