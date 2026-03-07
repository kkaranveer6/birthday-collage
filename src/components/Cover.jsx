import { forwardRef } from 'react'
import './Cover.css'

const Cover = forwardRef(({ type, title, subtitle }, ref) => {
  return (
    <div className={`cover cover-${type}`} ref={ref}>
      <div className="cover-inner">
        {type === 'front' && (
          <>
            <div className="cover-decoration-top" />
            <h1 className="cover-title">{title}</h1>
            {subtitle && <p className="cover-subtitle">{subtitle}</p>}
            <div className="cover-decoration-bottom" />
          </>
        )}
        {type === 'back' && (
          <p className="cover-back-text">Made with love ♥</p>
        )}
      </div>
    </div>
  )
})

Cover.displayName = 'Cover'
export default Cover
