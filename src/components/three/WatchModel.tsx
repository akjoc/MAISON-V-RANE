import { useMemo, useRef } from 'react'
import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { ViewerMaterial } from './viewerSupport'

/**
 * Original procedural study of the Aéroform case. Deliberately stylised —
 * it is a design prototype, not an engineering or photographic model.
 */

export const STUDY_MATERIALS: ViewerMaterial[] = [
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

/** Neutral palette used by the scroll-driven study. */
export const STUDIO_MATERIAL = STUDY_MATERIALS[0]

export const STUDY_DETAILS = [
  { id: 'crown', label: 'Fluted crown · oxblood cabochon', position: [2.28, 0.05, 0] as const },
  { id: 'bezel', label: 'Engraved bezel · polished chamfer', position: [1.55, 0.62, 1.35] as const },
  { id: 'dial', label: 'Brushed dial · applied indices', position: [-0.8, 0.62, -0.9] as const },
  { id: 'bracelet', label: 'Integrated H-link bracelet', position: [0, -0.25, 2.75] as const },
]

interface WatchProps {
  material: ViewerMaterial
  /** Idle drift for the product viewer; disable when scroll drives rotation. */
  idle?: boolean
}

export function Watch({ material, idle = false }: WatchProps) {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!group.current || !idle) return
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

/** Shared studio lighting so every 3D surface reads the same way. */
export function StudioRig() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 3, -4]} intensity={0.7} color="#d8c8ab" />
      <spotLight position={[0, 8, 0]} angle={0.7} penumbra={1} intensity={1.1} color="#f4e8d2" />
    </>
  )
}
