# Scroll Hint Click-to-Scroll — Design Spec

**Date:** 2026-03-21
**Status:** Draft

## Overview

Make the "scroll down for some memories ↓" hint in the birthday hero section clickable. Clicking (or pressing Enter/Space) smoothly scrolls the page to the top of the photo collage.

## Design

### Behavior

- Clicking the scroll hint scrolls the page smoothly to the collage section
- Uses `scrollIntoView({ behavior: 'smooth' })` targeting `document.getElementById('collage')`
- Keyboard users (Tab → Enter or Space) trigger the same scroll
- No URL hash change, no page jump

### Changes

**`src/components/Collage.jsx`**
- Add `id="collage"` to the `.collage-canvas` root `<div>`
- Note: `id="collage"` is a singleton; tests render `<Collage />` in isolated JSDOM environments so duplicate IDs across tests are not an issue

**`src/components/BirthdayHero.jsx`**
- On the `.birthday-hero__scroll-hint` `<p>`, add:
  - `role="button"`
  - `tabIndex={0}`
  - `onClick` handler: `() => document.getElementById('collage')?.scrollIntoView({ behavior: 'smooth' })`
  - `onKeyDown` handler: `(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('collage')?.scrollIntoView({ behavior: 'smooth' }) }`

**`src/components/BirthdayHero.css`**
- Add `cursor: pointer` to `.birthday-hero__scroll-hint`

**`src/test/BirthdayHero.test.jsx`**
- Add a test for the scroll behavior with this setup pattern:

  ```js
  beforeEach(() => {
    // JSDOM does not implement scrollIntoView — stub it globally
    window.HTMLElement.prototype.scrollIntoView = vi.fn()

    // Inject a fake collage target so getElementById('collage') resolves
    const target = document.createElement('div')
    target.id = 'collage'
    document.body.appendChild(target)
  })

  afterEach(() => {
    document.getElementById('collage')?.remove()
  })

  test('clicking scroll hint calls scrollIntoView on the collage', () => {
    render(<BirthdayHero />)
    fireEvent.click(screen.getByRole('button', { name: /scroll down/i }))
    expect(document.getElementById('collage').scrollIntoView)
      .toHaveBeenCalledWith({ behavior: 'smooth' })
  })
  ```

  Use `fireEvent` from `@testing-library/react` (already installed) — replace `userEvent.click(...)` with `fireEvent.click(...)`. No additional packages needed.

## Out of Scope

- Any changes to the collage layout, modal, or HeartBurst components
- Changes to the scroll hint text or visual design beyond `cursor: pointer`
