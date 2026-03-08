# Collage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 3D flip-book with a single scrollable canvas of 26 scattered polaroid photos.

**Architecture:** A `Collage` component renders all 26 photos as absolutely-positioned `CollagePhoto` cards on a large canvas. Positions and rotations are deterministic (seeded by photo index). Clicking any photo opens the existing `PhotoModal`.

**Tech Stack:** React, CSS (no new deps), Vite, Vitest + Testing Library

---

### Task 1: Create `CollagePhoto` component

**Files:**
- Create: `src/components/CollagePhoto.jsx`
- Create: `src/components/CollagePhoto.css`
- Test: `src/test/CollagePhoto.test.jsx`

**Step 1: Write the failing test**

```jsx
// src/test/CollagePhoto.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import CollagePhoto from '../components/CollagePhoto'

describe('CollagePhoto', () => {
  const defaultProps = {
    filename: '01.jpg',
    style: { left: '100px', top: '200px', transform: 'rotate(5deg)' },
    onClick: vi.fn(),
  }

  it('renders an img with the correct src', () => {
    render(<CollagePhoto {...defaultProps} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/01.jpg')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<CollagePhoto {...defaultProps} onClick={onClick} />)
    fireEvent.click(screen.getByRole('img').closest('.collage-photo'))
    expect(onClick).toHaveBeenCalledWith('01.jpg')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/test/CollagePhoto.test.jsx
```
Expected: FAIL — `CollagePhoto` module not found

**Step 3: Create `CollagePhoto.jsx`**

```jsx
// src/components/CollagePhoto.jsx
import './CollagePhoto.css'

export default function CollagePhoto({ filename, style, onClick }) {
  return (
    <div
      className="collage-photo"
      style={style}
      onClick={() => onClick(filename)}
    >
      <img src={`/images/${filename}`} alt="" className="collage-photo__img" />
    </div>
  )
}
```

**Step 4: Create `CollagePhoto.css`**

```css
/* src/components/CollagePhoto.css */
.collage-photo {
  position: absolute;
  background: #fff;
  padding: 10px 10px 36px;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  z-index: 1;
}

.collage-photo:hover {
  transform: scale(1.06) !important;
  box-shadow: 4px 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.collage-photo__img {
  display: block;
  width: 200px;
  height: 200px;
  object-fit: cover;
}
```

**Step 5: Run test to verify it passes**

```bash
npx vitest run src/test/CollagePhoto.test.jsx
```
Expected: PASS (2 tests)

**Step 6: Commit**

```bash
git add src/components/CollagePhoto.jsx src/components/CollagePhoto.css src/test/CollagePhoto.test.jsx
git commit -m "feat: add CollagePhoto polaroid component"
```

---

### Task 2: Create `Collage` component

**Files:**
- Create: `src/components/Collage.jsx`
- Create: `src/components/Collage.css`
- Test: `src/test/Collage.test.jsx`
- Read: `src/data/pages.json` (26 entries, each has `images[0]`)

**Step 1: Write the failing test**

```jsx
// src/test/Collage.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Collage from '../components/Collage'

describe('Collage', () => {
  it('renders all 26 photos', () => {
    render(<Collage />)
    expect(screen.getAllByRole('img').length).toBe(26)
  })

  it('opens modal when a photo is clicked', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    // modal overlay appears
    expect(document.querySelector('.modal-overlay')).toBeTruthy()
  })

  it('closes modal on overlay click', () => {
    render(<Collage />)
    fireEvent.click(screen.getAllByRole('img')[0].closest('.collage-photo'))
    fireEvent.click(document.querySelector('.modal-overlay'))
    expect(document.querySelector('.modal-overlay')).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run src/test/Collage.test.jsx
```
Expected: FAIL — `Collage` module not found

**Step 3: Create `Collage.jsx`**

