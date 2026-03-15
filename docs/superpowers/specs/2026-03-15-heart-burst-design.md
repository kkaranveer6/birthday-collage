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

Hearts render at the App level with `position: fixed`, so they always appear above all other content (z-index 9999) with no clipping or z-index conflicts.

`App.jsx` owns a `bursts` array: `[{ id, x, y }, ...]`. An `addBurst(e)` callback reads `e.clientX / e.clientY` and appends a new entry. Each `HeartBurst` component self-removes after its animation completes (900ms).

## New Files

### `src/components/HeartBurst.jsx`

Props: `{ id, x, y, onDone }`

- Renders 5 heart `<span className="heart-burst__heart">` elements, each styled `position: fixed` at `(x, y)`
- Each heart gets a random emoji from `['❤️', '🩷', '💗']` selected at render time
- Each heart has a CSS animation that translates it outward using evenly spaced angles `[0, 72, 144, 216, 288]` degrees. Each heart receives `--angle` and `--dist` as inline CSS custom properties:
  - `--angle`: angle in degrees as a string with suffix, e.g. `'0deg'`, `'72deg'`
  - `--dist`: distance in px generated as `Math.round(55 + Math.random() * 15) + 'px'` (produces 55–70px)
- Calls `onDone(id)` via `useEffect` + `setTimeout` after exactly 900ms, passing the `id` prop value
- The `useEffect` must return a cleanup function that calls `clearTimeout` on the timer, to handle unmounting before animation completes
- `pointer-events: none` on all heart elements so they don't interfere with clicks

### `src/components/HeartBurst.css`

- `@keyframes heart-fly` with these explicit keyframe stops:
  ```css
  @keyframes heart-fly {
    0%   { transform: rotate(var(--angle)) translateY(0)                    scale(0);   opacity: 1; }
    20%  { transform: rotate(var(--angle)) translateY(calc(-0.3 * var(--dist))) scale(1.2); opacity: 1; }
    100% { transform: rotate(var(--angle)) translateY(calc(-1   * var(--dist))) scale(0);   opacity: 0; }
  }
  ```
- Animation duration: 0.9s ease-out, `animation-fill-mode: forwards`
- `--angle` is set with a `deg` suffix (e.g. `'72deg'`); `--dist` is set with a `px` suffix (e.g. `'62px'`)
- Each `.heart-burst__heart` span: `position: fixed`, `pointer-events: none`, `z-index: 9999`, `font-size: 1.4rem`, `line-height: 1`

## Changed Files

### `src/App.jsx`

- Add `import { useState } from 'react'` at the top of the file
- Add `import HeartBurst from './components/HeartBurst'` at the top of the file
- Add burst state and handlers:

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
- Pass `onBurst` to `<PhotoModal>` (PhotoModal is rendered inside Collage, not App)

### `src/components/CollagePhoto.jsx`

- Accept `onBurst` prop
- Update the div's `onClick` handler signature from `() =>` to `(e) =>` so the event object is available
- Call `onBurst?.(e)` first, then `onClick?.(filename)`. The existing `onClick` prop signature — `(filename: string) => void` — is intentionally preserved unchanged; only the inner handler arrow function gains the `e` parameter.

### `src/components/PhotoModal.jsx`

- Accept `onBurst` prop
- Close button: change from `onClick={onClose}` to a full inline handler:
  ```jsx
  onClick={(e) => { e.stopPropagation(); onBurst?.(e); onClose() }}
  ```
  (`stopPropagation` is defensive — the `modal-polaroid` wrapper already stops propagation, but this is added for clarity)
- Rotate button: add `onBurst?.(e)` after the existing `e.stopPropagation()` and before the state toggle:
  ```jsx
  onClick={(e) => { e.stopPropagation(); onBurst?.(e); setShowOriginal(v => !v) }}
  ```
- **Overlay backdrop click** (`modal-overlay` div): does NOT trigger `onBurst` — only calls `onClose()`

## Burst Mechanics

- **Count:** 5 hearts per click
- **Directions:** `[0, 72, 144, 216, 288]` degrees — append `'deg'` suffix when setting `--angle` inline style
- **Distance:** `Math.round(55 + Math.random() * 15) + 'px'` per heart (produces 55–70px)
- **Duration:** 900ms ease-out
- **Emoji pool:** `['❤️', '🩷', '💗']` — random per heart, selected at render time
- **Cleanup:** `onDone(id)` called with the burst's `id` after exactly 900ms, removes entry from App state

## Testing

### `HeartBurst`
```js
import { render, act } from '@testing-library/react'
import { vi } from 'vitest'
beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('renders 5 heart elements', () => {
  const { container } = render(<HeartBurst id="abc" x={100} y={200} onDone={() => {}} />)
  expect(container.querySelectorAll('.heart-burst__heart')).toHaveLength(5)
})

test('calls onDone with id after 900ms', () => {
  const onDone = vi.fn()
  render(<HeartBurst id="abc" x={100} y={200} onDone={onDone} />)
  act(() => vi.advanceTimersByTime(900))
  expect(onDone).toHaveBeenCalledOnce()
  expect(onDone).toHaveBeenCalledWith('abc')
})
```

### `CollagePhoto`
- `onBurst` is called when the photo div is clicked

### `PhotoModal`
- `onBurst` is called when the close button is clicked
- `onBurst` is called when the rotate button is clicked
- `onBurst` is NOT called when the overlay backdrop is clicked

### Integration
- All existing tests continue to pass
