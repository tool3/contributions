/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, Vector2 } from 'three'

import fragmentShader from './shader/fragment.glsl'
import vertexShader from './shader/vertex.glsl'

export default function Grid({
  color,
  active = true
}: {
  color: string
  active?: boolean
}) {
  const shader = useRef() as any
  const planeRef = useRef() as any

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  useFrame(({ clock }) => {
    if (active) {
      const elapsedTime = clock.getElapsedTime()
      if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
    }
  })

  const resolution = new Vector2(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  )

  useEffect(() => {
    if (shader.current) {
      shader.current.uniforms.uColor.value = new Color(color)
    }
  }, [color, shader])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color(color) },
      uResolution: {
        max: resolution,
        value: resolution
      }
    }),
    []
  )

  return (
    <Suspense fallback={null}>
      <mesh
        visible={active}
        name="grid"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
      >
        <planeGeometry ref={planeRef} args={[70, 70, 1, 1]} />
        <shaderMaterial
          attach="material"
          ref={shader}
          side={DoubleSide}
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh>
    </Suspense>
  )
}
