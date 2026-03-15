// src/components/Collage.jsx
import { useState } from 'react'
import pages from '../data/pages.json'
import CollagePhoto from './CollagePhoto'
import PhotoModal from './PhotoModal'
import TimelineLine from './TimelineLine'
import './Collage.css'

function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

const COLS = 5
const ROWS = Math.ceil(pages.length / COLS)

const positions = pages.map((page, i) => {
  const row = Math.floor(i / COLS)
  const col = i % COLS
  // Serpentine: even rows go left-to-right, odd rows go right-to-left
  const effectiveCol = row % 2 === 0 ? col : (COLS - 1 - col)

  const xBase = 6 + effectiveCol * (76 / (COLS - 1))  // 6% – 82%
  const yBase = 8 + row * (74 / (ROWS - 1))            // 8% – 82%

  // Small jitter to preserve the scattered feel
  const xJitter = seededRand(2000 + i * 2,     -5, 5)
  const yJitter = seededRand(2001 + i * 2, -3, 3)

  return {
    filename: page.images[0],
    leftPct: xBase + xJitter,
    topPct:  yBase + yJitter,
    rot:     seededRand(i * 3 + 2, -15, 15),
  }
})

export default function Collage({ onBurst }) {
  const [modal, setModal] = useState(null)

  return (
    <div className="collage-canvas">
      <TimelineLine positions={positions} />
      {positions.map(({ filename, leftPct, topPct, rot }) => (
        <CollagePhoto
          key={filename}
          filename={filename}
          style={{
            left: `${leftPct}%`,
            top:  `${topPct}%`,
            transform: `rotate(${rot}deg)`,
          }}
          onClick={(f) => setModal({ filename: f })}
          onBurst={onBurst}
        />
      ))}
      {modal && (
        <PhotoModal
          filename={modal.filename}
          caption=""
          onClose={() => setModal(null)}
          onBurst={onBurst}
        />
      )}
    </div>
  )
}
