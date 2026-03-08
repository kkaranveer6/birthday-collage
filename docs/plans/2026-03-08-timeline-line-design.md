# Timeline Line Design Doc
Date: 2026-03-08

## Overview
Add a hand-drawn-looking SVG line that connects all 26 photos in chronological order, revealing itself as the user scrolls down the collage canvas.

## Architecture
- A single `<svg>` element absolutely positioned over the full collage canvas (`pointer-events: none`)
- Path computed from each photo's center position (derived from the same `seededRand` positions used in `Collage.jsx`)
- Wobbly/hand-drawn look via quadratic bezier curves with small random offsets on control points
- Scroll-driven reveal via `stroke-dasharray` / `stroke-dashoffset` updated on `window scroll`

## Path Computation
- Photo center X = `left% * canvasWidth + photoWidth/2`
- Photo center Y = `top% * canvasHeight + photoHeight/2`
- SVG path: `M center0 Q controlPoint center1 Q controlPoint center2 ...`
- Control points offset by ±20–40px randomly (seeded by index) for wobbly feel

## Line Style
- Color: `#c0392b` (red marker)
- `stroke-width: 3`
- `stroke-linecap: round`
- `stroke-linejoin: round`
- `fill: none`

## Scroll Reveal
- On mount: compute `totalLength = path.getTotalLength()`
- Set `stroke-dasharray = totalLength`
- Set `stroke-dashoffset = totalLength` (fully hidden)
- On scroll: `dashoffset = totalLength * (1 - scrollProgress)` where `scrollProgress = scrollY / (documentHeight - viewportHeight)`
- Use `requestAnimationFrame` for smoothness

## Files
- Modify: `src/components/Collage.jsx` — add SVG overlay, scroll listener, shared position logic
- Create: `src/components/TimelineLine.jsx` — SVG line component, accepts `positions` array
- Create: `src/components/TimelineLine.css` — SVG positioning styles

## Out of Scope
- Dots/markers at each photo
- Labels or dates on the line
- Mobile-specific behavior
