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

  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(id), 900)
    return () => clearTimeout(timer)
  }, [id])

  return (
    <>
      {hearts.current.map(({ angle, dist, emoji }) => (
        <span
          key={angle}
          className="heart-burst__heart"
          style={{
            left: `${x}px`,
            top: `${y}px`,
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
