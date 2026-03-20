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

  it('renders a bare M command with no Q segments for a single position', () => {
    render(<TimelineLine positions={makePositions(1)} />)
    const d = document.querySelector('path').getAttribute('d')
    expect(d).toMatch(/^M/)
    expect((d.match(/Q/g) || []).length).toBe(0)
  })

  it('uses photoOffsetX and photoOffsetY when building the path', () => {
    // With position at (0,0) and offsets (10, 12):
    //   photoCenter = { x: 10, y: 12 }
    //   startDot    = { x: 10, y: 4  }  (12 - 8)
    //   path starts: "M 10 4 ..."
    render(
      <TimelineLine
        positions={[{ leftPct: 0, topPct: 0 }]}
        photoOffsetX={10}
        photoOffsetY={12}
      />
    )
    const d = document.querySelector('path').getAttribute('d')
    expect(d).toMatch(/^M 10 4/)
  })
})
