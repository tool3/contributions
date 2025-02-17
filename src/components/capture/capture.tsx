import s from './capture.module.scss'

export default function Capture({ canvasRef }: { canvasRef: any }) {
  const handleCapture = () => {
    if (!canvasRef.current) return

    const gl = canvasRef.current.getContext('webgl2', {
      preserveDrawingBuffer: true
    })
    const canvas = gl.canvas

    // Convert canvas to an image
    const dataURL = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')

    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'contributions.png'
    link.click()
  }

  return (
    <button className={s.captureButton} onClick={handleCapture}>
      Capture Screenshot
    </button>
  )
}
