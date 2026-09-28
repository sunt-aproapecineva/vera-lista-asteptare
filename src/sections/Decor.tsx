import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { DECOR, IMG, type DecorTone } from '../lib/content'
import { useReducedMotion } from '../lib/utils'

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

/* toate cadrele, o singură dată: intro/final + câte unul pe decor */
const FRAMES = [DECOR.introImg, ...SETS.map((s) => s.img)]
const SIZES: Record<string, [number, number]> = {
  'vera-rade': [1058, 1700],
  'vera-mana': [679, 1600],
  'vera-costum': [748, 1800],
  'vera-portret': [1094, 1500],
  'vera-dans': [1325, 1600],
}

export function Decor() {
  const reduced = useReducedMotion()
  return reduced ? <DecorStatic /> : <DecorPinned />
}

function DecorPinned() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(-1) // -1 intro, 0..3 decoruri, 4 final
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next =
      v < INTRO_END
        ? -1
        : v >= OUTRO_START
          ? SETS.length
          : Math.min(SETS.length - 1, Math.floor(((v - INTRO_END) / (OUTRO_START - INTRO_END)) * SETS.length))
    if (next !== idx) setIdx(next)
  })

  const set = idx >= 0 && idx < SETS.length ? SETS[idx] : null
  const tone = set ? set.tone : 'studio'
  const dark = DARK.has(tone)
  const frame = set ? set.img : DECOR.introImg

  return (
    <section ref={ref} id="decorul" data-tone="light" className="relative h-[520svh]">
      <div data-tone-live={dark ? 'dark' : 'light'} className={`sticky top-0 h-[100svh] overflow-hidden ${GROUND[tone]}`}>
        {/* numele decorului, în spatele ei */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[17svh] z-10 flex justify-center sm:top-[11svh]">
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

        {/* eticheta constantă */}
        <p className={`absolute right-[max(20px,5vw)] top-[92px] z-30 text-[12px] font-medium tracking-[0.18em] uppercase sm:top-auto sm:bottom-[12svh] ${dark ? 'text-white' : 'text-ink'}`}>
          {DECOR.role}
        </p>

        {/* textul actului */}
        <div className={`absolute inset-x-[max(20px,5vw)] bottom-6 z-30 sm:bottom-[12svh] sm:right-auto sm:max-w-[25rem] ${dark ? 'text-white' : 'text-ink'}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl p-4 backdrop-blur-sm sm:bg-transparent sm:p-0 sm:backdrop-blur-none ${dark ? 'bg-black/30' : 'bg-white/60'}`}
            >
              {idx === -1 && <h2 className="h-sec text-[1.8rem] sm:text-[2.6rem]">{DECOR.intro}</h2>}
              {set && <p className="text-[1.25rem] font-medium leading-snug sm:text-[1.6rem]">{set.line}</p>}
              {idx === SETS.length && (
                <>
                  <h2 className="h-sec text-[1.9rem] sm:text-[2.8rem]">
                    Decorul se schimbă. <span className="accent">Tu rămâi.</span>
                  </h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{DECOR.outroSub}</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* programul decorurilor */}
        <ol
          aria-label="Decoruri"
          className={`absolute left-[max(20px,5vw)] top-[92px] z-30 flex gap-4 text-[13px] sm:top-auto sm:bottom-[5svh] ${dark ? 'text-white' : 'text-ink'}`}
        >
          {SETS.map((s, i) => (
            <li key={s.name} className={`transition-opacity duration-300 ${i === idx ? 'font-medium opacity-100' : 'opacity-40'}`}>
              {s.name}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* Fără mișcare: cele patru decoruri, unul sub altul, complete. */
function DecorStatic() {
  return (
    <section id="decorul" data-tone="light">
      <div className="ground-studio section wrap">
        <h2 className="h-sec text-[2.2rem] sm:text-[2.8rem]">{DECOR.intro}</h2>
      </div>
      {SETS.map((s) => (
        <div key={s.name} className={`relative flex min-h-[80svh] items-end overflow-hidden px-5 pb-10 sm:px-10 ${GROUND[s.tone]}`}>
          <span aria-hidden="true" className={`title absolute inset-x-0 top-8 text-center text-[22vw] leading-none ${WORD[s.tone]}`}>
            {s.name}
          </span>
          <img src={IMG(s.img)} alt="Vera Lozovanu-Guțu" loading="lazy" className="absolute bottom-0 left-1/2 h-[66svh] w-auto -translate-x-1/2" />
          <p className="relative z-10 max-w-sm text-xl font-medium">{s.line}</p>
        </div>
      ))}
      <div className="ground-studio section wrap">
        <h2 className="h-sec text-[2.2rem] sm:text-[2.8rem]">
          Decorul se schimbă. <span className="accent">Tu rămâi.</span>
        </h2>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{DECOR.outroSub}</p>
      </div>
    </section>
  )
}
