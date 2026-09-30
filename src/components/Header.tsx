import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { Menu, X } from 'lucide-react'
import { CTA, CTA_SHORT, NAV } from '../lib/content'
import { Ot } from './ui'

/* Bara de sus: numele, navigarea într-o pastilă și un singur buton.
   Citește `data-tone` de pe secțiunea de sub ea și se inversează pe
   scenă. Pe decoruri citește `data-tone-live`.
   Sub 1024px navigarea stă într-un meniu full-screen, care e dialog:
   focusul intră pe X, restul paginii devine inert, Escape îl închide. */

type Tone = 'light' | 'dark'

export function Header() {
  const [tone, setTone] = useState<Tone>('light')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const burgerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
      const probe = 40
      for (const el of document.querySelectorAll<HTMLElement>('[data-tone]')) {
        const r = el.getBoundingClientRect()
        if (r.top <= probe && r.bottom > probe) {
          const live = el.querySelector<HTMLElement>('[data-tone-live]')?.dataset.toneLive
          setTone(((live ?? el.dataset.tone) as Tone) ?? 'light')
          break
        }
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    /* Decorul își schimbă tonul și fără scroll (salt, restaurare). */
    const mo = new MutationObserver(schedule)
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-tone-live'] })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      mo.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) lenis?.stop()
    else lenis?.start()
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, lenis])

  useEffect(() => {
    if (!open) {
      if (restoreFocus.current) {
        restoreFocus.current = false
        burgerRef.current?.focus({ preventScroll: true })
      }
      return
    }
    const behind = [...document.querySelectorAll<HTMLElement>('main, main ~ footer')]
    behind.forEach((el) => {
      el.inert = true
    })
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        restoreFocus.current = true
        setOpen(false)
      }
    }
    const mq = window.matchMedia('(min-width: 1024px)')
    const onMq = () => {
      if (mq.matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      behind.forEach((el) => {
        el.inert = false
      })
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const dark = tone === 'dark'
  const bar = scrolled
    ? dark
      ? 'bg-stage/70 border-white/10 text-bone [--focus-ring:var(--color-red-soft)]'
      : 'bg-white/70 border-black/[0.06] text-ink'
    : dark
      ? 'bg-transparent border-transparent text-bone [--focus-ring:var(--color-red-soft)]'
      : 'bg-transparent border-transparent text-ink'

  return (
    <>
      <header inert={open} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={`mx-auto flex max-w-[1320px] items-center justify-between rounded-full border py-2 pl-5 pr-2 backdrop-blur-md transition-colors duration-300 ${bar}`}
        >
          <a
            href="#top"
            className="title -my-3.5 whitespace-nowrap py-3.5 text-[1.2rem] leading-none min-[390px]:text-[1.35rem] sm:text-[1.5rem]"
          >
            <Ot>Vera Lozovanu-Guțu</Ot>
          </a>

          <nav
            className={`hidden items-center gap-1 rounded-full p-1 text-[14px] lg:flex ${dark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'}`}
            aria-label="Secțiuni"
          >
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 transition-colors duration-200 ${dark ? 'hover:bg-white/10' : 'hover:bg-white'}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="#lista"
              className="hidden whitespace-nowrap rounded-full bg-red px-3.5 py-2 text-[13px] font-medium text-white transition-colors duration-300 hover:bg-red-deep min-[360px]:inline-block sm:px-5 sm:py-2.5 sm:text-[14px]"
            >
              <span className="sm:hidden">{CTA_SHORT}</span>
              <span className="hidden sm:inline">{CTA}</span>
            </a>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Deschide meniul"
              aria-expanded={open}
              aria-controls="meniu-mobil"
              className="-my-0.5 flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* meniul de pe telefon și tabletă. Tranziția separată pe deschidere
          face vizibil imediat meniul, altfel focus() pe X nu prinde. */}
      <div
        id="meniu-mobil"
        role="dialog"
        aria-modal="true"
        aria-label="Meniu"
        aria-hidden={!open}
        data-lenis-prevent
        className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-stage px-6 pb-10 pt-3 text-bone duration-300 [--focus-ring:var(--color-red-soft)] sm:pt-4 lg:hidden [@media(max-height:500px)]:pb-5 ${
          open
            ? 'visible opacity-100 transition-opacity'
            : 'pointer-events-none invisible opacity-0 transition-[opacity,visibility]'
        }`}
      >
        <div className="-mx-3 flex items-center justify-between border border-transparent py-2 pl-5 pr-2 sm:-mx-1">
          <span className="title whitespace-nowrap text-[1.2rem] leading-none min-[390px]:text-[1.35rem] sm:text-[1.5rem]">
            <Ot>Vera Lozovanu-Guțu</Ot>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              restoreFocus.current = true
              setOpen(false)
            }}
            aria-label="Închide meniul"
            className="-my-0.5 flex h-11 w-11 items-center justify-center rounded-full"
          >
            <X size={24} strokeWidth={1.6} />
          </button>
        </div>
        <nav aria-label="Secțiuni" className="mt-16 mb-6 flex shrink-0 flex-col gap-2 [@media(max-height:500px)]:mt-6">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="h-sec text-[2.6rem] [@media(max-height:500px)]:text-[2rem]">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#lista"
          onClick={() => setOpen(false)}
          className="mt-auto shrink-0 rounded-full bg-red py-4 text-center text-[16px] font-medium text-white"
        >
          {CTA}
        </a>
      </div>
    </>
  )
}
