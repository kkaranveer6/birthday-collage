# Heart Burst Animation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When any clickable element in the collage is clicked (photo thumbnails, modal close ×, modal rotate ↻), a burst of 5 pink/red hearts explodes outward from the click point and fades out.

**Architecture:** `App.jsx` owns a `bursts` array and an `addBurst(e)` callback that reads viewport coordinates from the click event. `HeartBurst` components render with `position: fixed` at those coordinates and self-remove after 900ms. The `onBurst` callback is threaded from `App` → `Collage` → `CollagePhoto` and `Collage` → `PhotoModal`.

**Tech Stack:** React (useState, useEffect), CSS custom properties + keyframe animation, Vitest + @testing-library/react

**Spec:** `docs/superpowers/specs/2026-03-15-heart-burst-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/HeartBurst.jsx` | Create | Renders 5 animated hearts at a fixed viewport position, calls onDone after 900ms |
| `src/components/HeartBurst.css` | Create | `@keyframes heart-fly` animation, `.heart-burst__heart` styles |
| `src/test/HeartBurst.test.jsx` | Create | Unit tests for HeartBurst |
| `src/App.jsx` | Modify | Add burst state + addBurst/removeBurst handlers, render HeartBurst list |
| `src/components/Collage.jsx` | Modify | Accept and thread `onBurst` to CollagePhoto and PhotoModal |
| `src/components/CollagePhoto.jsx` | Modify | Accept `onBurst`, call it on click before existing onClick |
| `src/test/CollagePhoto.test.jsx` | Modify | Add test: onBurst called on click |
| `src/components/PhotoModal.jsx` | Modify | Accept `onBurst`, call it on close button and rotate button clicks |
| `src/test/PhotoModal.test.jsx` | Modify | Add tests: onBurst called on close/rotate, NOT on overlay |

---

## Chunk 1: HeartBurst component

### Task 1: Create HeartBurst tests, CSS, and component

**Files:**
- Create: `src/test/HeartBurst.test.jsx`
- Create: `src/components/HeartBurst.css`
- Create: `src/components/HeartBurst.jsx`

- [ ] **Step 1: Create the test file**

Create `src/test/HeartBurst.test.jsx` with this exact content:

```jsx
import { render, act } from '@testing-library/react'
import { vi } from 'vitest'
import HeartBurst from '../components/HeartBurst'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('renders 5 heart elements', () => {
  const { container } = render(
    <HeartBurst id="abc" x={100} y={200} onDone={() => {}} />
  )
  expect(container.querySelectorAll('.heart-burst__heart')).toHaveLength(5)
})

test('calls onDone with id after 900ms', () => {
  const onDone = vi.fn()
  render(<HeartBurst id="abc" x={100} y={200} onDone={onDone} />)
  act(() => vi.advanceTimersByTime(900))
  expect(onDone).toHaveBeenCalledOnce()
  expect(onDone).toHaveBeenCalledWith('abc')
})
```

- [ ] **Step 2: Run tests to confirm they FAIL**

```bash
npm test -- HeartBurst
```

Expected: FAIL — `Cannot find module '../components/HeartBurst'`

- [ ] **Step 3: Create HeartBurst.css**

Create `src/components/HeartBurst.css` with this exact content:

```css
@keyframes heart-fly {
  0%   { transform: rotate(var(--angle)) translateY(0)                       scale(0);   opacity: 1; }
  20%  { transform: rotate(var(--angle)) translateY(calc(-0.3 * var(--dist))) scale(1.2); opacity: 1; }
  100% { transform: rotate(var(--angle)) translateY(calc(-1   * var(--dist))) scale(0);   opacity: 0; }
}

.heart-burst__heart {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 1.4rem;
  line-height: 1;
  animation: heart-fly 0.9s ease-out forwards;
}
```

- [ ] **Step 4: Create HeartBurst.jsx**

Create `src/components/HeartBurst.jsx` with this exact content:

```jsx
import { useEffect } from 'react'
import './HeartBurst.css'

const EMOJIS = ['❤️', '🩷', '💗']
const ANGLES = [0, 72, 144, 216, 288]

export default function HeartBurst({ id, x, y, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), 900)
    return () => clearTimeout(timer)
  }, [id, onDone])

  return (
    <>
      {ANGLES.map((angle) => (
        <span
          key={angle}
          className="heart-burst__heart"
          style={{
            left: x,
            top: y,
            '--angle': `${angle}deg`,
            '--dist': `${Math.round(55 + Math.random() * 15)}px`,
          }}
        >
          {EMOJIS[Math.floor(Math.random() * EMOJIS.length)]}
        </span>
      ))}
    </>
  )
}
```

