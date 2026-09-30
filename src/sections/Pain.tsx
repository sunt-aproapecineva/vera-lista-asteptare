import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { PAIN } from '../lib/content'
import { useReveal } from '../lib/utils'
import { Label, SectionTitle } from '../components/ui'

/* UNDE TE RECUNOȘTI. Compoziția din referință: titlul ocupă prima
   celulă a grilei, cardurile se întorc la apăsare, iar concluzia
   închide grila pe ultimele două celule. Primul card e deja întors,
   ca să se vadă că se poate. */

export function Pain() {
  const ref = useReveal<HTMLElement>()
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))
  const toggle = (i: number) =>
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <section ref={ref} data-tone="light" className="ground-studio section">
      <div className="wrap grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="reveal flex flex-col justify-between pb-8 sm:col-span-2 lg:col-span-1 lg:pb-0 lg:pr-8">
          <div>
            <Label>{PAIN.label}</Label>
            <SectionTitle title={PAIN.title} className="mt-6 text-[2.8rem] sm:text-[3.6rem] xl:text-[4.2rem]" />
          </div>
          <p className="mt-6 text-[13px] text-ink-mute">{PAIN.hint}</p>
        </div>

        {PAIN.cards.map((c, i) => {
          const on = open.has(i)
          return (
            <button
              key={c.front}
              type="button"
              aria-expanded={on}
              onClick={() => toggle(i)}
              className={`reveal group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[22px] p-6 text-left transition-[opacity,transform,background-color,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[280px] sm:p-7 ${
                on ? 'bg-stage text-bone' : 'bg-card text-ink hover:bg-white/60'
              }`}
              /* întârzierea în cascadă rămâne doar la apariție (opacity, transform);
                 culoarea răspunde imediat la apăsare */
              style={{ transitionDelay: `${(i % 3) * 60}ms, ${(i % 3) * 60}ms, 0ms, 0ms` }}
            >
              <span aria-hidden="true" className={`flex items-center justify-end gap-2 text-[12px] ${on ? 'text-bone/50' : 'text-ink-mute'}`}>
                {PAIN.flip}
                <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 ${on ? 'rotate-[-180deg] bg-white/10' : 'bg-black/[0.05]'}`}>
                  <RotateCcw size={15} className={`transition-colors duration-700 ${on ? 'text-red-soft' : 'text-red'}`} />
                </span>
              </span>

              {/* linia verticală din referință */}
              <span aria-hidden="true" className={`absolute left-6 top-6 h-8 w-px sm:left-7 sm:top-7 sm:h-14 ${on ? 'bg-bone/20' : 'bg-ink/10'}`} />

              {/* în buton doar span-uri; spatele cardului se citește doar când e întors */}
              <span className="relative block">
                <span aria-hidden="true" className={`text-[12px] font-medium tracking-[0.12em] transition-colors duration-700 ${on ? 'text-red-soft' : 'text-red'}`}>
                  [ {i + 1} ]
                </span>
                <span className={`mt-2 block text-pretty text-[1.25rem] leading-[1.2] tracking-[-0.015em] ${on ? 'text-bone/60' : 'font-medium'}`}>
                  {c.front}
                </span>
                <span
                  aria-hidden={!on}
                  className={`grid text-pretty transition-all duration-500 ${on ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <span className="overflow-hidden text-[15px] leading-[1.5] text-bone">{c.back}</span>
                </span>
              </span>
            </button>
          )
        })}

        <div className="reveal flex flex-col justify-end pt-10 sm:col-span-2 sm:pt-12 lg:pl-10">
          <SectionTitle as="h3" title={PAIN.statement} className="text-[2.2rem] sm:text-[3rem] lg:text-[3.4rem]" />
          <p className="mt-5 max-w-[33rem] text-[16px] leading-[1.6] text-ink-soft">{PAIN.statementSub}</p>
        </div>
      </div>
    </section>
  )
}
