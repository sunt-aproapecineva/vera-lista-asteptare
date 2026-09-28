import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CTA, NAV } from '../lib/content'
import { Ot } from './ui'

/* Bara de sus: numele, navigarea într-o pastilă și un singur buton.
   Citește `data-tone` de pe secțiunea de sub ea și se inversează pe
   scenă. Pe decoruri citește `data-tone-live`. */

type Tone = 'light' | 'dark'

export function Header() {
  const [tone, setTone] = useState<Tone>('light')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const dark = tone === 'dark'
  const bar = scrolled
    ? dark
      ? 'bg-stage/70 border-white/10 text-bone'
      : 'bg-white/70 border-black/[0.06] text-ink'
    : dark
      ? 'bg-transparent border-transparent text-bone'
      : 'bg-transparent border-transparent text-ink'

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={`mx-auto flex max-w-[1320px] items-center justify-between rounded-full border py-2 pl-5 pr-2 backdrop-blur-md transition-colors duration-300 ${bar}`}
        >
          <a href="#top" className="title text-[1.35rem] leading-none sm:text-[1.5rem]">
            <Ot>Vera Lozovanu-Guțu</Ot>
          </a>

          <nav
            className={`hidden items-center gap-1 rounded-full p-1 text-[14px] md:flex ${dark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'}`}
            aria-label="Secțiuni"
          >
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-1.5 transition-colors duration-200 ${dark ? 'hover:bg-white/10' : 'hover:bg-white'}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#lista"
              className="hidden rounded-full bg-red px-5 py-2.5 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-red-deep sm:inline-block"
            >
              {CTA}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Deschide meniul"
              className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* meniul de pe telefon */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-stage px-6 pb-10 pt-6 text-bone transition-[opacity,visibility] duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <span className="title text-[1.5rem]">
            <Ot>Vera Lozovanu-Guțu</Ot>
          </span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Închide meniul" className="flex h-10 w-10 items-center justify-center">
            <X size={24} strokeWidth={1.6} />
          </button>
        </div>
        <nav className="mt-16 flex flex-col gap-2">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="h-sec text-[2.6rem]">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#lista"
          onClick={() => setOpen(false)}
          className="mt-auto rounded-full bg-red py-4 text-center text-[16px] font-medium text-white"
        >
          {CTA}
        </a>
      </div>
    </>
  )
}
