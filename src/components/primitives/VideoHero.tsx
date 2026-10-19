import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { imageSrc, imageSrcSet } from '../../lib/assets'

interface VideoHeroProps {
  posterKey: string
  posterAlt: string
  /** Original, locally generated loop. */
  src?: string
  children?: ReactNode
  className?: string
  label?: string
  note?: string
}

/**
 * Muted, looping, inline hero video with poster-first rendering, explicit
 * play/pause and mute controls, reduced-motion respect and a graceful
 * image fallback if autoplay or decoding fails.
 */
export function VideoHero({
  posterKey,
  posterAlt,
  src = '/assets/video/aeroform-loop.mp4',
  children,
  className = '',
  label = 'Aéroform, in motion',
  note = 'Original studio loop — replaceable placeholder',
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    const attempt = async () => {
      try {
        video.muted = true
        await video.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
        setReady(false)
      }
    }
    const t = window.setTimeout(attempt, 200)
    return () => window.clearTimeout(t)
  }, [reduced])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play().then(() => setPlaying(true)).catch(() => setFailed(true))
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const poster = imageSrc(posterKey, 1600)

  return (
    <section
      className={`vhero ${ready && !failed && !reduced ? 'is-video-ready' : ''} ${className}`.trim()}
      aria-label={label}
    >
      <img
        className="vhero__poster"
        src={poster}
        srcSet={imageSrcSet(posterKey, 'wide', 'webp')}
        sizes="100vw"
        alt={posterAlt}
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="sync"
      />
      {!failed && !reduced && (
        <video
          ref={videoRef}
          className="vhero__video"
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={label}
          onCanPlay={() => setReady(true)}
          onPlaying={() => setReady(true)}
          onError={() => {
            setFailed(true)
            setReady(false)
          }}
        >
            <source src={src} type="video/mp4" />
        </video>
      )}
      <div className="vhero__scrim" aria-hidden="true" />
      {children}
      {!failed && !reduced && (
        <div className="vhero__controls">
          <button
            type="button"
            className="vhero__ctrl"
            onClick={togglePlay}
            aria-label={playing ? 'Pause background film' : 'Play background film'}
          >
            <Icon name={playing ? 'pause' : 'play'} size={15} />
          </button>
          <button
            type="button"
            className="vhero__ctrl"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute background film' : 'Mute background film'}
          >
            <Icon name={muted ? 'sound-off' : 'sound-on'} size={15} />
          </button>
        </div>
      )}
      {(failed || reduced) && <p className="vhero__fallback-note">Still image shown — film unavailable or motion reduced.</p>}
      <span className="visually-hidden">{note}</span>
    </section>
  )
}
