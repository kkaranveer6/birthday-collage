import { useEffect, useState } from 'react'
import './PhotoModal.css'

export default function PhotoModal({ filename, caption, onClose }) {
  const [showOriginal, setShowOriginal] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const imgSrc = showOriginal
    ? `/images/original/${filename}`
    : `/images/edited/${filename}`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-polaroid" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <img src={imgSrc} alt={caption || 'photo'} className="modal-img" />
        {caption && <p className="modal-caption">{caption}</p>}
        <button
          className="modal-rotate"
          aria-label="Rotate to original"
          onClick={(e) => { e.stopPropagation(); setShowOriginal(v => !v) }}
        >
          ↻
        </button>
      </div>
    </div>
  )
}
