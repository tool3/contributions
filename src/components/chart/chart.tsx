/* eslint-disable react/no-unknown-property */
import { Text3D } from '@react-three/drei'
import { Suspense } from 'react'
import { Color } from 'three'

import Grid from '../grid/grid'
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

function Box({ color, height, emissiveIntensity, i, position }) {
  return (
    <mesh castShadow receiveShadow key={i} position={position}>
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
    <>
      <group>
        {contributions.map((day, i) => {
          const color = new Color(getColor(day.contributionCount))
          const height =
            day.contributionCount > 0 ? day.contributionCount * 0.2 : 0.5
          const emissiveIntensity = Math.min(3, day.contributionCount / 10)
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
          return <Box key={i} {...props} />
        })}
      </group>
      {contributions.length ? <Grid /> : null}
    </>
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
      <Suspense>
        <ContributionGrid contributions={contributions} />
        <Text3D
          scale={1}
          position={[-3, 0, 6]}
          font={'/fonts/helvetiker_regular.typeface.json'}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {username}
          <meshStandardMaterial color="white" emissive={'#39d353'} />
        </Text3D>
      </Suspense>
      <Effects />
    </CanvasWithModel>
  )
}

export default ContributionVisualizer
