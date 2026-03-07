import './WashiTape.css'

export default function WashiTape({ color = '#f9a8d4', angle = -15, top, left, right, width = '60px' }) {
  return (
    <div
      className="washi-tape"
      style={{
        background: color,
        transform: `rotate(${angle}deg)`,
        top,
        left,
        right,
        width,
      }}
    />
  )
}
