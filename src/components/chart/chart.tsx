/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
'use client'

import { Center, Text3D } from '@react-three/drei'
import { useControls } from 'leva'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useMemo } from 'react'
import { MeshStandardMaterial } from 'three'

import { getYear } from '~/lib/utils'

import useMatcaps from '../../ts/hooks/use-matcaps'
import BaseModel from '../base/base'
import ContributionGrid from '../contribution-grid/contribution-grid'
import Grid from '../grid/grid'
import Effects from '../mincanvas/effects'
import CanvasWithModel from '../mincanvas/minicanvas'
import { generateDarkerPalette, hexToRgb, rgbToHex } from '../util/color'

function setTheme(theme: string) {
  const meta = document.querySelector('meta[name="theme-color"]')
  const darker = generateDarkerPalette(hexToRgb(theme))[1]!
  document.documentElement.style.setProperty('--theme-color', theme)
  document.documentElement.style.setProperty(
    '--theme-color-hover',
    rgbToHex(darker)
  )
  if (meta) {
    meta.setAttribute('content', theme)
  }
}

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
  const params = useSearchParams()

  const font = {
    value: '/fonts/json/Geist_Mono_Regular.json',
    options: {
      geistmono: '/fonts/json/Geist_Mono_Regular.json',
      grotesque: '/fonts/json/Grotesque_Regular.json',
      inter: '/fonts/json/Inter_Bold.json',
      monaspace: '/fonts/json/Monaspace_Argon_Bold.json'
    }
  }

  const material = {
    value: 'standard',
    options: {
      standard: 'standard',
      matcap: 'matcap'
    }
  }

  const urlTheme = params.get('theme')
  const urlFont = params.get('font')
  const urlMaterial = params.get('material')
  const urlMatcap = params.get('matcap') || 'matcap_16'

  const theme = urlTheme ? `#${urlTheme}` : '#39d353'

  if (urlTheme) {
    setTheme(theme)
  }

  if (urlFont && urlFont in font.options) {
    font.value = font.options[urlFont]
  }

  if (urlMaterial && urlMaterial in material.options) {
    material.value = material.options[urlMaterial]
  }

  const { color } = useControls('theme', {
    color: {
      value: theme,
      onEditEnd: (value) => setTheme(value)
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

  const fontMatcapMaterial = useMatcaps({
    name: 'theme',
    defaultMatcap: urlMatcap
  })

  const textMaterial =
    fontMaterialOptions === 'standard' ? fontMaterial : fontMatcapMaterial

  const textProps = {
    curveSegments: 32,
    bevelEnable: true,
    bevelSize: 0.04,
    bevelThickness: 0.1,
    height: 0.5,
    size: 1.3,
    font: textFont,
    rotation: [-Math.PI / 6.5, 0, 0] as any
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
        <group name="grid_parent">
          <Suspense fallback={null}>{contributionGrid}</Suspense>
          {contributions.length ? (
            <BaseModel
              position={[0, 0.8, 0]}
              rotation={[0, Math.PI, 0]}
              scale={[65.5, 40, 53]}
            />
          ) : null}
          <Grid color={color} active={contributions.length > 0} />
        </group>
        <Text3D
          name={'username'}
          {...textProps}
          position={[-Math.floor(username.length / 2 + offsetText), 0.35, 4.2]}
          material={textMaterial}
        >
          {username}
        </Text3D>
        <Text3D
          name={'year'}
          {...textProps}
          height={0.3}
          size={1}
          position={[22, 0.5, 4.2]}
          material={textMaterial}
        >
          {yearDisplay}
        </Text3D>
      </Center>
      <Effects />
    </CanvasWithModel>
  )
}
