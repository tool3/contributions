'use client'

/* eslint-disable react/no-unknown-property */
import { Center, Text3D } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, MeshStandardMaterial } from 'three'

import useMatcaps from '../../ts/hooks/use-matcaps'
import Grid from '../grid/grid'
import Effects from '../mincanvas/effects'
import CanvasWithModel from '../mincanvas/minicanvas'

interface Contribution {
  date: string
  contributionCount: number
}

function Box({ color, height, emissiveIntensity, i, position }) {
  const ref = useRef() as any
  useLayoutEffect(() => {
    if (ref.current) {
      gsap.to(ref.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        delay: 3,
        duration: 3,
        ease: 'expo.out'
      })
    }
  }, [ref, i])

  return (
    <mesh
      ref={ref}
      castShadow
      scale={[1, 1, 1]}
      receiveShadow
      key={i}
      position={position}
    >
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}

const ContributionGrid = ({
  contributions
}: {
  contributions: Contribution[]
}) => {
  const three = useThree() as any
  const { controls, camera } = three

  const colors = useControls('bars', {
    none: '#161b22',
    ten: '#0e4429',
    twenty: '#006d32',
    thirty: '#26a641',
    plus: '#39d353'
  })

  const GITHUB_COLORS = [
    colors.none,
    colors.ten,
    colors.twenty,
    colors.thirty,
    colors.plus
  ]

  const getColor = (count: number) => {
    if (count >= 30) return GITHUB_COLORS[4]
    if (count >= 20) return GITHUB_COLORS[3]
    if (count >= 10) return GITHUB_COLORS[2]
    if (count >= 1) return GITHUB_COLORS[1]
    return GITHUB_COLORS[0]
  }

  useLayoutEffect(() => {
    if (controls && contributions.length) {
      controls.autoRotate = false
      controls.enabled = true
      gsap.to(camera.position, {
        x: 0,
        y: 130,
        z: 100,
        duration: 2,
        delay: 0.5,
        ease: 'expo',
        onComplete: () => {
          controls.autoRotate = true
          camera.lookAt([0, 0, 0])
        }
      })
    }
  }, [controls, camera, contributions])

  return (
    <>
      <group position={[0, 0, -6]}>
        {contributions.map((day, i) => {
          if (!day) return null

          const color = new Color(getColor(day.contributionCount))
          const height =
            day.contributionCount > 0 ? day.contributionCount * 0.3 : 0.2
          const emissiveIntensity = Math.min(2, day.contributionCount / 10)
          const week = Math.floor(i / 7)
          const weekday = i % 7
          const position = [week - 26, height / 2, weekday + 3]

          const props = {
            color,
            height,
            emissiveIntensity,
            i,
            position
          }
          return <Box key={i} {...props} />
        })}
      </group>
      <Grid active={contributions.length > 0} />
    </>
  )
}

const ContributionVisualizer = ({
  contributions,
  username,
  year,
  canvasRef
}: {
  contributions: any[]
  username: string
  year: string
  canvasRef: React.MutableRefObject<HTMLCanvasElement>
}) => {
  const contributionGrid = useMemo(
    () => <ContributionGrid contributions={contributions} />,
    [contributions]
  )

  const yearDisplay = year === 'default' ? new Date().getFullYear() : year

  const { material: textMaterialOptions, color: textMaterialColor } =
    useControls('text', {
      material: {
        value: 'standard',
        options: {
          standard: 'standard',
          matcap: 'matcap'
        }
      },
      color: '#39d353'
    })

  const { material: yearMaterialOptions } = useControls('year', {
    material: {
      value: 'standard',
      options: {
        standard: 'standard',
        matcap: 'matcap'
      }
    }
  })

  const textMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        emissiveIntensity: 0.5,
        color: textMaterialColor,
        emissive: textMaterialColor,
        side: DoubleSide
      }),
    [textMaterialColor]
  )
  const textMatcapMaterial = useMatcaps({ name: 'text' })
  const yearMatcapMaterial = useMatcaps({ name: 'year' })

  const usernameTextMaterial =
    textMaterialOptions === 'standard' ? textMaterial : textMatcapMaterial
  const yearTextMaterial =
    yearMaterialOptions === 'standard' ? textMaterial : yearMatcapMaterial

  return (
    <CanvasWithModel
      canvasRef={canvasRef}
      orbitEnabled={false}
      cameraPosition={[0, 50, 0]}
    >
      <Center>
        <Suspense fallback={null}>{contributionGrid}</Suspense>
        <Text3D
          name={'username'}
          curveSegments={32}
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.1}
          height={0.5}
          size={2}
          font={'/fonts/Inter_Bold.json'}
          position={[-Math.floor(username.length / 2), 0, 6]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={usernameTextMaterial}
        >
          {username}
        </Text3D>
      </Center>
      <Text3D
        name={'year'}
        curveSegments={32}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={0.1}
        height={0.3}
        size={1}
        font={'/fonts/Inter_Bold.json'}
        position={[22, 0, 5]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={yearTextMaterial}
      >
        {yearDisplay}
      </Text3D>
      <Effects />
    </CanvasWithModel>
  )
}

export default ContributionVisualizer
