# trygt-overvann-website

Trygt Overvann™ sin offentlige nettside (trygtovervann.no). Varemerket drives av
OhJoy Ventures AS. Statisk multi-side, ingen build.

Deploy: git-auto-deploy er AV. Deploy skjer manuelt via wrangler — se DEPLOY.md for full instruks og den eksakte kommandoen.

## Lokal klon (sist oppdatert 2026-08-03)

Mappa er `~/ClaudeCode/active/trygt-overvann-website`. Den het `~/zsen-tovw-check`
fram til 03.08.2026, og laa i hjemmemappa fram til flyttingen 04.08.2026.

Bakgrunn: hjemmemappa hadde fire mapper som alle lignet nettsiden, og denne — den eneste
som faktisk er trygtovervann.no — hadde det minst gjenkjennelige navnet. Mappa som het
`to-hjemmeside` var en nedlagt forgjenger (én 99 kB-side, eget privat repo), ikke en eldre
versjon av denne siden. De tre nedlagte er arkivert til
`~/Backups/nettside-arkiv-2026-08-03/` med forklaring i `LES-MEG.md` der.

🔴 Én av dem, `bzsc-tohj-check`, er klonet fra en gammel GitHub-konto der repoet er
slettet (404). Arkivmappa er derfor den eneste kopien som finnes.

To lærdommer for neste gang:
- Sjekk live mot lokal kilde før du redigerer — mappenavn er ikke bevis.
- Cloudflares e-postobfuskering roterer et token ved hver forespørsel, så to hentinger av
  samme uendrede side gir ulik hash. Bruk diff, ikke hash, når du verifiserer mot prod.

## SEO-status (sist oppdatert 2026-09-11)

Full SEO-audit gjennomført (claude-seo). Health score ~87/100. Fullført, deployet og live:
- K1: tre brutte innholdsbilder rettet (filer lagt til assets/, src URL-encodet).
- H1: NAP-konsistens — all e-post standardisert til kontakt@trygtovervann.no; for-advokater-telefon rettet.
- H2: entitet/varemerke i schema — Organization name="Trygt Overvann™", legalName="OhJoy Ventures AS", parentOrganization="Green Harmony Holding AS". vatID/taxID beholdt.
- H3: rå mellomrom i og:image/twitter:image/inline <img> URL-encodet (%20).
- M2: sameAs utvidet med Brønnøysund Enhetsregisteret + Proff.no (personlig LinkedIn bevisst utelatt pga COWI-ansettelse).
- M3: llms.txt synket med eierskap (OhJoy Ventures AS / varemerke).
- M4: presis plassering fjernet fra schema (geo + streetAddress + postalCode); synlig "Landås, Bergen" → "Bergen". Beholder Bergen som område.
- M5: kontekstuell krysslinking (02.09.2026) — 16 lenker i brødteksten på de sju tjenestesidene, alle som lenke rundt ord som allerede sto der. Hver side har nå både utgående og innkommende kontekstlenker; `uavhengig-kontroll` og `breeam-nor` hadde null innkommende før. NB: FAQ-teksten er duplisert i JSON-LD — forankre mot `</p>` så bare den synlige varianten treffes.

- Navn/person/pris-rydding (07.09.2026, DEPLOYET til prod samme dag): ™ paa alle 163 navneforekomster i utrullede filer, logolenken i toppmenyen rettet paa alle 13 sider, sivilingenioer→ingenioer, 15+→17+ aar, konsul-vervet ut, alle priser ut. Se «Navnebruk» og «Personinformasjon og priser».

Gjenstår fra auditen — **alt som gjenstår krever Bengt, ikke en økt:**

1. **Search Console + Bing Webmaster (HØYEST, blokkerer måling).** Verifiser
   trygtovervann.no via DNS TXT og send inn `/sitemap.xml`. Verifisert 11.09:
   sonens eneste TXT er fortsatt SPF — ingen verifisering finnes. Til dette er
   på plass måles **ingenting** av ytelses- og schema-arbeidet 08.–09.09.
2. 🔴 **COWI-beslutningen** — se «AAPENT» under. Den gater M1: en Business
   Profile er langt mer synlig enn LinkedIn-lenken som alt ble utelatt av
   samme hensyn. Avgjør også «100 % Uavhengig» og habilitetssvaret.
