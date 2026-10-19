import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../primitives/Icon'
import { Media } from '../primitives/Media'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { hasWebGL, type ViewerMaterial } from './viewerSupport'

const ProductViewerCanvas = lazy(() => import('./ProductViewerCanvas'))

interface ProductViewerProps {
  fallbackImageKey: string
  fallbackAlt: string
}

const VIS_MATERIALS: ViewerMaterial[] = [
  {
    id: 'steel',
    label: 'Brushed steel · graphite',
    caseColor: '#b9b7ae',
    dialColor: '#3b3935',
    strapColor: '#a9a7a0',
    metalness: 0.92,
    roughness: 0.33,
  },
  {
    id: 'champagne',
    label: 'Steel · champagne',
    caseColor: '#bcb8ad',
    dialColor: '#c3a878',
    strapColor: '#b7a78a',
    metalness: 0.88,
    roughness: 0.36,
  },
  {
    id: 'oxblood',
    label: 'Steel · oxblood',
    caseColor: '#b9b7ae',
    dialColor: '#5e1a1f',
    strapColor: '#4b3335',
    metalness: 0.78,
    roughness: 0.44,
  },
]

class ViewerBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

/**
 * Optional interactive 3D. The canvas bundle is loaded only when the visitor
 * asks for it; mobile, reduced-motion and non-WebGL visitors get the still
 * image unless they explicitly opt in.
 */
export function ProductViewer({ fallbackImageKey, fallbackAlt }: ProductViewerProps) {
  const [enabled, setEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [visible, setVisible] = useState(true)
  const [materialId, setMaterialId] = useState(VIS_MATERIALS[0].id)
  const [autoRotate, setAutoRotate] = useState(true)
  const [hotspots, setHotspots] = useState(true)
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = wrapRef.current
    if (!node || !mounted) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [mounted])

  const supported = typeof window !== 'undefined' && hasWebGL()

  return (
    <div className="viewer" ref={wrapRef}>
      <div className="viewer__stage">
        {enabled && !failed && supported ? (
          <ViewerBoundary onError={() => setFailed(true)}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Suspense
                fallback={
                  <div className="viewer__loading">
                    <span className="viewer__spinner" aria-hidden="true" />
                    <p>Preparing the interactive study…</p>
                  </div>
                }
              >
                <ProductViewerCanvas
                  materials={VIS_MATERIALS}
                  activeMaterialId={materialId}
                  autoRotate={autoRotate && visible}
                  hotspots={hotspots}
                  reducedMotion={reduced}
                  active={visible}
                />
              </Suspense>
            </div>
          </ViewerBoundary>
        ) : (
          <div className="viewer__still">
            <Media
              imageKey={fallbackImageKey}
              alt={fallbackAlt}
              orientation="square"
              ratio="square"
              sizes="(min-width: 900px) 46vw, 92vw"
            />
            <div className="viewer__still-note">
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 6 }}>Image study</p>
              <p>
                {failed
                  ? 'The 3D study could not start on this device. The product photography remains fully available.'
                  : reduced
                    ? 'Motion is reduced. You can still enable the interactive study below.'
                    : 'A stylised procedural study is available. No photographic model is claimed.'}
              </p>
              <button
                type="button"
                className="btn btn--outline btn--small"
                onClick={() => {
                  setFailed(false)
                  setMounted(true)
                  setEnabled(true)
                }}
                disabled={!supported}
              >
                <span>{supported ? 'Enable interactive 3D study' : 'WebGL unavailable on this device'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {enabled && !failed && supported && (
        <div className="viewer__bar">
          <div className="viewer__materials" role="radiogroup" aria-label="Study material">
            {VIS_MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={materialId === m.id}
                className="viewer__material"
                onClick={() => setMaterialId(m.id)}
              >
                <span className="viewer__material-chip" style={{ background: m.dialColor }} />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          <div className="viewer__toggles">
            <button type="button" className="chip" aria-pressed={autoRotate} onClick={() => setAutoRotate((v) => !v)}>
              <Icon name="rotate" size={13} /> {autoRotate ? 'Idle rotation on' : 'Idle rotation off'}
            </button>
            <button type="button" className="chip" aria-pressed={hotspots} onClick={() => setHotspots((v) => !v)}>
              <Icon name="sparkle" size={13} /> Details {hotspots ? 'on' : 'off'}
            </button>
          </div>
        </div>
      )}
      {enabled && (
        <p className="viewer__disclaimer">
          A stylised procedural prototype — not a photographic or engineering model. Drag to rotate,
          scroll to zoom. Rendering pauses off-screen.
        </p>
      )}
    </div>
  )
}
