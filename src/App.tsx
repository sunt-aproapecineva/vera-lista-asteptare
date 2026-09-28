import { useCallback, useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'
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
import { readLead, useReducedMotion, type Lead } from './lib/utils'

/* Ordinea paginii urmează încălzirea: te recunoști → înțelegi cauza →
   vezi ideea (decorul) → metoda → omul și școala ei → cum lucrați →
   lista. Rutare minimă: `/` și `/multumesc`, prin history.pushState. */

const THANKYOU_PATH = '/multumesc'

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [lead, setLead] = useState<Lead>(readLead)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const go = useCallback((to: string) => {
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  if (path.replace(/\/+$/, '') === THANKYOU_PATH) {
    return <ThankYou lead={lead} onBack={() => go('/')} />
  }

  const page = (
    <>
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
    </>
  )

  return reduced ? page : (
    <ReactLenis root options={{ lerp: 0.12, anchors: { offset: -80 } }}>
      {page}
    </ReactLenis>
  )
}
