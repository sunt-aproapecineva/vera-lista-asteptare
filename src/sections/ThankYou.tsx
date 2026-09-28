import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { IMG, THANKYOU, whatsappLink } from '../lib/content'
import type { Lead } from '../lib/utils'
import { Ot } from '../components/ui'

/* /multumesc. Un singur lucru de făcut: WhatsApp, cu mesajul deja
   scris. Pagina duce singură acolo după 5 secunde (prin `location`,
   nu popup, deci nu e blocată). Numărătoarea se poate opri. */

const SECONDS = 5

export function ThankYou({ lead, onBack }: { lead: Lead; onBack: () => void }) {
  const href = whatsappLink(lead.name, lead.interest)
  const [left, setLeft] = useState(SECONDS)
  const [stopped, setStopped] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = `${THANKYOU.title} · Vera Lozovanu-Guțu`
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(() => {
    if (stopped) return
    if (left <= 0) {
      window.location.assign(href)
      return
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [left, stopped, href])

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
        <div className="relative z-10 py-12">
          <p className="anim-fade-up flex items-center gap-3 text-[13px] text-ink-mute">
            <span className="h-px w-6 bg-current opacity-60" />
            {THANKYOU.eyebrow}
          </p>
          <h1 className="anim-fade-up h-sec mt-6 text-[3rem] sm:text-[4.6rem]" style={{ animationDelay: '120ms' }}>
            Locul tău e <span className="accent">rezervat.</span>
          </h1>
          <p className="anim-fade-up mt-6 max-w-[28rem] text-[17px] leading-[1.6] text-ink-soft" style={{ animationDelay: '240ms' }}>
            {THANKYOU.body}
          </p>
          <a
            href={href}
            className="anim-fade-up group mt-9 inline-flex items-center gap-5 rounded-full bg-red py-2 pl-6 pr-2 text-white transition-colors duration-300 hover:bg-red-deep"
            style={{ animationDelay: '360ms' }}
          >
            <span className="text-[15px] font-medium">{THANKYOU.cta}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </a>
          <p className="anim-fade-up mt-4 text-[13px] text-ink-mute" style={{ animationDelay: '440ms' }} aria-live="polite">
            {stopped ? (
              THANKYOU.stopped
            ) : (
              <>
                {THANKYOU.redirect} ({left}){' '}
                <button type="button" onClick={() => setStopped(true)} className="underline underline-offset-4">
                  {THANKYOU.stay}
                </button>
              </>
            )}
          </p>
          <p className="anim-fade-up title mt-14 text-[1.8rem] italic text-ink/60" style={{ animationDelay: '560ms' }}>
            {THANKYOU.whisper}
          </p>
        </div>
        <div className="relative h-[48svh] md:h-[82svh] md:self-end">
          <img
            src={IMG('vera-esarfa')}
            alt=""
            aria-hidden="true"
            width={1533}
            height={1600}
            className="anim-fade-in absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2"
          />
        </div>
      </div>
    </main>
  )
}
