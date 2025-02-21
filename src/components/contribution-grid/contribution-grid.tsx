/* eslint-disable prefer-const */
/* eslint-disable react/no-unknown-property */
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import { Color, Object3D } from 'three'
import { STLExporter, SVGRenderer } from 'three-stdlib'

interface Contribution {
  date: string
  contributionCount: number
}

function exportStl(scene: any, { binary = false, username, year }) {
  const exporter = new STLExporter()

  let temp = new Object3D()
  const parent = scene.getObjectByName('grid_parent')
  const child = scene.getObjectByName('grid')

  temp = child
  parent.remove(child)

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

  parent.add(temp)
}

function exportSVG(scene, camera, { username, year }) {
  const renderer = new SVGRenderer()

  let temp = new Object3D()
  const parent = scene.getObjectByName('grid_parent')
  const child = scene.getObjectByName('grid')

  temp = child
  parent.remove(child)

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

  parent.add(temp)
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

export default function ContributionGrid({
  contributions,
  getColor,
  baseMaterial
}: {
  contributions: Contribution[]
  getColor: any
  baseMaterial: any
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

  return (
    <group position={[0, 1.85, -6]} name="bars">
      {contributions.map((day, i) => {
        if (!day) return null
        const color = new Color(getColor(day.contributionCount))
        const height =
          day.contributionCount > 0 ? day.contributionCount * 0.3 : 0
        const emissiveIntensity = Math.min(1, day.contributionCount / 10)
        const week = Math.floor(i / 7)
        const weekday = i % 7
        const position = [week - 26, height / 2, weekday + 3]

        const getMaterial = () => {
          const material = baseMaterial.clone()
          if (!material.matcap) {
            material.color = color
            material.emissive = color
            material.emissiveIntensity = emissiveIntensity
          }
          return material
        }

        const props = {
          i,
          name: 'bar',
          color,
          height,
          emissiveIntensity,
          material: getMaterial(),
          position
        }
        return <Bar key={i} {...props} />
      })}
    </group>
  )
}
