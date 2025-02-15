/* eslint-disable react/no-unknown-property */
import { OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, RigidBody, useRapier } from '@react-three/rapier'
import React, { useRef } from 'react'

interface Contribution {
  date: string
  count: number
}

function GitHub3DContributions({
  contributions
}: {
  contributions: Contribution[]
}) {
  return (
    <div>
      {/* ... (Form and error handling) */}
      <Canvas style={{ width: '100vw', height: '100svh' }}>
        <Physics gravity={[0, -9.82, 0]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={0.8} />
          <OrbitControls />
          {contributions.length > 0 && (
            <Contributions contributions={contributions} />
          )}
        </Physics>
      </Canvas>
    </div>
  )
}

function Contributions({ contributions }: { contributions: Contribution[] }) {
  const maxContribution = Math.max(...contributions.map((c) => c.count), 0)
  const largestContribution = contributions.reduce((a, b) =>
    a.count > b.count ? a : b
  )
  const attractorRadius = Math.max(
    1,
    (largestContribution.count / maxContribution) * 10
  )

  return (
    <>
      <AttractorSphere radius={attractorRadius} />
      {contributions.map((contribution, index) => (
        <ContributionSphere
          key={index}
          contribution={contribution}
          maxContribution={maxContribution}
          attractorRadius={attractorRadius}
        />
      ))}
    </>
  )
}

const AttractorSphere: React.FC<{ radius: number }> = ({ radius }) => {
  return (
    <RigidBody type="fixed">
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  )
}

const ContributionSphere: React.FC<{
  contribution: Contribution
  maxContribution: number
  attractorRadius: number
}> = ({ contribution, maxContribution }) => {
  const radius = Math.max(1, (contribution.count / maxContribution) * 10)
  const position = [
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20 + radius,
    (Math.random() - 0.5) * 20
  ]

  const { rapier, world } = useRapier()
  const rigidBodyRef = useRef<any>()

  useFrame(() => {
    if (!rapier || !world || !rigidBodyRef.current) return

    const attractorPosition = { x: 0, y: 0, z: 0 } // Attractor is at the origin
    const currentPosition = rigidBodyRef.current.translation()
    const direction = {
      x: attractorPosition.x - currentPosition.x,
      y: attractorPosition.y - currentPosition.y,
      z: attractorPosition.z - currentPosition.z
    }

    const distance = Math.sqrt(
      direction.x ** 2 + direction.y ** 2 + direction.z ** 2
    )
    if (distance > 0) {
      const normalizedDirection = {
        x: direction.x / distance,
        y: direction.y / distance,
        z: direction.z / distance
      }

      const forceMagnitude = 50 // Adjust force strength
      rigidBodyRef.current.applyImpulse(
        {
          x: normalizedDirection.x * forceMagnitude,
          y: normalizedDirection.y * forceMagnitude,
          z: normalizedDirection.z * forceMagnitude
        },
        true
      )
    }
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position as any}
      mass={contribution.count * 0.1}
    >
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={0x007bff} />
      </mesh>
      <Text
        fontSize={0.5}
        color="black"
        position={[0, radius + 0.5, 0]}
        textAlign="center"
        maxWidth={2}
      >
        {new Date(contribution.date).toLocaleDateString()}
      </Text>
    </RigidBody>
  )
}

export default GitHub3DContributions
