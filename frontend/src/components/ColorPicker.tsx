import { useEffect, useRef, useState } from 'react'
import { cn } from 'cn'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

interface HsvColor {
  h: number
  s: number
  v: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const hexToHsv = (hex: string): HsvColor => {
  const normalized = hex.replace('#', '').padEnd(6, '0')

  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0

  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6)
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2)
    } else {
      h = 60 * ((r - g) / delta + 4)
    }
  }

  if (h < 0) {
    h += 360
  }

  return {
    h,
    s: max === 0 ? 0 : delta / max,
    v: max,
  }
}

const hsvToHex = ({ h, s, v }: HsvColor) => {
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

  const toHex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const normalizeHex = (value: string) => {
  let hex = value.trim()

  if (!hex.startsWith('#')) {
    hex = `#${hex}`
  }

  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex =
      '#' +
      hex
        .slice(1)
        .split('')
        .map((char) => char + char)
        .join('')
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return null
  }

  return hex.toUpperCase()
}

export const ColorPicker = ({
  value,
  onChange,
  className,
}: ColorPickerProps) => {
  const areaRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  const [hsv, setHsv] = useState<HsvColor>(() => hexToHsv(value))

  const [hexValue, setHexValue] = useState(value.toUpperCase())

  useEffect(() => {
    const normalized = normalizeHex(value)

    if (!normalized) {
      return
    }

    setHsv(hexToHsv(normalized))
    setHexValue(normalized)
  }, [value])

  const updateColor = (next: HsvColor) => {
    setHsv(next)

    const hex = hsvToHex(next)

    setHexValue(hex)
    onChange(hex)
  }

  const updateArea = (clientX: number, clientY: number) => {
    const element = areaRef.current

    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()

    const s = clamp((clientX - rect.left) / rect.width, 0, 1)

    const v = clamp(1 - (clientY - rect.top) / rect.height, 0, 1)

    updateColor({
      ...hsv,
      s,
      v,
    })
  }

  const updateHue = (clientX: number) => {
    const element = hueRef.current

    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()

    const h = clamp(((clientX - rect.left) / rect.width) * 360, 0, 360)

    updateColor({
      ...hsv,
      h,
    })
  }

  const handleAreaPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateArea(event.clientX, event.clientY)
  }

  const handleAreaPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) {
      return
    }

    updateArea(event.clientX, event.clientY)
  }

  const handleHuePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateHue(event.clientX)
  }

  const handleHuePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) {
      return
    }

    updateHue(event.clientX)
  }

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.toUpperCase()

    setHexValue(input)

    const normalized = normalizeHex(input)

    if (!normalized) {
      return
    }

    setHsv(hexToHsv(normalized))
    onChange(normalized)
  }

  const hueColor = `hsl(${hsv.h}, 100%, 50%)`

  return (
    <div
      className={cn(
        'w-full rounded-2xl',
        'border border-white/[0.08]',
        'bg-white/[0.045]',
        'p-3',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      {/* Saturation / brightness */}
      <div
        ref={areaRef}
        className="relative h-[180px] w-full cursor-crosshair overflow-hidden rounded-xl"
        style={{
          backgroundColor: hueColor,
          backgroundImage: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, transparent)
          `,
        }}
        onPointerDown={handleAreaPointerDown}
        onPointerMove={handleAreaPointerMove}
      >
        <div
          className={cn(
            'pointer-events-none absolute size-5',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-full border-2 border-white',
            'shadow-[0_2px_8px_rgba(0,0,0,0.4)]',
          )}
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
          }}
        />
      </div>

      {/* Hue */}
      <div
        ref={hueRef}
        className="relative mt-3 h-3 w-full cursor-pointer rounded-full"
        style={{
          background:
            'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        }}
        onPointerDown={handleHuePointerDown}
        onPointerMove={handleHuePointerMove}
      >
        <div
          className={cn(
            'pointer-events-none absolute top-1/2 size-5',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-full border-2 border-white',
            'shadow-[0_2px_8px_rgba(0,0,0,0.4)]',
          )}
          style={{
            left: `${(hsv.h / 360) * 100}%`,
          }}
        />
      </div>

      {/* HEX */}
      <div className="mt-3 flex items-center gap-3">
        <div
          className="size-9 shrink-0 rounded-lg border border-white/10"
          style={{
            backgroundColor: value,
          }}
        />

        <div className="flex-1">
          <input
            value={hexValue}
            onChange={handleHexChange}
            maxLength={7}
            spellCheck={false}
            className={cn(
              'h-8 w-full rounded-lg',
              'border border-white/[0.08]',
              'bg-black/10',
              'px-2.5',
              'font-mono text-xs text-white/80',
              'outline-none',
              'transition-colors',
              'focus:border-white/20',
              'focus:bg-white/[0.05]',
            )}
          />
        </div>
      </div>
    </div>
  )
}
