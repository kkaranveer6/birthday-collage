// src/components/Collage.jsx
import { useState, useEffect } from 'react'
import pages from '../data/pages.json'
import CollagePhoto from './CollagePhoto'
import PhotoModal from './PhotoModal'
import TimelineLine from './TimelineLine'
import './Collage.css'

function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

function computePositions(isMobile) {
  const COLS = isMobile ? 2 : 5
  const ROWS = Math.ceil(pages.length / COLS)
  const xSpread = isMobile ? 50 : 76 / (COLS - 1)
  const xBase0  = isMobile ? 10 : 6
  const xJitter = isMobile ? 2 : 5   // max % jitter on x-axis

  return pages.map((page, i) => {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    const effectiveCol = row % 2 === 0 ? col : (COLS - 1 - col)

    const xBase = xBase0 + effectiveCol * xSpread
    const yBase = 8 + row * (74 / (ROWS - 1))

    return {
      filename: page.images[0],
      leftPct: xBase + seededRand(2000 + i * 2, -xJitter, xJitter),
      topPct:  yBase + seededRand(2001 + i * 2, -3, 3),
      rot:     seededRand(i * 3 + 2, -15, 15),
    }
  })
}

export default function Collage({ onBurst }) {
  const [modal, setModal] = useState(null)
  const isMobile = useIsMobile()
  const positions = computePositions(isMobile)

  const photoOffsetX = isMobile
    ? 70 / window.innerWidth * 100
    : 5.5
  const photoOffsetY = 6

  return (
    <div id="collage" className="collage-canvas">
      <TimelineLine
        positions={positions}
        photoOffsetX={photoOffsetX}
        photoOffsetY={photoOffsetY}
      />
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
