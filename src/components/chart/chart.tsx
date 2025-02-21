/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
'use client'

import { Center, Text3D } from '@react-three/drei'
import { useControls } from 'leva'
import { Suspense, useCallback, useMemo } from 'react'
import { MeshStandardMaterial } from 'three'

import { getYear } from '~/lib/utils'

import useMatcaps from '../../ts/hooks/use-matcaps'
import ContributionGrid from '../contribution-grid/contribution-grid'
import Grid from '../grid/grid'
import Effects from '../mincanvas/effects'
import CanvasWithModel from '../mincanvas/minicanvas'
import { generateDarkerPalette, hexToRgb, rgbToHex } from '../util/color'

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

  const { color } = useControls('theme', {
    color: {
      value: '#39d353',
      onEditEnd: (value) => {
        const meta = document.querySelector('meta[name="theme-color"]')
        const darker = generateDarkerPalette(hexToRgb(value))[1]!
        document.documentElement.style.setProperty('--theme-color', value)
        document.documentElement.style.setProperty(
          '--theme-color-hover',
          rgbToHex(darker)
        )
        if (meta) {
          meta.setAttribute('content', value)
        }
      }
    }
  })

  const palette = generateDarkerPalette(hexToRgb(color)).reduce(
    (acc, color, i) => {
      const key = `color_${i}`
      acc[key] = rgbToHex(color)
      return acc
    },
    {}
  ) as Record<string, string>

  const getColor = useCallback(
    (count: number) => {
      if (count >= 30) return palette.color_0
      if (count >= 20) return palette.color_1
      if (count >= 10) return palette.color_2
      if (count >= 1) return palette.color_3
      return palette.color_4
    },
    [palette]
  )
  const offsetText = username.length % 2 === 0 ? username.length / 4 : 2
  const yearDisplay = contributions.length ? getYear(year) : ''

  const { font: textFont } = useControls('text', { font })
  const { material: fontMaterialOptions } = useControls('theme', { material })

  const fontMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        emissiveIntensity: 0.5,
        color,
        emissive: color
      }),
    [fontMaterialOptions, color]
  )

  const fontMatcapMaterial = useMatcaps({ name: 'theme' })

  const textMaterial =
    fontMaterialOptions === 'standard' ? fontMaterial : fontMatcapMaterial

  const textProps = {
    curveSegments: 32,
    bevelEnable: true,
    bevelSize: 0.04,
    bevelThickness: 0.1,
    height: 0.5,
    size: 2,
    font: textFont,
    rotation: [-Math.PI / 2, 0, 0] as any
  }

  const contributionGrid = useMemo(
    () => (
      <ContributionGrid
        baseMaterial={textMaterial}
        getColor={getColor}
        contributions={contributions}
      />
    ),
    [contributions, color, textMaterial]
  )

  return (
    <CanvasWithModel
      canvasRef={canvasRef}
      orbitEnabled={false}
      cameraPosition={[0, 50, 0]}
    >
      <Center>
        <Suspense fallback={null}>{contributionGrid}</Suspense>
        <Grid color={color} active={contributions.length > 0} />
        <Text3D
          name={'username'}
          {...textProps}
          position={[-Math.floor(username.length / 2 + offsetText), 0, 6]}
          material={textMaterial}
        >
          {username}
        </Text3D>
      </Center>
      <Text3D
        name={'year'}
        {...textProps}
        height={0.3}
        size={1}
        position={[22, 0, 5]}
        material={textMaterial}
      >
        {yearDisplay}
      </Text3D>
      <Effects />
    </CanvasWithModel>
  )
}
