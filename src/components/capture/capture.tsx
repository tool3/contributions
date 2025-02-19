import s from './capture.module.scss'

export default function Capture({ canvasRef }: { canvasRef: any }) {
  const handleCapture = () => {
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
    link.download = 'contributions.png'
    link.click()
    link.remove()
  }

  return (
    <button className={s.capture} onClick={handleCapture}>
      <svg
        className={s.svg}
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
  )
}
