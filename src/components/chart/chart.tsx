/* eslint-disable react/no-unknown-property */
import { Grid, OrbitControls, Text, Text3D } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Color } from 'three'

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
        return (
          <mesh
            key={day.date}
            position={[
              (i % cols) + offsetX,
              height / 2,
              -Math.floor(i / cols) + offsetZ
            ]}
          >
            <boxGeometry args={[0.8, height, 0.8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        )
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
    <Canvas
      orthographic
      camera={{
        position: [0, 50, 0],
        zoom: 20,
        fov: 50
        // frustumCulled: true,
        // near: 0.0001
      }}
      style={{ height: '100svh', width: '100vw' }}
    >
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
        position={[0, 0, 5]}
        font={'/fonts/helvetiker_regular.typeface.json'}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {username}
        <meshStandardMaterial color="white"  />
      </Text3D>
    </Canvas>
  )
}

export default ContributionVisualizer
