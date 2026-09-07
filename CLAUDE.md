# trygt-overvann-website

Trygt Overvann™ sin offentlige nettside (trygtovervann.no). Varemerket drives av
OhJoy Ventures AS. Statisk multi-side, ingen build.

Deploy: git-auto-deploy er AV. Deploy skjer manuelt via wrangler — se DEPLOY.md for full instruks og den eksakte kommandoen.

## Lokal klon (sist oppdatert 2026-08-03)

Mappa er `~/trygt-overvann-website`. Den het `~/zsen-tovw-check` fram til 03.08.2026.

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

## SEO-status (sist oppdatert 2026-09-02)

Full SEO-audit gjennomført (claude-seo). Health score ~87/100. Fullført, deployet og live:
- K1: tre brutte innholdsbilder rettet (filer lagt til assets/, src URL-encodet).
- H1: NAP-konsistens — all e-post standardisert til kontakt@trygtovervann.no; for-advokater-telefon rettet.
- H2: entitet/varemerke i schema — Organization name="Trygt Overvann™", legalName="OhJoy Ventures AS", parentOrganization="Green Harmony Holding AS". vatID/taxID beholdt.
- H3: rå mellomrom i og:image/twitter:image/inline <img> URL-encodet (%20).
- M2: sameAs utvidet med Brønnøysund Enhetsregisteret + Proff.no (personlig LinkedIn bevisst utelatt pga COWI-ansettelse).
- M3: llms.txt synket med eierskap (OhJoy Ventures AS / varemerke).
- M4: presis plassering fjernet fra schema (geo + streetAddress + postalCode); synlig "Landås, Bergen" → "Bergen". Beholder Bergen som område.
- M5: kontekstuell krysslinking (02.09.2026) — 16 lenker i brødteksten på de sju tjenestesidene, alle som lenke rundt ord som allerede sto der. Hver side har nå både utgående og innkommende kontekstlenker; `uavhengig-kontroll` og `breeam-nor` hadde null innkommende før. NB: FAQ-teksten er duplisert i JSON-LD — forankre mot `</p>` så bare den synlige varianten treffes.

- Navn/person/pris-rydding (07.09.2026): ™ paa alle 163 navneforekomster i utrullede filer, logolenken i toppmenyen rettet paa alle 13 sider, sivilingenioer→ingenioer, 15+→17+ aar, konsul-vervet ut, alle priser ut. Se «Navnebruk» og «Personinformasjon og priser». IKKE deployet.

Gjenstår fra auditen:
- M1 (utenfor repo, HØYESTE): Google Business Profile + NAP-konsistente siteringer (Proff/1881/Gulesider). Navnespørsmålet som blokkerte er avklart 02.09 — se «Navnebruk». Gjenstår: adressemodus (GBP krever ekte adresse til verifisering selv i tjenesteområde-modus, som kolliderer med M4), og selve opprettelsen.
- Lav prioritet: 404.html noindex, render-blocking Google Fonts, background-image URL-encoding.

Merk: interne docs (tasks/, handoff) ligger i repoets egen `tasks/`, men deployes IKKE til web-root — rsync ekskluderer .git/DEPLOY.md/README.md/CLAUDE.md/AGENTS.md/tasks/.gitignore/.wrangler (se DEPLOY.md).

Schema-redigering: Organization-noden er duplisert identisk i alle 13 HTML-filer — bruk perl -0777 over alle filer for konsistens, og valider JSON-LD etterpå. NB: escape "@type" som "\@type" i Perl-erstatninger (ellers tolkes @ som array).

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
