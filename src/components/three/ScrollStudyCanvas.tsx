import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer } from '@react-three/drei'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { STUDY_DETAILS, Watch } from './WatchModel'
import type { ViewerMaterial } from './viewerSupport'

interface StudyProps {
  progressRef: RefObject<number>
  chapter: number
  hotspots: boolean
  material: ViewerMaterial
}

interface Props extends StudyProps {
  active: boolean
}

/**
 * The watch, rotated by document scroll. Rotation is read from a ref every
 * frame (never React state), so scrolling stays at frame rate.
 */
function ScrollDrivenWatch({ progressRef, chapter, hotspots, material }: StudyProps) {
  const pivot = useRef<Group>(null)
  const detail = STUDY_DETAILS[Math.min(chapter, STUDY_DETAILS.length - 1)]

  useFrame((_, delta) => {
    const node = pivot.current
    if (!node) return
    const p = progressRef.current ?? 0
    const targetY = -0.55 + p * Math.PI * 1.92
    const targetX = 0.44 - p * 0.26
    const targetScale = 0.9 + Math.sin(p * Math.PI) * 0.16
    const damp = Math.min(1, delta * 7)
    node.rotation.y += (targetY - node.rotation.y) * damp
    node.rotation.x += (targetX - node.rotation.x) * damp
    node.scale.setScalar(node.scale.x + (targetScale - node.scale.x) * damp)
  })

  return (
    <group ref={pivot} rotation={[0.44, -0.55, 0]} scale={0.9}>
      <Watch material={material} />
      {hotspots && (
        <Html
          position={detail.position as unknown as [number, number, number]}
          center
          distanceFactor={9}
          zIndexRange={[10, 0]}
        >
          <div className="study-hotspot" aria-live="polite">
            <span className="study-hotspot__dot" aria-hidden="true" />
            <span className="study-hotspot__label">{detail.label}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ScrollStudyCanvas({ progressRef, chapter, hotspots, material, active }: Props) {
  const camera = useMemo(() => ({ position: [0, 3.1, 8.2] as [number, number, number], fov: 32 }), [])

  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.7]}
      camera={camera}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-label="Three-dimensional study of the Aéroform watch, rotated by scrolling"
      role="img"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 7, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 3, -4]} intensity={0.75} color="#d8c8ab" />
        <spotLight position={[0, 8, 0]} angle={0.7} penumbra={1} intensity={1.05} color="#f4e8d2" />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, -6]} scale={[10, 6, 1]} color="#fff6e6" />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[-6, 2, 4]}
            scale={[6, 8, 1]}
            rotation={[0, Math.PI / 2, 0]}
            color="#e8ddc8"
          />
          <Lightformer
            form="rect"
            intensity={0.7}
            position={[6, 1, 3]}
            scale={[6, 8, 1]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </Environment>
        <ScrollDrivenWatch
          progressRef={progressRef}
          chapter={chapter}
          hotspots={hotspots}
          material={material}
        />
        <ContactShadows position={[0, -2.7, 0]} opacity={0.38} scale={15} blur={2.8} far={7} color="#3a332a" />
      </Suspense>
    </Canvas>
  )
}
