import { Suspense, useMemo, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, OrbitControls, RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import type { ViewerMaterial } from './viewerSupport'

interface Props {
  materials: ViewerMaterial[]
  activeMaterialId: string
  autoRotate: boolean
  hotspots: boolean
  reducedMotion: boolean
}

const DETAILS = [
  { id: 'crown', label: 'Fluted crown · oxblood cabochon', position: [2.28, 0.05, 0] },
  { id: 'bezel', label: 'Engraved bezel · polished chamfer', position: [1.55, 0.62, 1.35] },
  { id: 'dial', label: 'Brushed dial · applied indices', position: [-0.8, 0.62, -0.9] },
  { id: 'bracelet', label: 'Integrated H-link bracelet', position: [0, -0.25, 2.75] },
] as const

function Watch({ material, reducedMotion }: { material: ViewerMaterial; reducedMotion: boolean }) {
  const group = useRef<Group>(null)
  const auto = useMemo(() => !reducedMotion, [reducedMotion])

  useFrame((_, delta) => {
    if (!group.current || !auto) return
    // A very slow idle drift only; OrbitControls handles user rotation.
    group.current.rotation.y += delta * 0.06
  })

  const indices = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number; size: [number, number, number] }[] = []
    for (let i = 0; i < 12; i += 1) {
      if (i === 3 || i === 9) continue
      const angle = (i / 12) * Math.PI * 2
      const radius = 1.48
      items.push({
        pos: [Math.sin(angle) * radius, 0.5, Math.cos(angle) * radius],
        rot: -angle,
        size: [0.07, 0.03, 0.28],
      })
    }
    return items
  }, [])

  const links = useMemo(() => {
    const result: { z: number; y: number; rx: number; w: number }[] = []
    for (let i = 1; i <= 5; i += 1) {
      const t = i / 5
      result.push({
        z: 2.05 + i * 0.34,
        y: -0.1 - t * t * 0.9,
        rx: -t * 0.5,
        w: 1.75 - t * 0.55,
      })
      result.push({
        z: -(2.05 + i * 0.34),
        y: -0.1 - t * t * 0.9,
        rx: t * 0.5,
        w: 1.75 - t * 0.55,
      })
    }
    return result
  }, [])

  return (
    <group ref={group} rotation={[0.42, -0.35, 0]} scale={0.92} position={[0, -0.1, 0]}>
      {/* Case body */}
      <RoundedBox args={[4.15, 0.95, 4.15]} radius={0.52} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial color={material.caseColor} metalness={material.metalness} roughness={0.38} />
      </RoundedBox>

      {/* Bezel plate */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[2.02, 2.02, 0.1, 96]} />
        <meshStandardMaterial color={material.caseColor} metalness={0.94} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[1.82, 1.82, 0.04, 96]} />
        <meshStandardMaterial color="#1e1e1c" metalness={0.7} roughness={0.55} />
      </mesh>

      {/* Dial */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[1.76, 1.76, 0.03, 96]} />
        <meshStandardMaterial color={material.dialColor} metalness={0.35} roughness={0.62} />
      </mesh>

      {/* Subdials */}
      {[0.62, -0.62].map((x) => (
        <mesh key={x} position={[x, 0.6, 0.55]}>
          <cylinderGeometry args={[0.42, 0.42, 0.012, 64]} />
          <meshStandardMaterial color="#2b2a27" metalness={0.5} roughness={0.7} />
        </mesh>
      ))}

      {/* Indices */}
      {indices.map((item, i) => (
        <mesh key={i} position={item.pos} rotation={[0, item.rot, 0]}>
          <boxGeometry args={item.size} />
          <meshStandardMaterial color="#cfccc2" metalness={1} roughness={0.22} />
        </mesh>
      ))}

      {/* Hands */}
      <group position={[0, 0.63, 0]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0, 0.42]}>
          <boxGeometry args={[0.055, 0.02, 0.9]} />
          <meshStandardMaterial color="#e6e2d8" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.28, 0, 0.05]} rotation={[0, 1.1, 0]}>
          <boxGeometry args={[0.045, 0.02, 0.62]} />
          <meshStandardMaterial color="#e6e2d8" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.3]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.016, 0.02, 1.2]} />
          <meshStandardMaterial color="#6f1a20" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.03, 24]} />
          <meshStandardMaterial color="#cfccc2" metalness={1} roughness={0.2} />
        </mesh>
      </group>

      {/* Crystal */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.06, 96]} />
        <meshPhysicalMaterial
          color="#e8e6df"
          transparent
          opacity={0.16}
          roughness={0.05}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          transmission={0.35}
        />
      </mesh>

      {/* Crown */}
      <group position={[2.12, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.32, 24]} />
          <meshStandardMaterial color={material.caseColor} metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.115, 24, 24]} />
          <meshPhysicalMaterial color="#5e1a1f" roughness={0.16} metalness={0.2} clearcoat={1} />
        </mesh>
      </group>

      {/* Bracelet links */}
      {links.map((link, i) => (
        <RoundedBox
          key={i}
          args={[link.w, 0.3, 0.28]}
          radius={0.08}
          smoothness={3}
          position={[0, link.y - 0.2, link.z]}
          rotation={[link.rx, 0, 0]}
          castShadow
        >
          <meshStandardMaterial
            color={material.strapColor}
            metalness={material.id === 'steel' ? 0.9 : 0.18}
            roughness={material.id === 'steel' ? 0.34 : 0.62}
          />
        </RoundedBox>
      ))}

      {/* Lugs */}
      {[1.75, -1.75].map((z) => (
        <RoundedBox key={z} args={[1.5, 0.4, 0.4]} radius={0.1} smoothness={3} position={[0, -0.22, z]}>
          <meshStandardMaterial color={material.caseColor} metalness={0.9} roughness={0.36} />
        </RoundedBox>
      ))}
    </group>
  )
}

function Hotspot({
  label,
  position,
}: {
  label: string
  position: readonly [number, number, number]
}) {
  const [open, setOpen] = useState(false)
  return (
    <Html position={position as unknown as [number, number, number]} center distanceFactor={8} zIndexRange={[20, 0]}>
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
        {open && <span className="hotspot__label" role="status">{label}</span>}
      </div>
    </Html>
  )
}

export default function ProductViewerCanvas({ materials, activeMaterialId, autoRotate, hotspots, reducedMotion }: Props) {
  const material = materials.find((m) => m.id === activeMaterialId) ?? materials[0]

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 3.4, 7.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      aria-label="Interactive stylised three-dimensional study of the Aéroform watch"
      role="img"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 3, -4]} intensity={0.7} color="#d8c8ab" />
        <spotLight position={[0, 8, 0]} angle={0.7} penumbra={1} intensity={1.1} color="#f4e8d2" />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, -6]} scale={[10, 6, 1]} color="#fff6e6" />
          <Lightformer form="rect" intensity={1.1} position={[-6, 2, 4]} scale={[6, 8, 1]} rotation={[0, Math.PI / 2, 0]} color="#e8ddc8" />
          <Lightformer form="rect" intensity={0.7} position={[6, 1, 3]} scale={[6, 8, 1]} rotation={[0, -Math.PI / 2, 0]} />
        </Environment>

        <Watch material={material} reducedMotion={reducedMotion} />

        {hotspots && DETAILS.map((d) => <Hotspot key={d.id} label={d.label} position={d.position} />)}

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

