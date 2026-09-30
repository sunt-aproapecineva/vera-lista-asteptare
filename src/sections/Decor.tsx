import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { DECOR, IMG, titleText, type DecorTone } from '../lib/content'
import { SectionTitle } from '../components/ui'

/* DECORUL. Act fixat: decorul se schimbă prin tăietură (camera,
   ședința, acasă, scena), iar odată cu el se schimbă și cadrul cu
   Vera. Același om, alt context. Numele decorului stă uriaș în
   spatele ei. La început și la final, grundul revine la studio.   */

const GROUND: Record<DecorTone | 'studio', string> = {
  studio: 'ground-studio',
  mint: 'ground-mint',
  spot: 'ground-spot',
  brown: 'ground-brown',
  red: 'ground-red',
}
const WORD: Record<DecorTone, string> = {
  mint: 'text-red',
  spot: 'text-red',
  brown: 'text-[#d9a878]',
  red: 'text-white/90',
}
const DARK = new Set<string>(['brown', 'red'])
const SETS = DECOR.sets
const INTRO_END = 0.1
const OUTRO_START = 0.86
/** Progresul secțiunii → starea: -1 intro, 0..3 decoruri, SETS.length final. */
const stageAt = (v: number) =>
  v < INTRO_END
    ? -1
    : v >= OUTRO_START
      ? SETS.length
      : Math.min(SETS.length - 1, Math.floor(((v - INTRO_END) / (OUTRO_START - INTRO_END)) * SETS.length))

/* toate cadrele, o singură dată: intro/final + câte unul pe decor */
const FRAMES = [DECOR.introImg, ...SETS.map((s) => s.img)]
const SIZES: Record<string, [number, number]> = {
  'vera-rade': [1058, 1700],
  'vera-mana': [679, 1600],
  'vera-costum': [748, 1800],
  'vera-portret': [1094, 1500],
  'vera-dans': [1325, 1600],
}

/* Preferința de mișcare se citește o singură dată, la montare.
   useLayoutEffect trece pe varianta statică înainte de paint, fără
   mismatch la hidratare. Comutarea ulterioară nu mai remontează nimic. */
export function Decor() {
  const [reduced, setReduced] = useState(false)
  useLayoutEffect(() => {
    // intenționat: valoarea există doar în browser; citită o dată, înainte de paint
    // oxlint-disable-next-line react/set-state-in-effect
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setReduced(true)
  }, [])
  return reduced ? <DecorStatic /> : <DecorPinned />
}

