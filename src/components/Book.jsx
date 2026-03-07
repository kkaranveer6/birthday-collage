import HTMLFlipBook from 'react-pageflip'
import { forwardRef } from 'react'
import Cover from './Cover'
import Page from './Page'
import pages from '../data/pages.json'
import './Book.css'

// End papers flank the cover and back — needed so every spread has two pages
const EndPaper = forwardRef((props, ref) => (
  <div ref={ref} className="end-paper" />
))
EndPaper.displayName = 'EndPaper'

export default function Book() {
  let slot = 1
  const pageSlots = pages.map(page => {
    const start = slot
    slot += page.images.length
    return start
  })

  // Each page is half the spread; leave 48px for #root padding (24px each side)
  const pageWidth = Math.min(400, Math.floor((window.innerWidth - 48) / 2))
  const pageHeight = Math.floor(pageWidth * 1.375)

  return (
    <div className="book-container">
      <HTMLFlipBook
        width={pageWidth}
        height={pageHeight}
        size="fixed"
        minWidth={250}
        maxWidth={400}
        minHeight={340}
        maxHeight={550}
        mobileScrollSupport={true}
        className="book"
        flippingTime={800}
        useMouseEvents={true}
      >
        {/* End paper on left, Cover on right — opening spread */}
        <EndPaper />
        <Cover
          type="front"
          title="Happy Birthday!"
          subtitle="A little book of memories"
        />

        {pages.map((pageData, i) => (
          <Page key={i} pageData={pageData} startSlot={pageSlots[i]} />
        ))}

        {/* Back cover on left, end paper on right — closing spread */}
        <Cover type="back" title="" subtitle="" />
        <EndPaper />
      </HTMLFlipBook>

      <p className="book-hint">Click or drag the page edges to flip</p>
    </div>
  )
}