3. **Person `sameAs`** — LinkedIn (kolliderer med punkt 2), Proff-rolle, eller
   ingen. Person-noden har i dag null ekstern forankring.
4. **M1: Google Business Profile + NAP-siteringer** (Proff/1881/Gulesider).
   Navnespørsmålet er avklart 02.09. Gjenstår adressemodus — GBP krever ekte
   adresse til verifisering selv i tjenesteområde-modus, som kolliderer med M4
   — og selve opprettelsen. Gated på punkt 2.

Lav prioritet: render-blocking Google Fonts (tre familier, ~870 ms på LCP-stien
målt 08.09), utbygging av /om/ og /tjenester/ med fagstoff (krever Bengt),
`.svc-arr`/`.split-eyebrow`-kontrast, sticky `.aside-block`, wrangler 4.71 →
4.129. (404 noindex, URL-encoding, titler, `lang="nb"`, datoer og og-bilder er
gjort — se «Bolk C-F GJORT».)

Merk: interne docs (tasks/, handoff) ligger i repoets egen `tasks/`, men deployes IKKE til web-root — rsync ekskluderer .git/DEPLOY.md/README.md/CLAUDE.md/AGENTS.md/tasks/.gitignore/.wrangler (se DEPLOY.md).

Schema-redigering: Organization-noden er duplisert identisk i alle 13 HTML-filer — bruk perl -0777 over alle filer for konsistens, og valider JSON-LD etterpå. NB: escape "@type" som "\@type" i Perl-erstatninger (ellers tolkes @ som array).

## Superlativ og COWI-omtale (Bengts avgjoerelse 08.09.2026)

### «Norges spesialist» er fjernet — ikke gjeninnfoer den

Sto **38 steder over alle 13 sider**, minst to per side: bunnteksten og
`description` paa Organization-noden. Naa **«Spesialist paa vannrelatert
klimarisiko»** overalt, samme ordlyd som llms.txt allerede brukte.

Grunnen er ikke stilistisk. «Norges» gjoer utsagnet til en paastand om
markedsposisjon — et faktisk forhold. **Markedsfoeringsloven § 3 andre ledd**
krever at slike paastander kan dokumenteres, og at dokumentasjonen foreligger
**naar markedsfoeringen skjer**, ikke naar noen spoer. For et firma etablert
2023 finnes ikke den dokumentasjonen. Verst: paastanden sto i samme JSON-LD-
blokk som `numberOfEmployees: 1`.

(§ 26 er forbudet mot villedende framstilling *naeringsdrivende imellom* —
sporet som gjelder her, siden kundene er kommuner, utbyggere, ingenioerfirmaer,
advokater og forsikringsselskap. Det er § 3 som stiller dokumentasjonskravet.)

Den reelle risikoen er ikke tilsyn, men **sakkyndigrollen**: motpartens advokat
leser nettsida, og en udokumenterbar nasjonal superlativ er et gratis
angrepspunkt mot troverdigheten i en prosedyre.

🔴 Beskrivelser ligger i `description` i strukturerte data paa alle sider, og
det er den strengen AI-soek gjengir. En superlativ der reproduseres i svar du
ikke kontrollerer, med deg som kilde.

### COWI: ansettelsen LOEPER — "tidligere" var feil

Bengt bekreftet 08.09 at han **fortsatt er ansatt i COWI**. /om/ sa «tidligere
hos COWI», og Person-noden hadde `alumniOf: COWI`. Begge er rettet:

- /om/ sier naa «blant annet fra COWI» — den noeytrale formen
  /for-advokater/ («flere aars praksis i COWI AS») og llms.txt («blant annet
  fra COWI AS») allerede brukte.
- `alumniOf`-noden er **fjernet**. Den er for utdanningsinstitusjoner, Google
  bruker den ikke til noe, og den hevdet i maskinlesbar form at forholdet var
  avsluttet. Samme moenster som `hasCredential`/`educationalLevel: "Master"`
  som ble fjernet 07.09 — en schema-node som fantes kun for aa hevde noe.
  Gjeninnfoer ingen av dem.

Skriv **aldri** COWI-omtalen om til fortid igjen.

### 🔴 AAPENT: skal ansettelsen opplyses eksplisitt?

Rettingen over fjernet det som var **uriktig**. Den tar ikke stilling til om
det loepende ansettelsesforholdet skal **opplyses**. Det er Bengts beslutning,
ikke en opprydding — den beroerer baade arbeidsgiverforholdet og habilitet.

