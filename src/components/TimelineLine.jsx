// src/components/TimelineLine.jsx
import { useEffect, useRef } from 'react'
import './TimelineLine.css'

function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

function buildPath(positions) {
  if (positions.length === 0) return ''
  // Approximate photo center: card is ~11% wide, ~12% tall in viewBox units
  const pts = positions.map((p) => ({ x: p.leftPct + 5.5, y: p.topPct + 6 }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    // Midpoint control point with seeded wobble
    const mx = (pts[i - 1].x + pts[i].x) / 2 + seededRand(1000 + i * 2, -4, 4)
    const my = (pts[i - 1].y + pts[i].y) / 2 + seededRand(1001 + i * 2, -4, 4)
    d += ` Q ${mx} ${my} ${pts[i].x} ${pts[i].y}`
  }
  return d
}

export default function TimelineLine({ positions = [] }) {
  const pathRef = useRef()

  useEffect(() => {
    const path = pathRef.current
    if (!path || typeof path.getTotalLength !== 'function') return

    const totalLength = path.getTotalLength()
    path.style.strokeDasharray = totalLength
    path.style.strokeDashoffset = totalLength

    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      path.style.strokeDashoffset = totalLength * (1 - progress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [positions])

  const d = buildPath(positions)

  return (
    <svg
      className="timeline-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d={d}
        className="timeline-path"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
