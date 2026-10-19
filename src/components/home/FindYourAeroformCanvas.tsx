import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import type { ViewerMaterial } from '../three/viewerSupport'
import { StudioRig, Watch } from '../three/WatchModel'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'

interface Props {
  material: ViewerMaterial
  sizeScale: number
  autoRotate: boolean
  reducedMotion: boolean
  active?: boolean
}

export default function FindYourAeroformCanvas({
  material,
  sizeScale,
  autoRotate,
  reducedMotion,
  active = true,
}: Props) {
  const controlsRef = useRef<OrbitControlsType>(null)

  return (
    <Canvas
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.8]}
      camera={{ position: [0, 1.6, 6.2], fov: 36 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      aria-label="3D Interactive Visualizer of MAISON VÉRANE Aéroform"
      role="img"
    >
      <Suspense fallback={null}>
        <StudioRig />
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[0, 5, -6]}
            scale={[10, 6, 1]}
            color="#fff8ed"
          />
          <Lightformer
            form="rect"
            intensity={1.3}
            position={[-5, 2, 4]}
            scale={[6, 8, 1]}
            rotation={[0, Math.PI / 2, 0]}
            color="#faecd2"
          />
          <Lightformer
            form="rect"
            intensity={0.9}
            position={[5, 1, 3]}
            scale={[6, 8, 1]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </Environment>

        <group scale={sizeScale} position={[0, -0.15, 0]}>
          <Watch material={material} idle={!reducedMotion} />
        </group>

        {/* Soft realistic ground shadow onto the horizon plane */}
        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={0.42}
          scale={11}
          blur={2.4}
          far={5.5}
          color="#221e1a"
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.85}
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={0.9}
          enableDamping
          dampingFactor={0.06}
        />
      </Suspense>
    </Canvas>
  )
}
