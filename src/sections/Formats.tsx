import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FORMATS } from '../lib/content'
import { useReveal } from '../lib/utils'
import { Label, SectionTitle } from '../components/ui'

/* FORMATE. Compoziția „programului pe module” din referință: tab-uri
   deasupra, conținutul în stânga, cardul „Rezultat” în dreapta, în
   roșu. Trei formate: consultație, individual, grup. */

export function Formats() {
  const ref = useReveal<HTMLElement>()
  const [active, setActive] = useState(2)
  const item = FORMATS.items[active]

  return (
    <section id="formate" ref={ref} data-tone="light" className="ground-studio border-t border-line section">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[12rem_1fr] lg:gap-0">
          <Label className="reveal">{FORMATS.label}</Label>
          <SectionTitle title={FORMATS.title} className="reveal max-w-[18ch] text-[2.5rem] sm:text-[3.4rem] lg:text-[3.9rem]" />
        </div>

        <div className="reveal mt-14 flex flex-col gap-5 lg:ml-[12rem] lg:mt-16 lg:flex-row lg:items-center lg:gap-8">
          <div role="tablist" aria-label="Formate" className="flex flex-wrap gap-2">
            {FORMATS.items.map((f, i) => {
              const on = i === active
              return (
                <button
                  key={f.tab}
                  role="tab"
                  aria-selected={on}
                  aria-controls="format-panel"
                  onClick={() => setActive(i)}
                  className={`rounded-full border px-5 py-2.5 text-[14px] font-medium transition-colors duration-300 ${
                    on ? 'border-red bg-red text-white' : 'border-line bg-card text-ink hover:border-ink/30'
                  }`}
                >
                  {f.tab}
                </button>
              )
            })}
          </div>
          <span className="hidden h-px flex-1 bg-line lg:block" aria-hidden="true" />
          <p className="text-[13px] text-ink-mute">{FORMATS.hint}</p>
        </div>

        <div id="format-panel" role="tabpanel" className="reveal mt-6 lg:ml-[12rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-3 lg:grid-cols-[1fr_20rem]"
            >
              <div className="rounded-[24px] bg-card p-7 sm:p-10">
                <h3 className="title text-[2.6rem] leading-none sm:text-[3.2rem]">{item.title}</h3>
                <p className="mt-4 max-w-[34rem] text-[17px] leading-[1.6] text-ink-soft">{item.lead}</p>
                <ul className="mt-8 grid gap-x-10 gap-y-4 border-t border-line pt-8 sm:grid-cols-2">
                  {item.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15px] leading-snug">
                      <span aria-hidden="true" className="mt-[0.55em] flex shrink-0 items-center">
                        <span className="h-px w-3 bg-ink" />
                        <span className="h-1 w-1 rounded-full bg-ink" />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex min-h-[220px] flex-col justify-between rounded-[24px] bg-red p-7 text-white sm:p-8">
                <p className="h-sec text-[1.9rem] italic">{FORMATS.resultLabel}:</p>
                <p className="mt-6 text-[19px] leading-[1.4]">{item.result}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
