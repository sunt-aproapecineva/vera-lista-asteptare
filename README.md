# Vera Lozovanu-Guțu · lista de așteptare

Landingul care o vinde pe Vera și metoda ei de autor, **MPA (Metoda Prezenței Actoricești)**.
Lista e pentru toți cei care vor să lucreze cu ea, în oricare dintre formate:

- consultație 1:1;
- mentorat individual;
- mentoratul de grup „Scena Vieții”.

Structura pornește de la `cornelia-russu-landing`. Compozițiile blocurilor urmează referințele
primite de la client. Metoda de lucru și verificarea vin din scroll-craft, iar mecanismele de
animație din componentry.

## Cum pornești

```bash
npm install
npm run dev
```

Rulează pe `http://localhost:5185`. Build de producție: `npm run build`.

## Structură

Tot textul stă în [`src/lib/content.ts`](src/lib/content.ts).

| Bloc | Fișier | Compoziția |
|---|---|---|
| Hero | `Hero` | Promisiunea în stânga, Vera în centru, textul și mentorii în dreapta, cifrele jos. |
| Unde te recunoști | `Pain` | Grilă cu titlul în prima celulă. Șase carduri care se întorc, iar concluzia închide grila. |
| Decorul | `Decor` | Bloc fixat. Decorul se schimbă (Camera, Ședința, Acasă, Scena) și, odată cu el, poza cu Vera. |
| MPA | `Method` | Pe grund întunecat. Cei 4 piloni pe rânduri: număr, iconiță, titlu, descriere. |
| Cine sunt + mentorii | `About` | Portret, citat și cifre. Mentorii apar în rame de vizor, cu poze alb-negru. |
| Formate | `Formats` | Tab-uri (consultație, individual, grup) și cardul roșu „Rezultat”. |
| Lista | `Waitlist` | Grilă 2×2 cu cele 4 condiții, apoi pașii și formularul. |
| Final | `Final` | „Un singur rol. Oriunde.”, buton și subsol. |
| — | `ThankYou` | `/multumesc`. Deschide singur WhatsApp după 5 secunde, cu mesajul completat. |

## Sistemul vizual

- **Două grunduri:** studio (gri deschis cu reflector) și scenă (aproape-negru). Culorile de decor apar doar în blocul „Decorul”.
- **Titluri:** Helvetica Neue, cu **un** cuvânt în OT Miniature italic roșu (`SectionTitle` din `components/ui.tsx`).
- **Roșul `#AD0003`** e doar accent: butoane, cuvântul din titlu, cifre.
- **Animații puține:** o singură apariție discretă la scroll, blocul „Decorul” și un parallax ușor în hero.
- **Poze:** cele 15 fotografii editate ale Verei, decupate, stau în [`poze-vera-decupate/`](poze-vera-decupate/), la 3000px. Acolo e și lista cu locul fiecăreia pe pagină. Copiile web folosite pe landing sunt în `public/img/`.

## Ce mai lipsește

- **`WHATSAPP_NUMBER`:** numărul Verei.
- **`FORM_ENDPOINT`:** webhook-ul în care se salvează înscrierile. Fără el, datele nu se salvează nicăieri.
- **Detaliile consultației și ale mentoratului individual.** Durata și numărul de întâlniri sunt scrise general și trebuie confirmate cu Vera.
- **Licența webfont pentru OT Miniature**, care e font comercial.
- **Adresarea:** textul e la feminin.