Hvorfor det henger sammen med resten av sida:

- Forsiden har **«100 % Uavhengig»** som noekkeltall (to steder), /om/ sier
  «uavhengig raadgivning **uten interessekonflikter**» og «ingen binding til
  leverandoerer eller utbyggere». Alle er absolutte.
- Habilitetssvaret paa /for-advokater/ er formulert i **fortid**: «Hvis jeg
  *tidligere* har vaert involvert … Habilitetserklaering som beskriver
  eventuelle *tidligere* forbindelser.» Et loepende ansettelsesforhold hos et
  av landets stoerste raadgivende ingenioerfirmaer er en annen og sterkere
  kategori enn en historisk binding — og COWI prosjekterer VA og overvann i
  stort omfang, saa sannsynligheten for beroering i en konkret sak er reell.
- Uavhengig kontroll etter SAK10 har uavhengighet som **vilkaar**, ikke som
  markedsfoeringspoeng.
- Google Business Profile (M1) er langt mer synlig enn LinkedIn-lenken som
  allerede ble utelatt av COWI-hensyn.

Det som skader er ikke konflikten — den haandteres ved aa takke nei. Det er
**rekkefoelgen**: at motparten oppdager ansettelsen etter aa ha lest nettsida.
Da handler saken om hvorfor det sto som det sto.

**Presisering som avgjoer tyngden i dette (utledet 09.09):** det finnes to
slags sakkyndige, og Bengt er stort sett den andre.

- *Rettsoppnevnt sakkyndig:* habilitetsreglene gjelder formelt — tvisteloven
  § 25-3 viser til domstolloven, der § 108 er sekkebestemmelsen: «saeregne
  omstendigheter … skikket til aa svekke tilliten til hans uhildethet». Merk
  standarden: den spoer ikke om han VAR paavirket, men om omstendighetene er
  EGNET TIL aa svekke tilliten. En tilsynelatende-standard.
- *Privat engasjert sakkyndig* — som er det /for-advokater/ selger, oppdrag
  fra advokater og forsikringsselskap. Her finnes **ingen formell
  habilitetsregel** som kan diskvalifisere ham.

Det siste hoeres beskyttende ut, men er det motsatte: finnes det ingen regel
som diskvalifiserer, finnes det heller ingen prosedyre som RENVASKER. Retten
staar fritt i bevisvurderingen. Da er tilknytning og troverdighet ikke et
formelt spoersmaal ved siden av saken — de er hele spoersmaalet om hva
rapporten er verdt.

Derfor er den kommersielle risikoen stoerre enn den rettslige, og den ligger
i KANALEN, ikke i saken: advokaten som engasjerte ham blir overrumplet i
retten foran sin egen klient. Han ringer ikke igjen, og advokater snakker
sammen. Bengt er ikke jurist paa dette punktet, og beslutningen boer tas med
en advokat han allerede jobber med — saerlig ordlyden i habilitetserklaeringen,
som i dag bare dekker TIDLIGERE bindinger.

Ikke endre «100 % Uavhengig», habilitetssvaret eller GBP-planen uten at Bengt
har tatt denne beslutningen.

## SEO/GEO-revisjon 08.09.2026 — ytelse og bildehaandtering

Full revisjon maalt mot LIVE prod, ikke mot repoet. Rapport med alle funn:
`tasks/seo-geo-revisjon-2026-09-08.md`. Bolk A+B rettet og deployet samme dag.

**Resultat: 7 av 12 sider strauk paa LCP, naa 0. Total vekt 6980 -> 3788 KB.**

To ting var oedelagt i prod uten at noen visste det:

1. 🔴 **`styles.css` pekte paa `assets/Flom under bro.webp`, som aldri har
   ligget i dette repoet.** Referansen ble arvet fra forgjenger-sida.
   Klimatilpasning-seksjonen paa forsiden brukte regelen uten aa overstyre
   den, og `.split-img` har ingen reservefarge — saa halve seksjonen sto tom.
   Bildet er hentet fra `~/Backups/nettside-arkiv-2026-08-03/`.
