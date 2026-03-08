// src/test/TimelineLine.test.jsx
import { render } from '@testing-library/react'
import TimelineLine from '../components/TimelineLine'

const makePositions = (n) =>
  Array.from({ length: n }, (_, i) => ({
    leftPct: i * 3,
    topPct: i * 4,
  }))

describe('TimelineLine', () => {
  it('renders an SVG element', () => {
    render(<TimelineLine positions={makePositions(3)} />)
    expect(document.querySelector('svg')).toBeTruthy()
  })

  it('renders a path whose d attribute starts with M', () => {
    render(<TimelineLine positions={makePositions(3)} />)
    const d = document.querySelector('path').getAttribute('d')
    expect(d).toMatch(/^M/)
  })

  it('has one Q segment per gap between positions', () => {
    render(<TimelineLine positions={makePositions(4)} />)
    const d = document.querySelector('path').getAttribute('d')
    const qCount = (d.match(/Q/g) || []).length
    expect(qCount).toBe(3) // 4 positions = 3 gaps
  })

  it('renders nothing when positions is empty', () => {
    render(<TimelineLine positions={[]} />)
    const d = document.querySelector('path')?.getAttribute('d') ?? ''
    expect(d).toBe('')
  })
})
