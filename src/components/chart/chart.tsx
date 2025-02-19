'use client'

/* eslint-disable react/no-unknown-property */
import { Center, Text3D } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { button, useControls } from 'leva'
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, MeshStandardMaterial, Object3D } from 'three'
import { STLExporter } from 'three-stdlib'

import useMatcaps from '../../ts/hooks/use-matcaps'
import Grid from '../grid/grid'
import Effects from '../mincanvas/effects'
import CanvasWithModel from '../mincanvas/minicanvas'

interface Contribution {
  date: string
  contributionCount: number
}

function exportStl(scene: any) {
  const exporter = new STLExporter()
  let temp = new Object3D()
  scene.traverse((node: any) => {
    if (node.name === 'grid_parent') {
      const child = scene.getObjectByName('grid')
      temp = child
      node.remove(child)
    }
  })
  const str = exporter
    .parse(scene)
    .replace(/\t/g, '  ')
    .replace(/-?\d+\.\d+e[-+]?\d+|-?\d*\.\d+/g, (num) => {
      return parseFloat(num).toFixed(2)
    })
  const blob = new Blob([str], { type: 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'scene.stl'
  link.click()
  scene.traverse((node: any) => {
    if (node.name === 'grid_parent') {
      node.add(temp)
    }
  })
}

function Box({ material, height, i, position }) {
  const ref = useRef() as any

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.position.y = 0
      ref.current.scale.y = 0
      gsap.to(ref.current.scale, {
        y: 1,
        delay: 2,
        duration: 3,
        ease: 'expo.out',
        onUpdate: () => {
          ref.current.position.y = (ref.current.scale.y * height) / 2
        }
      })
    }
  }, [ref, height, i])

  return (
    <mesh
      ref={ref}
      castShadow
      scale={[1, 1, 1]}
      receiveShadow
      key={i}
      position={position}
      material={material}
    >
      <boxGeometry args={[0.8, height, 0.8]} />
    </mesh>
  )
}

const ContributionGrid = ({
  contributions
}: {
  contributions: Contribution[]
}) => {
  const three = useThree() as any
  const { controls, camera, scene } = three

  useControls('general', {
    ['export stl']: button(() => exportStl(scene))
  })

  const colors = useControls('bars', {
    none: '#161b22',
    ten: '#0e4429',
    twenty: '#006d32',
    thirty: '#26a641',
    forty: '#39d353'
  })

  const GITHUB_COLORS = [
    colors.none,
    colors.ten,
    colors.twenty,
    colors.thirty,
    colors.forty
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
        delay: 1,
        ease: 'expo',
        onComplete: () => {
          controls.autoRotate = true
          camera.lookAt([0, 0, 0])
        }
      })
    }
  }, [controls, camera, contributions])

  const baseMaterial = useMemo(() => new MeshStandardMaterial(), [])
  const barsMatcapMaterial = useMatcaps({ name: 'bars' })
  const { material: barsMaterialOptions } = useControls('bars', {
    material: {
      value: 'standard',
      options: {
        standard: 'standard',
        matcap: 'matcap'
      }
    }
  })

  return (
    <group name="grid_parent">
      <group position={[0, 0, -6]}>
        {contributions.map((day, i) => {
          if (!day) return null

          const color = new Color(getColor(day.contributionCount))
          const height =
            day.contributionCount > 0 ? day.contributionCount * 0.3 : 0.2
          const emissiveIntensity = Math.min(1, day.contributionCount / 10)
          const week = Math.floor(i / 7)
          const weekday = i % 7
          const position = [week - 26, height / 2, weekday + 3]

          const getBaseMaterial = () => {
            const material = baseMaterial.clone()
            material.color = color
            material.emissive = color
            material.emissiveIntensity = emissiveIntensity
            return material
          }

          const material =
            barsMaterialOptions === 'standard'
              ? getBaseMaterial()
              : barsMatcapMaterial

          const props = {
            color,
            height,
            emissiveIntensity,
            i,
            material,
            position
          }
          return <Box key={i} {...props} />
        })}
      </group>
      <Grid active={contributions.length > 0} />
    </group>
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

  const yearDisplay =
    year.toLowerCase() === 'default' ? new Date().getFullYear() : year

  const font = {
    value: '/fonts/json/Geist_Mono_Regular.json',
    options: {
      GeistMono: '/fonts/json/Geist_Mono_Regular.json',
      Grotesque: '/fonts/json/Grotesque_Regular.json',
      Inter: '/fonts/json/Inter_Bold.json',
      Monaspace: '/fonts/json/Monaspace_Argon_Bold.json'
    }
  }

  const material = {
    value: 'standard',
    options: {
      standard: 'standard',
      matcap: 'matcap'
    }
  }

  const color = '#39d353'

  const {
    font: textFont,
    material: textMaterialOptions,
    color: textMaterialColor
  } = useControls('text', {
    material,
    color,
    font
  })

  const {
    font: yearFont,
    material: yearMaterialOptions,
    color: yearMaterialColor
  } = useControls('year', {
    material,
    color,
    font
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

  const yearMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        emissiveIntensity: 0.5,
        color: yearMaterialColor,
        emissive: yearMaterialColor,
        side: DoubleSide
      }),
    [yearMaterialColor]
  )
  const textMatcapMaterial = useMatcaps({ name: 'text' })
  const yearMatcapMaterial = useMatcaps({ name: 'year' })

  const usernameTextMaterial =
    textMaterialOptions === 'standard' ? textMaterial : textMatcapMaterial
  const yearTextMaterial =
    yearMaterialOptions === 'standard' ? yearMaterial : yearMatcapMaterial

  const textProps = {
    curveSegments: 32,
    bevelEnable: true,
    bevelSize: 0.04,
    bevelThickness: 0.1,
    height: 0.5,
    size: 2,
    rotation: [-Math.PI / 2, 0, 0] as any
  }

  const offsetText = username.length % 2 === 0 ? username.length / 4 : 2

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
          {...textProps}
          font={textFont}
          position={[-Math.floor(username.length / 2 + offsetText), 0, 6]}
          material={usernameTextMaterial}
        >
          {username}
        </Text3D>
      </Center>
      <Text3D
        name={'year'}
        {...textProps}
        font={yearFont}
        height={0.3}
        size={1}
        position={[22, 0, 5]}
        material={yearTextMaterial}
      >
        {yearDisplay}
      </Text3D>
      <Effects />
    </CanvasWithModel>
  )
}

export default ContributionVisualizer
