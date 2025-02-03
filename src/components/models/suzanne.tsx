/* eslint-disable react/no-unknown-property */

import { useGLTF } from '@react-three/drei'

export default function Suzanne() {
  const { nodes } = useGLTF('/models/suzanne.glb') as any
  return <primitive object={nodes.Suzanne.geometry} />
}

useGLTF.preload('/models/suzanne.glb')
