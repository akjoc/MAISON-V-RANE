import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from '../../lib/motion'
import { Icon } from '../primitives/Icon'

export interface FilmChapter {
  at: number
  title: string
  copy: string
}

interface ScrollFilmProps {
  posterKey: string
  posterAlt: string
  src?: string
  webmSrc?: string
  eyebrow: string
  heading: string
  chapters: FilmChapter[]
  id?: string
}

/**
 * A film that is scrubbed by scroll rather than autoplayed: scrolling moves
 * through the footage frame by frame. Playback controls are always available,
 * and reduced motion / unsupported devices get the poster and chapter text.
 */
export function ScrollFilm({
  posterKey,
  posterAlt,
  src = '/assets/video/aeroform-loop.mp4',
  webmSrc = '/assets/video/aeroform-loop.webm',
  eyebrow,
  heading,
  chapters,
  id = 'film',
}: ScrollFilmProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const seeking = useRef(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  // Fetch the film only when the section approaches the viewport.
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section || reduced || failed) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || video.dataset.loaded === 'true') return
        video.dataset.loaded = 'true'
        video.preload = 'auto'
        video.load()
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [reduced, failed])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !ready || reduced || failed) return

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setProgress(self.progress)
        setActive(Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length)))
        if (playing) return
        const duration = video.duration || 9
        if (!Number.isFinite(duration) || duration <= 0) return
        const target = Math.min(duration - 0.05, Math.max(0, self.progress * duration))
        if (Math.abs(video.currentTime - target) < 0.04) return
        if (seeking.current) return
        seeking.current = true
        const finish = () => {
          seeking.current = false
          video.removeEventListener('seeked', finish)
        }
        video.addEventListener('seeked', finish)
        if (typeof video.fastSeek === 'function') {
          video.fastSeek(target)
        } else {
          video.currentTime = target
        }
        window.setTimeout(finish, 400)
      },
    })
    return () => {
      trigger.kill()
    }
  }, [ready, reduced, failed, playing, chapters.length])

  // Stop continuous playback when the film leaves the viewport.
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section || !playing) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause()
          setPlaying(false)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [playing])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try {
        video.currentTime = 0
        await video.play()
        setPlaying(true)
      } catch {
        setFailed(true)
      }
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const poster = `/assets/images/${posterKey}-1600.webp`
  const showFilm = !reduced && !failed

  return (
    <section className={`film ${showFilm ? '' : 'film--still'}`} id={id} ref={sectionRef}>
      <div className="film__sticky">
        <div className="film__media">
          <img
            className={`film__poster ${ready && showFilm ? 'is-hidden' : ''}`}
            src={poster}
            srcSet={`/assets/images/${posterKey}-960.webp 960w, /assets/images/${posterKey}-1280.webp 1280w, /assets/images/${posterKey}-1600.webp 1600w, /assets/images/${posterKey}-1920.webp 1920w`}
            sizes="100vw"
            alt={posterAlt}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
          {showFilm && (
            <video
              ref={videoRef}
              className={`film__video ${ready ? 'is-ready' : ''}`}
              poster={poster}
              muted
              playsInline
              preload="none"
              loop
              aria-label="Original studio film: light moving across an Aéroform case"
              onLoadedMetadata={() => setReady(true)}
              onCanPlay={() => setReady(true)}
              onError={() => setFailed(true)}
              onEnded={() => setPlaying(false)}
            >
              <source src={webmSrc} type="video/webm" />
              <source src={src} type="video/mp4" />
            </video>
          )}
          <div className="film__scrim" aria-hidden="true" />
        </div>

        <div className="container film__content">
          <div className="film__copy">
            <p className="eyebrow film__eyebrow">{eyebrow}</p>
            <h2>{heading}</h2>
            <ol className="film__chapters">
              {chapters.map((c, i) => (
                <li key={c.title} className={active === i ? 'is-active' : ''}>
                  <span className="film__chapter-index">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="film__chapter-title">{c.title}</span>
                    <span className="film__chapter-copy">{c.copy}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="film__controls">
            <button
              type="button"
              className="film__control"
              onClick={togglePlay}
              disabled={!showFilm}
              aria-pressed={playing}
            >
              <Icon name={playing ? 'pause' : 'play'} size={14} />
              <span>{playing ? 'Pause film' : 'Play the film'}</span>
            </button>
            <span className="film__hint">
              {showFilm
                ? 'Scroll to move through the film · play to watch continuously'
                : 'Film unavailable — the poster frame is shown instead'}
            </span>
          </div>
        </div>

        <div className="film__progress" aria-hidden="true">
          <span style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </section>
  )
}
