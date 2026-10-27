import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, PointerEvent } from 'react'

import { cn } from 'cn'
import {
  clamp,
  hexToHsv,
  hsvToHex,
  normalizeHex,
} from '@/lib/color-utils'
import type { HsvColor } from '@/lib/color-utils'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
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

    if (!normalized) return

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

    if (!element) return

    const rect = element.getBoundingClientRect()

    updateColor({
      ...hsv,
      s: clamp((clientX - rect.left) / rect.width, 0, 1),
      v: clamp(1 - (clientY - rect.top) / rect.height, 0, 1),
    })
  }

  const updateHue = (clientX: number) => {
    const element = hueRef.current

    if (!element) return

    const rect = element.getBoundingClientRect()

    updateColor({
      ...hsv,
      h: clamp(((clientX - rect.left) / rect.width) * 360, 0, 360),
    })
  }

  const handleAreaPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateArea(event.clientX, event.clientY)
  }

  const handleAreaPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return

    updateArea(event.clientX, event.clientY)
  }

  const handleHuePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateHue(event.clientX)
  }

  const handleHuePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return

    updateHue(event.clientX)
  }

  const handleHexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.toUpperCase()

    setHexValue(input)

    const normalized = normalizeHex(input)

    if (!normalized) return

    setHsv(hexToHsv(normalized))
    onChange(normalized)
  }

  const hueColor = `hsl(${hsv.h}, 100%, 50%)`

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-white/[0.08]',
        'bg-white/[0.045] p-3',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      <div
        ref={areaRef}
        role="group"
        aria-label="Выбор насыщенности и яркости"
        className="relative h-[180px] w-full touch-none cursor-crosshair overflow-hidden rounded-xl"
        style={{
          backgroundColor: hueColor,
          backgroundImage:
            'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
        }}
        onPointerDown={handleAreaPointerDown}
        onPointerMove={handleAreaPointerMove}
      >
        <div
          aria-hidden="true"
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

      <div
        ref={hueRef}
        role="group"
        aria-label="Выбор оттенка"
        className="relative mt-3 h-3 w-full touch-none cursor-pointer rounded-full"
        style={{
          background:
            'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        }}
        onPointerDown={handleHuePointerDown}
        onPointerMove={handleHuePointerMove}
      >
        <div
          aria-hidden="true"
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

      <div className="mt-3 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="size-9 shrink-0 rounded-lg border border-white/10"
          style={{ backgroundColor: value }}
        />

        <div className="flex-1">
          <label htmlFor="category-color-hex" className="sr-only">
            HEX-код цвета
          </label>
          <input
            id="category-color-hex"
            value={hexValue}
            onChange={handleHexChange}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            className={cn(
              'h-8 w-full rounded-lg border border-white/[0.08]',
              'bg-black/10 px-2.5',
              'font-mono text-xs text-white/80',
              'outline-none transition-colors',
              'focus:border-white/20 focus:bg-white/[0.05]',
            )}
          />
        </div>
      </div>
    </div>
  )
}