- [ ] **Step 5: Run tests to confirm they PASS**

```bash
npm test -- HeartBurst
```

Expected: 2 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/HeartBurst.jsx src/components/HeartBurst.css src/test/HeartBurst.test.jsx
git commit -m "feat: add HeartBurst component with burst animation"
```

---

## Chunk 2: Wire App.jsx and thread onBurst

> **Prerequisite:** Chunk 1 must be complete. `src/components/HeartBurst.jsx` and `src/components/HeartBurst.css` must exist before starting this chunk, as `App.jsx` imports `HeartBurst`.

### Task 2: Add burst state to App.jsx

**Files:**
- Modify: `src/App.jsx`

No new test needed — the existing integration tests (Collage.test.jsx) will catch regressions. App.jsx is thin orchestration.

- [ ] **Step 1: Rewrite App.jsx**

Replace the entire contents of `src/App.jsx` with:

```jsx
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
```

- [ ] **Step 2: Run all tests to confirm nothing broke**

```bash
npm test
```

Expected: all existing tests still PASS (Collage tests pass because `onBurst` is an optional prop — Collage doesn't use it yet)

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add burst state and HeartBurst rendering to App"
```

---

### Task 3: Thread onBurst through Collage → CollagePhoto (with tests)

**Files:**
- Modify: `src/components/CollagePhoto.jsx`
- Modify: `src/test/CollagePhoto.test.jsx`
- Modify: `src/components/Collage.jsx`

- [ ] **Step 1: Add failing test to CollagePhoto.test.jsx**

Read `src/test/CollagePhoto.test.jsx` first, then append this test to the file:

```jsx
test('calls onBurst with click event when photo is clicked', () => {
  const onBurst = vi.fn()
  render(
    <CollagePhoto
      filename="01.jpg"
      style={{}}
      onClick={() => {}}
      onBurst={onBurst}
    />
  )
  fireEvent.click(screen.getByRole('img').closest('.collage-photo'))
  expect(onBurst).toHaveBeenCalledOnce()
})
```

Also add `import { vi } from 'vitest'` and `import { fireEvent } from '@testing-library/react'` to the imports at the top if not already present. Check the existing imports before editing.

- [ ] **Step 2: Run CollagePhoto tests to confirm the new test FAILS**

```bash
npm test -- CollagePhoto
```

Expected: the new test FAILS — `onBurst` not called

- [ ] **Step 3: Update CollagePhoto.jsx**

Replace the entire contents of `src/components/CollagePhoto.jsx` with:

```jsx
import './CollagePhoto.css'

export default function CollagePhoto({ filename, style, onClick, onBurst }) {
  // Extract transform (rotation) from style and pass as CSS var so hover can compose
  const { transform, ...restStyle } = style || {}
  return (
    <div
      className="collage-photo"
      style={{ ...restStyle, '--rotation': transform || 'rotate(0deg)' }}
      onClick={(e) => { onBurst?.(e); onClick?.(filename) }}
    >
      <img src={`/images/edited/${filename}`} alt={filename} className="collage-photo__img" />
    </div>
  )
}
```

- [ ] **Step 4: Run CollagePhoto tests to confirm all PASS**

```bash
npm test -- CollagePhoto
```

Expected: all CollagePhoto tests PASS (existing tests still pass because `onBurst` is optional via `?.`)

- [ ] **Step 5: Thread onBurst through Collage.jsx to CollagePhoto**

Replace the entire contents of `src/components/Collage.jsx` with:

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

const COLS = 5
const ROWS = Math.ceil(pages.length / COLS)

const positions = pages.map((page, i) => {
  const row = Math.floor(i / COLS)
  const col = i % COLS
  // Serpentine: even rows go left-to-right, odd rows go right-to-left
  const effectiveCol = row % 2 === 0 ? col : (COLS - 1 - col)

  const xBase = 6 + effectiveCol * (76 / (COLS - 1))  // 6% – 82%
  const yBase = 8 + row * (74 / (ROWS - 1))            // 8% – 82%

  // Small jitter to preserve the scattered feel
  const xJitter = seededRand(2000 + i * 2,     -5, 5)
  const yJitter = seededRand(2001 + i * 2, -3, 3)

  return {
    filename: page.images[0],
    leftPct: xBase + xJitter,
    topPct:  yBase + yJitter,
    rot:     seededRand(i * 3 + 2, -15, 15),
  }
})