2. ✅ **www.trygtovervann.no LOEST 09.09.2026.** `www` er lagt inn som custom
   domain paa Pages-prosjektet via API-et, og svarer 200 paa alle testede ruter.
   Innhold er identisk med apex (verifisert med diff, ikke hash — se lærdommen
   om Cloudflares e-postobfuskering), `canonical` paa www peker til apex, og
   sitemap lister kun apex. Duplikat-innhold er dermed haandtert.

### Bilder: <img>, ikke background-image

Alle hero-bilder var CSS `background-image` i full opploesning. De er naa
`<img>` med `fetchpriority="high"` og derivater i 3.2:1 — formatet
`.svc-hero` faktisk viser (maks 440 px hoy). Det loeste to ting samtidig:
LCP, og at fem sider hadde **null indekserbare bilder**, fordi Google Images
ikke ser CSS-bakgrunner og `role="img"` + `aria-label` ikke er alt-tekst.

Ikke gaa tilbake til `background-image` for fotografier.

`logo.jpg` var 806x806 og 56 KB, vist 38x38, eager, paa hver eneste side.
`<img>` bruker naa `logo-96.webp` (2,5 KB); **JSON-LD beholder `logo.jpg`**,
som ikke hentes av nettleseren og boer vaere stor.

### 🔴 Assets ligger 4 timer paa edge — endre URL, ikke bare fila

Foerste deploy tok ikke effekt: `cf-cache-status: HIT` med gammel
`content-length`. Verre enn treg oppdatering — ny HTML moette gammel
`styles.css`, saa forsiden ga 404 paa det slettede bildet ETTER at fiksen
var deployet.

Rot: filnavn uten innholdshash + sonens Browser Cache TTL paa 4 t.
`_headers` ber om 3600, men `/assets/*`-regelen slaar aldri gjennom.
DEPLOY.md paastod «1t cache paa /assets/ — deploys vises uten manuell purge»;
begge deler var feil, og er rettet. Keychain-tokenet har ikke purge-tilgang.

**Regel: endrer du innholdet i en assetfil, endre ogsaa URL-en.** Bilder faar
nytt filnavn, `styles.css` har `?v=AAAAMMDD` som skal bumpes ved CSS-endring.

### Feller ved bildearbeid

- **Verifiser bildet, ikke filstoerrelsen.** Et regenerert hero ble stille
  hentet fra feil kilde fordi skriptet gjenbrukte en midlertidig fil fra
  forrige iterasjon. Stoerrelsen saa plausibel ut. Se paa bildet.
- **Filnavn med mellomrom OG `ø` gjoer grep upaalitelig** — HTML-en koder
  mellomrom som `%20`, men lar `ø` staa raa. Et soek paa den fullkodede
  formen bommer. Kostet en feilaktig «ubrukt asset»-melding i rapporten.
- **`loading="lazy"` utsetter ikke bilder naer viewporten.** Broedtekstbildet
  paa uavhengig-kontroll startet 676 ms inn og delte baandbredde med heroen.
  Lazy er ikke nok; stoerrelsen betyr fortsatt noe.
- Inline broedtekstbilder oppga alle `width="1200" height="800"` uansett
  faktisk fil, og tre av dem er portrett. Rettet.

### Bolk C-F GJORT 09.09.2026 (commit bdc4e7d, deployet og verifisert live)

- **Datoer:** alle 12 indekserbare sider har en side-node (`WebPage`, eller
  eksisterende `AboutPage`/`ContactPage`/`CollectionPage`) med `@id …#webpage`,
  `isPartOf` → `#website`, `datePublished` 2026-04-18 og `dateModified`.
  **`scripts/oppdater-datoer.sh` setter `dateModified` og sitemap `<lastmod>`
  fra git-datoen per fil** (ucommittert = i dag) og er foerste steg i
  DEPLOY.md-oppskriften. Kjoer det — ellers lyver datoene igjen.
- **Én entitet:** `#localbusiness` er borte. `#organization` har
  `@type: ["Organization","ProfessionalService"]` paa alle sider;
  `hasOfferCatalog` og `openingHoursSpecification` ligger kun paa forsiden.
- **Overskrifter:** /om/ har h2 «Om firmaet», «Verdier», «Faglig ekspertise»
  (c-label-etikettene er `<h2 class="c-label">`, visuelt uendret — `.c-label`
  fikk `font-weight:400`). /tjenester/ og forsiden: tjenestenavn i kortene er
  `<h3 class="svc-name">`, /tjenester/ fikk h2 «Alle tjenester».
