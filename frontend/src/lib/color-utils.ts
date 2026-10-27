export interface HsvColor {
  h: number
  s: number
  v: number
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const normalizeHex = (value: string): string | null => {
  let hex = value.trim()

  if (!hex.startsWith('#')) {
    hex = `#${hex}`
  }

  if (/^#[\da-f]{3}$/i.test(hex)) {
    hex = `#${hex
      .slice(1)
      .split('')
      .map((char) => char + char)
      .join('')}`
  }

  return /^#[\da-f]{6}$/i.test(hex) ? hex.toUpperCase() : null
}

export const hexToHsv = (hex: string): HsvColor => {
  const normalized = normalizeHex(hex)

  if (!normalized) {
    throw new Error(`Invalid HEX color: ${hex}`)
  }

  const r = parseInt(normalized.slice(1, 3), 16) / 255
  const g = parseInt(normalized.slice(3, 5), 16) / 255
  const b = parseInt(normalized.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0

  if (delta > 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6)
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2)
    } else {
      h = 60 * ((r - g) / delta + 4)
    }
  }

  return {
    h: (h + 360) % 360,
    s: max === 0 ? 0 : delta / max,
    v: max,
  }
}

export const hsvToHex = ({ h, s, v }: HsvColor): string => {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  const toHex = (channel: number) =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}
