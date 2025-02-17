/* eslint-disable react/no-unknown-property */
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import { Canvas, Vector3 } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { ReactNode, Suspense, useRef, useState } from 'react'

import { useDeviceDetect } from '~/ts/hooks/use-device-detect'

import Debug from '../debug/debug'

export default function CanvasWithModel({
  className,
  orbitEnabled = true,
  panel = false,
  maxZoom = 100,
  minZoom = 5,
  initZoom = 20,
  cameraPosition = [0, 0, 300],
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
    rotate: false
  })

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
          fov: 50,
          far: 10000,
          frustumCulled: true,
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
        <Environment environmentIntensity={0.8} files={'/textures/environments/studio_small_03_1k.hdr'} />
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
