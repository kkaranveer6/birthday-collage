// src/components/TimelineLine.jsx
import './TimelineLine.css'

function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

function buildPath(start, positions, end) {
  if (positions.length === 0) return ''
  // Approximate photo center: card is ~11% wide, ~12% tall in viewBox units
  const pts = positions.map((p) => ({ x: p.leftPct + 5.5, y: p.topPct + 6 }))
  let d = `M ${start.x} ${start.y} L ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    // Midpoint control point with seeded wobble
    const mx = (pts[i - 1].x + pts[i].x) / 2 + seededRand(1000 + i * 2, -4, 4)
    const my = (pts[i - 1].y + pts[i].y) / 2 + seededRand(1001 + i * 2, -4, 4)
    d += ` Q ${mx} ${my} ${pts[i].x} ${pts[i].y}`
  }
  d += ` L ${end.x} ${end.y}`
  return d
}

export default function TimelineLine({ positions = [] }) {
  if (positions.length === 0) return null

  const firstCenter = { x: positions[0].leftPct + 5.5, y: positions[0].topPct + 6 }
  const lastCenter  = { x: positions[positions.length - 1].leftPct + 5.5, y: positions[positions.length - 1].topPct + 6 }
  // Start dot sits 8 viewBox units above the first photo center
  const startDot = { x: firstCenter.x, y: firstCenter.y - 8 }
  // End dot sits 8 viewBox units below the last photo center
  const endDot   = { x: lastCenter.x,  y: lastCenter.y  + 8 }

  // Ring radius is 9px in screen space; convert to viewBox y-units so the path stops at the ring edge
  // Canvas is 350vh tall, viewBox is 0-100, so 1 viewBox unit = 3.5vh = 3.5 * innerHeight px
  const ringRadiusVB = 9 / (3.5 * window.innerHeight / 100)
  const pathEnd = { x: endDot.x, y: endDot.y - ringRadiusVB }

  const d = buildPath(startDot, positions, pathEnd)

  return (
    <>
      <svg
        className="timeline-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={d}
          className="timeline-path"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        className="timeline-start-dot"
        style={{ left: `${startDot.x}%`, top: `${startDot.y}%` }}
      />
      <span
        className="timeline-start-label"
        style={{ left: `${startDot.x}%`, top: `${startDot.y}%` }}
      >
        2017
      </span>
      <div
        className="timeline-end-dot"
        style={{ left: `${endDot.x}%`, top: `${endDot.y}%` }}
      />
      <svg
        className="timeline-end-ring"
        style={{ left: `${endDot.x}%`, top: `${endDot.y}%` }}
        viewBox="0 0 30 30"
      >
        <circle cx="15" cy="15" r="9" vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        className="timeline-start-label"
        style={{ left: `${endDot.x}%`, top: `${endDot.y}%` }}
      >
        ∞
      </span>
    </>
  )
}
