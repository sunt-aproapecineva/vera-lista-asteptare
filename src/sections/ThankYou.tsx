import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { BRAND, IMG, THANKYOU, titleText, whatsappLink } from '../lib/content'
import type { Lead } from '../lib/utils'
import { Ot, SectionTitle } from '../components/ui'

/* /multumesc. Un singur lucru de făcut: WhatsApp, cu mesajul deja
   scris. Pagina duce singură acolo după 10 secunde (prin `location`,
   nu popup, deci nu e blocată). Numărătoarea se poate opri. */

const SECONDS = 10

/* Adusă aici cu Înapoi (după click pe buton): fără numărătoare, altfel pagina te trimite din nou pe WhatsApp. */
const cameBack = () => {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return nav?.type === 'back_forward' && new URL(nav.name).pathname.replace(/\/+$/, '') === '/multumesc'
}

export function ThankYou({ lead, onBack }: { lead: Lead; onBack: () => void }) {
  const href = whatsappLink(lead.name, lead.interest)
  const [left, setLeft] = useState(SECONDS)
  const [stopped, setStopped] = useState(cameBack)
  // Ce aude cititorul de ecran. Se schimbă de două ori: la intrare și la oprire.
  const [announce, setAnnounce] = useState(() => (cameBack() ? THANKYOU.stopped : ''))
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const prev = document.title
    document.title = titleText(THANKYOU.title).replace(/\.$/, '') + ' · ' + BRAND
    return () => {
      document.title = prev
    }
  }, [])

  // Focusul pleacă de pe formular și vine pe titlu. Numărătoarea se anunță
  // o singură dată, nu în fiecare secundă.
  useEffect(() => {
    document.getElementById('multumesc-titlu')?.focus({ preventScroll: true })
    const t = window.setTimeout(() => setAnnounce((a) => a || THANKYOU.redirect(SECONDS)), 300)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (stopped) return
    if (left <= 0) {
      // replace, nu assign: Înapoi de pe WhatsApp nu mai aduce aici.
      window.location.replace(href)
      return
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [left, stopped, href])

  const stop = () => {
    setStopped(true)
    setAnnounce(THANKYOU.stopped)
    ctaRef.current?.focus()
  }

  return (
    <main className="ground-studio relative flex min-h-[100svh] flex-col overflow-hidden">
      <header className="wrap pt-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onBack()
          }}
          className="title text-[1.5rem] transition-opacity hover:opacity-60"
        >
          <Ot>Vera Lozovanu-Guțu</Ot>
        </a>
      </header>

      <div className="wrap relative grid flex-1 items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10 py-12 [@media(max-height:500px)]:py-4">
          <p className="anim-fade-up flex items-center gap-3 text-[13px] text-ink-mute [@media(max-height:500px)]:hidden">
            <span className="h-px w-6 bg-current opacity-60" />
            {THANKYOU.eyebrow}
          </p>
          <SectionTitle
            as="h1"
            id="multumesc-titlu"
            tabIndex={-1}
            title={THANKYOU.title}
            className="anim-fade-up mt-6 text-[3rem] outline-none sm:text-[4.6rem] [@media(max-height:500px)]:mt-0 [@media(max-height:500px)]:text-[2.8rem]"
            style={{ animationDelay: '120ms' }}
          />
          <div
            className="anim-fade-up mt-4 text-[13px] text-ink-mute [@media(max-height:500px)]:mt-2"
            style={{ animationDelay: '180ms' }}
          >
            {stopped ? (
              <p aria-hidden="true">{THANKYOU.stopped}</p>
            ) : (
              <p>
                <span aria-hidden="true">{THANKYOU.redirect(left)}</span>
                <span className="sr-only">{THANKYOU.redirect(SECONDS)}</span>{' '}
                <button
                  type="button"
                  onClick={stop}
                  className="-mx-2 -my-3 inline-block px-2 py-3 underline underline-offset-4"
                >
                  {THANKYOU.stay}
                </button>
              </p>
            )}
            <p role="status" className="sr-only">
              {announce}
            </p>
          </div>
          <p
            className="anim-fade-up mt-6 max-w-[28rem] text-[17px] leading-[1.6] text-ink-soft [@media(max-height:500px)]:mt-3"
            style={{ animationDelay: '240ms' }}
          >
            {THANKYOU.body}
          </p>
          <a
            ref={ctaRef}
            href={href}
            onClick={() => setStopped(true)}
            className="anim-fade-up group mt-9 inline-flex items-center gap-5 rounded-full bg-red py-2 pl-6 pr-2 text-white transition-colors duration-300 hover:bg-red-deep [@media(max-height:500px)]:mt-5"
            style={{ animationDelay: '360ms' }}
          >
            <span className="text-[15px] font-medium">{THANKYOU.cta}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </a>
          <p className="anim-fade-up title mt-14 text-[1.8rem] italic text-ink/60" style={{ animationDelay: '560ms' }}>
            {THANKYOU.whisper}
          </p>
        </div>
        <div className="relative h-[48svh] md:h-[82svh] md:self-end">
          <img
            src={IMG('vera-piele-rade')}
            alt=""
            aria-hidden="true"
            width={884}
            height={2000}
            className="anim-fade-in absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2"
          />
        </div>
      </div>
    </main>
  )
}
