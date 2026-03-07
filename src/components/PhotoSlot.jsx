import './PhotoSlot.css'

export default function PhotoSlot({ filename, caption, slotNumber, onPhotoClick }) {
  const handleClick = (e) => {
    if (!filename || !onPhotoClick) return
    e.stopPropagation()
    onPhotoClick(filename, caption)
  }

  // react-pageflip triggers on mousedown/pointerdown — stop those too
  const stopBubble = filename ? (e) => e.stopPropagation() : undefined

  return (
    <div className="photo-slot">
      <div
        className={`polaroid${filename ? ' polaroid--clickable' : ''}`}
        onClick={handleClick}
        onMouseDown={stopBubble}
        onPointerDown={stopBubble}
        onTouchStart={stopBubble}
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
