import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { FORM, FORM_ENDPOINT, WAITLIST } from '../lib/content'
import { saveLead, useReveal } from '../lib/utils'
import { Button, Label, SectionTitle } from '../components/ui'

/* LISTA. Al doilea bloc pe scenă. Compoziția „condiții doar pentru
   participanți” din referință: grilă 2×2 cu lățimi alternate, fiecare
   card cu un „obiect” mare în dreapta (aici, cifra sau semnul culese
   în OT Miniature). Apoi ultimul pas: pașii în stânga, formularul
   alb în dreapta, ca să fie cel mai luminos lucru de pe ecran. */

const SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

export function Waitlist({ onSent }: { onSent: (name: string, interest: string) => void }) {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="lista" ref={ref} data-tone="dark" className="ground-stage section">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <Label className="reveal">{WAITLIST.label}</Label>
            <SectionTitle title={WAITLIST.title} className="reveal mt-6 max-w-[16ch] text-[2.6rem] sm:text-[3.6rem] lg:text-[4.2rem]" />
          </div>
          <p className="reveal max-w-[34rem] text-[16px] leading-[1.6] text-ink-soft">{WAITLIST.side}</p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-12 lg:mt-16">
          {WAITLIST.perks.map((p, i) => (
            <article
              key={p.title}
              className={`reveal relative flex min-h-[230px] flex-col justify-end overflow-hidden rounded-[22px] border border-line bg-stage-card p-7 pt-[9.5rem] sm:min-h-[260px] sm:p-8 sm:pt-[10.5rem] ${SPANS[i]}`}
              style={{ transitionDelay: `${(i % 2) * 90}ms` }}
            >
              <span aria-hidden="true" className="pointer-events-none absolute right-6 top-2 select-none sm:right-10">
                {p.mark === 'W' ? (
                  <BookOpen size={120} strokeWidth={0.8} className="mt-3 text-bone/25 sm:mt-8" />
                ) : (
                  <span className="title text-[9rem] leading-none text-bone/20 sm:text-[11rem]">{p.mark}</span>
                )}
              </span>
              <h3 className="relative h-sec text-[1.5rem] sm:text-[1.75rem]">{p.title}</h3>
              <p className="relative mt-2 max-w-[26rem] text-[15px] leading-[1.55] text-ink-soft">{p.text}</p>
            </article>
          ))}
        </div>

        <p className="reveal mt-8 text-center text-[17px]">
          {WAITLIST.note.replace('NIMIC.', '')}
          <span className="font-bold">NIMIC</span>.
        </p>

        {/* ultimul pas */}
        <div className="mt-24 grid gap-10 border-t border-line pt-16 lg:mt-32 lg:grid-cols-[1fr_28rem] lg:gap-16 lg:pt-20">
          <div className="reveal">
            <SectionTitle as="h3" title={FORM.title} className="text-[2.4rem] sm:text-[3.2rem]" />
            <ol className="mt-10 flex flex-col">
              {FORM.steps.map((s, i) => (
                <li key={s} className="flex items-baseline gap-5 border-b border-line py-5 text-[17px]">
                  <span className="title w-4 shrink-0 text-[1.6rem] text-red-soft">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <Form onSent={onSent} />
        </div>
      </div>
    </section>
  )
}

function Form({ onSent }: { onSent: (name: string, interest: string) => void }) {
  const [interest, setInterest] = useState('')

  return (
    <form
      className="reveal rounded-[24px] bg-card p-6 text-ink [--color-ink-soft:#57504d] [--color-ink-mute:#6b6460] [--color-line:rgba(18,16,16,0.12)] [--focus-ring:var(--color-red)] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
        data.name = (data.name ?? '').trim()
        /* Corp urlencoded, fără Content-Type setat de mână: rămâne o cerere
           „simplă”, fără preflight CORS (Apps Script, Formspree etc.). */
        if (FORM_ENDPOINT) {
          fetch(FORM_ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams({ ...data, source: 'vera-lista', at: new Date().toISOString() }),
            keepalive: true,
          }).catch(() => {})
        }
        saveLead(data.name ?? '', data.interest ?? '')
        onSent(data.name ?? '', data.interest ?? '')
      }}
    >
      <div className="flex flex-col gap-4">
        <Field label={FORM.name} name="name" autoComplete="given-name" autoCapitalize="words" pattern=".*\S.*" message={() => FORM.errors.name} />
        <Field label={FORM.phone} name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+ \(\)\-]{8,20}" message={(v) => (v.valueMissing ? FORM.errors.phone : FORM.errors.phoneBad)} />
        <Field label={FORM.email} name="email" type="email" autoComplete="email" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" message={(v) => (v.valueMissing ? FORM.errors.emailMissing : FORM.errors.emailBad)} />
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-[14px] font-medium">{FORM.interest.label}</legend>
        <div className="flex flex-wrap gap-2">
          {FORM.interest.options.map((o) => {
            const on = interest === o
            return (
              <label
                key={o}
                className={`cursor-pointer rounded-full border px-4 py-2 pointer-coarse:py-3 text-[14px] transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red ${
                  on ? 'border-ink bg-ink text-white' : 'border-line text-ink hover:border-ink/40'
                }`}
              >
                <input
                  type="radio"
                  name="interest"
                  value={o}
                  checked={on}
                  required
                  className="sr-only"
                  onInvalid={(e) => e.currentTarget.setCustomValidity(FORM.errors.interest)}
                  onChange={(e) => {
                    /* mesajul stă pe fiecare radio din grup, deci îl ștergem pe toate */
                    e.currentTarget.form?.querySelectorAll<HTMLInputElement>('input[name=interest]').forEach((r) => r.setCustomValidity(''))
                    setInterest(o)
                  }}
                />
                {o}
              </label>
            )
          })}
        </div>
      </fieldset>

      <label className="mt-6 flex items-start gap-3 text-[13px] leading-relaxed text-ink-soft">
        <input
          type="checkbox"
          name="consent"
          value="da"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#ad0003]"
          onInvalid={(e) => e.currentTarget.setCustomValidity(FORM.errors.consent)}
          onChange={(e) => e.currentTarget.setCustomValidity('')}
        />
        {FORM.consent}
      </label>
      {/* TODO client (I13): nota de confidențialitate (<details> cu FORM.privacy)
          intră aici, după acord, doar cu textul primit și înainte de FORM_ENDPOINT. */}

      <div className="mt-6">
        <Button type="submit" full>
          {FORM.submit}
        </Button>
      </div>
    </form>
  )
}

/* Câmp text cu mesaje de validare în română. `message` primește starea
   câmpului (gol sau greșit) și întoarce textul pentru balonul browserului. */
function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  inputMode,
  pattern,
  autoCapitalize,
  message,
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  inputMode?: 'tel' | 'email' | 'text'
  pattern?: string
  autoCapitalize?: string
  message: (v: ValidityState) => string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-medium">{label}</span>
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        autoCapitalize={autoCapitalize}
        onInvalid={(e) => e.currentTarget.setCustomValidity(message(e.currentTarget.validity))}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        className="rounded-xl border border-line bg-studio px-4 py-3 text-ink outline-none transition-colors focus:border-red"
      />
    </label>
  )
}
