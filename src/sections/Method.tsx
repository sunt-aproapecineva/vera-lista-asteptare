import { AudioLines, HeartPulse, MessageSquareText, PersonStanding } from 'lucide-react'
import { IMG, METHOD } from '../lib/content'
import { useReveal } from '../lib/utils'
import { Label, SectionTitle } from '../components/ui'

/* MPA. Primul bloc pe scenă (grund întunecat), pentru contrast.
   Compoziția din referința cu etapele: eticheta în stânga, titlul
   mare, apoi rânduri despărțite de linii: număr, iconiță, titlu,
   descriere. Vera, pe gânduri, se stinge în întuneric în dreapta. */

const ICONS = [HeartPulse, AudioLines, PersonStanding, MessageSquareText]

export function Method() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="metoda" ref={ref} data-tone="dark" className="ground-stage relative overflow-hidden section">
      <img
        src={IMG('vera-gand')}
        alt=""
        aria-hidden="true"
        width={995}
        height={1500}
        loading="lazy"
        className="pointer-events-none absolute right-[max(-6%,calc(50%_-_800px))] top-24 hidden h-[640px] w-auto opacity-90 [mask-image:linear-gradient(to_bottom,black_55%,transparent),linear-gradient(to_left,black_60%,transparent)] [mask-composite:intersect] min-[1180px]:block"
      />

      <div className="wrap relative">
        <div className="grid gap-8 lg:grid-cols-[12rem_1fr] lg:gap-0">
          <div className="reveal">
            <Label>{METHOD.label}</Label>
          </div>
          <div className="max-w-[46rem]">
            <p className="reveal title text-[1.6rem] text-red-soft">{METHOD.abbr}</p>
            <SectionTitle title={METHOD.title} className="reveal mt-3 text-[2.9rem] sm:text-[4rem] lg:text-[4.8rem]" />
            <p className="reveal mt-8 max-w-[30rem] text-[18px] leading-[1.6] text-ink-soft" style={{ transitionDelay: '100ms' }}>
              {METHOD.side}
            </p>
          </div>
        </div>

        <ol className="mt-20 border-t border-line lg:mt-28">
          {METHOD.pillars.map((p, i) => {
            const Icon = ICONS[i]
            return (
              <li
                key={p.n}
                className="reveal grid grid-cols-[3rem_1fr] gap-x-4 gap-y-3 border-b border-line py-8 sm:py-10 lg:grid-cols-[12rem_4rem_1fr_1fr] lg:items-start lg:gap-0"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="text-[14px] text-ink-mute lg:pt-2">/{p.n}</span>
                <span className="col-start-1 row-start-2 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/[0.04] lg:col-start-2 lg:row-start-1">
                  <Icon size={19} strokeWidth={1.5} className="text-red-soft" aria-hidden="true" />
                </span>
                <div className="col-start-2 row-span-2 row-start-1 lg:col-start-3 lg:row-span-1 lg:pr-10">
                  <p className="title text-[1.5rem] text-red-soft">{p.name}</p>
                  <h3 className="h-sec mt-1 text-[1.5rem] sm:text-[1.9rem]">{p.title}</h3>
                  <p className="mt-3 max-w-[30rem] text-[16px] leading-[1.6] text-ink-soft lg:hidden">{p.text}</p>
                </div>
                <p className="hidden text-[16px] leading-[1.6] text-ink-soft lg:block lg:pt-2">{p.text}</p>
              </li>
            )
          })}
        </ol>

        <div className="reveal mt-14 flex flex-col gap-6 lg:ml-[12rem] lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[26rem] text-[18px] leading-[1.5]">{METHOD.order}</p>
          <p className="title text-[2.4rem] italic leading-none text-bone/90 sm:text-[3rem]">{METHOD.motto}</p>
        </div>
      </div>
    </section>
  )
}
