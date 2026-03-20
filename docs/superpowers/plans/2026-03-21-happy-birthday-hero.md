# Happy Birthday Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-viewport-height "Happy Birthday, Dipu! 🎂" hero section that appears above the photo collage when the page loads.

**Architecture:** A new purely-presentational `BirthdayHero` component (JSX + CSS) is rendered as the first child in `App.jsx`, immediately before `<Collage>`. No state, no props, no changes to the collage.

**Tech Stack:** React, Vitest, @testing-library/react, plain CSS

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/BirthdayHero.jsx` | Hero section markup |
| Create | `src/components/BirthdayHero.css` | Hero styles |
| Create | `src/test/BirthdayHero.test.jsx` | Component tests |
| Modify | `src/App.jsx` | Mount `<BirthdayHero />` before `<Collage />` |

---

## Task 1: BirthdayHero component (TDD)

**Files:**
- Create: `src/test/BirthdayHero.test.jsx`
- Create: `src/components/BirthdayHero.jsx`
- Create: `src/components/BirthdayHero.css`

- [ ] **Step 1: Write the failing tests**

Create `src/test/BirthdayHero.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import BirthdayHero from '../components/BirthdayHero'

test('renders birthday greeting with name', () => {
  render(<BirthdayHero />)
  expect(screen.getByText(/Happy Birthday,/i)).toBeInTheDocument()
  expect(screen.getByText(/Dipu/i)).toBeInTheDocument()
})

test('renders scroll hint', () => {
  render(<BirthdayHero />)
  expect(screen.getByText(/scroll down/i)).toBeInTheDocument()
})

test('section has accessible label', () => {
  render(<BirthdayHero />)
  expect(screen.getByRole('region', { name: /birthday greeting/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests — expect them to fail**

```bash
npx vitest run src/test/BirthdayHero.test.jsx
```

Expected: all 3 tests FAIL with "Cannot find module '../components/BirthdayHero'"

- [ ] **Step 3: Create `src/components/BirthdayHero.css`**

```css
/* src/components/BirthdayHero.css */
.birthday-hero {
  position: relative;
  min-height: 100vh;
  background-color: #f5f0e8;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
  border-bottom: 2px dashed #d4c9b8;
}

.birthday-hero__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem 2rem 4rem;
  gap: 0.5rem;
}

.birthday-hero__eyebrow {
  font-size: 1.1rem;
  color: #b0a090;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.birthday-hero__headline {
  font-size: 4.5rem;
  color: #e05c7a;
  line-height: 1.1;
}

.birthday-hero__name {
  font-size: 5.5rem;
  color: #c0395a;
  font-weight: bold;
  line-height: 1;
}

.birthday-hero__scroll-hint {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.4rem;
  font-style: italic;
  color: #999;
  white-space: nowrap;
}
```

- [ ] **Step 4: Create `src/components/BirthdayHero.jsx`**

```jsx
// src/components/BirthdayHero.jsx
import './BirthdayHero.css'

export default function BirthdayHero() {
  return (
    <section className="birthday-hero" aria-label="Birthday greeting">
      <div className="birthday-hero__content">
        <p className="birthday-hero__eyebrow">🎉 today is a special day 🎉</p>
        <p className="birthday-hero__headline">Happy Birthday,</p>
        <p className="birthday-hero__name">Dipu! 🎂</p>
      </div>
      <p className="birthday-hero__scroll-hint">scroll down for some memories ↓</p>
    </section>
  )
}
```

- [ ] **Step 5: Run tests — expect them to pass**

```bash
npx vitest run src/test/BirthdayHero.test.jsx
```

Expected: all 3 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/BirthdayHero.jsx src/components/BirthdayHero.css src/test/BirthdayHero.test.jsx
git commit -m "feat: add BirthdayHero component"
```

---

## Task 2: Wire BirthdayHero into App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the import and render `<BirthdayHero />` in App.jsx**

Open `src/App.jsx`. Add the import after the existing imports, and render `<BirthdayHero />` as the first child of the fragment:

```jsx
import { useState } from 'react'
import Collage from './components/Collage'
import HeartBurst from './components/HeartBurst'
import BirthdayHero from './components/BirthdayHero'

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
      <BirthdayHero />
      <Collage onBurst={addBurst} />
      {bursts.map((b) => (
        <HeartBurst key={b.id} {...b} onDone={removeBurst} />
      ))}
    </>
  )
}
```

- [ ] **Step 2: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests PASS (no regressions)

- [ ] **Step 3: Smoke-test in the browser**

```bash
npm run dev
```

Open the local URL. Verify:
- The birthday message fills the first screen
- Scrolling down reveals the photo collage
- Heart bursts still work when clicking photos

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: mount BirthdayHero above collage in App"
```
