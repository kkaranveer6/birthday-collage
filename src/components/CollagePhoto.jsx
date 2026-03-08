import './CollagePhoto.css'

export default function CollagePhoto({ filename, style, onClick }) {
  return (
    <div
      className="collage-photo"
      style={style}
      onClick={() => onClick(filename)}
    >
      <img src={`/images/${filename}`} alt={filename} className="collage-photo__img" />
    </div>
  )
}
