import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { CTA, HERO, IMG } from '../lib/content'
import { useReducedMotion } from '../lib/utils'
import { Button, SectionTitle } from '../components/ui'

/* HERO. Compoziția din referință: promisiunea în stânga, Vera în
   centru, textul și dovada (mentorii) în dreapta, cifrele jos.
   Adâncime discretă: numele din spate, Vera și eticheta cu linie de
   legătură se mișcă cu viteze diferite. Fără altă animație. */

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const backY = useTransform(p, [0, 1], reduced ? ['0%', '0%'] : ['0%', '22%'])
  const veraY = useTransform(p, [0, 1], reduced ? ['0%', '0%'] : ['0%', '8%'])
  const tagY = useTransform(p, [0, 1], reduced ? ['0%', '0%'] : ['0%', '-60%'])

  return (
    <section id="top" ref={ref} data-tone="light" className="ground-studio relative overflow-hidden md:h-[100svh] md:min-h-[720px]">
      {/* numele din spate, abia vizibil */}
      <motion.div aria-hidden="true" style={{ y: backY }} className="pointer-events-none absolute inset-x-0 bottom-[-4vw] flex justify-center">
        <span className="title select-none text-[46vw] leading-[0.8] text-black/[0.035] md:text-[30vw]">Vera</span>
      </motion.div>

      <div className="wrap relative flex h-full flex-col pt-28 md:grid md:grid-cols-[1.3fr_minmax(0,28vw)_0.9fr] md:pt-0">
        {/* stânga: promisiunea, butonul, cifrele */}
        <div className="relative z-20 flex flex-col md:justify-between md:pb-12 md:pt-[26svh]">
          <div>
            <SectionTitle
              as="h1"
              title={HERO.title}
              className="anim-fade-up max-w-[14ch] text-[2.9rem] sm:text-[3.4rem] xl:text-[3.9rem]"
            />
            <p className="anim-fade-up mt-6 max-w-[26rem] text-[16px] leading-[1.6] text-ink-soft md:hidden" style={{ animationDelay: '120ms' }}>
              {HERO.side}
            </p>
            <div className="anim-fade-up mt-8 hidden md:block" style={{ animationDelay: '200ms' }}>
              <Button href="#lista">{CTA}</Button>
              <p className="mt-3 max-w-[20rem] text-[13px] text-ink-mute">{HERO.note}</p>
            </div>
          </div>

          <dl className="anim-fade-up mt-10 hidden grid-cols-2 gap-8 md:grid" style={{ animationDelay: '320ms' }}>
            {HERO.stats.map(([n, l]) => (
              <div key={l} className="border-t border-line pt-4">
                <dt className="h-sec text-[2rem]">{n}</dt>
                <dd className="mt-1 text-[13px] leading-snug text-ink-mute">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* centru: Vera */}
        <div className="relative -mx-5 mt-6 h-[62svh] md:mx-0 md:mt-0 md:h-auto">
          <motion.div style={{ y: veraY }} className="absolute bottom-0 left-1/2 h-full -translate-x-1/2 md:h-[90svh]">
            <img
              src={IMG('vera-costum')}
              alt="Vera Lozovanu-Guțu, în costum, cu cravată roșie"
              width={748}
              height={1800}
              fetchPriority="high"
              className="anim-fade-in h-full w-auto max-w-none select-none"
              draggable={false}
            />
          </motion.div>

          {/* eticheta cu linie de legătură, ca un afiș de distribuție */}
          <motion.div
            style={{ y: tagY }}
            className="anim-fade-up absolute bottom-[16%] left-[88%] z-10 hidden w-max md:block"
          >
            <div className="flex items-center gap-2 text-[17px] font-medium">
              <BadgeCheck size={18} className="text-red" aria-hidden="true" />
              {HERO.tag.name}
            </div>
            <div className="ml-6 mt-1 border-t border-ink/25 pt-2 text-[13px] text-ink-mute">{HERO.tag.role}</div>
          </motion.div>
        </div>

        {/* dreapta: cine e și cine a format-o */}
        <div className="relative z-20 hidden flex-col md:flex md:pt-[30svh]">
          <div className="ml-auto max-w-[22rem]">
            <span aria-hidden="true" className="mb-6 flex items-center">
              <span className="h-px w-40 bg-ink/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-red" />
            </span>
            <p className="anim-fade-up text-[19px] leading-[1.5] text-ink-soft" style={{ animationDelay: '150ms' }}>
              {HERO.side}
            </p>
            <Proof />
          </div>
        </div>
      </div>

      {/* telefon: dovada, butonul și cifrele stau sub portret, nu peste el */}
      <div className="wrap relative z-20 border-t border-line bg-studio pb-10 pt-8 md:hidden">
        <Button href="#lista" full>
          {CTA}
        </Button>
        <p className="mt-3 text-center text-[13px] text-ink-mute">{HERO.note}</p>
        <Proof />
        <dl className="mt-8 grid grid-cols-2 gap-6">
          {HERO.stats.map(([n, l]) => (
            <div key={l} className="border-t border-line pt-3">
              <dt className="h-sec text-[1.7rem]">{n}</dt>
              <dd className="mt-1 text-[13px] leading-snug text-ink-mute">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Proof() {
  return (
    <div className="anim-fade-up mt-8 flex items-center gap-4" style={{ animationDelay: '260ms' }}>
      <div className="flex shrink-0">
        {['av-metiu', 'av-naghiev'].map((a, i) => (
          <img
            key={a}
            src={IMG(a)}
            alt=""
            width={48}
            height={48}
            className={`h-12 w-12 rounded-full border-2 border-studio object-cover ${i ? '-ml-3' : ''}`}
          />
        ))}
      </div>
      <p className="text-[14px] leading-snug text-ink-soft">{HERO.proof}</p>
    </div>
  )
}
