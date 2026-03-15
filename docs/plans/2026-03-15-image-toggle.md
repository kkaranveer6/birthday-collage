# Image Edited/Original Toggle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a ↻ rotate button to the photo modal that toggles between `edited/` and `original/` versions of each image, showing edited by default.

**Architecture:** `PhotoModal` owns a `showOriginal` boolean state. The image src is derived from that state — `/images/edited/<filename>` or `/images/original/<filename>`. The collage grid is also updated to load from `edited/`. The button mirrors the close button's visual style, placed bottom-left.

**Tech Stack:** React (useState), CSS animations, Vite dev server

---

### Task 1: Update CollagePhoto to load from `edited/` subfolder

**Files:**
- Modify: `src/components/CollagePhoto.jsx`
- Modify: `src/test/CollagePhoto.test.jsx`

**Step 1: Read the existing test to understand its structure**

Open `src/test/CollagePhoto.test.jsx` and note how the image src is currently asserted.

**Step 2: Update the test to expect the new path**

In `src/test/CollagePhoto.test.jsx`, change the src assertion from `/images/01.jpg` to `/images/edited/01.jpg` (or whatever filename the test uses). The test should now fail.

**Step 3: Run the test to verify it fails**

```bash
npm test -- CollagePhoto
```
Expected: FAIL — src does not match `/images/edited/...`

**Step 4: Update CollagePhoto.jsx**

In `src/components/CollagePhoto.jsx`, change line 12:
```jsx
// Before
<img src={`/images/${filename}`} alt={filename} className="collage-photo__img" />

// After
<img src={`/images/edited/${filename}`} alt={filename} className="collage-photo__img" />
```

**Step 5: Run the test to verify it passes**

```bash
npm test -- CollagePhoto
```
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/CollagePhoto.jsx src/test/CollagePhoto.test.jsx
git commit -m "feat: load collage thumbnails from images/edited/ subfolder"
```

---

### Task 2: Add toggle state and rotate button to PhotoModal

**Files:**
- Modify: `src/components/PhotoModal.jsx`
- Modify: `src/test/` — check if a PhotoModal test exists; if not, create `src/test/PhotoModal.test.jsx`

**Step 1: Check for existing PhotoModal tests**

```bash
ls src/test/
```

If `PhotoModal.test.jsx` does not exist, create it. If it does, open it and understand what's already tested.

**Step 2: Write a failing test — modal shows edited image by default**

In `src/test/PhotoModal.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import PhotoModal from '../components/PhotoModal'

test('shows edited image by default', () => {
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} />)
  const img = screen.getByRole('img')
  expect(img.src).toContain('/images/edited/01.jpg')
})
```

**Step 3: Run test to verify it fails**

```bash
npm test -- PhotoModal
```
Expected: FAIL — src contains `/images/01.jpg` not `/images/edited/01.jpg`

**Step 4: Write a failing test — button click switches to original**

Add to `src/test/PhotoModal.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'

test('clicking rotate button shows original image', () => {
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} />)
  const btn = screen.getByRole('button', { name: /rotate/i })
  fireEvent.click(btn)
  const img = screen.getByRole('img')
  expect(img.src).toContain('/images/original/01.jpg')
})

test('clicking rotate button again returns to edited image', () => {
  render(<PhotoModal filename="01.jpg" caption="" onClose={() => {}} />)
  const btn = screen.getByRole('button', { name: /rotate/i })
  fireEvent.click(btn)
  fireEvent.click(btn)
  const img = screen.getByRole('img')
  expect(img.src).toContain('/images/edited/01.jpg')
})
```

**Step 5: Run tests to verify they fail**

```bash
npm test -- PhotoModal
```
Expected: FAIL — button not found

**Step 6: Update PhotoModal.jsx**

Replace `src/components/PhotoModal.jsx` with:
```jsx
import { useEffect, useState } from 'react'
import './PhotoModal.css'

export default function PhotoModal({ filename, caption, onClose }) {
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
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <img src={imgSrc} alt={caption || ''} className="modal-img" />
        {caption && <p className="modal-caption">{caption}</p>}
        <button
          className="modal-rotate"
          aria-label="Rotate to original"
          onClick={(e) => { e.stopPropagation(); setShowOriginal(v => !v) }}
        >
          ↻
        </button>
      </div>
    </div>
  )
}
```

**Step 7: Run tests to verify they pass**

```bash
npm test -- PhotoModal
```
Expected: all 3 PASS

**Step 8: Commit**

```bash
git add src/components/PhotoModal.jsx src/test/PhotoModal.test.jsx
git commit -m "feat: add rotate button to toggle between edited and original images"
```

---

### Task 3: Style the rotate button and add image fade transition

**Files:**
- Modify: `src/components/PhotoModal.css`

No tests needed for pure CSS.

**Step 1: Add styles to PhotoModal.css**

Append to `src/components/PhotoModal.css`:
```css
.modal-rotate {
  position: absolute;
  bottom: -14px;
  left: -14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #FEF6E4;
  color: #5a3e2b;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.modal-rotate:hover {
  transform: scale(1.15) rotate(30deg);
}

.modal-rotate:active {
  animation: rotate-spin 0.3s ease;
}

@keyframes rotate-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.modal-img {
  transition: opacity 0.15s ease;
}
```

Note: The `.modal-img` rule already exists in the file — merge the `transition` property into the existing rule rather than duplicating it.

**Step 2: Verify visually**

Run the dev server and open the modal. Confirm:
- ↻ button appears bottom-left of the polaroid frame
- Clicking it fades the image and swaps to the original
- Clicking again returns to edited
- Hover causes a slight clockwise nudge

```bash
npm run dev
```

**Step 3: Commit**

```bash
git add src/components/PhotoModal.css
git commit -m "feat: style rotate button and add image fade transition"
```

---

### Task 4: Verify all tests still pass

**Step 1: Run full test suite**

```bash
npm test
```
Expected: all tests PASS

**Step 2: If any tests fail**

Read the failure message carefully — it will usually be a path assertion that needs updating from `/images/` to `/images/edited/`.
