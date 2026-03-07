import HTMLFlipBook from 'react-pageflip'
import { forwardRef, useRef } from 'react'
import Cover from './Cover'
import Page from './Page'
import pages from '../data/pages.json'
import './Book.css'

const EndPaper = forwardRef((props, ref) => (
  <div ref={ref} className="end-paper" />
))
EndPaper.displayName = 'EndPaper'

export default function Book() {
  const bookRef = useRef()

  let slot = 1
  const pageSlots = pages.map(page => {
    const start = slot
    slot += page.images.length
    return start
  })

  const pageWidth = Math.min(380, Math.floor((window.innerWidth - 80) / 2))
  const pageHeight = Math.floor(pageWidth * 1.38)

  const onPrev = () => bookRef.current?.pageFlip().flipPrev()
  const onNext = () => bookRef.current?.pageFlip().flipNext()

  return (
    <div className="scrapbook-scene">

      {/* Desk items — left side */}
      <span className="deco d-camera">📷</span>
      <span className="deco d-daisy">🌼</span>
      <span className="deco d-heart1">💕</span>
      <span className="deco d-flower1">🌸</span>
      <span className="deco d-letter">💌</span>

      {/* Desk items — right side */}
      <span className="deco d-pen">✒️</span>
      <span className="deco d-rose">🌹</span>
      <span className="deco d-heart2">🩷</span>
      <span className="deco d-sunflower">🌻</span>
      <span className="deco d-scroll">📜</span>

      {/* Desk items — top */}
      <span className="deco d-washi">🎀</span>
      <span className="deco d-star1">✨</span>
      <span className="deco d-star2">⭐</span>

      {/* Desk items — bottom */}
      <span className="deco d-flower2">🌺</span>
      <span className="deco d-heart3">❤️</span>
      <span className="deco d-sparkle">💫</span>

      <div className="book-stage">
        <HTMLFlipBook
          ref={bookRef}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          minWidth={200}
          maxWidth={380}
          minHeight={276}
          maxHeight={524}
          mobileScrollSupport={true}
          className="flip-book"
          flippingTime={900}
          useMouseEvents={true}
        >
          {/* End paper + front cover as opening spread */}
          <EndPaper />
          <Cover
            type="front"
            title="Happy Birthday!"
            subtitle="We've 26 adventures ✨"
          />

          {pages.map((pageData, i) => (
            <Page key={i} pageData={pageData} startSlot={pageSlots[i]} pageIndex={i} />
          ))}

          {/* Back cover + end paper as closing spread */}
          <Cover type="back" title="" subtitle="" />
          <EndPaper />
        </HTMLFlipBook>
      </div>

      <nav className="book-nav">
        <button className="nav-btn nav-prev" onClick={onPrev}>← Prev</button>
        <button className="nav-btn nav-next" onClick={onNext}>Next →</button>
      </nav>
    </div>
  )
}
