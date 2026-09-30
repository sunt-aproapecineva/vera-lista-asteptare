import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Title } from '../lib/content'

/* Piesele comune ale sistemului. Toate secțiunile le folosesc pe
   acestea, ca pagina să arate ca un singur lucru. */

/** Titlu de secțiune: Helvetica, cu un cuvânt în OT Miniature italic.
 *  Dacă `before` se termină cu un cuvânt de o literă („o”, „e”), spațiul
 *  de după e nedespărțitor, ca litera să nu rămână singură la capăt de rând.
 *  `id` și `tabIndex` servesc la mutarea focusului pe titlu (/multumesc). */
export function SectionTitle({
  title,
  as: Tag = 'h2',
  className = '',
  style,
  id,
  tabIndex,
}: {
  title: Title
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  style?: CSSProperties
  id?: string
  tabIndex?: number
}) {
  const [before, accent, after] = title
  return (
    <Tag id={id} tabIndex={tabIndex} className={`h-sec ${className}`} style={style}>
      {before}
      {before && (/(^|\s)\S$/.test(before) ? '\u00a0' : ' ')}
      <span className="accent">{accent}</span>
      {after && (/^[.,!?]/.test(after) ? after : ` ${after}`)}
    </Tag>
  )
}

/** Eticheta mică din coloana stângă. */
export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[13px] tracking-wide text-ink-mute ${className}`}>
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </p>
  )
}

/** Butonul principal. Același peste tot. */
export function Button({
  href,
  children,
  onClick,
  type,
  full = false,
}: {
  href?: string
  children: ReactNode
  onClick?: () => void
  type?: 'submit' | 'button'
  full?: boolean
}) {
  const cls = `group inline-flex items-center justify-between gap-5 rounded-full bg-red py-2 pl-6 pr-2 text-white transition-colors duration-300 hover:bg-red-deep ${
    full ? 'w-full' : ''
  }`
  const inner = (
    <>
      <span className="text-[15px] font-medium">{children}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight size={18} />
      </span>
    </>
  )
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type ?? 'button'} className={cls} onClick={onClick}>
      {inner}
    </button>
  )
}

/** OT Miniature are cratima lată cât o linie de pauză. În textele culese
 *  cu el, cratima se culege în Helvetica. */
export function Ot({ children }: { children: string }) {
  const parts = children.split('-')
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="font-body">-</span>}
          {p}
        </span>
      ))}
    </>
  )
}
