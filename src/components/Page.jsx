import { forwardRef } from 'react'
import PhotoSlot from './PhotoSlot'
import './Page.css'

// Decoration sets — alternated by pageIndex for visual variety
const DECO_SETS = [
  ['🌸', '✨', '🌼', '💕', '⭐'],
  ['🌺', '💫', '🌸', '❤️', '✨'],
  ['🌼', '⭐', '🌹', '🌸', '💕'],
  ['✨', '🌺', '💫', '🌼', '❤️'],
]

const Page = forwardRef(({ pageData, startSlot, pageIndex = 0 }, ref) => {
  const { layout, images, captions } = pageData
  const decos = DECO_SETS[pageIndex % DECO_SETS.length]

  return (
    <div className={`page page-${layout}`} ref={ref} data-idx={pageIndex}>
      {/* Scattered page decorations */}
      <span className="pdeco pdeco-tl" aria-hidden="true">{decos[0]}</span>
      <span className="pdeco pdeco-tr" aria-hidden="true">{decos[1]}</span>
      <span className="pdeco pdeco-bl" aria-hidden="true">{decos[2]}</span>
      <span className="pdeco pdeco-br" aria-hidden="true">{decos[3]}</span>
      <span className="pdeco pdeco-mid" aria-hidden="true">{decos[4]}</span>

      <div className="page-inner">
        {images.map((filename, i) => (
          <PhotoSlot
            key={i}
            filename={filename || null}
            caption={captions[i]}
            slotNumber={startSlot + i}
          />
        ))}
      </div>
    </div>
  )
})

Page.displayName = 'Page'
export default Page
