import { useEffect } from 'react'
import './HeartBurst.css'

const EMOJIS = ['❤️', '🩷', '💗']
const ANGLES = [0, 72, 144, 216, 288]

export default function HeartBurst({ id, x, y, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), 900)
    return () => clearTimeout(timer)
  }, [id, onDone])

  return (
    <>
      {ANGLES.map((angle) => (
        <span
          key={angle}
          className="heart-burst__heart"
          style={{
            left: x,
            top: y,
            '--angle': `${angle}deg`,
            '--dist': `${Math.round(55 + Math.random() * 15)}px`,
          }}
        >
          {EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}
        </span>
      ))}
    </>
  )
}
