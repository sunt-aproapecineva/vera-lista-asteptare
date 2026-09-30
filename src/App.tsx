import { useCallback, useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'
import { MotionConfig } from 'framer-motion'
import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { Pain } from './sections/Pain'
import { Decor } from './sections/Decor'
import { Method } from './sections/Method'
import { About } from './sections/About'
import { Formats } from './sections/Formats'
import { Waitlist } from './sections/Waitlist'
import { Final } from './sections/Final'
import { ThankYou } from './sections/ThankYou'
import { readLead, type Lead } from './lib/utils'

/* Ordinea paginii urmează încălzirea: te recunoști → înțelegi cauza →
   vezi ideea (decorul) → metoda → omul și școala ei → cum lucrați →
   lista. Rutare minimă: `/` și `/multumesc`, prin history.pushState. */

const THANKYOU_PATH = '/multumesc'
const SCROLL_KEY = 'vera-lista:y'

export default function App() {
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname))
  const [lead, setLead] = useState<Lead>(readLead)

  useEffect(() => {
    /* Lenis lasă linkul #ancoră să adauge o intrare în istoric. Cu scrollRestoration 'manual',
       poziția de dinaintea click-ului stă în history.state, ca Înapoi să revină acolo. */
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a[href^="#"]'))
        history.replaceState({ ...(history.state ?? {}), y: Math.round(window.scrollY) }, '')
    }
    const onPop = () => {
      setPath(window.location.pathname)
      const y = (history.state as { y?: number } | null)?.y
      /* ținta se caută după randare: venind de pe /multumesc, secțiunile abia se montează */
      requestAnimationFrame(() => {
        if (typeof y === 'number') {
          window.scrollTo({ top: y, behavior: 'instant' })
          return
        }
        let el: HTMLElement | null = null
        try { el = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null } catch { /* hash invalid */ }
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
      })
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  /* La încărcare: o reîncărcare sau un Înapoi revine unde a rămas pagina;
     altfel /#lista duce la secțiune (offset 0, ca anchors.offset).
     scrollRestoration e 'manual' (main.tsx), deci poziția o ținem noi. */
  useEffect(() => {
    let raf = 0
    if (window.location.pathname.replace(/\/+$/, '') !== THANKYOU_PATH) {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      let y = 0
      try { y = Number(sessionStorage.getItem(SCROLL_KEY)) || 0 } catch { /* fără storage */ }
      let id = ''
      try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { /* hash invalid */ }
      const el = id ? document.getElementById(id) : null
      /* reload și Înapoi revin unde a rămas pagina, chiar dacă URL-ul păstrează #lista de la un click în nav */
      if (nav && (nav.type === 'reload' || nav.type === 'back_forward') && y > 0)
        raf = requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }))
      else if (el)
        raf = requestAnimationFrame(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }))
    }
    const save = () => { try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))) } catch { /* idem */ } }
    window.addEventListener('pagehide', save)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pagehide', save) }
  }, [])

  const go = useCallback((to: string) => {
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  if (path.replace(/\/+$/, '') === THANKYOU_PATH) {
    return <ThankYou lead={lead} onBack={() => go('/')} />
  }

  /* reducedMotion="user": framer-motion respectă preferința sistemului.
     Lenis rămâne mereu montat (o respectă singur), ca să nu remonteze
     pagina când preferința se schimbă cu pagina deschisă. */
  const page = (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero />
        <Pain />
        <Decor />
        <Method />
        <About />
        <Formats />
        <Waitlist
          onSent={(name, interest) => {
            setLead({ name, interest })
            go(THANKYOU_PATH)
          }}
        />
      </main>
      <Final />
    </MotionConfig>
  )

  /* userData marchează zborul spre o ancoră: Decor nu schimbă decorurile
     cât durează (rotița și degetul îl resetează la {}). */
  return <ReactLenis root options={{ lerp: 0.12, anchors: { offset: 0, userData: { anchor: true } } }}>{page}</ReactLenis>
}
