import { useEffect, useRef, useState } from 'react'
import { usePinnedProgress } from '../../lib/scrollMotion'
import { assetUrl, imageSrc, imageSrcSet } from '../../lib/assets'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Icon } from './Icon'

export interface FilmChapter {
  at: number
  title: string
  copy: string
}

interface ScrollFilmProps {
  id?: string
  eyebrow?: string
  heading: string
  chapters: FilmChapter[]
  posterKey: string
  posterAlt: string
  src?: string
}

/**
 * A film driven by the scrollbar rather than by time.
 *
 * The section is taller than the viewport; its stage is pinned and the video's
 * currentTime is mapped to scroll progress, so moving down the page moves
 * forward through the shot. Seeking is guarded (one in flight at a time) and
 * every browser that cannot scrub — or a visitor who prefers reduced motion —
 * gets the poster and the written chapters instead of a stalled frame.
 */
export function ScrollFilm({
  id = 'film',
  eyebrow = 'Film study',
  heading,
  chapters,
  posterKey,
  posterAlt,
  src = assetUrl('assets/video/aeroform-loop.mp4'),
}: ScrollFilmProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress] = useState(0)
  const progressRef = useRef(0)
  const progressBarRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [mode, setMode] = useState<'scroll' | 'play'>('scroll')
  const modeRef = useRef(mode)
  const seeking = useRef(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  // Load the film when the section nears the viewport.
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section || reduced || failed) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || video.dataset.loaded === 'true') return
        video.dataset.loaded = 'true'
        video.load()
      },
      { rootMargin: '300px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [reduced, failed])

  // Keep the film paused while it is scrub-controlled.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (mode === 'scroll') {
      video.pause()
      video.muted = true
    } else {
      void video.play().catch(() => setMode('scroll'))
    }
  }, [mode])

  // Scroll progress drives the film. Measured live from the section's rect so
  // the mapping survives layout changes above it.
  usePinnedProgress(
    sectionRef,
    (p) => {
      progressRef.current = p
      const bar = progressBarRef.current
      if (bar) bar.style.transform = `scaleX(${Math.max(0.002, p)})`

      if (modeRef.current !== 'scroll') return
      const video = videoRef.current
      if (!video || seeking.current || video.readyState < 2) return
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0.1) return
      const target = Math.min(duration - 0.06, Math.max(0, p * duration))
      if (Math.abs(video.currentTime - target) < 0.03) return

      seeking.current = true
      const release = () => {
        seeking.current = false
        video.removeEventListener('seeked', release)
      }
      video.addEventListener('seeked', release)
      if (typeof video.fastSeek === 'function') video.fastSeek(target)
      else video.currentTime = target
      // A browser that never fires `seeked` must not lock the film up.
      window.setTimeout(release, 400)
    },
    {
      enabled: !reduced && !failed,
      chapters: chapters.length,
      onChapter: (index) => setActive((current) => (current === index ? current : index)),
    },
  )

  // Once the film can seek (or after it has been played), put the frame back
  // under scroll control at the current position.
  useEffect(() => {
    if (!ready || failed || reduced || mode !== 'scroll') return
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0.1) return
    const target = Math.min(video.duration - 0.06, Math.max(0, progressRef.current * video.duration))
    if (Math.abs(video.currentTime - target) > 0.03) video.currentTime = target
  }, [ready, mode, failed, reduced])

  const still = !ready || failed || reduced
  const current = chapters[Math.min(active, chapters.length - 1)]

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`film ${still ? 'film--still' : ''}`.trim()}
      aria-labelledby={`${id}-title`}
    >
      <div className="film__sticky">
        <div className="film__media">
          <img
            className={`film__poster ${!still ? 'is-hidden' : ''}`}
            src={imageSrc(posterKey, 1600)}
            srcSet={imageSrcSet(posterKey, 'wide', 'webp')}
            sizes="100vw"
            alt={posterAlt}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
          {!reduced && !failed && (
            <video
              ref={videoRef}
              className={`film__video ${!still ? 'is-ready' : ''}`}
              muted
              playsInline
              loop={mode === 'play'}
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
              onLoadedData={() => setReady(true)}
              onCanPlay={() => setReady(true)}
              onError={() => {
                setFailed(true)
                setReady(false)
              }}
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
          <div className="film__scrim" aria-hidden="true" />
        </div>

        <div className="film__content">
          <div className="container">
            <p className="eyebrow film__eyebrow">{eyebrow}</p>
            <h2 id={`${id}-title`} className="film__title">
              {heading}
            </h2>
            <div className="film__chapter">
              <span className="film__chapter-index tabular">
                {String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
              </span>
              <h3 className="film__chapter-title">{current?.title}</h3>
              <p className="film__chapter-copy">{current?.copy}</p>
            </div>
            <ol className="film__marks" aria-label="Film chapters">
              {chapters.map((chapter, i) => (
                <li key={chapter.title} className={i === active ? 'is-active' : ''}>
                  <button
                    type="button"
                    onClick={() => {
                      const section = sectionRef.current
                      if (!section) return
                      const start = section.offsetTop
                      const span = section.offsetHeight - window.innerHeight
                      window.scrollTo({ top: start + span * chapter.at, behavior: 'smooth' })
                    }}
                    aria-current={i === active ? 'true' : undefined}
                  >
                    <span className="film__mark-line" aria-hidden="true" />
                    <span className="film__mark-label">{chapter.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="film__actions">
              <button
                type="button"
                className="film__play"
                onClick={() => setMode(mode === 'play' ? 'scroll' : 'play')}
                disabled={failed || reduced}
              >
                <Icon name={mode === 'play' ? 'pause' : 'play'} size={13} />
                {mode === 'play' ? 'Back to scroll control' : 'Play the film'}
              </button>
              <span className="film__hint">
                {failed
                  ? 'Film unavailable — still frames shown.'
                  : reduced
                    ? 'Motion reduced — still frames shown.'
                    : mode === 'play'
                      ? 'Playing · the scroll position is no longer driving the film.'
                      : 'Scroll to move the film forward.'}
              </span>
            </div>
          </div>
        </div>

        <div className="film__progress" aria-hidden="true">
          <span ref={progressBarRef} style={{ transform: `scaleX(${Math.max(0.002, progress)})` }} />
        </div>
      </div>
    </section>
  )
}
