import HTMLFlipBook from 'react-pageflip'
import Cover from './Cover'
import Page from './Page'
import pages from '../data/pages.json'
import './Book.css'

export default function Book() {
  let slot = 1
  const pageSlots = pages.map(page => {
    const start = slot
    slot += page.images.length
    return start
  })

  return (
    <div className="book-container">
      <HTMLFlipBook
        width={400}
        height={550}
        size="fixed"
        minWidth={300}
        maxWidth={600}
        minHeight={400}
        maxHeight={750}
        showCover={true}
        mobileScrollSupport={true}
        className="book"
        flippingTime={800}
        useMouseEvents={true}
      >
        <Cover
          type="front"
          title="Happy Birthday!"
          subtitle="A little book of memories"
        />

        {pages.map((pageData, i) => (
          <Page key={i} pageData={pageData} startSlot={pageSlots[i]} />
        ))}

        <Cover type="back" title="" subtitle="" />
      </HTMLFlipBook>

      <p className="book-hint">Click or drag the page edges to flip</p>
    </div>
  )
}
