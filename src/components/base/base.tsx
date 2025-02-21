/* eslint-disable react/no-unknown-property */
import { useGLTF } from '@react-three/drei'

export default function BaseModel(props) {
  const { nodes } = useGLTF('/models/base.glb') as any

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['ashtom2014_Base_v2_15cm-steel002'].geometry}
      >
        <meshStandardMaterial roughness={0.8} metalness={1} color={'#1e1e1e'} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/base.glb')
