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
  } = useControls('Post Processing', {
    enabled: true,
    Bloom: folder(
      {
        bloomEnabled: true,
        luminanceThreshold: {
          value: 2.0,
          min: 0,
          max: 5.0
        },
        luminanceSmoothing: {
          value: 1.0,
          min: 0,
          max: 1
        },
        intensity: {
          value: 1.5,
          min: 0,
          max: 10
        }
      },
      { collapsed: true }
    ),
    Scanline: folder(
      {
        scanlineEnabled: false,
        scanlineStrength: {
          value: 0.01,
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
  })

  return enabled ? (
    <EffectComposer multisampling={2} stencilBuffer autoClear>
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
