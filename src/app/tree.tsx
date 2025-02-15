/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

const Tree = ({ commitsData }: { commitsData: any[] }) => {
  return (
    <group>
      {commitsData.map((repo, i) => (
        <mesh key={repo.repo} position={[i * 3, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.5, 3, 8]} />
          <meshStandardMaterial color="brown" />
          {repo.commits.map((commit: any, j: number) => (
            <mesh key={commit.oid} position={[0, j * 0.3 + 2, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="green" />
            </mesh>
          ))}
        </mesh>
      ))}
    </group>
  )
}

const TreeOfCommits = ({ commitsData }: { commitsData: any[] }) => {
  return (
    <Canvas camera={{ position: [0, 5, 10] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <OrbitControls />
      <Tree commitsData={commitsData} />
    </Canvas>
  )
}

export default TreeOfCommits
