# Timeline Line Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a hand-drawn SVG line that connects all 26 photos in chronological order and reveals itself as the user scrolls.

**Architecture:** A `TimelineLine` component renders an absolutely-positioned SVG overlay on the collage canvas. `Collage` computes photo positions once and passes them to both `CollagePhoto` (for layout) and `TimelineLine` (for the path). The path uses quadratic bezier curves with seeded-random control point offsets for a wobbly hand-drawn look. Scroll progress drives `stroke-dashoffset` to reveal the line.

**Tech Stack:** React, SVG, CSS, Vitest + @testing-library/react

---

### Task 1: Create `TimelineLine` component

**Files:**
- Create: `src/components/TimelineLine.jsx`
- Create: `src/components/TimelineLine.css`
- Test: `src/test/TimelineLine.test.jsx`

**Background:**
The SVG uses `viewBox="0 0 100 100"` with `preserveAspectRatio="none"` so positions map directly to percentages of the canvas. `vectorEffect="non-scaling-stroke"` keeps the stroke a fixed 3px regardless of the viewBox distortion. Each photo center is approximated as `(leftPct + 5.5, topPct + 6)` (half of ~11% wide card, ~12% tall card). Control points for bezier curves use seeds `1000 + i*2` and `1001 + i*2` to avoid colliding with photo position seeds.

In jsdom (tests), `getTotalLength` doesn't exist on SVG path elements — the `useEffect` guards against this with a `typeof` check and exits early. Tests can still verify path structure via the `d` attribute.

**Step 1: Write the failing test**

```jsx
// src/test/TimelineLine.test.jsx
import { render } from '@testing-library/react'
import TimelineLine from '../components/TimelineLine'

const makePositions = (n) =>
  Array.from({ length: n }, (_, i) => ({
    leftPct: i * 3,
    topPct: i * 4,
  }))

describe('TimelineLine', () => {
  it('renders an SVG element', () => {
    render(<TimelineLine positions={makePositions(3)} />)
    expect(document.querySelector('svg')).toBeTruthy()
  })

  it('renders a path whose d attribute starts with M', () => {
    render(<TimelineLine positions={makePositions(3)} />)
    const d = document.querySelector('path').getAttribute('d')
    expect(d).toMatch(/^M/)
  })

  it('has one Q segment per gap between positions', () => {
    render(<TimelineLine positions={makePositions(4)} />)
    const d = document.querySelector('path').getAttribute('d')
    const qCount = (d.match(/Q/g) || []).length
    expect(qCount).toBe(3) // 4 positions = 3 gaps
  })

  it('renders nothing when positions is empty', () => {
    render(<TimelineLine positions={[]} />)
    const d = document.querySelector('path')?.getAttribute('d') ?? ''
    expect(d).toBe('')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
cd /home/karanveer/Documents/birthday-collage && npx vitest run src/test/TimelineLine.test.jsx
```
Expected: FAIL — `TimelineLine` module not found

**Step 3: Create `TimelineLine.jsx`**

```jsx
// src/components/TimelineLine.jsx
import { useEffect, useRef } from 'react'
import './TimelineLine.css'

function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

function buildPath(positions) {
  if (positions.length === 0) return ''
  // Approximate photo center: card is ~11% wide, ~12% tall in viewBox units
  const pts = positions.map((p) => ({ x: p.leftPct + 5.5, y: p.topPct + 6 }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    // Midpoint control point with seeded wobble
    const mx = (pts[i - 1].x + pts[i].x) / 2 + seededRand(1000 + i * 2, -4, 4)
    const my = (pts[i - 1].y + pts[i].y) / 2 + seededRand(1001 + i * 2, -4, 4)
    d += ` Q ${mx} ${my} ${pts[i].x} ${pts[i].y}`
  }
  return d
}

export default function TimelineLine({ positions }) {
  const pathRef = useRef()

  useEffect(() => {
    const path = pathRef.current
    if (!path || typeof path.getTotalLength !== 'function') return

    const totalLength = path.getTotalLength()
    path.style.strokeDasharray = totalLength
    path.style.strokeDashoffset = totalLength

    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      path.style.strokeDashoffset = totalLength * (1 - progress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const d = buildPath(positions)

  return (
    <svg
      className="timeline-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d={d}
        className="timeline-path"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
```

