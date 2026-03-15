# Heart Burst Animation — Design Spec

Date: 2026-03-15

## Goal

When the user clicks any interactive element in the collage (photo thumbnails, modal close button, modal rotate button), a burst of 5 hearts explodes outward from the click point and fades out.

## Decisions

| Question | Answer |
|---|---|
| Animation style | Burst — multiple hearts explode outward from click point |
| Scope | All clickable elements: CollagePhoto thumbnails, modal close ×, modal rotate ↻ |
| Colors | Pink & Red: `['❤️', '🩷', '💗']` — each heart picks randomly |
| Positioning | `position: fixed` at viewport coordinates (clientX, clientY) |
| Architecture | App-level burst state, `onBurst` callback threaded down |

## Architecture

Hearts render at the App level with `position: fixed`, so they always appear above all other content (z-index ~9999) with no clipping or z-index conflicts.

`App.jsx` owns a `bursts` array: `[{ id, x, y }, ...]`. An `addBurst(e)` callback reads `e.clientX / e.clientY` and appends a new entry. Each `HeartBurst` component self-removes after its animation completes (~900ms).

## New Files

### `src/components/HeartBurst.jsx`

Props: `{ id, x, y, onDone }`

- Renders 5 heart `<span>` elements, each styled `position: fixed` at `(x, y)`
- Each heart gets a random emoji from `['❤️', '🩷', '💗']`
- Each heart has a CSS animation that translates it outward in a unique direction (evenly spread across 360°, e.g. 0°, 72°, 144°, 216°, 288°) with slight random speed jitter
- Calls `onDone(id)` via `useEffect` + `setTimeout` after 900ms
- No user interaction — pointer-events: none

### `src/components/HeartBurst.css`

- `@keyframes heart-fly` — scales from 0 → 1.2 → 1 → 0, translates outward ~60px
- Each heart uses a CSS custom property `--angle` (0–360deg) and `--dist` (50–70px) to determine direction and distance
- Animation duration: 0.9s ease-out, fill-mode: forwards

## Changed Files

### `src/App.jsx`

```jsx
const [bursts, setBursts] = useState([])
const addBurst = (e) => setBursts(b => [...b, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }])
const removeBurst = (id) => setBursts(b => b.filter(burst => burst.id !== id))

return (
  <>
    <Collage onBurst={addBurst} />
    {bursts.map(b => <HeartBurst key={b.id} {...b} onDone={removeBurst} />)}
  </>
)
```

### `src/components/Collage.jsx`

- Accept `onBurst` prop
- Pass `onBurst` to each `<CollagePhoto>`

### `src/components/CollagePhoto.jsx`

- Accept `onBurst` prop
- In the div's `onClick`: call `onBurst(e)` before or after existing `onClick?.(filename)`

### `src/components/PhotoModal.jsx`

- Accept `onBurst` prop
- Close button `onClick`: call `onBurst(e)` then `onClose()`
- Rotate button `onClick`: call `onBurst(e)` then toggle state

## Burst Mechanics

- **Count:** 5 hearts per click
- **Directions:** evenly spaced angles `[0, 72, 144, 216, 288]` degrees
- **Distance:** 55–70px (slight per-heart jitter via CSS or inline style)
- **Duration:** 900ms ease-out
- **Emoji pool:** `['❤️', '🩷', '💗']` — random per heart
- **Cleanup:** `onDone(id)` called after 900ms removes entry from App state

## Testing

- Unit test `HeartBurst`: renders 5 hearts, calls `onDone` after timeout
- Unit test `CollagePhoto`: `onBurst` called on click
- Unit test `PhotoModal`: `onBurst` called on close button click and rotate button click
- Integration: no existing tests should break
