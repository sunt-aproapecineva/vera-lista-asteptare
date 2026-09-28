import { ABOUT, IMG, MENTORS } from '../lib/content'
import { useReveal } from '../lib/utils'
import { Label, Ot, SectionTitle } from '../components/ui'

/* VERA + MENTORII. Două compoziții din referințe:
   1) portretul în stânga, citatul mare și cifrele în dreapta;
   2) mentorii în rame „de vizor” (colțuri marcate, eticheta pe
      verticală), cu numele și ce fac, ca dovadă de școală.        */

export function About() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="vera" ref={ref} data-tone="light" className="ground-studio">
      {/* 1. Vera */}
      <div className="wrap grid gap-10 pt-[clamp(96px,11vw,168px)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="relative order-2 -mx-5 h-[70svh] max-h-[760px] min-h-[460px] sm:mx-0 lg:order-1 lg:h-[780px]">
          <img
            src={IMG('vera-portret')}
            alt="Vera Lozovanu-Guțu, portret, în rochie neagră"
            width={1094}
            height={1500}
            loading="lazy"
            className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none"
            draggable={false}
          />
        </div>

        <div className="order-1 lg:order-2 lg:pt-16">
          <Label className="reveal">{ABOUT.label}</Label>
          <blockquote className="reveal mt-8">
            <p className="h-sec text-[1.9rem] sm:text-[2.5rem] lg:text-[2.8rem]">
              «{ABOUT.quoteStrong} <span className="text-ink-mute">{ABOUT.quoteRest}»</span>
            </p>
            <footer className="mt-5 text-[14px] text-ink-mute">
              <span className="title text-[1.3rem] text-ink">
                <Ot>{ABOUT.cite}</Ot>
              </span>
            </footer>
          </blockquote>

          <p className="reveal mt-10 max-w-[34rem] text-[17px] leading-[1.65] text-ink-soft">{ABOUT.body}</p>

          <dl className="reveal mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ABOUT.stats.map(([n, l]) => (
              <div key={l} className="flex min-h-[140px] flex-col justify-between rounded-[18px] bg-card p-5">
                <dt className="title text-[3rem] leading-none text-red">{n}</dt>
                <dd className="text-[13px] leading-snug text-ink-soft">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 2. Mentorii */}
      <div className="border-t border-line">
        <div className="wrap section">
          <div className="grid gap-8 lg:grid-cols-[12rem_1fr] lg:gap-0">
            <Label className="reveal">{MENTORS.label}</Label>
            <SectionTitle title={MENTORS.title} className="reveal max-w-[20ch] text-[2.5rem] sm:text-[3.4rem] lg:text-[3.9rem]" />
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:ml-[12rem] lg:mt-20 lg:gap-10">
            {MENTORS.people.map((m, i) => (
              <article key={m.name} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="relative pl-9">
                  <span className="absolute left-0 top-3 rotate-180 whitespace-nowrap text-[12px] tracking-[0.2em] text-ink-mute uppercase [writing-mode:vertical-rl]">
                    Mentor
                  </span>
                  <figure className="relative aspect-[4/5] border border-ink/25 p-2">
                    {['-left-1 -top-1', '-right-1 -top-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((c) => (
                      <span key={c} aria-hidden="true" className={`absolute h-2 w-2 bg-red ${c}`} />
                    ))}
                    <img
                      src={IMG(m.img)}
                      alt={m.alt}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </figure>
                </div>
                <div className="mt-6 pl-9">
                  <h3 className="title text-[2.4rem] leading-none">{m.name}</h3>
                  <p className="mt-4 max-w-[30rem] text-[16px] leading-[1.6] text-ink-soft">{m.text}</p>
                  <p className="mt-4 inline-flex rounded-full border border-line px-4 py-1.5 text-[13px] text-ink-soft">{m.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