export default function Collage({ onBurst }) {
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

- [ ] **Step 6: Run all tests to confirm everything passes**

```bash
npm test
```

Expected: all tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/CollagePhoto.jsx src/test/CollagePhoto.test.jsx src/components/Collage.jsx
git commit -m "feat: thread onBurst through Collage and CollagePhoto"
```

---

### Task 4: Add onBurst to PhotoModal (with tests)

**Files:**
- Modify: `src/components/PhotoModal.jsx`
- Modify: `src/test/PhotoModal.test.jsx`

- [ ] **Step 1: Add failing tests to PhotoModal.test.jsx**

Read `src/test/PhotoModal.test.jsx` first to see what's already there, then append these three tests:

```jsx
test('calls onBurst when close button is clicked', () => {
  const onBurst = vi.fn()
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} onBurst={onBurst} />)
  fireEvent.click(screen.getByRole('button', { name: /close/i }))
  expect(onBurst).toHaveBeenCalledOnce()
})

test('calls onBurst when rotate button is clicked', () => {
  const onBurst = vi.fn()
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} onBurst={onBurst} />)
  fireEvent.click(screen.getByRole('button', { name: /rotate/i }))
  expect(onBurst).toHaveBeenCalledOnce()
})

test('does NOT call onBurst when overlay backdrop is clicked', () => {
  const onBurst = vi.fn()
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} onBurst={onBurst} />)
  fireEvent.click(document.querySelector('.modal-overlay'))
  expect(onBurst).not.toHaveBeenCalled()
})
```

Make sure `import { vi } from 'vitest'` and `import { fireEvent } from '@testing-library/react'` are present at the top. Check the existing imports before editing.

- [ ] **Step 2: Run PhotoModal tests to confirm the new tests FAIL**

```bash
npm test -- PhotoModal
```

Expected: the 3 new tests FAIL

- [ ] **Step 3: Update PhotoModal.jsx**

Replace the entire contents of `src/components/PhotoModal.jsx` with:

```jsx
import { useEffect, useState } from 'react'
import './PhotoModal.css'

export default function PhotoModal({ filename, caption, onClose, onBurst }) {
  const [showOriginal, setShowOriginal] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const imgSrc = showOriginal
    ? `/images/original/${filename}`
    : `/images/edited/${filename}`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-polaroid" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={(e) => { e.stopPropagation(); onBurst?.(e); onClose() }}
          aria-label="Close"
        >
          ×
        </button>
        <img src={imgSrc} alt={caption || 'photo'} className="modal-img" />
        {caption && <p className="modal-caption">{caption}</p>}
        <button
          className="modal-rotate"
          aria-label="Rotate to original"
          onClick={(e) => { e.stopPropagation(); onBurst?.(e); setShowOriginal(v => !v) }}
        >
          ↻
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run PhotoModal tests to confirm all PASS**

```bash
npm test -- PhotoModal
```

Expected: all PhotoModal tests PASS (6 total — 3 existing + 3 new)

- [ ] **Step 5: Run full test suite to confirm no regressions**

```bash
npm test
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/PhotoModal.jsx src/test/PhotoModal.test.jsx
git commit -m "feat: add onBurst to PhotoModal close and rotate buttons"
```

---

## Chunk 3: Final verification

### Task 5: Verify everything works end-to-end

- [ ] **Step 1: Run the full test suite one final time**

```bash
npm test
```

Expected: all test files pass, 0 failures.

If any test fails, read the error message carefully:
- A missing import → add it to the relevant test or component file
- A wrong selector → check `aria-label` values match what's in the component
- A timer issue → ensure `vi.useFakeTimers()` / `vi.useRealTimers()` are in `beforeEach`/`afterEach`

- [ ] **Step 2: Smoke test in the browser**

```bash
npm run dev
```

Open the app and verify:
- Clicking a polaroid thumbnail → hearts burst from the click point
- Clicking the close button (×) in the modal → hearts burst
- Clicking the rotate button (↻) in the modal → hearts burst
- Clicking the overlay backdrop → no hearts, modal closes
- Hearts are ❤️ 🩷 💗 colors, spread in 5 directions, fade out after ~900ms
