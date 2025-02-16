/* eslint-disable react/no-unknown-property */
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import { Canvas, Vector3 } from '@react-three/fiber'
import gsap from 'gsap'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { ReactNode, Suspense, useLayoutEffect, useRef, useState } from 'react'

import { useDeviceDetect } from '~/ts/hooks/use-device-detect'

import Debug from '../debug/debug'

export default function CanvasWithModel({
  className,
  orbitEnabled = true,
  panel = false,
  maxZoom = 100,
  minZoom = 5,
  initZoom = 20,
  cameraPosition = [0, 0, 100],
  children
}: {
  className?: string
  orbitEnabled?: boolean
  panel?: boolean
  maxZoom?: number
  minZoom?: number
  initZoom?: number
  cameraPosition?: Vector3
  children: ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef([0, 0, 0]) as any
  const [active, setActive] = useState(panel)
  const { isMobile, isTablet } = useDeviceDetect()
  const zoom = isMobile && !isTablet ? 13 : initZoom

  const { perf, rotate } = useControls({
    perf: false,
    rotate: true
  })

  useLayoutEffect(() => {
    if (target.current) {
      gsap.to(target.current.position, {
        z: 0,
        delay: 1
      })
    }
  }, [target])

  return (
    <>
      <Leva collapsed hidden={!active} />
      {perf ? <Stats /> : null}
      <Debug set={setActive} />
      <Canvas
        className={className}
        ref={canvasRef}
        dpr={[1, 2]}
        orthographic
        shadows
        camera={{
          frustumCulled: true,
          fov: 50,
          position: cameraPosition,
          zoom
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          height: '100svh',
          width: '100vw'
        }}
      >
        {perf ? <Perf position="bottom-left" logsPerSecond={1} /> : null}
        <color attach={'background'} args={['#000']} />
        <Suspense fallback={null}>{children}</Suspense>
        <Environment files={'/textures/environments/autumn_field_1k.hdr'} />
        <OrbitControls
          autoRotate={rotate}
          ref={target}
          makeDefault
          enabled={orbitEnabled}
          minZoom={minZoom}
          maxZoom={maxZoom}
          maxPolarAngle={Math.PI / 2}
          maxDistance={200}
          minDistance={10}
        />
      </Canvas>
    </>
  )
}