```jsx
// src/components/Collage.jsx
import { useState } from 'react'
import pages from '../data/pages.json'
import CollagePhoto from './CollagePhoto'
import PhotoModal from './PhotoModal'
import './Collage.css'

// Deterministic pseudo-random based on index
function seededRand(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  return min + (x - Math.floor(x)) * (max - min)
}

export default function Collage() {
  const [modal, setModal] = useState(null) // { filename }

  return (
    <div className="collage-canvas">
      {pages.map((page, i) => {
        const filename = page.images[0]
        const left = seededRand(i * 3,     4, 80)   // % of canvas width
        const top  = seededRand(i * 3 + 1, 2, 95)   // % of canvas height
        const rot  = seededRand(i * 3 + 2, -15, 15) // degrees

        return (
          <CollagePhoto
            key={filename}
            filename={filename}
            style={{
              left: `${left}%`,
              top:  `${top}%`,
              transform: `rotate(${rot}deg)`,
            }}
            onClick={(f) => setModal({ filename: f })}
          />
        )
      })}

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

**Step 4: Create `Collage.css`**

```css
/* src/components/Collage.css */
.collage-canvas {
  position: relative;
  width: 200vw;
  height: 400vh;
  /* warm linen background */
  background-color: #f5f0e8;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
}
```

**Step 5: Run test to verify it passes**

```bash
npx vitest run src/test/Collage.test.jsx
```
Expected: PASS (3 tests)

**Step 6: Commit**

```bash
git add src/components/Collage.jsx src/components/Collage.css src/test/Collage.test.jsx
git commit -m "feat: add Collage canvas component with scattered photos"
```

---

### Task 3: Wire up `App.jsx` and update `index.css`

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`

**Step 1: Update `App.jsx` to render `Collage`**

Replace entire file content:

```jsx
// src/App.jsx
import Collage from './components/Collage'

export default function App() {
  return <Collage />
}
```

**Step 2: Update `index.css`**

The body currently centers content for the book. For the collage we want a scrollable page.
Replace the `body` and `#root` rules:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #3a3a3a;
  font-family: 'Caveat', cursive;
  overflow-x: hidden;
}

#root {
  width: 100%;
}
```

**Step 3: Run all tests**

```bash
npx vitest run
```
Expected: all tests pass (old Book/Page/Cover tests may now fail — see Task 4)

**Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: wire Collage into App, update body styles"
```

---

### Task 4: Remove obsolete components and tests

**Files to delete:**
- `src/components/Book.jsx`
- `src/components/Book.css`
- `src/components/Page.jsx`
- `src/components/Page.css`
- `src/components/Cover.jsx`
- `src/components/Cover.css`
- `src/components/PhotoSlot.jsx`
- `src/components/PhotoSlot.css`
- `src/components/decorations/WashiTape.jsx`
- `src/components/decorations/WashiTape.css`
- `src/test/pages.test.js`
- `src/test/Page.test.jsx`
- `src/test/Cover.test.jsx`
- `src/test/PhotoSlot.test.jsx`
- `src/test/WashiTape.test.jsx`

**Step 1: Delete all obsolete files**

```bash
rm src/components/Book.jsx src/components/Book.css \
   src/components/Page.jsx src/components/Page.css \
   src/components/Cover.jsx src/components/Cover.css \
   src/components/PhotoSlot.jsx src/components/PhotoSlot.css \
   src/components/decorations/WashiTape.jsx src/components/decorations/WashiTape.css \
   src/test/pages.test.js src/test/Page.test.jsx src/test/Cover.test.jsx \
   src/test/PhotoSlot.test.jsx src/test/WashiTape.test.jsx
```

**Step 2: Run all tests to confirm clean**

```bash
npx vitest run
```
Expected: only `Collage.test.jsx`, `CollagePhoto.test.jsx`, and any remaining tests (like `PhotoModal`) pass — no failures

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove obsolete scrapbook components and tests"
```

---

### Task 5: Smoke-test in browser

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Open browser and verify**
- All 26 photos visible scattered on a warm linen canvas
- Photos slightly rotated
- Hovering a photo scales it up and brings it to front
- Clicking any photo opens the full-size modal
- Escape or overlay click closes modal
- Page scrollable horizontally and vertically

**Step 3: If anything looks off, fix styles in `Collage.css` or `CollagePhoto.css` and re-check**
