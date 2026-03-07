import { useRef, useEffect } from 'react'
import './PhotoSlot.css'

export default function PhotoSlot({ filename, caption, slotNumber, onPhotoClick }) {
  const polaroidRef = useRef()

  // Attach NATIVE listeners — React synthetic stopPropagation fires after
  // page-flip's native listener already received the event. We must intercept
  // at the native level, before the event bubbles up to page-flip's distElement.
  useEffect(() => {
    const el = polaroidRef.current
    if (!el || !filename) return

    const stop = (e) => e.stopPropagation()
    el.addEventListener('mousedown', stop)
    el.addEventListener('touchstart', stop)

    return () => {
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('touchstart', stop)
    }
  }, [filename])

  const handleClick = () => {
    if (filename && onPhotoClick) onPhotoClick(filename, caption)
  }

  return (
    <div className="photo-slot">
      <div
        ref={polaroidRef}
        className={`polaroid${filename ? ' polaroid--clickable' : ''}`}
        onClick={handleClick}
      >
        {filename ? (
          <img src={`/images/${filename}`} alt={caption || ''} className="photo-img" />
        ) : (
          <div className="photo-placeholder">
            <span>{slotNumber}</span>
          </div>
        )}
      </div>
      {caption && <p className="photo-caption">{caption}</p>}
    </div>
  )
}
