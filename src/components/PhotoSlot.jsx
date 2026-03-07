import './PhotoSlot.css'

export default function PhotoSlot({ filename, caption, slotNumber }) {
  return (
    <div className="photo-slot">
      <div className="polaroid">
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
