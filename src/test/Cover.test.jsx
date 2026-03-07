import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Cover from '../components/Cover'

describe('Cover', () => {
  it('renders front cover with title', () => {
    render(<Cover type="front" title="Happy Birthday!" subtitle="A little book of memories" />)
    expect(screen.getByText('Happy Birthday!')).toBeInTheDocument()
    expect(screen.getByText('A little book of memories')).toBeInTheDocument()
  })

  it('renders back cover', () => {
    const { container } = render(<Cover type="back" title="The End" subtitle="" />)
    expect(container.querySelector('.cover-back')).toBeTruthy()
  })
})
