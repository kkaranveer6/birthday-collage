# Mobile-Friendly Collage — Design Spec

**Date:** 2026-03-21
**Status:** Approved

## Overview

The birthday collage is a React/Vite app with two sections: a full-screen hero (`BirthdayHero`) and a 350vh absolute-positioned collage canvas (`Collage`) showing 35 polaroid-style photos connected by a serpentine timeline thread. Currently the collage is desktop-only: it uses a fixed 5-column layout with 200×200px photos, which overflows and breaks on mobile screens.

The goal is to make the collage usable and visually faithful on mobile by switching to a 2-column layout with smaller photos at narrow viewports, preserving the scattered polaroid aesthetic.

## Decisions

- **Hero section**: No changes. Font sizes (4.5rem, 5.5rem) are intentionally large and left as-is.
- **Mobile aesthetic**: Preserve the scattered/absolute-position feel — not a structured grid.
- **Breakpoint**: 640px (standard mobile/tablet boundary).
- **Mobile columns**: 2 (down from 5). Results in 18 rows for 35 photos.
- **Mobile photo size**: 120px (down from 200px).

## Architecture

### Position computation — make reactive

Currently `positions` is computed once at module level in `Collage.jsx`:

```js
const COLS = 5
const positions = pages.map(...)  // static, computed once
```

This must move inside the component and recompute when viewport width crosses the 640px breakpoint.

A `useIsMobile(breakpoint)` hook encapsulates the window resize listener and returns a boolean. `Collage` calls this hook, then computes `positions` with the appropriate `COLS` and spread.

### Position spread — adjusted for mobile

Desktop (COLS=5): `xBase = 6 + effectiveCol * (76 / 4)` → 6% to 82%
Mobile (COLS=2): `xBase = 10 + effectiveCol * 50` → 10% and 60%

At 375px viewport, 60% + 120px = 225 + 120 = 345px — safely within bounds. Jitter remains (±5% x, ±3% y) for the scattered feel.

Canvas height stays at 350vh. With 18 rows, `yBase` spans 8%–82% of 350vh, giving ~15vh spacing between rows — comfortable.

### Timeline — no changes needed

`TimelineLine` accepts `positions` as a prop and redraws from them. When `Collage` re-renders with new positions, the timeline updates automatically. The `window.innerHeight` read in `TimelineLine` is re-evaluated on each render, so resize redraws it correctly.

### Photo size — CSS media query

`CollagePhoto.css` gets a media query at `max-width: 640px` changing `.collage-photo__img` from `200px` to `120px`. The polaroid padding and box-shadow scale naturally since they use fixed pixel values that remain appropriate at 120px.

### Scroll hint — allow wrapping

`BirthdayHero.css` removes `white-space: nowrap` from `.birthday-hero__scroll-hint` so the text can wrap on narrow screens. No other hero changes.

## Files Changed

| File | Change |
|------|--------|
| `src/components/Collage.jsx` | Move position computation into component; add `useIsMobile` hook; use COLS=2 and adjusted spread on mobile |
| `src/components/CollagePhoto.css` | Add `@media (max-width: 640px)` reducing photo size to 120px |
| `src/components/BirthdayHero.css` | Remove `white-space: nowrap` from `.birthday-hero__scroll-hint` |

No new files. No changes to `TimelineLine`, `PhotoModal`, `App`, or `index.css`.

## Out of Scope

- Hero font size scaling
- Touch-specific interactions (tap vs hover)
- Landscape orientation handling
- Any changes to the PhotoModal (already responsive)
