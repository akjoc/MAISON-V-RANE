import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, OrbitControls } from '@react-three/drei'
import type { ViewerMaterial } from './viewerSupport'
import { STUDY_DETAILS, StudioRig, Watch } from './WatchModel'

interface Props {
  materials: ViewerMaterial[]
  activeMaterialId: string
  autoRotate: boolean
  hotspots: boolean
  reducedMotion: boolean
  active?: boolean
}

function Hotspot({ label, position }: { label: string; position: readonly [number, number, number] }) {
  const [open, setOpen] = useState(false)
  return (
    <Html
      position={position as unknown as [number, number, number]}
      center
      distanceFactor={8}
      zIndexRange={[20, 0]}
    >
      <div className="hotspot">
        <button
          type="button"
          className="hotspot__dot"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">+</span>
        </button>
        {open && (
          <span className="hotspot__label" role="status">
            {label}
          </span>
        )}
      </div>
    </Html>
  )
}

export default function ProductViewerCanvas({
  materials,
  activeMaterialId,
  autoRotate,
  hotspots,
  reducedMotion,
  active = true,
}: Props) {
  const material = materials.find((m) => m.id === activeMaterialId) ?? materials[0]

  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.8]}
      camera={{ position: [0, 3.4, 7.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      aria-label="Interactive stylised three-dimensional study of the Aéroform watch"
      role="img"
    >
      <Suspense fallback={null}>
        <StudioRig />
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

        <Watch material={material} idle={!reducedMotion} />

        {hotspots && STUDY_DETAILS.map((d) => <Hotspot key={d.id} label={d.label} position={d.position} />)}

        <ContactShadows position={[0, -2.6, 0]} opacity={0.4} scale={14} blur={2.6} far={6} color="#3a332a" />
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={5.2}
          maxDistance={11}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.75}
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.06}
          makeDefault
        />
      </Suspense>
    </Canvas>
  )
}
