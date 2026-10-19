"use client"

import { useEffect, useRef } from "react"

const GAP = 8
const EDGE = 8

/**
 * One tooltip for every `[data-tip]` element, shown the moment the pointer arrives (native `title`
 * waits about a second). SVG marks follow the cursor; other elements anchor below, or above when
 * there is no room. Touch shows it on tap. Hidden from assistive tech: every tip repeats an
 * accessible name or a text table that is already on the page.
 */
export function HoverTip() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tip = ref.current
    if (!tip) return
    let current: Element | null = null

    const place = (x: number, y: number, anchor?: DOMRect) => {
      const { width, height } = tip.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      let left: number
      let top: number
      if (anchor) {
        left = anchor.left + anchor.width / 2 - width / 2
        top = anchor.bottom + GAP
        if (top + height > vh - EDGE) top = anchor.top - height - GAP
      } else {
        left = x + GAP * 1.5
        top = y + GAP * 2
        if (left + width > vw - EDGE) left = x - width - GAP * 1.5
        if (top + height > vh - EDGE) top = y - height - GAP * 1.5
      }
      left = Math.min(Math.max(left, EDGE), vw - width - EDGE)
      top = Math.max(top, EDGE)
      tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`
    }

    const show = (el: Element, x: number, y: number) => {
      const text = el.getAttribute("data-tip")
      if (!text) return hide()
      current = el
      tip.textContent = text
      tip.hidden = false
      place(x, y, el instanceof SVGElement ? undefined : el.getBoundingClientRect())
    }

    const hide = () => {
      current = null
      tip.hidden = true
    }

    const tipTarget = (target: EventTarget | null) => (target instanceof Element ? target.closest("[data-tip]") : null)

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const el = tipTarget(e.target)
      if (el) show(el, e.clientX, e.clientY)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (current instanceof SVGElement && e.pointerType !== "touch") place(e.clientX, e.clientY)
    }
    const onPointerOut = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !current) return
      if (!(e.relatedTarget instanceof Node && current.contains(e.relatedTarget))) hide()
    }
    const onPointerDown = (e: PointerEvent) => {
      const el = e.pointerType === "touch" ? tipTarget(e.target) : null
      if (el && el !== current) show(el, e.clientX, e.clientY)
      else hide()
    }
    const onFocusIn = (e: FocusEvent) => {
      const el = tipTarget(e.target)
      if (el && el === e.target && el.matches(":focus-visible")) show(el, 0, 0)
    }
    const onFocusOut = (e: FocusEvent) => {
      if (e.target === current) hide()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide()
    }

    document.addEventListener("pointerover", onPointerOver)
    document.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerout", onPointerOut)
    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    document.addEventListener("keydown", onKeyDown)
    window.addEventListener("scroll", hide, { capture: true, passive: true })
    window.addEventListener("blur", hide)
    return () => {
      document.removeEventListener("pointerover", onPointerOver)
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerout", onPointerOut)
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("scroll", hide, true)
      window.removeEventListener("blur", hide)
    }
  }, [])

  return (
    <div
      ref={ref}
      hidden
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] max-w-[min(18rem,calc(100vw-1rem))] border border-ink bg-paper px-2 py-1 text-small text-ink shadow-[3px_3px_0_hsl(var(--ink))]"
    />
  )
}
