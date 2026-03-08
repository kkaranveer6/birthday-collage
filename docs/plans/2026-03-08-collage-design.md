# Collage Redesign — Design Doc
Date: 2026-03-08

## Overview
Replace the 3D flip-book scrapbook with a single scrollable photo collage. All 26 photos scattered across a large canvas, polaroid-style, clickable to open full-size.

## Architecture
- `App.jsx` renders `Collage` instead of `Book`
- `Collage` component: single scrollable div with all photos absolutely positioned
- `CollagePhoto` component: individual polaroid card (white border, slight shadow, rotation)
- Reuse existing `PhotoModal` for full-size view
- `pages.json` still drives the photo list (just read `images[0]` from each entry)

## Layout
- Canvas: `min-width: 100vw`, `min-height: 300vh` — tall enough to scatter 26 photos without too much overlap
- Photos positioned with seeded pseudo-random values (deterministic based on index) for `left`, `top`, `rotate`
- Rotation range: -15° to +15°
- Photo size: ~220px wide, auto height (maintains aspect ratio inside polaroid)
- Polaroid: white background, 12px padding on sides/top, 40px padding on bottom (caption space, left blank)

## Styling
- Page background: warm linen texture (CSS `background-color` + subtle noise pattern or just `#f5f0e8`)
- No washi tape, no decorations — just photos
- Hover: slight scale-up (1.05) + z-index bump so hovered photo comes to front
- Cursor: pointer

## Interaction
- Click photo → opens `PhotoModal` (already built)
- Scroll to explore canvas
- No navigation buttons needed

## Files Changed
- `src/App.jsx` — swap `Book` for `Collage`
- `src/components/Collage.jsx` — new component
- `src/components/Collage.css` — new styles
- `src/components/CollagePhoto.jsx` — new component
- `src/components/CollagePhoto.css` — new styles
- Delete or ignore: `Book.jsx`, `Book.css`, `Page.jsx`, `Page.css`, `Cover.jsx`, `Cover.css`, `PhotoSlot.jsx`, `PhotoSlot.css`, `WashiTape.jsx`, `WashiTape.css`

## Out of Scope
- Captions
- Animations/physics
- Mobile-specific layout
