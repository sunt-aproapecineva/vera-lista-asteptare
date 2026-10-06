import { BRAND, CTA, FINAL, IMG, SOCIAL } from '../lib/content'
import { useReveal } from '../lib/utils'
import { Button } from '../components/ui'

/* FINAL. Rămâne pe scenă, continuarea listei: fraza de brand mare,
   Vera dansând, butonul și subsolul. Se rezolvă și rămâne. */

export function Final() {
  const ref = useReveal<HTMLElement>()

  return (
    <footer ref={ref} data-tone="dark" className="ground-stage ground-cont relative overflow-hidden">
      <div className="wrap relative grid min-h-[92svh] items-end md:grid-cols-[1fr_1fr]">
        <div className="relative z-10 pb-20 pt-24 md:pb-32">
          <h2 className="h-sec text-[clamp(2.6rem,15vw,3.4rem)] sm:text-[5rem] md:text-[min(7.4vw,5rem)] lg:text-[min(7.4vw,5.2rem)] xl:text-[6.2rem]">
            <span className="whitespace-nowrap">{FINAL.line[0]}</span>
            <br />
            <span className="accent">{FINAL.line[1]}</span>
          </h2>
          <p className="reveal mt-6 max-w-[22rem] text-[18px] leading-[1.5] text-ink-soft">{FINAL.sub}</p>
          <div className="reveal mt-8">
            <Button href="#lista">{CTA}</Button>
          </div>
        </div>
        <div className="relative h-[60svh] md:h-[86svh]">
          <img
            src={IMG('vera-esarfa-dans')}
            alt="Vera dansând, cu o eșarfă albă în mișcare"
            width={1637}
            height={2000}
            loading="lazy"
            className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none md:left-[45%] lg:left-[60%] xl:left-[58%]"
            draggable={false}
          />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-6 text-[13px] text-ink-mute sm:flex-row sm:justify-between">
          <span>© 2026 {BRAND}</span>
          <nav className="flex gap-5">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="-my-3 py-3 hover:text-bone">
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