function DecorPinned() {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(-1) // -1 intro, 0..3 decoruri, 4 final
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    /* cât Lenis zboară spre o ancoră, decorul stă pe loc (fără stroboscop) */
    if (lenis?.isScrolling === 'smooth' && lenis.userData?.anchor === true) return
    const next = stageAt(v)
    if (next !== idx) setIdx(next)
  })
  /* La aterizare, decorul se aliniază la poziția reală. Altfel rămâne
     starea de dinaintea zborului: după #top din Waitlist, intrarea în
     Decor ar arăta finalul, iar la urcarea din Metoda, intro-ul.
     Lenis trimite `scrollend` pe window la capătul oricărui zbor. */
  useEffect(() => {
    const onEnd = () => {
      if (lenis?.isScrolling === 'smooth' && lenis.userData?.anchor === true) return
      setIdx(stageAt(scrollYProgress.get()))
    }
    window.addEventListener('scrollend', onEnd)
    return () => window.removeEventListener('scrollend', onEnd)
  }, [lenis, scrollYProgress])

  /* cadrele sunt lazy; după load le încălzim în cache, ca un scroll
     rapid să nu ajungă la ele înainte să fie descărcate */
  useEffect(() => {
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return
    const keep: HTMLImageElement[] = []
    let t = 0
    const warm = () => {
      t = window.setTimeout(() => {
        for (const f of FRAMES) {
          const im = new Image()
          im.decoding = 'async'
          im.src = IMG(f)
          keep.push(im)
        }
      }, 200)
    }
    if (document.readyState === 'complete') warm()
    else window.addEventListener('load', warm, { once: true })
    return () => {
      window.removeEventListener('load', warm)
      clearTimeout(t)
      keep.length = 0
    }
  }, [])

  const set = idx >= 0 && idx < SETS.length ? SETS[idx] : null
  const tone = set ? set.tone : 'studio'
  const dark = DARK.has(tone)
  const frame = set ? set.img : DECOR.introImg

  return (
    <section ref={ref} id="decorul" data-tone="light" className="relative h-[520svh]">
      {/* tot textul actului, stabil, pentru cititorul de ecran;
          stratul vizual de mai jos își schimbă conținutul la scroll */}
      <div className="sr-only">
        <h2>{DECOR.intro}</h2>
        <p>{DECOR.role}</p>
        <ul>
          {SETS.map((s) => (
            <li key={s.name}>
              {s.name}: {s.line}
            </li>
          ))}
        </ul>
        <h2>{titleText(DECOR.outro)}</h2>
        <p>{DECOR.outroSub}</p>
      </div>

      {/* 100lvh: decorul acoperă ecranul și când bara browserului se strânge */}
      <div
        aria-hidden="true"
        data-tone-live={dark ? 'dark' : 'light'}
        className={`sticky top-0 h-[100lvh] overflow-hidden ${GROUND[tone]}`}
      >
        {/* numele decorului, în spatele ei */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[max(17svh,calc(120px_+_3vw))] z-10 flex justify-center sm:top-[max(11svh,calc(92px_+_2vw))]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {set && (
              <motion.span
                key={set.name}
                initial={{ y: '10%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-6%', opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`title block whitespace-nowrap text-[29vw] leading-none sm:text-[20vw] ${WORD[set.tone]}`}
              >
                {set.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* cadrele cu Vera: toate încărcate, doar unul vizibil */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[68svh] sm:h-[84svh]">
          {FRAMES.map((f) => {
            const on = f === frame
            const [w, h] = SIZES[f]
            return (
              <img
                key={f}
                src={IMG(f)}
                alt={on ? 'Vera Lozovanu-Guțu' : ''}
                aria-hidden={!on}
                width={w}
                height={h}
                loading="lazy"
                className="absolute bottom-0 left-1/2 h-full w-auto max-w-none select-none transition-[opacity,transform] duration-500"
                style={{
                  opacity: on ? 1 : 0,
                  transform: `translateX(-50%) scale(${on ? 1 : 0.985})`,
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                draggable={false}
              />
            )
          })}
        </div>

        {/* textele stau în zona vizibilă (100svh), nu sub bara browserului */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[100svh] [&>*]:pointer-events-auto">
          {/* eticheta constantă */}
          <p
            className={`absolute right-[max(20px,5vw)] top-[92px] z-30 text-[12px] font-medium tracking-[0.18em] uppercase sm:top-auto sm:bottom-[12svh] ${dark ? 'text-white' : 'text-ink'}`}
          >
            {DECOR.role}
          </p>

          {/* textul actului */}
          <div
            className={`absolute inset-x-[max(20px,5vw)] bottom-6 z-30 sm:bottom-[12svh] sm:right-auto sm:max-w-[25rem] ${dark ? 'text-white' : 'text-ink'}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-2xl p-4 backdrop-blur-xl xl:bg-transparent xl:p-0 xl:backdrop-blur-none ${dark ? 'bg-black/55' : 'bg-white/92'}`}
              >
                {idx === -1 && <h2 className="h-sec text-[1.8rem] sm:text-[2.6rem]">{DECOR.intro}</h2>}
                {set && <p className="text-[1.25rem] font-medium leading-snug sm:text-[1.6rem]">{set.line}</p>}
                {idx === SETS.length && (
                  <>
                    <SectionTitle title={DECOR.outro} className="text-[1.9rem] sm:text-[2.8rem]" />
                    <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{DECOR.outroSub}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* programul decorurilor; pe ecranele joase (telefon în landscape)
              coboară, ca să nu se lipească de caseta finalului */}
          <ol
            aria-label="Decoruri"
            className={`absolute left-[max(20px,5vw)] top-[92px] z-30 flex gap-4 text-[13px] max-[359px]:gap-3 max-[359px]:text-[12px] sm:top-auto sm:bottom-[5svh] sm:rounded-full [@media(max-height:500px)]:sm:bottom-2 sm:px-3 sm:py-1 sm:backdrop-blur-sm xl:bg-transparent xl:p-0 xl:backdrop-blur-none ${dark ? 'text-white sm:bg-black/30' : 'text-ink sm:bg-white/60'}`}
          >
            {/* pe telefon, pe maro, lista n-are pastilă și stă chiar în lumina
                grundului: acolo numele inactive rămân albe pline (≥4,5:1) */}
            {SETS.map((s, i) => (
              <li
                key={s.name}
                className={`transition-opacity duration-300 ${i === idx ? 'font-medium underline decoration-1 underline-offset-4' : dark ? 'sm:opacity-90' : 'opacity-90'}`}
              >
                {s.name}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* Fără mișcare: cele patru decoruri, unul sub altul, complete.
   data-tone stă pe fiecare bloc (nu pe secțiune), ca header-ul să
   se închidă pe Acasă și Scena. */
function DecorStatic() {
  return (
    <section id="decorul">
      <div data-tone="light" className="ground-studio section wrap">
        <h2 className="h-sec text-[2.2rem] sm:text-[2.8rem]">{DECOR.intro}</h2>
      </div>
      {SETS.map((s) => (
        <div
          key={s.name}
          data-tone={DARK.has(s.tone) ? 'dark' : 'light'}
          className={`relative flex min-h-[80svh] items-end overflow-hidden px-5 pb-10 sm:px-10 ${GROUND[s.tone]}`}
        >
          <span aria-hidden="true" className={`title absolute inset-x-0 top-8 text-center text-[22vw] leading-none ${WORD[s.tone]}`}>
            {s.name}
          </span>
          <img src={IMG(s.img)} alt="Vera Lozovanu-Guțu" loading="lazy" className="absolute bottom-0 left-1/2 h-[66svh] w-auto -translate-x-1/2" />
          <p
            className={`relative z-10 max-w-sm rounded-2xl p-4 text-xl font-medium backdrop-blur-sm ${DARK.has(s.tone) ? 'bg-black/55' : 'bg-white/80'}`}
          >
            {s.line}
          </p>
        </div>
      ))}
      <div data-tone="light" className="ground-studio section wrap">
        <SectionTitle title={DECOR.outro} className="text-[2.2rem] sm:text-[2.8rem]" />
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{DECOR.outroSub}</p>
      </div>
    </section>
  )
}