- **og:image:** 9 JPEG 1200×630 i `assets/og/` (sips fra webp-originalene,
  midtbeskaaret), med `og:image:type/width/height/alt` og `twitter:image:alt`.
  Nye filnavn — ingen edge-cache-kollisjon.
- **Titler:** 8 kortet til ≤60 tegn (forsiden 58, tjenester 55, for-advokater
  55, breeam 54, havnivaa 59, klima 52, uavhengig 59, va 50). og:/twitter:title
  speiler `<title>`.
- `lang="nb"`, `inLanguage: "nb-NO"`, 404.html `noindex,follow`, `_headers`
  har kommentar om at kanten overstyrer TTL.

**Gjenstaar og krever Bengt:** Search Console + Bing (DNS TXT), Person
`sameAs` (valg), utbygging av /om/ og /tjenester/ (fagstoff), COWI-spoersmaalet
over, GBP. `/OM/` med store bokstaver gir 200 — Pages har ingen bryter for det.

## Navnebruk (besluttet 02.09.2026, skjerpet 07.09.2026)

Gjennomgaende merkenavn er **«Trygt Overvann™»** — med varemerkesymbol, uten AS.
Selskapet ble omdoept fra det gamle AS-navnet til OhJoy Ventures AS i
Broennoeysund i april 2026. «Trygt Overvann» er et varemerke, ikke et
aksjeselskap.

Reglene:
- **Alle** henvisninger til merket — synlig tekst, titler, og:*/twitter:*,
  description, meta-author, JSON-LD `name`, llms.txt, robots.txt, kommentarer i
  styles.css/nav.js/_redirects → **«Trygt Overvann™»**. Ikke bare foerste
  forekomst per side; symbolet staar hver gang navnet nevnes.
- Symbolet skrives som **literal ™**, ikke `&trade;`. HTML-entiteter dekodes
  ikke inne i `<script type="application/ld+json">`, saa `&trade;` ville blitt
  staaende raatt i strukturerte data. Literal tegn virker begge steder, og gjoer
  at ett grep finner alle forekomster.
- Juridisk enhet **«OhJoy Ventures AS»** staar paa noeyaktig ett sted per side:
  bunnteksten der org.nr. staar. Eneste tillatte tillegg er `legalName` i schema
  og kontaktsidens egen organisasjonsblokk (Bengts valg 07.09.2026 — den er
  faktisk korrekt selv om den bryter ett-sted-regelen).
  🔴 Kontaktsidens organisasjonsblokk paret feil navn med riktig org.nr fram til
  02.09.2026. Blindt soek-og-erstatt ville sementert feilen — sjekk alltid
  konteksten rundt org.nr.
- `alternateName` er **["Trygt Overvann"]** — ren-formen uten symbol. Den gamle
  AS-varianten er fjernet etter krav 07.09.2026; hadde begge oppfoeringene blitt
  konvertert ville arrayet inneholdt samme streng to ganger.
- Skriv aldri «OhJoy Ventures AS» inn i heading, broedtekst eller metadata som
  bivirkning av soek-og-erstatt.

🔴 **Fella som overlevde forrige rydding:** logolenken i toppmenyen sto som
`<div class="nav-name">Trygt Overvann <small>AS &mdash; Bergen</small></div>` paa
alle 13 sidene. «AS» laa i en egen `<small>`-tag, saa et tekstsoek paa
«Trygt Overvann AS» traff den aldri — den sto synlig i prod i fem dager etter at
navneryddingen 02.09 ble erklaert ferdig og verifisert mot live. Samme mekanisme
gjaldt `assets/styles.css` linje 1. Naar du verifiserer en navneendring, sjekk det
**rendrede** resultatet, ikke bare kildestrengen.

Bunnteksten er identisk paa alle 13 sider og skal lyde:

    © 2026 OhJoy Ventures AS · org.nr. 932 480 956.
    Trygt Overvann™ er et varemerke som drives av OhJoy Ventures AS.

Gjenstaar for M1: Google Business Profile (tjenesteomraade-modus, ikke synlig
adresse — se M4) og NAP-konsistente siteringer. Krever Bengts handling.

## Personinformasjon og priser (07.09.2026)

