/* ════════════════════════════════════════════════════════════════
   CONȚINUT — Vera Lozovanu-Guțu · lista de așteptare.
   Pagina o vinde pe Vera și metoda ei de autor, MPA. Lista e pentru
   oricine vrea să lucreze cu ea: consultație, mentorat individual
   sau mentoratul de grup „Scena Vieții”.

   Surse: ARSENAL_CONTENT_VERA_2_AUDIENTE.md, vera-analiza-voce.md,
   Scena_Vietii_Rezumat_Strategic.md, deck-ul de brand v2 din Figma,
   plus textele despre mentori date de client.
   Titlurile de secțiune se scriu ca [înainte, accent, după]: accentul
   e cules în OT Miniature italic, roșu. Un singur accent pe titlu.
════════════════════════════════════════════════════════════════ */

export const IMG = (n: string) => `/img/${n}.webp`

export const BRAND = 'Vera Lozovanu-Guțu'
export const CTA = 'Mă înscriu pe listă'
export const SEATS = 20

export type Title = [string, string, string]

export const NAV = [
  { label: 'Metoda', href: '#metoda' },
  { label: 'Despre Vera', href: '#vera' },
  { label: 'Formate', href: '#formate' },
  { label: 'Lista', href: '#lista' },
]

export const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/vera.lozovanu_gutu/' },
]

/* ── WhatsApp ────────────────────────────────────────────────────
   TODO: numărul Verei (sau al asistentei), doar cifre, cu prefixul
   țării și fără „+”. Ex.: 37369123456. Cât e gol, WhatsApp se
   deschide cu mesajul scris, dar fără destinatar.                 */
export const WHATSAPP_NUMBER = ''

