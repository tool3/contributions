import { useLayoutEffect, useState } from 'react'

import Crank from './sounds/crank.mp3'
import Tick from './sounds/tick.mp3'
import Tock from './sounds/tock.mp3'
import useInteraction from './use-interaction'

export default function useAudio({ track = 'crank' }: { track?: string }) {
  const [audio, setAudio] = useState() as any
  const interacted = useInteraction()

  useLayoutEffect(() => {
    const tracks = {
      crank: Crank,
      tick: Tick,
      tock: Tock
    }
    ;(async () => {
      if (interacted) {
        const { Howl } = await import('howler')

        setAudio(
          new Howl({
            src: [tracks[track]],
            format: ['mp3'],
            preload: true,
            html5: true
          })
        )
      }
    })()

    return () => {
      if (audio) {
        audio.unload()
      }
    }
  }, [interacted, track])

  return audio
}