- **Bengt er ingenioer, ikke sivilingenioer.** Tittelen sto 32 steder, inkludert
  `jobTitle` i strukturerte data paa alle 13 sider og en `hasCredential`-node med
  `educationalLevel: "Master"` paa /om/. Hele hasCredential-noden er fjernet —
  den fantes utelukkende for aa hevde graden. Gjeninnfoer den ikke.
- **Erfaring er 17+ aar**, ikke 15+. Tallet sto 12 steder, blant annet som
  hero-stat og split-stat paa forsiden.
- **Konsul-vervet er fjernet.** «Honoraer konsul for Ungarn i Bergen (under
  svergelse)» sto som kulepunkt under Kvalifikasjoner paa /for-advokater/ og som
  linje under «Optional» i llms.txt. Skal ikke tilbake.
- 🔴 **Ingen priser paa nettsiden.** Kronebeloep er fjernet fra fem FAQ-svar:
  /for-advokater/ (timepris og to intervaller), breeam-nor, overvannsradgivning,
  uavhengig-kontroll og klimatilpasning. Svarene sier naa at pris avtales etter
  innledende vurdering og at fastpris/rammeoverslag gis i skriftlig tilbud.
  Hvert svar staar **to steder** per fil — i FAQPage-JSON-LD og i den synlige
  FAQ-blokken. Endrer du ett, endre begge.
- **Befaring og beregninger er IKKE lenger sakkyndig-leveranser.** Kulepunktene
  «Befaring med fotodokumentasjon» (med drone- og terrengopptak) og
  «Beregninger og modellering» er tatt ut av «Hva du faar» paa /for-advokater/,
  og befaring er fjernet som `Offer` i OfferCatalog. llms.txt lister naa bare
  rapport, teknisk uttalelse og vitnefoersel. Drone skal ikke tilbake.
  Bevisst BEHOLDT etter Bengts avgjoerelse 07.09: omtalen av befaring og
  beregninger i metadata, i JSON-LD-`description`, som steg 4 i prosesslista og
  i FAQ-svaret om oppdrag utenfor Bergen. Sida er altså med vilje ikke helt
  konsistent her — ikke «rydd» det uten aa spoerre.
  I tillegg er `"priceRange": "$$"` fjernet fra LocalBusiness-noden paa forsiden.
  Det er et maskinlesbart prissignal Google viser som prisnivaa, og et ordsoek
  etter «kr», «kroner» eller beloep finner det aldri. Legg det ikke tilbake.
- Gjenstaar, ikke fjernet (Bengts avgjoerelse): «reisekostnader etter statens
  satser» og «foerste samtale uten kostnad» paa /for-advokater/, og «Gratis 14
  dagers trial» i Rapportagent-teaseren paa forsiden. Ingen av dem oppgir et
  beloep, men alle tre er prisutsagn.

## Rendringsfeil funnet og rettet 07.09.2026

To feil paa /for-advokater/, begge usynlige i kildekoden og bare synlige i
rendret side:

1. 🔴 **Usynlig knappetekst.** `.svc-content a{color:var(--petro)}` har
   spesifisitet (0,1,1) og slaar `.btn-primary{color:#fff}` (0,1,0). Enhver
   knapp i broedteksten fikk derfor petrol tekst paa petrol bakgrunn — samme
   farge, null kontrast. Den blasse understrekingen som saas i stedet kom fra
   `text-decoration-color:var(--rule)`. Rettet med
   `.svc-content a.btn-primary` / `a.btn-ghost` (0,2,1), som vinner tilbake.
   Knappene i sidestolpen var aldri rammet — `.svc-card-contact` ligger
   utenfor `.svc-content`.
2. **Sidestolpen manglet alle stiler.** Sida bruker `svc-layout`/`svc-aside`/
   `aside-block`/`aside-list`, mens de sju tjenestesidene bruker
   `svc-body`/`svc-sidebar`/`svc-card-contact`/`svc-related`. Bare det siste
   settet fantes i styles.css, saa rutenettet ble aldri opprettet og
   `<aside>` falt ustylet ned under artikkelen. Lagt inn regler for de fire
   klassene, inkludert i begge media queries. Merk: `.aside-block` er IKKE
   sticky, slik `.svc-card-contact` er paa tjenestesidene. Hoeyre kolonne staar
   derfor tom nedover en lang side. Bevisst valgt for aa holde fiksen minimal.

