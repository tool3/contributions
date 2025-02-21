/* eslint-disable prefer-const */
function generateDarkerPalette({ r, g, b }) {
  // Convert RGB to HSL
  const { h, s, l } = rgbToHsl(r, g, b)

  // Define lightness reduction factors (adjusted for smooth shading)
  const lightnessSteps = [l, l * 0.8, l * 0.55, l * 0.3, l * 0.12]

  // Generate shades by applying the lightness steps
  return lightnessSteps.map((lightness) => hslToRgb(h, s, lightness))
}

// Converts RGB to HSL (to allow smooth lightness adjustment)
function rgbToHsl(r, g, b) {
  ;(r /= 255), (g /= 255), (b /= 255)
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // No saturation
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60
        break
      case g:
        h = ((b - r) / d + 2) * 60
        break
      case b:
        h = ((r - g) / d + 4) * 60
        break
    }
  }
  return { h, s, l }
}

function hslToRgb(h: number, s: number, l: number) {
  const f = (n) => {
    const k = (n + h / 30) % 12
    return Math.round(
      (l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))) *
        255
    )
  }
  return { r: f(0), g: f(8), b: f(4) }
}

const hexToRgb = (hex) => {
  const v = parseInt(hex.slice(1), 16)
  return { r: v >> 16, g: (v >> 8) & 255, b: v & 255 }
}

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`

export { generateDarkerPalette, hexToRgb, rgbToHex, rgbToHsl }
