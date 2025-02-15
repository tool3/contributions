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
    enabled: false,
    Bloom: folder(
      {
        bloomEnabled: true,
        luminanceThreshold: {
          value: 1.0,
          min: 0,
          max: 1
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
        scanlineEnabled: true,
        scanlineStrength: {
          value: 0.05,
          min: 0,
          max: 1
        }
      },
      { collapsed: true }
    ),
    Vignette: folder(
      {
        vignetteEnabled: true,
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
