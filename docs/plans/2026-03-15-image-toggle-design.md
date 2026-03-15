# Image Edited/Original Toggle — Design Doc

Date: 2026-03-15

## Summary

Add a rotate button (↻) to the photo modal that toggles between the edited and original version of each image. Edited images are shown by default; clicking the button reveals the original.

## Folder Convention

Images are stored in two sibling folders under `public/images/`:

```
public/images/
  edited/01.jpg … 50.jpg
  original/01.jpg … 50.jpg
```

Filenames are identical across both folders. Only the subfolder differs.

## State

`PhotoModal` owns a `showOriginal` boolean (default `false`). The image `src` is derived:

```
/images/edited/<filename>   // showOriginal === false
/images/original/<filename> // showOriginal === true
```

State resets to `false` whenever the modal closes or a new image is opened.

## Button

- Character: `↻`
- Position: absolute, bottom-left corner of `.modal-polaroid`, mirroring the close button placement (top-right)
- Style: same circular pill as `.modal-close` — `#FEF6E4` background, `#5a3e2b` color, `32×32px`, box shadow
- Interaction: click toggles `showOriginal`, stops propagation, triggers a 360° spin CSS animation

## Image Transition

`.modal-img` fades opacity (0 → 1, 0.15s ease) on src change so the switch feels smooth rather than a hard cut.

## Files Changed

| File | Change |
|---|---|
| `src/components/PhotoModal.jsx` | Add `showOriginal` state, rotate button, derive src from state |
| `src/components/PhotoModal.css` | Add `.modal-rotate` styles and fade keyframe |
| `src/components/CollagePhoto.jsx` | Update image src from `/images/` to `/images/edited/` |
