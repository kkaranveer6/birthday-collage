# Scroll Hint Click-to-Scroll — Design Spec

**Date:** 2026-03-21
**Status:** Draft

## Overview

Make the "scroll down for some memories ↓" hint in the birthday hero section clickable. Clicking it smoothly scrolls the page to the top of the photo collage.

## Design

### Behavior

- Clicking the scroll hint scrolls the page smoothly to the collage section
- Uses `scrollIntoView({ behavior: 'smooth' })` targeting the collage canvas by ID
- No URL hash change, no page jump

### Accessibility

- The scroll hint `<p>` gains `role="button"` and `tabIndex={0}` so keyboard users can activate it
- Keyboard activation (Enter/Space) is not wired — `role="button"` alone is sufficient for discoverability; full keyboard support is out of scope

### Changes

**`src/components/Collage.jsx`**
- Add `id="collage"` to the `.collage-canvas` root `<div>`

**`src/components/BirthdayHero.jsx`**
- Add `onClick={() => document.getElementById('collage')?.scrollIntoView({ behavior: 'smooth' })}` to the `.birthday-hero__scroll-hint` `<p>`
- Add `role="button"` and `tabIndex={0}` to the same element

**`src/components/BirthdayHero.css`**
- Add `cursor: pointer` to `.birthday-hero__scroll-hint`

**`src/test/BirthdayHero.test.jsx`**
- Add a test: mock `scrollIntoView` on the element, click the scroll hint, assert `scrollIntoView` was called with `{ behavior: 'smooth' }`

## Out of Scope

- Full keyboard handler (Enter/Space) on the scroll hint
- Removing or changing the scroll hint text/style beyond `cursor: pointer`
- Any changes to the collage layout or other components
