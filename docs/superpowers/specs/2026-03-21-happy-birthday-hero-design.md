# Happy Birthday Hero Section — Design Spec

**Date:** 2026-03-21
**Status:** Draft

## Overview

Add a full-viewport-height hero section above the existing photo collage. When the page loads, the user sees a warm birthday message first, then scrolls down into the photo collage.

## Goal

Display "Happy Birthday, Dipu! 🎂" in a way that feels personal and matches the existing scrapbook aesthetic before the collage begins.

## Design

### Visual Style

- **Background:** `background-color: #f5f0e8` plus the same SVG noise `background-image` data URI currently in `Collage.css` line 9 — copy the declaration verbatim into `BirthdayHero.css` so both sections render identically
- **Font:** `Caveat` cursive (already loaded globally in `index.css`)
- **Eyebrow text:** `🎉 today is a special day 🎉` — `font-size: 1.1rem`, uppercase, muted color `#b0a090`, `letter-spacing: 3px`
- **Headline:** `Happy Birthday,` — `font-size: 4.5rem`, pink `#e05c7a`, `line-height: 1.1`
- **Name line:** `Dipu! 🎂` — `font-size: 5.5rem`, deeper pink `#c0395a`, bold, `line-height: 1`
- **Scroll hint:** `scroll down for some memories ↓` — `font-size: 1.4rem`, italic, muted `#999`; pinned to the bottom of the hero with `position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%)`
- **Bottom divider:** `border-bottom: 2px dashed #d4c9b8` on the hero container

### Layout

- Container: `<section aria-label="Birthday greeting">` with `position: relative; min-height: 100vh`
- Inner content (eyebrow + headline + name): `display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 2rem 2rem 4rem; gap: 0.5rem` — bottom padding is `4rem` (not `2rem`) to prevent the absolutely positioned scroll hint from overlapping the name on short viewports
- Scroll hint is absolutely positioned at the bottom (see above), outside the flex flow
- `font-family` inherits from the global `body` rule in `index.css`; no override needed in `BirthdayHero.css`

## Components

### New: `BirthdayHero`

- **File:** `src/components/BirthdayHero.jsx`
- **CSS:** `src/components/BirthdayHero.css`
- Renders a `<section aria-label="Birthday greeting">` with the hero markup
- No props, no state, no interactivity — purely presentational
- Name ("Dipu") is hardcoded

### Modified: `App.jsx`

- Add `import BirthdayHero from './components/BirthdayHero'`
- In the JSX fragment, render `<BirthdayHero />` as the first element, immediately before `<Collage onBurst={addBurst} />`
- The existing `HeartBurst` overlay elements that follow `<Collage>` are unrelated to document flow — do not touch them

## Out of Scope

- Animations or entrance effects on the hero text
- Making the name a prop (hardcoded is fine)
- Any changes to the collage, photo layout, modal, or HeartBurst components
- Extracting the noise texture to a shared CSS variable (a future refactor if desired)