export const whatsappLink = (name?: string, interest?: string) => {
  const hello = name?.trim() ? `Bună! Sunt ${name.trim()}.` : 'Bună!'
  const want = interest && interest !== 'Încă nu știu' ? ` Mă interesează: ${interest}.` : ''
  const text = `${hello} M-am înscris pe listă și aș vrea să planific ședința bonus cu Vera.${want}`
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(text)}`
}

/* TODO: webhook pentru înscrieri (Make / Zapier / Apps Script /
   Supabase). Cât e gol, formularul duce direct spre WhatsApp. */
export const FORM_ENDPOINT = ''

/* ── HERO ───────────────────────────────────────────────────────── */
export const HERO = {
  title: ['Rămâi', 'tu', 'când te privesc alții.'] as Title,
  side: 'Vera Lozovanu-Guțu sunt. Cu MPA, metoda mea de autor, te pregătesc pentru cameră, ședință și scenă.',
  proof: 'Am învățat de la Teodora Mețiu și Dmitrii Naghiev.',
  tag: { name: 'Vera Lozovanu-Guțu', role: 'expertă în comunicare autentică' },
  stats: [
    ['15 ani', 'pe scenă, în teatru'],
    ['3 fluxuri', 'de mentorat de grup'],
  ] as [string, string][],
  note: 'Pentru consultație, mentorat individual sau de grup.',
}

/* ── UNDE TE RECUNOȘTI ─────────────────────────────────────────────
   Șase situații din Arsenal (A și B amestecate). Fața cardului e
   situația, spatele e alegoria sau mecanismul, scurtat.          */
export const PAIN = {
  label: 'Unde te recunoști',
  title: ['La fiecare', 'doare', 'altfel.'] as Title,
  hint: 'Apasă pe un card',
  flip: 'întoarce',
  cards: [
    {
      front: 'Filmezi de zece ori aceeași frază',
      back: 'Și o păstrezi pe prima. Sau pe niciuna. A zecea dublă nu e mai bună, e doar mai obosită.',
    },
    {
      front: 'Ai galeria plină de filmări nepostate',
      back: 'Patruzeci de scrisori scrise și netrimise. Iar omul căruia îi erau adresate nu știe nici că exiști.',
    },
    {
      front: 'La ședință ai răspunsul, iar pauza trece',
      back: 'Apoi îl spune altcineva, cu jumătate din competența ta. Și toți dau din cap.',
    },
    {
      front: 'Repeți acasă de cincisprezece ori',
      back: 'Și iese perfect. În sală e altceva, pentru că te-ai antrenat exact acolo unde problema nu există.',
    },
    {
      front: 'Îți revine accentul când ai emoții',
      back: 'Nu e dicția. E corpul care, în momentele importante, te trimite înapoi de unde ai plecat.',
    },
    {
      front: 'Ești alt om în weekend',
      back: 'Liberă, sigură, prezentă. Iar luni, în fața colegilor sau a șefului, te faci mică.',
    },
  ],
  statement: ['Toți repară textul. Problema e în', 'corp', '.'] as Title,
  statementSub:
    'Crezi că îți lipsește curajul? Nu. Un telefon rezemat de o cană și o sală plină îi transmit corpului același lucru: ești privită. De aici vin nodul din gât, vocea care se subțiază și textul uitat. Iar corpul se antrenează.',
}

/* ── DECORUL ─────────────────────────────────────────────────────
   Construcția a rămas (a plăcut). Acum se schimbă și cadrul cu
   Vera odată cu decorul: același om, alt context.               */
export type DecorTone = 'mint' | 'spot' | 'brown' | 'red'

export const DECOR = {
  intro: 'Nu construim zece versiuni ale tale.',
  introImg: 'vera-rade',
  role: 'Rolul: tu',
  sets: [
    { name: 'Camera', line: 'Reel-ul pe care îl amâni de o lună.', tone: 'mint' as DecorTone, img: 'vera-mana' },
    { name: 'Ședința', line: 'Luni, la zece, cu toți ochii pe tine.', tone: 'spot' as DecorTone, img: 'vera-costum' },
    { name: 'Acasă', line: 'Discuția pe care o tot amâni.', tone: 'brown' as DecorTone, img: 'vera-portret' },
    { name: 'Scena', line: 'Cinci minute la microfon, cu ai tăi în sală.', tone: 'red' as DecorTone, img: 'vera-dans' },
  ],
  outro: 'Decorul se schimbă. Tu rămâi.',
  outroSub: 'Asta lucrăm cu MPA: același om pe cameră, la ședință, acasă și pe scenă.',
}

/* ── MPA ─────────────────────────────────────────────────────────
   „Metoda Prezenței Actoricești”. Deck-ul v2 observa că
   „actoricească” poate suna a „joacă un rol”. Textul răspunde
   direct: actorii nu joacă pe altcineva, rămân vii când sunt priviți. */
export const METHOD = {
  label: 'Metoda de autor',
  abbr: 'MPA',
  title: ['Metoda Prezenței', 'Actoricești', ''] as Title,
  side: 'Actorii nu joacă pe altcineva. Au învățat să rămână vii în fața a o mie de oameni. Asta te învăț și pe tine, fără scenă și fără costum.',
  pillars: [
    {
      n: '01',
      name: 'Emoție',
      title: 'Întâi scoatem frica din corp',
      text: 'Lucrăm cu reflexul care îți strânge vocea și îți golește mintea. Fără asta, orice tehnică se prăbușește la prima emoție.',
    },
    {
      n: '02',
      name: 'Voce',
      title: 'O voce care nu se subțiază',
      text: 'Respirația, tonul și intonația care coboară. Vocea ta, așa cum sună când nu te privește nimeni.',
    },
    {
      n: '03',
      name: 'Corp',
      title: 'Primele cinci secunde',
      text: 'Privirea, mâinile, felul în care intri. Oamenii decid înainte să spui primul cuvânt.',
    },
    {
      n: '04',
      name: 'Mesaj',
      title: 'Abia acum, ce spui',
      text: 'Structura, ideea, primele trei secunde din reel. Pe o temelie care deja ține.',
    },
  ],
  order: 'Ordinea contează. Toți încep cu mesajul, dar mesajul vine ultimul.',
  motto: 'Ochii se tem, mâinile fac.',
}

/* ── VERA ─────────────────────────────────────────────────────────
   Cifrele sunt din deck, slide „Profilul brandului”.              */
export const ABOUT = {
  label: 'Cine sunt',
  quoteStrong: 'Actorii cu patruzeci de ani de scenă au trac înainte de fiecare spectacol.',
  quoteRest: 'Nu le trece. Diferența e ce fac cu el.',
  cite: 'Vera Lozovanu-Guțu',
  stats: [
    ['15', 'ani de teatru'],
    ['5', 'ani de jurnalism'],
    ['5', 'ani de marketing'],
    ['3', 'fluxuri de mentorat'],
  ] as [string, string][],
  body: 'Am crescut pe scenă. Apoi am lucrat în jurnalism, în marketing și opt ani alături de un trainer de vânzări. Peste tot am văzut același lucru: oameni foarte buni, care dispar exact când sunt priviți. Din asta s-a născut MPA.',
}

/* ── MENTORII ─────────────────────────────────────────────────────
   Textele sunt ale clientului. „Intensiv … Dubai, 2026” e din deck. */
export const MENTORS = {
  label: 'Mentorii mei',
  title: ['Am învățat de la oameni care', 'nu ratează', 'tonul.'] as Title,
  people: [
    {
      name: 'Teodora Mețiu',
      img: 'mentor-metiu',
      alt: 'Vera Lozovanu-Guțu alături de Teodora Mețiu',
      text: 'De 15 ani antrenează președinți, europarlamentari și CEO ai celor mai mari corporații din lume să vorbească în public.',
      note: 'Public speaking la cel mai înalt nivel',
    },
    {
      name: 'Dmitrii Naghiev',
      img: 'mentor-naghiev',
      alt: 'Vera Lozovanu-Guțu alături de Dmitrii Naghiev',
      text: 'Numărul 1 în televiziunea și filmul din Rusia de peste 30 de ani. Peste 150 de roluri, de la comedie la drame grele după fapte reale, fără să rateze vreodată tonul.',
      note: 'Intensiv cu Dmitrii Naghiev, Dubai, 2026',
    },
  ],
}

/* ── FORMATE ──────────────────────────────────────────────────────
   TODO: detaliile consultației și ale mentoratului individual sunt
   formulate general. De confirmat cu Vera (durată, număr de întâlniri). */
export const FORMATS = {
  label: 'Cum lucrăm',
  title: ['Trei feluri în care putem', 'lucra împreună', '.'] as Title,
  hint: 'Alege un format ca să vezi ce conține',
  resultLabel: 'Rezultat',
  items: [
    {
      tab: 'Consultație 1:1',
      title: 'Consultația',
      lead: 'O întâlnire unu la unu, ca să vedem unde ești acum.',
      points: [
        'Aflăm unde te blochezi: pe cameră, la ședință sau pe scenă',
        'Vedem cu care pilon din MPA începi',
        'Pleci cu primii pași concreți',
      ],
      result: 'Știi de unde pornești și ce lucrezi primul.',
    },
    {
      tab: 'Mentorat individual',
      title: 'Mentoratul individual',
      lead: 'Lucrăm doar noi două, pe situația și în ritmul tău.',
      points: [
        'Programul se construiește pe scopul tău',
        'Cei patru piloni ai MPA, luați pe rând',
        'Feedback direct pe filmările și prezentările tale',
      ],
      result: 'Te recunoști în video și în sală. Același om, peste tot.',
    },
    {
      tab: 'Scena Vieții · grup',
      title: 'Scena Vieții',
      lead: 'Mentoratul de grup care te pregătește pentru cel mai important rol: rolul tău de zi cu zi.',
      points: [
        '6 săptămâni, cu temă după fiecare lecție',
        'Grupă mică: exersezi în fața unor oameni reali',
        'ZOOM-uri săptămânale cu mine',
        'Final pe o scenă adevărată, la Chișinău',
      ],
      result: 'Ieși pe scenă, în fața publicului, și rămâi tu.',
    },
  ],
}

/* ── LISTA ────────────────────────────────────────────────────────
   Bonusurile cerute de client. Fraza din `side` e formularea care a
   convertit în DM-uri (analiza vocii, secț. 7).                    */
export const WAITLIST = {
  label: 'Lista de așteptare',
  title: ['Condiții doar pentru cei', 'de pe listă', '.'] as Title,
  side: 'Lista e pentru oamenii care știu că au ceva valoros de spus, dar nu se simt siguri pe cameră și în fața oamenilor.',
  perks: [
    {
      mark: '%',
      title: 'Cea mai bună ofertă de preț',
      text: 'La consultație și la mentorat, individual sau de grup. Doar pentru cei de pe listă.',
    },
    {
      mark: '20',
      title: 'Loc garantat la Scena Vieții',
      text: `Grupa are doar ${SEATS} de locuri. Al tău e rezervat înainte să se deschidă înscrierea.`,
    },
    {
      mark: '30',
      title: 'Ședință bonus cu mine',
      text: '30 de minute, doar noi două. Vedem unde te blochezi și ce format ți se potrivește.',
    },
    {
      mark: 'W',
      title: 'Workbook, pas cu pas',
      text: 'Cum să fii sigură pe tine în fața camerei și în viața de zi cu zi.',
    },
  ],
  note: 'Numele tău pe listă nu te obligă la NIMIC.',
}

export const FORM = {
  title: 'Ultimul pas',
  steps: ['Completezi formularul', 'Te duc pe WhatsApp, cu mesajul deja scris', 'Stabilim împreună ședința bonus'],
  name: 'Prenumele',
  phone: 'Telefon (WhatsApp)',
  email: 'Email',
  interest: {
    label: 'Ce te interesează?',
    options: ['Consultație 1:1', 'Mentorat individual', 'Scena Vieții (grup)', 'Încă nu știu'],
  },
  consent: 'Sunt de acord să fiu contactată în legătură cu lista de așteptare.',
  submit: CTA,
}

/* ── FINAL ────────────────────────────────────────────────────── */
export const FINAL = {
  line: ['Un singur rol.', 'Oriunde.'],
  sub: 'Dacă vrei să-l joci și tu, lista e deschisă.',
}

/* ── MULȚUMESC ─────────────────────────────────────────────────── */
export const THANKYOU = {
  eyebrow: 'Ești pe listă',
  title: 'Locul tău e rezervat.',
  body: 'Mai e un pas: scrie-mi pe WhatsApp și stabilim ședința bonus. Mesajul e deja scris, trebuie doar să-l trimiți.',
  redirect: 'Te duc pe WhatsApp în câteva secunde…',
  cta: 'Deschide WhatsApp',
  stay: 'Rămân aici',
  stopped: 'Am oprit redirecționarea. Butonul de mai sus te duce oricând.',
  whisper: 'Ochii se tem, mâinile fac.',
}
