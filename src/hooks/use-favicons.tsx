import { useLayoutEffect } from 'react'

export default function useFavicons({ hours }) {
  useLayoutEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]')
    const appleTouchIcon = document.querySelector(
      'link[rel="apple-touch-icon"]'
    )

    if (favicon && hours !== '88') {
      favicon.setAttribute('href', `/images/favicons/${hours}.ico`)
    }

    if (appleTouchIcon && hours !== '88') {
      appleTouchIcon.setAttribute('href', `/images/favicons/${hours}.ico`)
    }
  }, [hours])
}
