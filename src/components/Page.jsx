import { forwardRef } from 'react'
import PhotoSlot from './PhotoSlot'
import './Page.css'

const Page = forwardRef(({ pageData, startSlot }, ref) => {
  const { layout, images, captions } = pageData

  return (
    <div className={`page page-${layout}`} ref={ref}>
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
