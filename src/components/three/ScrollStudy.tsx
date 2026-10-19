import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { usePinnedProgress } from '../../lib/scrollMotion'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Media } from '../primitives/Media'
import { Icon } from '../primitives/Icon'
import { hasWebGL, type ViewerMaterial } from './viewerSupport'
import { STUDY_MATERIALS } from './WatchModel'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { scrollToTarget } from '../../hooks/useLenis'

const ScrollStudyCanvas = lazy(() => import('./ScrollStudyCanvas'))

export interface StudyChapter {
  id: string
  index: string
  title: string
  copy: string
  meta: string
  /** Image used by the fallback sequence for this chapter. */
  imageKey: string
  alt: string
}

interface ScrollStudyProps {
  chapters: StudyChapter[]
  /** Section id used for anchor links. */
  id?: string
}

/**
 * A scroll-driven real-time study of the case. Scrolling rotates the watch
 * through four chapters, each with its detail hotspot.
 *
 * - Desktop + WebGL + motion allowed: three.js canvas driven by scroll.
 * - Mobile, reduced motion, or no WebGL: a labelled image sequence with the
 *   same chapters, or a static editorial grid under reduced motion.
 * - Chapter titles are buttons, so every chapter is reachable without
 *   scrolling: the experience never traps the page.
 */