**Step 4: Create `TimelineLine.css`**

```css
/* src/components/TimelineLine.css */
.timeline-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.timeline-path {
  fill: none;
  stroke: #c0392b;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

**Step 5: Run test to verify it passes**

```bash
cd /home/karanveer/Documents/birthday-collage && npx vitest run src/test/TimelineLine.test.jsx
```
Expected: PASS (4 tests)

**Step 6: Commit**

```bash
git add src/components/TimelineLine.jsx src/components/TimelineLine.css src/test/TimelineLine.test.jsx
git commit -m "feat: add TimelineLine SVG component with scroll-driven reveal"
```

---

### Task 2: Update `Collage` to compute positions once and wire in `TimelineLine`

**Files:**
- Modify: `src/components/Collage.jsx`

**Background:**
Currently `Collage` computes `left`, `top`, `rot` inline inside `.map()`. Refactor to compute a `positions` array at module level (outside the component) so the same values are used for both photo layout and the timeline path. Then render `<TimelineLine positions={positions} />` inside `.collage-canvas` before the photos.

**Step 1: Verify existing Collage tests still pass before changing anything**

```bash
cd /home/karanveer/Documents/birthday-collage && npx vitest run src/test/Collage.test.jsx
```
Expected: 3/3 PASS

**Step 2: Replace `src/components/Collage.jsx` with:**

```jsx
// src/components/Collage.jsx
import { useState } from 'react'
import pages from '../data/pages.json'
import CollagePhoto from './CollagePhoto'
import PhotoModal from './PhotoModal'
import TimelineLine from './TimelineLine'
import './Collage.css'

function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

const positions = pages.map((page, i) => ({
  filename: page.images[0],
  leftPct: seededRand(i * 3,     4, 80),
  topPct:  seededRand(i * 3 + 1, 2, 95),
  rot:     seededRand(i * 3 + 2, -15, 15),
}))

export default function Collage() {
  const [modal, setModal] = useState(null)

  return (
    <div className="collage-canvas">
      <TimelineLine positions={positions} />
      {positions.map(({ filename, leftPct, topPct, rot }) => (
        <CollagePhoto
          key={filename}
          filename={filename}
          style={{
            left: `${leftPct}%`,
            top:  `${topPct}%`,
            transform: `rotate(${rot}deg)`,
          }}
          onClick={(f) => setModal({ filename: f })}
        />
      ))}
      {modal && (
        <PhotoModal
          filename={modal.filename}
          caption=""
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
```

**Step 3: Run all tests**

```bash
cd /home/karanveer/Documents/birthday-collage && npx vitest run
```
Expected: all pass — Collage (3), CollagePhoto (2), TimelineLine (4)

**Step 4: Commit**

```bash
git add src/components/Collage.jsx
git commit -m "feat: wire TimelineLine into Collage with shared photo positions"
```

---

### Task 3: Browser smoke test

**Step 1: Start dev server**

```bash
cd /home/karanveer/Documents/birthday-collage && npm run dev
```

**Step 2: Open browser and verify**
- A red line is visible at the start of the canvas (the portion revealed at scroll position 0)
- Scrolling down reveals more of the line progressively
- The line is wobbly/hand-drawn looking (not perfectly straight)
- The line passes near each photo in order
- Line does not block clicking photos (pointer-events: none)
- Existing modal still works

**Step 3: If line isn't visible, check:**
- DevTools: confirm `.timeline-svg` has `position: absolute`, covers full canvas
- Confirm `.timeline-path` has `stroke: #c0392b` and `stroke-width: 3`
- Confirm `stroke-dashoffset` is being updated on scroll (inspect in DevTools)
