import { useEffect, useRef } from 'react'
import './HeartBurst.css'

const EMOJIS = ['❤️', '🩷', '💗']
const ANGLES = [0, 72, 144, 216, 288]

export default function HeartBurst({ id, x, y, onDone }) {
  const hearts = useRef(
    ANGLES.map((angle) => ({
      angle,
      dist: `${Math.round(55 + Math.random() * 15)}px`,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }))
  )

  useEffect(() => {
    const timer = setTimeout(() => onDone(id), 900)
    return () => clearTimeout(timer)
  }, [id, onDone])

  return (
    <>
      {hearts.current.map(({ angle, dist, emoji }) => (
        <span
          key={angle}
          className="heart-burst__heart"
          style={{
            left: x,
            top: y,
            '--angle': `${angle}deg`,
            '--dist': dist,
          }}
        >
          {emoji}
        </span>
      ))}
    </>
  )
}
