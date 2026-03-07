# Birthday Scrapebook Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 3D interactive birthday scrapebook with react-pageflip showing 26 images across playful, scrapbook-styled pages, deployable to AWS S3.

**Architecture:** Vite + React SPA — all config driven by `src/data/pages.json`, images served from `public/images/`. react-pageflip wraps page components that render one of three layout types (single, collage, triple). CSS-only decorations (washi tape, polaroid borders, paper texture).

**Tech Stack:** Vite, React 18, react-pageflip, Vitest, React Testing Library, Google Fonts (Caveat)

---

### Task 1: Scaffold Project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`

**Step 1: Initialize Vite project**

```bash
cd /home/karanveer/Documents/birthday-collage
npm create vite@latest . -- --template react
```

When prompted, confirm overwriting the directory (only `docs/` exists, it will be preserved).

**Step 2: Install dependencies**

```bash
npm install
npm install react-pageflip
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

**Step 3: Configure Vitest**

Add to `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

**Step 4: Create test setup file**

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom'
```

**Step 5: Add test script to package.json**

In `package.json`, ensure scripts include:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 6: Create image folder and placeholder image**

```bash
mkdir -p public/images
```

**Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server running at `http://localhost:5173`

**Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold vite react project with react-pageflip"
```

---

### Task 2: pages.json Data File

**Files:**
- Create: `src/data/pages.json`
- Create: `src/test/pages.test.js`

**Step 1: Write the failing test**

Create `src/test/pages.test.js`:

```js
import { describe, it, expect } from 'vitest'
import pages from '../data/pages.json'

