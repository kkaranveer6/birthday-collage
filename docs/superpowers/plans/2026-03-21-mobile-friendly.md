# Mobile-Friendly Collage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the birthday collage usable on mobile by switching from a fixed 5-column layout to a 2-column layout at viewports ≤640px, preserving the scattered polaroid aesthetic.

**Architecture:** `TimelineLine` gains `photoOffsetX`/`photoOffsetY` props (replacing hardcoded values). `Collage` adds a `useIsMobile` hook, moves position computation inside the component, and passes mobile-aware offsets. CSS media queries handle photo sizing and scroll hint wrapping.

**Tech Stack:** React 19, Vitest, @testing-library/react, plain CSS

---

## File Map

| File | What changes |
|------|-------------|
| `src/components/TimelineLine.jsx` | Accept `photoOffsetX` (default 5.5) and `photoOffsetY` (default 6) props; replace hardcoded values |
| `src/components/Collage.jsx` | Add `useIsMobile` hook; move `positions` computation inside component; compute mobile (COLS=2) vs desktop (COLS=5) positions; pass `photoOffsetX`/`photoOffsetY` to `TimelineLine` |
| `src/components/CollagePhoto.css` | Add `@media (max-width: 640px)` block: `width`/`height` of `.collage-photo__img` → 120px |
| `src/components/BirthdayHero.css` | Add `@media (max-width: 640px)` block: `white-space: normal` and `text-align: center` on `.birthday-hero__scroll-hint` |
| `src/test/TimelineLine.test.jsx` | Add test: custom `photoOffsetX`/`photoOffsetY` props change the path |
| `src/test/Collage.test.jsx` | Add `matchMedia` mock; fix stale photo count (50 → 35); add smoke test for mobile layout |

---

## Task 1: TimelineLine — accept offset props

**Files:**
- Modify: `src/components/TimelineLine.jsx`
- Test: `src/test/TimelineLine.test.jsx`

- [ ] **Step 1.1: Write the failing test**

Add to `src/test/TimelineLine.test.jsx` below the existing tests:

```jsx
it('uses photoOffsetX and photoOffsetY when building the path', () => {
  // With position at (0,0) and offsets (10, 12):
  //   photoCenter = { x: 10, y: 12 }
  //   startDot    = { x: 10, y: 4  }  (12 - 8)
  //   path starts: "M 10 4 ..."
  render(
    <TimelineLine
      positions={[{ leftPct: 0, topPct: 0 }]}
      photoOffsetX={10}
      photoOffsetY={12}
    />
  )
  const d = document.querySelector('path').getAttribute('d')
  expect(d).toMatch(/^M 10 4/)
})
```

- [ ] **Step 1.2: Run the test — verify it fails**

```bash
cd /home/karanveer/Documents/birthday-collage
npm test -- TimelineLine
```

Expected: FAIL — the test will fail because the hardcoded `+5.5`/`+6` offsets produce `M 5.5 -8` not `M 10 4`.

- [ ] **Step 1.3: Update TimelineLine.jsx to accept and use offset props**

In `src/components/TimelineLine.jsx`, change the function signature and the `pts` mapping:

```jsx
// Before:
export default function TimelineLine({ positions = [] }) {

// After:
export default function TimelineLine({ positions = [], photoOffsetX = 5.5, photoOffsetY = 6 }) {
```

In `buildPath`, pass offsets as parameters:

```jsx
// Before:
function buildPath(start, positions, end) {
  // ...
  const pts = positions.map((p) => ({ x: p.leftPct + 5.5, y: p.topPct + 6 }))

// After:
function buildPath(start, positions, end, offsetX, offsetY) {
  // ...
  const pts = positions.map((p) => ({ x: p.leftPct + offsetX, y: p.topPct + offsetY }))
```

Update the two calls to `firstCenter`/`lastCenter` and the `buildPath` call in the component body:

```jsx
// Before:
const firstCenter = { x: positions[0].leftPct + 5.5,                  y: positions[0].topPct + 6 }
const lastCenter  = { x: positions[positions.length - 1].leftPct + 5.5, y: positions[positions.length - 1].topPct + 6 }
// ...
const d = buildPath(startDot, positions, pathEnd)

// After:
const firstCenter = { x: positions[0].leftPct + photoOffsetX,                  y: positions[0].topPct + photoOffsetY }
const lastCenter  = { x: positions[positions.length - 1].leftPct + photoOffsetX, y: positions[positions.length - 1].topPct + photoOffsetY }
// ...
const d = buildPath(startDot, positions, pathEnd, photoOffsetX, photoOffsetY)
```

- [ ] **Step 1.4: Run tests — verify all pass**

```bash
npm test -- TimelineLine
```

Expected: all 6 tests PASS.

- [ ] **Step 1.5: Commit**

```bash
git add src/components/TimelineLine.jsx src/test/TimelineLine.test.jsx
git commit -m "feat: accept photoOffsetX/Y props in TimelineLine"
```

---

## Task 2: Collage.jsx — useIsMobile hook + reactive positions

**Files:**
- Modify: `src/components/Collage.jsx`
- Test: `src/test/Collage.test.jsx`

- [ ] **Step 2.1: Fix Collage.test.jsx — add matchMedia mock and fix photo count**

