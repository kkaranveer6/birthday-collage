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

const positions = pages.map((page, i) => ({
  filename: page.images[0],
  leftPct: seededRand(i * 3,     4, 80),
  topPct:  seededRand(i * 3 + 1, 2, 95),
  rot:     seededRand(i * 3 + 2, -15, 15),
}))

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
