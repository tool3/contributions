import { useEffect, useRef, useState } from 'react'

import { getYear } from '~/lib/utils'

import styles from './capture-select.module.scss'

const CaptureSelect = ({ canvasRef, year: baseYear, username }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null) as any
  const options = ['png', 'stl (ascii)', 'stl (binary)']
  const year = getYear(baseYear)

  const handlePNG = () => {
    if (!canvasRef.current) return

    const gl = canvasRef.current.getContext('webgl2', {
      preserveDrawingBuffer: true
    })

    const canvas = gl.canvas
    const dataURL = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')

    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${username}_${year}.png`
    link.click()
    link.remove()
  }

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleSelect = (option) => {
    setIsOpen(false)

    if (option === 'png') {
      handlePNG()
    } else if (option === 'stl (ascii)') {
      dispatchEvent(
        new CustomEvent('stl-export', {
          detail: { binary: false, username, year }
        })
      )
    } else if (option === 'stl (binary)') {
      dispatchEvent(
        new CustomEvent('stl-export', {
          detail: { binary: true, username, year }
        })
      )
    } else if (option === 'svg') {
      dispatchEvent(
        new CustomEvent('svg-export', {
          detail: { username, year }
        })
      )
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.selectWrapper} ref={dropdownRef}>
      <button className={styles.selectButton} onClick={toggleDropdown}>
        <svg
          className={styles.svg}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={styles.option}
            >
              {option.toUpperCase()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CaptureSelect
