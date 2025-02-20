/* eslint-disable react/no-unknown-property */
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, MeshStandardMaterial, Object3D } from 'three'
import { STLExporter, SVGRenderer } from 'three-stdlib'

import useMatcaps from '~/ts/hooks/use-matcaps'

import Grid from '../grid/grid'

interface Contribution {
  date: string
  contributionCount: number
}

function exportStl(scene: any, { binary = false, username, year }) {
  const exporter = new STLExporter()
  let temp = new Object3D()
  scene.traverse((node: any) => {
    if (node.name === 'grid_parent') {
      const child = scene.getObjectByName('grid')
      temp = child
      node.remove(child)
    }
  })
  const str = binary
    ? exporter.parse(scene, { binary: true })
    : exporter
        .parse(scene)
        .replace(/\t/g, '  ')
        .replace(/-?\d+\.\d+e[-+]?\d+|-?\d*\.\d+/g, (num) => {
          return parseFloat(num).toFixed(2)
        })

  const blob = new Blob([str], { type: 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${username}_${year}.stl`
  link.click()
  link.remove()
  scene.traverse((node: any) => {
    if (node.name === 'grid_parent') {
      node.add(temp)
    }
  })
}

function exportSVG(scene, camera, { username, year }) {
  const renderer = new SVGRenderer()

  let temp = new Object3D()
  scene.traverse((node: any) => {
    if (node.name === 'grid_parent') {
      const child = scene.getObjectByName('grid')
      temp = child
      node.remove(child)
    }
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPrecision(0.001)
  renderer.setQuality('high')
  renderer.render(scene, camera)

  renderer.domElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const XMLS = new XMLSerializer()
  const svgfile = XMLS.serializeToString(renderer.domElement)
  const svgData = svgfile

  const svgBlob = new Blob([svgData], {
    type: 'image/svg+xml'
  })

  const svgUrl = URL.createObjectURL(svgBlob)
  const link = document.createElement('a')

  link.href = svgUrl
  link.download = `${username}_${year}.svg`
  document.body.appendChild(link)
  link.click()
  link.remove()

  scene.traverse((node: any) => {
    if (node.name === 'grid_parent') {
      node.add(temp)
    }
  })
}

function Bar({ name, material, height, i, position }) {
  const ref = useRef() as any

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.position.y = 0
      ref.current.scale.y = 0
      gsap.to(ref.current.scale, {
        y: 1,
        duration: 1.5,
        ease: 'expo.inOut',
        onUpdate: () => {
          ref.current.position.y = (ref.current.scale.y * height) / 2
        }
      })
    }
  }, [ref, height, i])

  return (
    <mesh
      name={name}
      ref={ref}
      castShadow
      receiveShadow
      key={i}
      position={position}
      material={material}
    >
      <boxGeometry args={[0.8, height, 0.8]} />
    </mesh>
  )
}

function Base() {
  const { color, metalness, roughness } = useControls(
    'box',
    {
      color: '#161b22',
      metalness: { value: 1, min: 0, max: 1 },
      roughness: { value: 0.9, min: 0, max: 1 }
    },
    { collapsed: true }
  )
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[53, 1, 7]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  )
}

export default function ContributionGrid({
  contributions
}: {
  contributions: Contribution[]
}) {
  const three = useThree() as any
  const { controls, camera, scene } = three

  useLayoutEffect(() => {
    /* @ts-ignore */
    addEventListener('stl-export', ({ detail: options }: CustomEvent) =>
      exportStl(scene, options)
    )
    /* @ts-ignore */
    addEventListener('svg-export', ({ detail: options }: CustomEvent) =>
      exportSVG(scene, camera, options)
    )
    return () => {
      removeEventListener('stl-export', () =>
        exportStl(scene, { binary: false, username: '', year: '' })
      )
      removeEventListener('svg-export', () =>
        exportSVG(scene, camera, { username: '', year: '' })
      )
    }
  }, [])

  useLayoutEffect(() => {
    if (controls && contributions.length) {
      controls.autoRotate = false
      controls.enabled = true
      gsap.to(camera.position, {
        x: 0,
        y: 130,
        z: 100,
        duration: 1,
        delay: 0,
        ease: 'expo.inOut',
        onComplete: () => {
          controls.autoRotate = true
          camera.lookAt([0, 0, 0])
        }
      })
    }
  }, [controls, scene, camera, contributions])

  useControls('theme', {
    color: {
      value: '#39d353',
      onEditEnd: (value) => {
        const meta = document.querySelector('meta[name="theme-color"]')
        document.documentElement.style.setProperty('--theme-color', value)
        if (meta) {
          meta.setAttribute('content', value)
        }
      }
    }
  })

  const colors = useControls('bars', {
    none: '#161b22',
    ten: '#0e4429',
    twenty: '#006d32',
    thirty: '#26a641',
    forty: '#39d353'
  })

  const getColor = (count: number) => {
    if (count >= 30) return colors.forty
    if (count >= 20) return colors.thirty
    if (count >= 10) return colors.twenty
    if (count >= 1) return colors.ten
    return colors.none
  }

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
      <group position={[0, 1.01, -6]} name="bars">
        {contributions.map((day, i) => {
          if (!day) return null
          const color = new Color(getColor(day.contributionCount))
          const height =
            day.contributionCount > 0 ? day.contributionCount * 0.3 : 0
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
            i,
            name: 'bar',
            color,
            height,
            emissiveIntensity,
            material,
            position
          }
          return <Bar key={i} {...props} />
        })}
      </group>
      <Grid active={contributions.length > 0} />
      {contributions.length ? <Base /> : null}
    </group>
  )
}
