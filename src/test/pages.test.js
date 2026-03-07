import { describe, it, expect } from 'vitest'
import pages from '../data/pages.json'

describe('pages.json', () => {
  it('has exactly 26 image slots across all pages', () => {
    const total = pages.reduce((sum, page) => sum + page.images.length, 0)
    expect(total).toBe(26)
  })

  it('every page has a valid layout type', () => {
    const valid = ['single', 'collage', 'triple']
    pages.forEach((page, i) => {
      expect(valid, `page ${i} has invalid layout`).toContain(page.layout)
    })
  })

  it('every page has matching images and captions arrays', () => {
    pages.forEach((page, i) => {
      expect(page.images.length, `page ${i} captions length mismatch`).toBe(page.captions.length)
    })
  })

  it('single layout has exactly 1 image', () => {
    pages.filter(p => p.layout === 'single').forEach((page, i) => {
      expect(page.images.length, `single page ${i}`).toBe(1)
    })
  })

  it('collage layout has exactly 2 images', () => {
    pages.filter(p => p.layout === 'collage').forEach((page, i) => {
      expect(page.images.length, `collage page ${i}`).toBe(2)
    })
  })

  it('triple layout has exactly 3 images', () => {
    pages.filter(p => p.layout === 'triple').forEach((page, i) => {
      expect(page.images.length, `triple page ${i}`).toBe(3)
    })
  })
})
