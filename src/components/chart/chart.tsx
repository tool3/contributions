/* eslint-disable react/no-unknown-property */
import { Grid, OrbitControls, Text3D } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect, useRef } from 'react'
import { Color, Matrix4 } from 'three'

import Effects from '../mincanvas/effects'
import CanvasWithModel from '../mincanvas/minicanvas'

interface Contribution {
  date: string
  contributionCount: number
}

const GITHUB_COLORS = [
  '#161b22', // No contributions
  '#0e4429', // 1-9 contributions
  '#006d32', // 10-19 contributions
  '#26a641', // 20-29 contributions
  '#39d353' // 30+ contributions
]

const getColor = (count: number) => {
  if (count >= 30) return GITHUB_COLORS[4]
  if (count >= 20) return GITHUB_COLORS[3]
  if (count >= 10) return GITHUB_COLORS[2]
  if (count >= 1) return GITHUB_COLORS[1]
  return GITHUB_COLORS[0]
}

function InstancedBox({ color, height, emissiveIntensity, i, position }) {
  // const ref = useRef() as any
  // useEffect(() => {
  //   ref.current.setMatrixAt(0, new Matrix4())
  // }, [])
  return (
    <mesh key={i} position={position}>
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
  const cols = 53
  const rows = Math.ceil(contributions.length / cols)
  const offsetX = -(cols / 2)
  const offsetZ = rows / 2

  return (
    <group>
      {contributions.map((day, i) => {
        const color = new Color(getColor(day.contributionCount))
        const height =
          day.contributionCount > 0 ? day.contributionCount * 0.2 : 0.5
        const emissiveIntensity = Math.min(1, day.contributionCount / 10)
        const position = [
          (i % cols) + offsetX,
          height / 2,
          -Math.floor(i / cols) + offsetZ
        ]
        const props = {
          color,
          height,
          emissiveIntensity,
          i,
          position
        }
        return <InstancedBox key={i} {...props} />
      })}
    </group>
  )
}

const ContributionVisualizer = ({
  contributions,
  username
}: {
  contributions: any[]
  username: string
}) => {
  return (
    <CanvasWithModel cameraPosition={[0, 50, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        makeDefault
        minZoom={1}
        maxZoom={100}
      />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.2}
          intensity={1.5}
        />
      </EffectComposer>
      <Grid
        args={[100, 50]}
        sectionThickness={1}
        cellSize={1}
        // infiniteGrid
        // fadeDistance={200}
        sectionColor={'#6f6f6f'}
        cellColor={'#6f6f6f'}
        followCamera={false}
      />
      {/* <gridHelper args={[50, 50, 0xff0000, 'teal']} /> */}
      <ContributionGrid contributions={contributions} />
      <Text3D
        scale={1}
        position={[0, 0, 6]}
        font={'/fonts/helvetiker_regular.typeface.json'}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {username}
        <meshStandardMaterial color="white" />
      </Text3D>
      <Effects />
    </CanvasWithModel>
  )
}

export default ContributionVisualizer
