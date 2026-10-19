export interface ViewerMaterial {
  id: string
  label: string
  caseColor: string
  dialColor: string
  strapColor: string
  metalness: number
  roughness: number
}

/** True when a WebGL context can be created in this browser. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}
