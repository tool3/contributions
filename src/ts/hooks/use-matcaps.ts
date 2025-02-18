import { useLoader } from '@react-three/fiber'
import { useControls } from 'leva'
import { MeshMatcapMaterial, TextureLoader } from 'three'

const options = Array.from(
  { length: 61 },
  (_, i) => 'matcap_' + (i + 1) + '.png'
).reduce((acc, curr) => {
  acc[curr.replace('.png', '')] = curr
  return acc
}, {})

export default function useMatcaps({
  name,
  defaultMatcap = 'matcap_18.png'
}: {
  name: string
  defaultMatcap?: string
}) {
  if (typeof document !== 'undefined') {
    const matcap = useControls(name, {
      matcap: {
        value: defaultMatcap,
        options
      }
    })

    const [map] = useLoader(TextureLoader, [
      `/textures/matcaps/${matcap.matcap}`
    ])

    return new MeshMatcapMaterial({ matcap: map })
  }
}