**Teknikk som fant dem:** kryssjekk av alle `class="..."` i HTML mot alle
selektorer i styles.css avsloerer markup uten stiler. En klasse uten regel er
ikke i seg selv en feil — `.footer-brand`, `.hero-left`, `.svc-sidebar` og
`.svc-aside` er rene rutenettbarn og trenger ingen — men `.svc-layout` var det.

**Kontrastrevisjon** av alle 13 sider kjoert i headless Chrome via
DevTools-protokollen (`--headless=new --remote-debugging-port`, CDP over
Node-innebygd WebSocket — ingen npm-installasjon noedvendig). Nettleser-
utvidelsen var ikke tilkoblet; dette er et fullverdig alternativ.
🔴 En naiv variant gir ~44 falske positive fordi hvit tekst over
`background-image` (hero, tjenestekort) ser ut som hvit paa lys bakgrunn.
Filtrer bort alt som har en forelder med bakgrunnsbilde eller et absolutt
posisjonert overlay.

Restfunn, ikke rettet (kosmetisk, forelaa foer denne oekten):
- `.svc-arr` — «→» i tjenestekortene, `--rule` paa hvitt = 1,49:1. 12 steder
  paa forsiden og /tjenester/. Dekorativt, men under 3:1.
- `.split-eyebrow` «Klimatilpasning» paa forsiden — amber paa petrol = 2,67:1.
  Ekte tekst under WCAG AA (4,5:1).

## E-post: Cloudflare Email Routing (satt opp 02.09.2026)

`kontakt@trygtovervann.no` videresendes til `trygt.overvann@gmail.com`. Sonen tar
imot e-post via Cloudflare; det sendes ingenting ut derfra.

| Ressurs | Verdi |
|---|---|
| zone_id | `377d254ff31245a9e6a50dc5e38ca54d` |
| account_id | `a883a1ff61882fbcf8756f078097748f` |
| Regel «kontakt» | `05ea119562d846a8b956e9dac0b66b4c` |
| Catch-all | `314a59add4d44523ba8163518c65d2f6` — `drop`, enabled |
| Destination | `trygt.overvann@gmail.com`, verifisert 02.09.2026 |

DNS lagt til (fem poster; CNAME-ene til Pages er urørt): MX route1/2/3
.mx.cloudflare.net (prio 5/33/78), TXT SPF `v=spf1 include:_spf.mx.cloudflare.net ~all`,
TXT DKIM `cf2024-1._domainkey`, TXT `_dmarc` med
`v=DMARC1; p=quarantine; rua=mailto:kontakt@trygtovervann.no; adkim=r; aspf=r`.

### Feller (kostet tid 02.09.2026)

🔴 **Email Routing ligger IKKE under sonen lenger.** Det er flyttet til kontonivå:
dashboard → **Compute → Email Service → Email Routing → Onboard Domain**. Sonens
egen Email-meny viser bare DMARC Management og Email Security, så det ser ut som
produktet mangler.

🔴 **Sone-endepunktene for aktivering svarer 403 uansett token.**
`GET/POST /zones/{id}/email/routing`, `/enable` og `/dns` ga «Authentication error»
med et token som hadde Email Routing Rules:Edit, DNS:Edit, Zone:Read og
Account Email Routing Addresses:Edit — mens `/email/routing/rules` og
`/dns_records` virket fint på samme token. Aktivering må gjøres i dashboardet;
resten (regler, catch-all, DNS) går utmerket via API.

- `zones`-objektets `permissions`-liste nevner ikke Email Routing i det hele tatt,
  selv når tokenet har tilgang. Den listen er ikke et sannhetsvitne — test kallet.
- Catch-all med `enabled: true` + `drop` tar imot posten og kaster den stille.
  Deaktivert catch-all ville avvist i SMTP og gitt avsender en bounce. Valgt: drop.
- DKIM-posten kom med på kjøpet fra Email Service (utgående e-post). Ufarlig, men
  den var ikke bestilt.

### API-token

Ligger i macOS Keychain, ikke i Doppler (workspace står på 10 av 10 prosjekter og
flere krever betalt plan). Hentes med
`security find-generic-password -a cloudflare -s trygtovervann-cf-token -w`.
Skal det legges inn på nytt: kjør kommandoen under i et **ekte terminalvindu** —
en skjult prompt kjørt via `!` inne i Claude Code får EOF og lagrer tom streng
uten å feile:

    security add-generic-password -a cloudflare -s trygtovervann-cf-token -U -w