Replace the entire content of `src/test/Collage.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'
import Collage from '../components/Collage'

// jsdom doesn't implement matchMedia — provide a minimal stub
function mockMatchMedia(matches) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

beforeEach(() => {
  mockMatchMedia(false) // desktop by default
})

describe('Collage', () => {
  it('renders all 35 photos', () => {
    render(<Collage />)
    expect(screen.getAllByRole('img').length).toBe(35)
  })

  it('opens modal when a photo is clicked', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    expect(document.querySelector('.modal-overlay')).toBeTruthy()
  })

  it('closes modal on overlay click', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    fireEvent.click(document.querySelector('.modal-overlay'))
    expect(document.querySelector('.modal-overlay')).toBeNull()
  })

  it('renders 35 photos on mobile layout', () => {
    mockMatchMedia(true) // simulate mobile
    render(<Collage />)
    expect(screen.getAllByRole('img').length).toBe(35)
  })
})
```

- [ ] **Step 2.2: Run tests — verify they fail due to missing matchMedia**

```bash
npm test -- Collage
```

Expected: FAIL — `window.matchMedia is not a function` (or similar) because `Collage.jsx` hasn't been updated yet, but the mock is now in place. The photo-count test (`50 photos`) may also fail.

Note: if the existing `Collage.jsx` doesn't call `matchMedia` yet, the tests may pass except for the count (`50 → 35`). That's fine — proceed to the implementation step.

- [ ] **Step 2.3: Update Collage.jsx**

Replace the content of `src/components/Collage.jsx` with:

```jsx
// src/components/Collage.jsx
import { useState, useEffect } from 'react'
import pages from '../data/pages.json'
import CollagePhoto from './CollagePhoto'
import PhotoModal from './PhotoModal'
import TimelineLine from './TimelineLine'
import './Collage.css'

function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

function computePositions(isMobile) {
  const COLS = isMobile ? 2 : 5
  const ROWS = Math.ceil(pages.length / COLS)
  const xSpread = isMobile ? 50 : 76 / (COLS - 1)
  const xBase0  = isMobile ? 10 : 6
  const xJitter = isMobile ? 2 : 5   // max % jitter on x-axis

  return pages.map((page, i) => {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    const effectiveCol = row % 2 === 0 ? col : (COLS - 1 - col)

    const xBase = xBase0 + effectiveCol * xSpread
    const yBase = 8 + row * (74 / (ROWS - 1))

    return {
      filename: page.images[0],
      leftPct: xBase + seededRand(2000 + i * 2, -xJitter, xJitter),
      topPct:  yBase + seededRand(2001 + i * 2, -3, 3),
      rot:     seededRand(i * 3 + 2, -15, 15),
    }
  })
}

export default function Collage({ onBurst }) {
  const [modal, setModal] = useState(null)
  const isMobile = useIsMobile()
  const positions = computePositions(isMobile)

  const photoOffsetX = isMobile
    ? 70 / window.innerWidth * 100
    : 5.5
  const photoOffsetY = 6

  return (
    <div id="collage" className="collage-canvas">
      <TimelineLine
        positions={positions}
        photoOffsetX={photoOffsetX}
        photoOffsetY={photoOffsetY}
      />
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
          onBurst={onBurst}
        />
      ))}
      {modal && (
        <PhotoModal
          filename={modal.filename}
          caption=""
          onClose={() => setModal(null)}
          onBurst={onBurst}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2.4: Run all tests — verify they pass**

```bash
npm test
```

Expected: all tests PASS. If any TimelineLine tests fail, check that the default prop values (5.5, 6) are in place.

- [ ] **Step 2.5: Commit**

```bash
git add src/components/Collage.jsx src/test/Collage.test.jsx
git commit -m "feat: responsive 2-column mobile layout with useIsMobile hook"
```

---

## Task 3: CSS — mobile photo size

**Files:**
- Modify: `src/components/CollagePhoto.css`

No test needed — CSS-only visual change verified manually.

- [ ] **Step 3.1: Add media query to CollagePhoto.css**

Append to `src/components/CollagePhoto.css`:

```css
@media (max-width: 640px) {
  .collage-photo__img {
    width: 120px;
    height: 120px;
  }
}
```

- [ ] **Step 3.2: Run tests to confirm nothing broke**

```bash
npm test
```

Expected: all tests PASS (CSS changes don't affect unit tests).

- [ ] **Step 3.3: Commit**

```bash
git add src/components/CollagePhoto.css
git commit -m "feat: scale collage photos to 120px on mobile"
```

---

## Task 4: CSS — scroll hint wrapping

**Files:**
- Modify: `src/components/BirthdayHero.css`

No test needed — CSS-only visual change verified manually.

- [ ] **Step 4.1: Add media query to BirthdayHero.css**

Append to `src/components/BirthdayHero.css`:

```css
@media (max-width: 640px) {
  .birthday-hero__scroll-hint {
    white-space: normal;
    text-align: center;
  }
}
```

- [ ] **Step 4.2: Run tests to confirm nothing broke**

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 4.3: Commit**

```bash
git add src/components/BirthdayHero.css
git commit -m "feat: allow scroll hint to wrap on mobile"
```

---

## Manual Verification Checklist

After all tasks complete, verify in a real browser using DevTools device emulation:

- [ ] At 375px (iPhone SE / standard mobile): photos are ~120px, no horizontal overflow, timeline thread connects photos
- [ ] At 320px (narrowest target): no horizontal overflow
- [ ] At 768px (iPad / above breakpoint): 5-column desktop layout, 200px photos
- [ ] Resize across 640px: layout switches cleanly without visual artifacts
- [ ] Scroll hint text wraps and centers on mobile
- [ ] Photo modal opens and closes correctly on mobile
