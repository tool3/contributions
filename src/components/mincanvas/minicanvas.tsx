/* eslint-disable react/no-unknown-property */
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import { Canvas, Vector3 } from '@react-three/fiber'
import { button, Leva, useControls } from 'leva'
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
  canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>,
  children
}: {
  className?: string
  orbitEnabled?: boolean
  panel?: boolean
  maxZoom?: number
  minZoom?: number
  initZoom?: number
  cameraPosition?: Vector3
  canvasRef?: React.MutableRefObject<HTMLCanvasElement>
  children: ReactNode
}) {
  const target = useRef([0, 0, 0]) as any
  const [active, setActive] = useState(panel)
  const { isMobile, isTablet } = useDeviceDetect()
  const zoom = isMobile && !isTablet ? 7 : initZoom

  const { perf, rotate } = useControls(
    'general',
    {
      perf: false,
      rotate: true,
      ['reset camera']: button(() => {
        target.current.reset()
      })
    },
    { order: -1 }
  )

  return (
    <>
      <Leva hideCopyButton hidden={!active} />
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
          preserveDrawingBuffer: true
        }}
        style={{
          height: '100svh',
          width: '100vw'
        }}
      >
        {perf ? <Perf position={'bottom-right'} logsPerSecond={1} /> : null}
        <color attach={'background'} args={['#000']} />
        <Suspense fallback={null}>{children}</Suspense>
        <Environment
          environmentIntensity={0.9}
          files={'/textures/environments/studio_small_03_1k.hdr'}
        />
        <OrbitControls
          autoRotate={rotate}
          autoRotateSpeed={0.5}
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
