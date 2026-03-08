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
const ROWS = Math.ceil(pages.length / COLS) // 6 rows for 26 photos

const positions = pages.map((page, i) => {
  const row = Math.floor(i / COLS)
  const col = i % COLS
  // Serpentine: even rows go left-to-right, odd rows go right-to-left
  const effectiveCol = row % 2 === 0 ? col : (COLS - 1 - col)

  const xBase = 3 + effectiveCol * (60 / (COLS - 1))  // 3% – 63%
  const yBase = 5 + row * (85 / (ROWS - 1))            // 5% – 90%

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

export default function Collage() {
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
        />
      ))}
      {modal && (
        <PhotoModal
          filename={modal.filename}
          caption=""
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
