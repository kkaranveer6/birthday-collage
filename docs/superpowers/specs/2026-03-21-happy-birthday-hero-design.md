# Happy Birthday Hero Section — Design Spec

**Date:** 2026-03-21
**Status:** Approved

## Overview

Add a full-viewport-height hero section above the existing photo collage. When the page loads, the user sees a warm birthday message first, then scrolls down into the photo collage.

## Goal

Display "Happy Birthday, Dipu! 🎂" in a way that feels personal and matches the existing scrapbook aesthetic before the collage begins.

## Design

### Visual Style

- **Background:** Same warm linen (`#f5f0e8`) with the same SVG noise texture used by `collage-canvas` — the hero flows seamlessly into the collage
- **Font:** `Caveat` cursive (already loaded globally)
- **Eyebrow text:** `🎉 today is a special day 🎉` — small, uppercase, muted color (`#b0a090`)
- **Headline:** `Happy Birthday,` (large, pink `#e05c7a`)
- **Name line:** `Dipu! 🎂` (slightly larger, deeper pink `#c0395a`, bold)
- **Scroll hint:** `scroll down for some memories ↓` — italic, muted
- **Bottom divider:** `2px dashed #d4c9b8` to visually separate hero from collage

### Layout

- `min-height: 100vh` — occupies the full first screen
- Content centered (flex column, center/center)
- No interaction needed — purely presentational

## Components

### New: `BirthdayHero`

- **File:** `src/components/BirthdayHero.jsx`
- **CSS:** `src/components/BirthdayHero.css`
- Renders the hero markup with no props (name is hardcoded)
- No state, no interactivity

### Modified: `App.jsx`

- Render `<BirthdayHero />` immediately before `<Collage />` in the JSX tree
- No other changes

## Out of Scope

- Animations or entrance effects on the hero text
- Making the name a prop (hardcoded is fine)
- Any changes to the collage, photo layout, or modal
