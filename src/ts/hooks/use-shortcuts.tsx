import { useEffect } from 'react'

export default function useShortcuts(props) {
  const map = Object.keys(props).reduce((acc, k) => {
    const { key, action } = props[k]

    return { ...acc, [key]: action }
  }, {})
  function handleKeyDown(e) {
    if (e.code in map) {
      const key = e.code
      map[key](e)
    }
  }

  useEffect(() => {
    addEventListener('keydown', handleKeyDown)

    return () => removeEventListener('keydown', handleKeyDown)
  }, [])
}
