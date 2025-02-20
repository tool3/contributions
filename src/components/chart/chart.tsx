/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
'use client'

import { Center, Text3D } from '@react-three/drei'
import { useControls } from 'leva'
import { Suspense, useMemo } from 'react'
import { DoubleSide, MeshStandardMaterial } from 'three'

import { getYear } from '~/lib/utils'

import useMatcaps from '../../ts/hooks/use-matcaps'
import ContributionGrid from '../contribution-grid/contribution-grid'
import Effects from '../mincanvas/effects'
import CanvasWithModel from '../mincanvas/minicanvas'

export default function ContributionVisualizer({
  contributions,
  username,
  year,
  canvasRef
}: {
  contributions: any[]
  username: string
  year: string
  canvasRef: React.MutableRefObject<HTMLCanvasElement>
}) {
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
  } = useControls('username', {
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
  const textMatcapMaterial = useMatcaps({ name: 'username' })
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
  const yearDisplay = contributions.length ? getYear(year) : ''

  const contributionGrid = useMemo(
    () => <ContributionGrid contributions={contributions} />,
    [contributions]
  )

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
