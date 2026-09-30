import { useEffect, useRef, useSyncExternalStore } from 'react'

/**
 * Pune `data-in` pe elementele `.reveal` din interior, o singură dată
 * (atribut, nu clasă: React rescrie className la re-randare).
 *
 * Preluat din landingul Cornelia. Deliberat NU folosește
 * IntersectionObserver: la un scroll rapid un element poate trece de la
 * 0 la 0 fără niciun callback și rămâne invizibil. Pe un landing, text
 * ascuns e mult mai rău decât o animație ratată.
 */
export function useReveal<T extends HTMLElement>(margin = 0.08) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const pending = new Set<HTMLElement>(
      root.classList.contains('reveal')
        ? [root as HTMLElement]
        : Array.from(root.querySelectorAll<HTMLElement>('.reveal')),
    )
    if (!pending.size) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending.forEach((t) => t.setAttribute('data-in', ''))
      return
    }

    let frame = 0
    const sweep = () => {
      frame = 0
      const limit = window.innerHeight * (1 - margin)
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < limit) {
          el.setAttribute('data-in', '')
          pending.delete(el)
        }
      })
      if (!pending.size) stop()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sweep)
    }
    const ro = new ResizeObserver(schedule)
    ro.observe(document.documentElement)

    const stop = () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('load', schedule)
      ro.disconnect()
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('load', schedule)
    sweep()

    return stop
  }, [margin])

  return ref
}

/** `prefers-reduced-motion`, ascultat live. Pe server (pre-randare) e false. */
const RM = '(prefers-reduced-motion: reduce)'
const subscribeRM = (cb: () => void) => {
  const mq = window.matchMedia(RM)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false)
}

/** Prenumele și formatul ales, păstrate pentru /multumesc (supraviețuiesc
 *  unei reîncărcări). Storage-ul poate lipsi (mod privat), deci try/catch. */
const LEAD_KEY = 'vera-lista:lead'
export type Lead = { name: string; interest: string }
export function readLead(): Lead {
  try {
    const raw = sessionStorage.getItem(LEAD_KEY)
    if (raw) {
      const v: unknown = JSON.parse(raw)
      if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>
        return {
          name: typeof o.name === 'string' ? o.name : '',
          interest: typeof o.interest === 'string' ? o.interest : '',
        }
      }
    }
  } catch {
    /* fără storage, mesajul pleacă fără prenume */
  }
  return { name: '', interest: '' }
}
export function saveLead(name: string, interest: string) {
  try {
    sessionStorage.setItem(LEAD_KEY, JSON.stringify({ name, interest }))
  } catch {
    /* idem */
  }
}
