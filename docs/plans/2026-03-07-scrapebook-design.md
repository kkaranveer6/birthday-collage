# Birthday Scrapebook — Design Document
**Date:** 2026-03-07

## Overview

A 3D interactive birthday scrapebook built with Vite + React and `react-pageflip`. 26 images displayed across mixed-layout pages with a playful, physical scrapbook aesthetic. Deployed as a static site to AWS S3.

## Architecture

**Stack:** Vite + React (no backend, fully static)

**Project structure:**
```
birthday-collage/
├── public/
│   └── images/          # 26 photo slots (drop files here)
├── src/
│   ├── data/
│   │   └── pages.json   # page definitions (layout, images, captions)
│   ├── components/
│   │   ├── Book.jsx        # react-pageflip wrapper
│   │   ├── Page.jsx        # renders a page by layout type
│   │   ├── Cover.jsx       # front and back cover
│   │   └── decorations/    # washi tape, stickers, torn edge components
│   └── App.jsx
```

## Page Config (`pages.json`)

Each entry defines one page:

```json
[
  { "layout": "single",  "images": ["01.jpg"],                    "captions": ["Summer 2023"] },
  { "layout": "collage", "images": ["02.jpg", "03.jpg"],          "captions": ["...", "..."] },
  { "layout": "triple",  "images": ["04.jpg", "05.jpg", "06.jpg"],"captions": ["...", "...", "..."] }
]
```

**Layout types:**
- `single` — one full-bleed photo per page
- `collage` — two photos side by side
- `triple` — three photos arranged collage-style

Missing images fall back to a styled placeholder card (numbered, colored).

## Visual Style

Playful scrapbook aesthetic — CSS only, no external decoration assets required:

- **Paper background:** Warm cream texture via CSS
- **Photos:** Polaroid-style white border, slight random rotation, drop shadow
- **Washi tape:** Translucent colored strips (CSS pseudo-elements) pinning photos
- **Font:** [Caveat](https://fonts.google.com/specimen/Caveat) (Google Fonts) — handwritten captions
- **Cover:** Decorative title + hero photo, journal-style
- **Page flip:** react-pageflip 3D curl animation; pages render as left/right spreads

## Deployment

```bash
npm run build
aws s3 sync dist/ s3://your-bucket --delete
```

- S3 static website hosting; `index.html` as index and error document
- Optional CloudFront distribution for HTTPS + CDN caching
- No environment variables — all config lives in `pages.json`
