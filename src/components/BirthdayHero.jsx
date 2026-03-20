// src/components/BirthdayHero.jsx
import './BirthdayHero.css'

export default function BirthdayHero() {
  return (
    <section className="birthday-hero" aria-label="Birthday greeting">
      <div className="birthday-hero__content">
        <p className="birthday-hero__eyebrow">🎉 today is a special day 🎉</p>
        <p className="birthday-hero__headline">Happy Birthday,</p>
        <p className="birthday-hero__name">Dipu! 🎂</p>
      </div>
      <p
        className="birthday-hero__scroll-hint"
        role="button"
        tabIndex={0}
        onClick={() => document.getElementById('collage')?.scrollIntoView({ behavior: 'smooth' })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ')
            document.getElementById('collage')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        scroll down for some memories ↓
      </p>
    </section>
  )
}
