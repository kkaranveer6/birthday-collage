# Scroll Hint Click-to-Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the "scroll down for some memories ↓" hint in the birthday hero clickable so it smoothly scrolls to the photo collage.

**Architecture:** Add `id="collage"` to the collage canvas div so it can be targeted by ID. Wire `onClick` and `onKeyDown` handlers on the scroll hint that call `scrollIntoView({ behavior: 'smooth' })` on that element. Add `cursor: pointer` to the hint's CSS class.

**Tech Stack:** React, Vitest, @testing-library/react, plain CSS

---

## File Map

| Action | Path | Change |
|--------|------|--------|
| Modify | `src/components/Collage.jsx` | Add `id="collage"` to root div |
| Modify | `src/components/BirthdayHero.jsx` | Add onClick, onKeyDown, role, tabIndex to scroll hint |
| Modify | `src/components/BirthdayHero.css` | Add `cursor: pointer` to `.birthday-hero__scroll-hint` |
| Modify | `src/test/BirthdayHero.test.jsx` | Add click test with scrollIntoView mock |

---

## Task 1: Scroll hint click-to-scroll (TDD)

All four file changes belong together — they implement one behavior.

**Files:**
- Modify: `src/test/BirthdayHero.test.jsx`
- Modify: `src/components/Collage.jsx`
- Modify: `src/components/BirthdayHero.jsx`
- Modify: `src/components/BirthdayHero.css`

- [ ] **Step 1: Write the failing test**

Open `src/test/BirthdayHero.test.jsx`. Add `fireEvent` to the existing `@testing-library/react` import, then append these blocks after the existing tests:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import BirthdayHero from '../components/BirthdayHero'

// ... existing tests unchanged ...

describe('scroll hint interaction', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    const target = document.createElement('div')
    target.id = 'collage'
    document.body.appendChild(target)
  })

  afterEach(() => {
    document.getElementById('collage')?.remove()
  })

  test('clicking scroll hint scrolls to collage', () => {
    render(<BirthdayHero />)
    fireEvent.click(screen.getByRole('button', { name: /scroll down/i }))
    expect(document.getElementById('collage').scrollIntoView)
      .toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})
```

Note: the existing import line at the top of the file already imports `render` and `screen` — update it to also include `fireEvent`. Do not duplicate the import.

- [ ] **Step 2: Run the new test — expect it to fail**

```bash
npx vitest run src/test/BirthdayHero.test.jsx
```

Expected: `clicking scroll hint scrolls to collage` FAILS — the scroll hint has no `role="button"` yet so `getByRole` throws, or `scrollIntoView` is never called.

- [ ] **Step 3: Add `id="collage"` to Collage.jsx**

Open `src/components/Collage.jsx`. Find the root div on line ~42:

```jsx
<div className="collage-canvas">
```

Change it to:

```jsx
<div id="collage" className="collage-canvas">
```

No other changes to this file.

- [ ] **Step 4: Update BirthdayHero.jsx — add handlers and ARIA attributes**

Open `src/components/BirthdayHero.jsx`. Find the scroll hint `<p>` (currently the last element before `</section>`):

```jsx
<p className="birthday-hero__scroll-hint">scroll down for some memories ↓</p>
```

Replace it with:

```jsx
<p
  className="birthday-hero__scroll-hint"
  role="button"
  tabIndex={0}
  onClick={() => document.getElementById('collage')?.scrollIntoView({ behavior: 'smooth' })}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ')
      document.getElementById('collage')?.scrollIntoView({ behavior: 'smooth' })
  }}
>
  scroll down for some memories ↓
</p>
```

- [ ] **Step 5: Update BirthdayHero.css — add cursor**

Open `src/components/BirthdayHero.css`. Find `.birthday-hero__scroll-hint` and add `cursor: pointer`:

```css
.birthday-hero__scroll-hint {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.4rem;
  font-style: italic;
  color: #999;
  white-space: nowrap;
  cursor: pointer;
}
```

- [ ] **Step 6: Run all tests — expect them to pass**

```bash
npx vitest run src/test/BirthdayHero.test.jsx
```

Expected: all 4 tests PASS (3 existing + 1 new).

Then run the full suite:

```bash
npx vitest run
```

Expected: 24 tests pass, 1 pre-existing failure (`Collage > renders all 50 photos`) — that failure is unrelated and pre-dates this work.

- [ ] **Step 7: Commit**

```bash
git add src/components/Collage.jsx src/components/BirthdayHero.jsx src/components/BirthdayHero.css src/test/BirthdayHero.test.jsx
git commit -m "feat: clicking scroll hint smoothly scrolls to collage"
```
