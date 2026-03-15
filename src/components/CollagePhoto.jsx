import './CollagePhoto.css'

export default function CollagePhoto({ filename, style, onClick }) {
  // Extract transform (rotation) from style and pass as CSS var so hover can compose
  const { transform, ...restStyle } = style || {}
  return (
    <div
      className="collage-photo"
      style={{ ...restStyle, '--rotation': transform || 'rotate(0deg)' }}
      onClick={() => onClick?.(filename)}
    >
      <img src={`/images/edited/${filename}`} alt={filename} className="collage-photo__img" />
    </div>
  )
}