export function ScrollStudy({ chapters, id = 'study' }: ScrollStudyProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<(HTMLDivElement | null)[]>([])
  const [chapter, setChapter] = useState(0)
  const [materialId, setMaterialId] = useState(STUDY_MATERIALS[0].id)
  const [webgl, setWebgl] = useState(false)
  const [enable3d, setEnable3d] = useState(true)
  const reduced = useReducedMotion()
  const [inView, setInView] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setWebgl(hasWebGL())
  }, [])

  // Pause the WebGL render loop whenever the study is off-screen.
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const use3d = webgl && enable3d && !reduced && !isMobile
  const material = STUDY_MATERIALS.find((m) => m.id === materialId) ?? STUDY_MATERIALS[0]

  // Scroll progress → ref (+ chapter index only when it changes). Progress is
  // measured from the section's live rect on every scroll frame, so it stays
  // correct when images or fonts change the page height above it.
  usePinnedProgress(
    sectionRef,
    (progress) => {
      progressRef.current = progress
      if (stageRef.current) {
        stageRef.current.style.setProperty('--study-progress', String(progress))
      }
      if (!use3d) {
        // Image-sequence fallback: crossfade + slow push-in per chapter.
        const scaled = progress * chapters.length
        layersRef.current.forEach((layer, i) => {
          if (!layer) return
          const distance = scaled - i
          const opacity = distance < -1 || distance > 1 ? 0 : 1 - Math.min(1, Math.abs(distance))
          layer.style.opacity = String(Math.max(0.06, opacity))
          layer.style.transform = `scale(${1.06 + Math.min(1, Math.max(0, distance + 1)) * 0.04})`
        })
      }
    },
    {
      enabled: !reduced,
      chapters: chapters.length,
      onChapter: (index) => setChapter((current) => (current === index ? current : index)),
    },
  )

  // Reduced motion: no long scroll section, just a quiet reveal.
  useEffect(() => {
    if (!reduced) return
    layersRef.current.forEach((layer) => {
      if (layer) {
        layer.style.opacity = ''
        layer.style.transform = ''
      }
    })
  }, [reduced])

  const goToChapter = useCallback(
    (index: number) => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const startY = window.scrollY + rect.top
      const scrollable = section.offsetHeight - window.innerHeight
      const target = startY + (scrollable * (index + 0.12)) / chapters.length
      scrollToTarget(Math.max(0, target))
    },
    [chapters.length],
  )

  if (reduced) {
    return (
      <section className="study study--static" id={id} aria-label="Aéroform case study">
        <div className="container">
          <div className="study__static-head">
            <p className="eyebrow">
              <span className="eyebrow__num">04</span> Case architecture
            </p>
            <h2>The case, in four studies</h2>
            <p className="prose">
              Motion is reduced in your browser, so the study is shown as a still sequence rather
              than a scroll-rotated model.
            </p>
          </div>
          <div className="study__static-grid">
            {chapters.map((c) => (
              <figure key={c.id} className="study__static-item">
                <Media imageKey={c.imageKey} alt={c.alt} orientation="square" ratio="portrait" sizes="(min-width: 900px) 23vw, 46vw" />
                <figcaption>
                  <span className="micro">{c.index}</span>
                  <span className="serif">{c.title}</span>
                  <span className="small">{c.copy}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="study" id={id} ref={sectionRef} aria-label="Aéroform case study">
      <div className="study__sticky" ref={stageRef}>
        <div className="container study__grid">
          <div className="study__copy">
            <p className="eyebrow study__eyebrow">
              <span className="eyebrow__num">04</span> Case architecture
            </p>
            <h2 className="study__title">
              Scroll to turn
              <br />
              <em>the case.</em>
            </h2>

            <div className="study__chapters">
              {chapters.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className={`study__chapter ${chapter === i ? 'is-active' : ''}`}
                  aria-current={chapter === i ? 'true' : undefined}
                  onClick={() => goToChapter(i)}
                >
                  <span className="study__chapter-index">{c.index}</span>
                  <span className="study__chapter-body">
                    <span className="study__chapter-title">{c.title}</span>
                    <span className="study__chapter-copy">{c.copy}</span>
                    <span className="study__chapter-meta">{c.meta}</span>
                  </span>
                </button>
              ))}
            </div>

            {use3d && (
              <div className="study__materials" role="radiogroup" aria-label="Study finish">
                {STUDY_MATERIALS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={material.id === m.id}
                    className={`study__material ${material.id === m.id ? 'is-active' : ''}`}
                    onClick={() => setMaterialId(m.id)}
                  >
                    <span className="study__material-chip" style={{ background: m.dialColor }} aria-hidden="true" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="study__foot">
              <span className="micro">
                {use3d ? 'Real-time study · original procedural model' : 'Image sequence · 3D optional'}
              </span>
              {!use3d && webgl && !isMobile && (
                <button type="button" className="text-link" onClick={() => setEnable3d(true)}>
                  Enable 3D <Icon name="rotate" size={13} />
                </button>
              )}
              {use3d && (
                <button type="button" className="text-link" onClick={() => setEnable3d(false)}>
                  Use image sequence <Icon name="arrow-right" size={13} />
                </button>
              )}
            </div>
          </div>

          <div className={`study__stage ${use3d ? 'is-3d' : 'is-fallback'}`}>
            <div className="study__stage-inner">
              {use3d ? (
                <Suspense
                  fallback={
                    <div className="study__loading">
                      <span className="viewer__spinner" aria-hidden="true" />
                      <p>Preparing the study…</p>
                    </div>
                  }
                >
                  <ScrollStudyCanvas
                    progressRef={progressRef}
                    chapter={chapter}
                    hotspots
                    material={material as ViewerMaterial}
                    active={inView}
                  />
                </Suspense>
              ) : (
                <div className="study__frames">
                  {chapters.map((c, i) => (
                    <div
                      key={c.id}
                      className="study__frame"
                      ref={(el) => {
                        layersRef.current[i] = el
                      }}
                      style={{ opacity: i === 0 ? 1 : 0 }}
                      aria-hidden={chapter !== i}
                    >
                      <Media
                        imageKey={c.imageKey}
                        alt={chapter === i ? c.alt : ''}
                        orientation="square"
                        ratio="square"
                        sizes="(min-width: 1024px) 46vw, 92vw"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                  <div className="study__frame-badge">
                    <span className="micro">Frame</span>
                    <span className="tabular">
                      {String(chapter + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="study__stage-caption" aria-live="polite">
              <span className="micro">{chapters[chapter].index} / 04</span>
              <span className="serif">{chapters[chapter].title}</span>
              <span className="micro">{chapters[chapter].meta}</span>
            </div>
            <div className="study__progress" aria-hidden="true">
              <span className="study__progress-track">
                <span className="study__progress-fill" />
              </span>
              <span className="study__progress-label micro">
                {chapters[chapter].index} — {chapters[chapter].title}
              </span>
            </div>
            <p className="study__disclaimer">
              Original stylised study. It is not a photographic or engineering model, and no
              manufacturer data is represented.
            </p>
          </div>
        </div>
        <span className="study__cue" aria-hidden="true">
          <span className="line" /> Scroll
        </span>
      </div>
    </section>
  )
}
