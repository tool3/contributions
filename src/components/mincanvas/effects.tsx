import {
  Bloom,
  EffectComposer,
  Scanline,
  Vignette
} from '@react-three/postprocessing'
import { folder, useControls } from 'leva'
import { VignetteTechnique } from 'postprocessing'

export default function Effects() {
  const {
    enabled,
    bloomEnabled,
    intensity,
    luminanceSmoothing,
    luminanceThreshold,
    vignetteEnabled,
    vignetteStrength,
    vignetteOffset,
    scanlineEnabled,
    scanlineStrength
  } = useControls(
    'Post Processing',
    {
      enabled: true,
      Bloom: folder(
        {
          bloomEnabled: true,
          luminanceThreshold: {
            value: 1.3,
            min: 0,
            max: 5.0
          },
          luminanceSmoothing: {
            value: 2.0,
            min: 0,
            max: 5.0
          },
          intensity: {
            value: 0.5,
            min: 0,
            max: 10
          }
        },
        { collapsed: true }
      ),
      Scanline: folder(
        {
          scanlineEnabled: true,
          scanlineStrength: {
            value: 0.03,
            min: 0,
            max: 1
          }
        },
        { collapsed: true }
      ),
      Vignette: folder(
        {
          vignetteEnabled: false,
          vignetteStrength: {
            value: 0.7,
            min: 0,
            max: 1
          },
          vignetteOffset: {
            value: 0,
            min: 0,
            max: 1
          }
        },
        { collapsed: true }
      )
    },
    { collapsed: true }
  )

  return enabled ? (
    <EffectComposer stencilBuffer autoClear>
      {bloomEnabled ? (
        <Bloom
          mipmapBlur
          intensity={intensity}
          luminanceThreshold={luminanceThreshold}
          luminanceSmoothing={luminanceSmoothing}
        />
      ) : (
        <></>
      )}
      {scanlineEnabled ? <Scanline opacity={scanlineStrength} /> : <></>}
      {vignetteEnabled ? (
        <Vignette
          offset={vignetteOffset}
          darkness={vignetteStrength}
          technique={VignetteTechnique.DEFAULT}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  ) : null
}