describe('pages.json', () => {
  it('has exactly 26 image slots across all pages', () => {
    const total = pages.reduce((sum, page) => sum + page.images.length, 0)
    expect(total).toBe(26)
  })

  it('every page has a valid layout type', () => {
    const valid = ['single', 'collage', 'triple']
    pages.forEach((page, i) => {
      expect(valid, `page ${i} has invalid layout`).toContain(page.layout)
    })
  })

  it('every page has matching images and captions arrays', () => {
    pages.forEach((page, i) => {
      expect(page.images.length, `page ${i} captions length mismatch`).toBe(page.captions.length)
    })
  })

  it('single layout has exactly 1 image', () => {
    pages.filter(p => p.layout === 'single').forEach((page, i) => {
      expect(page.images.length, `single page ${i}`).toBe(1)
    })
  })

  it('collage layout has exactly 2 images', () => {
    pages.filter(p => p.layout === 'collage').forEach((page, i) => {
      expect(page.images.length, `collage page ${i}`).toBe(2)
    })
  })

  it('triple layout has exactly 3 images', () => {
    pages.filter(p => p.layout === 'triple').forEach((page, i) => {
      expect(page.images.length, `triple page ${i}`).toBe(3)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `pages.json` does not exist yet.

**Step 3: Create pages.json with 26 image slots**

Create `src/data/pages.json`. Use a mix of layouts totalling exactly 26 images. Example (adjust captions to suit the birthday person):

```json
[
  { "layout": "single",  "images": ["01.jpg"],                          "captions": [""] },
  { "layout": "collage", "images": ["02.jpg", "03.jpg"],                "captions": ["", ""] },
  { "layout": "triple",  "images": ["04.jpg", "05.jpg", "06.jpg"],      "captions": ["", "", ""] },
  { "layout": "single",  "images": ["07.jpg"],                          "captions": [""] },
  { "layout": "collage", "images": ["08.jpg", "09.jpg"],                "captions": ["", ""] },
  { "layout": "triple",  "images": ["10.jpg", "11.jpg", "12.jpg"],      "captions": ["", "", ""] },
  { "layout": "single",  "images": ["13.jpg"],                          "captions": [""] },
  { "layout": "collage", "images": ["14.jpg", "15.jpg"],                "captions": ["", ""] },
  { "layout": "triple",  "images": ["16.jpg", "17.jpg", "18.jpg"],      "captions": ["", "", ""] },
  { "layout": "single",  "images": ["19.jpg"],                          "captions": [""] },
  { "layout": "collage", "images": ["20.jpg", "21.jpg"],                "captions": ["", ""] },
  { "layout": "triple",  "images": ["22.jpg", "23.jpg", "24.jpg"],      "captions": ["", "", ""] },
  { "layout": "collage", "images": ["25.jpg", "26.jpg"],                "captions": ["", ""] }
]
```

Verify image count: 1+2+3+1+2+3+1+2+3+1+2+3+2 = 26. ✓

**Step 4: Run test to verify it passes**

```bash
npm test
```

Expected: PASS (6 tests)

**Step 5: Commit**

```bash
git add src/data/pages.json src/test/pages.test.js
git commit -m "feat: add pages.json config with 26 image slots"
```

---

### Task 3: PhotoSlot Component (image + placeholder)

**Files:**
- Create: `src/components/PhotoSlot.jsx`
- Create: `src/components/PhotoSlot.css`
- Create: `src/test/PhotoSlot.test.jsx`

**Step 1: Write the failing test**

Create `src/test/PhotoSlot.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PhotoSlot from '../components/PhotoSlot'

describe('PhotoSlot', () => {
  it('renders an img when filename is provided', () => {
    render(<PhotoSlot filename="01.jpg" caption="Summer" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/images/01.jpg')
    expect(img).toHaveAttribute('alt', 'Summer')
  })

  it('renders placeholder when filename is null', () => {
    render(<PhotoSlot filename={null} caption="?" slotNumber={3} />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders caption text', () => {
    render(<PhotoSlot filename="01.jpg" caption="At the beach" />)
    expect(screen.getByText('At the beach')).toBeInTheDocument()
  })

  it('renders no caption element when caption is empty string', () => {
    const { container } = render(<PhotoSlot filename="01.jpg" caption="" />)
    expect(container.querySelector('.photo-caption')).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `PhotoSlot` not found.

**Step 3: Implement PhotoSlot**

Create `src/components/PhotoSlot.jsx`:

```jsx
import './PhotoSlot.css'

export default function PhotoSlot({ filename, caption, slotNumber }) {
  return (
    <div className="photo-slot">
      <div className="polaroid">
        {filename ? (
          <img src={`/images/${filename}`} alt={caption || ''} className="photo-img" />
        ) : (
          <div className="photo-placeholder">
            <span>{slotNumber}</span>
          </div>
        )}
      </div>
      {caption && <p className="photo-caption">{caption}</p>}
    </div>
  )
}
```

**Step 4: Create PhotoSlot.css**

Create `src/components/PhotoSlot.css`:

```css
.photo-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.polaroid {
  background: #fff;
  padding: 8px 8px 28px 8px;
  box-shadow: 2px 4px 12px rgba(0,0,0,0.25);
  border: 1px solid #e8e0d0;
}

.photo-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0e6d3, #ddd0bb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #a89880;
  font-family: 'Caveat', cursive;
}

.photo-caption {
  font-family: 'Caveat', cursive;
  font-size: 1rem;
  color: #5a4a3a;
  text-align: center;
  margin: 0;
}
```

**Step 5: Run test to verify it passes**

```bash
npm test
```

Expected: PASS (4 tests)

**Step 6: Commit**

```bash
git add src/components/PhotoSlot.jsx src/components/PhotoSlot.css src/test/PhotoSlot.test.jsx
git commit -m "feat: add PhotoSlot with polaroid style and placeholder support"
```

---

### Task 4: Page Component (layout types)

**Files:**
- Create: `src/components/Page.jsx`
- Create: `src/components/Page.css`
- Create: `src/test/Page.test.jsx`

**Step 1: Write the failing test**

Create `src/test/Page.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { forwardRef } from 'react'
import Page from '../components/Page'

// react-pageflip requires forwarded refs on children; mock for tests
vi.mock('../components/Page', async () => {
  const actual = await vi.importActual('../components/Page')
  return actual
})

describe('Page', () => {
  const pageData = {
    layout: 'single',
    images: ['01.jpg'],
    captions: ['At the beach'],
  }

  it('renders without crashing', () => {
    const { container } = render(<Page pageData={pageData} startSlot={1} />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders correct number of PhotoSlots for single layout', () => {
    const { container } = render(<Page pageData={pageData} startSlot={1} />)
    expect(container.querySelectorAll('.photo-slot').length).toBe(1)
  })

  it('renders correct number of PhotoSlots for collage layout', () => {
    const collage = { layout: 'collage', images: ['02.jpg', '03.jpg'], captions: ['a', 'b'] }
    const { container } = render(<Page pageData={collage} startSlot={2} />)
    expect(container.querySelectorAll('.photo-slot').length).toBe(2)
  })

  it('renders correct number of PhotoSlots for triple layout', () => {
    const triple = { layout: 'triple', images: ['04.jpg','05.jpg','06.jpg'], captions: ['a','b','c'] }
    const { container } = render(<Page pageData={triple} startSlot={4} />)
    expect(container.querySelectorAll('.photo-slot').length).toBe(3)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Page` not found.

**Step 3: Implement Page**

Create `src/components/Page.jsx`:

```jsx
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
```

**Step 4: Create Page.css**

Create `src/components/Page.css`:

```css
.page {
  background-color: #fdf6ec;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.page-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  gap: 16px;
}

/* Single: large centered photo */
.page-single .page-inner {
  flex-direction: column;
}

.page-single .photo-slot {
  width: 80%;
  max-height: 80%;
}

.page-single .polaroid {
  width: 100%;
  aspect-ratio: 4/3;
}

.page-single .photo-img,
.page-single .photo-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
}

/* Collage: two side-by-side */
.page-collage .page-inner {
  flex-direction: row;
  align-items: center;
}

.page-collage .photo-slot {
  width: 45%;
}

.page-collage .polaroid {
  width: 100%;
  aspect-ratio: 3/4;
}

.page-collage .photo-img,
.page-collage .photo-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
}

/* Triple: one large top, two small bottom */
.page-triple .page-inner {
  flex-direction: column;
  gap: 12px;
}

.page-triple .photo-slot:first-child {
  width: 70%;
}

.page-triple .photo-slot:first-child .polaroid {
  width: 100%;
  aspect-ratio: 4/3;
}

.page-triple .photo-slot:first-child .photo-img,
.page-triple .photo-slot:first-child .photo-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
}

.page-triple .page-inner {
  flex-wrap: wrap;
  align-content: center;
}

.page-triple .photo-slot:not(:first-child) {
  width: 40%;
}

.page-triple .photo-slot:not(:first-child) .polaroid {
  width: 100%;
  aspect-ratio: 1/1;
}

.page-triple .photo-slot:not(:first-child) .photo-img,
.page-triple .photo-slot:not(:first-child) .photo-placeholder {
  width: 100%;
  aspect-ratio: 1/1;
}

/* Random slight rotation on polaroids for scrapbook feel */
.photo-slot:nth-child(odd) .polaroid  { transform: rotate(-1.5deg); }
.photo-slot:nth-child(even) .polaroid { transform: rotate(1.2deg); }
```

**Step 5: Run test to verify it passes**

```bash
npm test
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Page.jsx src/components/Page.css src/test/Page.test.jsx
git commit -m "feat: add Page component with single/collage/triple layouts"
```

---

### Task 5: WashiTape Decoration Component

**Files:**
- Create: `src/components/decorations/WashiTape.jsx`
- Create: `src/components/decorations/WashiTape.css`
- Create: `src/test/WashiTape.test.jsx`

**Step 1: Write the failing test**

Create `src/test/WashiTape.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import WashiTape from '../components/decorations/WashiTape'

describe('WashiTape', () => {
  it('renders a div with washi-tape class', () => {
    const { container } = render(<WashiTape color="#f9c" angle={-15} top="10px" left="20px" />)
    expect(container.querySelector('.washi-tape')).toBeTruthy()
  })

  it('applies inline styles for positioning', () => {
    const { container } = render(<WashiTape color="#abc" angle={10} top="5px" left="30px" />)
    const el = container.querySelector('.washi-tape')
    expect(el.style.top).toBe('5px')
    expect(el.style.left).toBe('30px')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL

**Step 3: Implement WashiTape**

Create `src/components/decorations/WashiTape.jsx`:

```jsx
import './WashiTape.css'

export default function WashiTape({ color = '#f9a8d4', angle = -15, top, left, right, width = '60px' }) {
  return (
    <div
      className="washi-tape"
      style={{
        background: color,
        transform: `rotate(${angle}deg)`,
        top,
        left,
        right,
        width,
      }}
    />
  )
}
```

Create `src/components/decorations/WashiTape.css`:

```css
.washi-tape {
  position: absolute;
  height: 18px;
  opacity: 0.7;
  border-top: 1px dashed rgba(255,255,255,0.4);
  border-bottom: 1px dashed rgba(255,255,255,0.4);
  z-index: 10;
  pointer-events: none;
}
```

**Step 4: Run test to verify it passes**

```bash
npm test
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/decorations/WashiTape.jsx src/components/decorations/WashiTape.css src/test/WashiTape.test.jsx
git commit -m "feat: add WashiTape decoration component"
```

---

### Task 6: Cover Component

**Files:**
- Create: `src/components/Cover.jsx`
- Create: `src/components/Cover.css`
- Create: `src/test/Cover.test.jsx`

**Step 1: Write the failing test**

Create `src/test/Cover.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Cover from '../components/Cover'

describe('Cover', () => {
  it('renders front cover with title', () => {
    render(<Cover type="front" title="Happy Birthday!" subtitle="A little book of memories" />)
    expect(screen.getByText('Happy Birthday!')).toBeInTheDocument()
    expect(screen.getByText('A little book of memories')).toBeInTheDocument()
  })

  it('renders back cover', () => {
    const { container } = render(<Cover type="back" title="The End" subtitle="" />)
    expect(container.querySelector('.cover-back')).toBeTruthy()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL

**Step 3: Implement Cover**

Create `src/components/Cover.jsx`:

```jsx
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
```

**Step 4: Create Cover.css**

Create `src/components/Cover.css`:

```css
.cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-front {
  background: linear-gradient(145deg, #8b5e3c, #6b4226);
}

.cover-back {
  background: linear-gradient(145deg, #6b4226, #4a2e18);
}

.cover-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  text-align: center;
}

.cover-title {
  font-family: 'Caveat', cursive;
  font-size: 3rem;
  color: #fdf6ec;
  margin: 0;
  text-shadow: 1px 2px 6px rgba(0,0,0,0.3);
}

.cover-subtitle {
  font-family: 'Caveat', cursive;
  font-size: 1.4rem;
  color: #e8d5b7;
  margin: 0;
}

.cover-decoration-top,
.cover-decoration-bottom {
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e8d5b7, transparent);
}

.cover-back-text {
  font-family: 'Caveat', cursive;
  font-size: 1.8rem;
  color: #e8d5b7;
}
```

**Step 5: Run test to verify it passes**

```bash
npm test
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Cover.jsx src/components/Cover.css src/test/Cover.test.jsx
git commit -m "feat: add Cover component for front and back of book"
```

---

### Task 7: Book Component (react-pageflip wrapper)

**Files:**
- Create: `src/components/Book.jsx`
- Create: `src/components/Book.css`

> Note: react-pageflip uses canvas-based 3D rendering which cannot be meaningfully unit tested in jsdom. No test file for this component — verify visually in the browser.

**Step 1: Implement Book**

Create `src/components/Book.jsx`:

```jsx
import HTMLFlipBook from 'react-pageflip'
import { forwardRef } from 'react'
import Cover from './Cover'
import Page from './Page'
import pages from '../data/pages.json'
import './Book.css'

export default function Book() {
  // compute starting slot number per page (for placeholder labels)
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
        {/* Front cover — page 0 */}
        <Cover
          type="front"
          title="Happy Birthday!"
          subtitle="A little book of memories"
        />

        {/* Content pages */}
        {pages.map((pageData, i) => (
          <Page key={i} pageData={pageData} startSlot={pageSlots[i]} />
        ))}

        {/* Back cover — last page */}
        <Cover type="back" title="" subtitle="" />
      </HTMLFlipBook>

      <p className="book-hint">Click or drag the page edges to flip</p>
    </div>
  )
}
```

**Step 2: Create Book.css**

Create `src/components/Book.css`:

```css
.book-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.book-hint {
  font-family: 'Caveat', cursive;
  font-size: 1rem;
  color: #a89880;
  margin: 0;
}
```

**Step 3: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. You should see the book with front cover. Click the bottom-right corner to flip pages.

**Step 4: Commit**

```bash
git add src/components/Book.jsx src/components/Book.css
git commit -m "feat: add Book component wrapping react-pageflip"
```

---

### Task 8: App.jsx — Wire Everything Together

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css` (global styles)
- Modify: `index.html` (add Google Font)

**Step 1: Update index.html to load Caveat font**

In `index.html`, add inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap" rel="stylesheet">
```

Also update `<title>` to `Happy Birthday!`.

**Step 2: Replace src/index.css with global styles**

```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(160deg, #2d1b0e 0%, #1a0f07 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Caveat', cursive;
}

#root {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
```

**Step 3: Replace src/App.jsx**

```jsx
import Book from './components/Book'

export default function App() {
  return <Book />
}
```

**Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Dark warm background, book centered, Caveat font loaded, pages flip with 3D animation.

**Step 5: Commit**

```bash
git add index.html src/App.jsx src/index.css
git commit -m "feat: wire up app with global styles and Caveat font"
```

---

### Task 9: Add Real Photos

**Files:**
- Modify: `public/images/` — drop your photos here
- Modify: `src/data/pages.json` — fill in captions

**Step 1: Copy your photos into public/images/**

Name them to match the filenames in `pages.json` (e.g., `01.jpg`, `02.jpg`, ...).

For any slots where you don't yet have a photo, leave the filename as-is in `pages.json` — the placeholder will render automatically because the `<img>` will 404. To make placeholders explicit, set the filename to `null`:

```json
{ "layout": "single", "images": [null], "captions": ["Coming soon"] }
```

**Step 2: Add captions in pages.json**

Fill in meaningful captions for each photo. Leave as `""` for no caption.

**Step 3: Verify in browser**

```bash
npm run dev
```

Flip through all pages and confirm photos and placeholders look correct.

**Step 4: Commit**

```bash
git add public/images/ src/data/pages.json
git commit -m "feat: add photos and captions"
```

---

### Task 10: Build and Deploy to AWS S3

**Files:**
- No code changes — this is a deployment task.

**Step 1: Build the static site**

```bash
npm run build
```

Expected: `dist/` folder created with `index.html` and assets.

**Step 2: Create S3 bucket (if not already created)**

```bash
aws s3 mb s3://your-birthday-collage-bucket --region us-east-1
```

Replace `your-birthday-collage-bucket` with your chosen bucket name.

**Step 3: Enable static website hosting on the bucket**

```bash
aws s3 website s3://your-birthday-collage-bucket \
  --index-document index.html \
  --error-document index.html
```

**Step 4: Set bucket policy for public read**

Create a file `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-birthday-collage-bucket/*"
  }]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket your-birthday-collage-bucket \
  --policy file://bucket-policy.json
```

**Step 5: Deploy**

```bash
aws s3 sync dist/ s3://your-birthday-collage-bucket --delete
```

**Step 6: Get the URL**

The URL will be:
```
http://your-birthday-collage-bucket.s3-website-us-east-1.amazonaws.com
```

Open it in the browser and verify the scrapebook loads and flips correctly.

**Step 7: Commit bucket policy file**

```bash
git add bucket-policy.json
git commit -m "chore: add S3 bucket policy for static hosting"
```

---

## Summary

| Task | What it builds |
|------|---------------|
| 1 | Vite + React scaffold, Vitest configured |
| 2 | `pages.json` config with 26 image slots |
| 3 | `PhotoSlot` — polaroid image + placeholder |
| 4 | `Page` — single/collage/triple layouts |
| 5 | `WashiTape` — CSS decoration |
| 6 | `Cover` — front and back cover |
| 7 | `Book` — react-pageflip wrapper |
| 8 | `App.jsx` wired up with global styles + font |
| 9 | Drop in real photos and captions |
| 10 | Build and deploy to AWS S3 |
