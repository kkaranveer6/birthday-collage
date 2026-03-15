import { useState } from 'react'
import Collage from './components/Collage'
import HeartBurst from './components/HeartBurst'

export default function App() {
  const [bursts, setBursts] = useState([])

  const addBurst = (e) =>
    setBursts((b) => [
      ...b,
      { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY },
    ])

  const removeBurst = (id) =>
    setBursts((b) => b.filter((burst) => burst.id !== id))

  return (
    <>
      <Collage onBurst={addBurst} />
      {bursts.map((b) => (
        <HeartBurst key={b.id} {...b} onDone={removeBurst} />
      ))}
    </>
  )
}
