import { useEffect } from 'react'
import './PhotoModal.css'

export default function PhotoModal({ filename, caption, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-polaroid" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <img src={`/images/${filename}`} alt={caption || ''} className="modal-img" />
        {caption && <p className="modal-caption">{caption}</p>}
      </div>
    </div>
  )
}
