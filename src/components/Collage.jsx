import { useState } from 'react'
import pages from '../data/pages.json'
import CollagePhoto from './CollagePhoto'
import PhotoModal from './PhotoModal'
import './Collage.css'

// Deterministic pseudo-random based on index
function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

export default function Collage() {
  const [modal, setModal] = useState(null) // { filename }

  return (
    <div className="collage-canvas">
      {pages.map((page, i) => {
        const filename = page.images[0]
        const left = seededRand(i * 3,     4, 80)   // % of canvas width
        const top  = seededRand(i * 3 + 1, 2, 95)   // % of canvas height
        const rot  = seededRand(i * 3 + 2, -15, 15) // degrees

        return (
          <CollagePhoto
            key={filename}
            filename={filename}
            style={{
              left: `${left}%`,
              top:  `${top}%`,
              transform: `rotate(${rot}deg)`,
            }}
            onClick={(f) => setModal({ filename: f })}
          />
        )
      })}

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
