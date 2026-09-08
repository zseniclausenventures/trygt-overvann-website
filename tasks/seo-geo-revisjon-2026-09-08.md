# SEO- og GEO-revisjon — trygtovervann.no (08.09.2026)

Alt under er verifisert mot **live prod**, ikke mot repoet. LCP/CLS er målt med
headless Chrome over CDP, kaldlast (cache deaktivert), 4× CPU-struping og
~1,6 Mbit/150 ms nett — omtrent Googles mobilprofil.

Måleskript: `/tmp/lcp2.js`. Rådata: `/tmp/lcp-resultat.json`.

## 1. Dom over de kjente funnene fra 07.09

| Funn | Dom | Målt |
|---|---|---|
| LCP 3548 ms på /tjenester/breeam-nor/ | BEKREFTET, verre | **4396 ms** |
| LCP 2556 ms på forsiden | Tallet BEKREFTET (**2652 ms**), årsaken MOTBEVIST | se 2.1 |
| «hero-bildene er 651 og 790 KB» | Halvt feil — 790 KB-bildet ligger ikke på forsiden | se 2.1 |
| sitemap lastmod 2026-04-18 på alle 12 URL-er | BEKREFTET mot live | 12/12 |
| 404.html har index,follow | BEKREFTET, men lav alvorlighet | se 2.2 |
| Ingen dateModified noe sted | BEKREFTET | 0 av 12 |
| Titler for lange på 7 av 13 sider | BEKREFTET, egentlig **8 av 13** | se 3.7 |

## 2. Der den forrige diagnosen bommet

### 2.1 Forsidens LCP handler ikke om hero-bildet

Forsidens hero er `.hero-img` i `styles.css:41` → `Vann Bryggen.webp`,
**87 KB**, 1209×629. Det er ikke problemet, og å komprimere det gir null.

790 KB-bildet er `NyeSUS_Adkomstvei_Regnbed.webp`, og det ligger på
**/tjenester/uavhengig-kontroll/** — en side som ikke sto på lista, og som er
nettstedets desidert verste: **LCP 7772 ms**, 1489 KB overført.

Forsidens faktiske årsak: 1060 KB total last, fordi to bakgrunnsbilder **under
folden** lastes ivrig og konkurrerer med heroen om båndbredden —
`regnbed med trær og møblering thorvald meyers gate.webp` (431 KB) og
`Forsenkning Carl Berner.webp` (349 KB). Begge er inline `background-image`.
CSS-bakgrunner har ingen `loading="lazy"`; de hentes så snart regelen matcher.

### 2.2 404-metaen er nesten uten effekt

`<meta name="robots" content="index,follow">` står i 404.html, men Cloudflare
returnerer ekte **HTTP 404** på ukjente stier (verifisert). En 404-status
hindrer indeksering uansett hva robots-metaen sier. Rett den, men ikke prioriter.

## 3. Nye funn

### 3.1 🔴 www.trygtovervann.no svarer HTTP 522

DNS peker på Cloudflare (172.67.130.176 / 104.21.3.122, samme som apex), men
vertsnavnet er ikke bundet til Pages-prosjektet. Det finnes ingen redirect til
apex. Alle som skriver «www.» får en Cloudflare-feilside under eget merkenavn,
og enhver innkommende lenke eller sitering med www er død.

### 3.2 🔴 Brutt bakgrunnsbilde på forsiden

`https://trygtovervann.no/assets/Flom under bro.webp` → **404**. Fila finnes
ikke i `assets/`. Den refereres fra `styles.css:113`:

    .split-climate .split-img{background-image:url('../assets/Flom under bro.webp')}

`index.html:378` har `<div class="split-img" role="img" aria-label="Flom under bro">`
**uten** inline-stil, i motsetning til de andre split-seksjonene. Den arver
altså CSS-regelen. `.split-img` (linje 91) setter ingen `background-color`, så
høyre halvdel av «Klimatilpasning»-seksjonen står helt tom, minst 420 px høy.
Reproduserer i ekte nettleser — 404-en dukket opp i nettverksloggen ved måling.

### 3.3 7 av 12 sider stryker på LCP, ikke 2

| Side | LCP | CLS | KB | LCP-element |
|---|---|---|---|---|
| /tjenester/uavhengig-kontroll/ | **7772** | 0,002 | 1489 | NyeSUS_Adkomstvei_Regnbed.webp (790 KB) |
| /tjenester/breeam-nor/ | **4396** | 0,042 | 814 | Verdensparken regnbed 1.webp (650 KB) |
| /tjenester/overvannsradgivning/ | **4144** | 0,001 | 730 | overvannsrenne…ensjø.webp (392 KB) |
| /tjenester/eu-taksonomi-crva/ | **3344** | 0,042 | 603 | Trappet regnbed Nydalen.webp (284 KB) |
| /tjenester/ | **3308** | 0,001 | 593 | regnbed…thorvald meyers gate.webp (431 KB) |
| / | **2652** | 0,028 | 1060 | Vann Bryggen.webp (87 KB) |
| /tjenester/klimatilpasning/ | **2620** | 0,030 | 456 | Regn plen_1.webp (208 KB) |
| /tjenester/havnivaastigning/ | 2120 | 0,002 | 440 | Vann Bryggen.webp |
| /tjenester/va-prosjektering/ | 1856 | 0,004 | 308 | Dyp brosteinsgrøft.webp |
| /kontakt/ · /for-advokater/ · /om/ | 436–544 | ≤0,031 | ~162 | tekst |

CLS er bra overalt (verste 0,042 mot terskel 0,1). Problemet er utelukkende bilder.

Alle hero-bildene er 1200–1600 px brede originaler uten `srcset`, uten
`preload`, og uten moderne komprimering. Flere er dessuten **portrett**
(1200×1600) og blir kraftig beskåret i et landskaps-hero.

### 3.4 Fem sider har null indekserbare bilder

Alle hero-bilder er CSS `background-image`, ikke `<img>`. Google Images kan
ikke indeksere dem, og `role="img"` + `aria-label` teller ikke som alt-tekst
for bildesøk. Forsiden, /om/, /kontakt/, /tjenester/ og /for-advokater/ har
**0** indekserbare bilder. De sju tjenestesidene har 1 hver (inline-bildet i
brødteksten). Samme rotårsak som 3.3 — to konsekvenser av samme valg.

### 3.5 og:image er feil format på fire sider

Portrett 1200×1600 der delingskort forventer ~1,91:1: /om/, /tjenester/,
/tjenester/overvannsradgivning/, /tjenester/eu-taksonomi-crva/. Blir
midtbeskåret i LinkedIn, Slack, X og AI-svarkort.

I tillegg: alle `og:image` er **WebP**, som X og LinkedIn håndterer ujevnt, og
ingen side har `og:image:width`, `og:image:height` eller `og:image:alt`.

### 3.6 Ingen Search Console, ingen Bing Webmaster, ingen analytics

Verken meta-verifisering i HTML eller `google-site-verification` i DNS TXT.
Sonens eneste TXT er SPF. Sitemapen er dermed aldri sendt inn, ingen
indekseringsdata finnes, og **alt som fikses herfra måles blindt**. Dette står
som et Bengt-punkt i DEPLOY.md, men konsekvensen er større enn punktet antyder.

### 3.7 Titler: 8 av 13 over 60 tegn

77 /tjenester/uavhengig-kontroll/ · 77 /tjenester/va-prosjektering/ ·
72 /tjenester/klimatilpasning/ · 70 /tjenester/havnivaastigning/ ·
69 / · 69 /tjenester/ · 65 /for-advokater/ · 62 /tjenester/breeam-nor/.
Under grensen: eu-taksonomi-crva 60, om 59, overvannsradgivning 54,
kontakt 49, 404 41.

Merk kostnaden ved en tidligere beslutning: `™` + ` | Trygt Overvann™` spiser
~21 tegn av budsjettet på hver eneste side. Det var et bevisst valg
(CLAUDE.md «Navnebruk»), men det er her regningen kommer.

### 3.8 Entiteten er splittet i to

`#organization` (Organization) og `#localbusiness` (ProfessionalService)
beskriver samme virksomhet, med hvert sitt `@id` og ingen relasjon mellom seg.
Søkemotorer og AI-modeller ser to entiteter. Bør konsolideres — enten samme
`@id`, eller eksplisitt kobling.

### 3.9 Person-noden har ingen sameAs

`Person` for Bengt (`/om/#bengt`) har ingen ekstern identitetsforankring i det
hele tatt. LinkedIn er bevisst utelatt av COWI-hensyn — men da står det
ingenting igjen. Brønnøysund og Proff ligger på Organization, ikke på Person.
For GEO er dette den svakeste enkeltnoden på hele nettstedet: AI-modeller har
ingen måte å bekrefte at personen finnes.

### 3.10 «tidligere hos COWI» + alumniOf

/om/ sier «tidligere hos COWI», og JSON-LD har `"alumniOf": [{"name": "COWI"}]`.
Global CLAUDE.md sier Bengt jobber i COWI i dag, ved siden av. Enten er teksten
feil, eller så er den bevisst distansering — jeg antar ikke. Uavhengig av svaret
er `alumniOf` schema.org-feilbruk: den er for utdanningsinstitusjoner, ikke
arbeidsgivere.

### 3.11 Manglende overskriftsstruktur på E-E-A-T-sidene

/om/ har **h1 + én h2** på 347 ord. «Om firmaet», «Verdier» og «Faglig
ekspertise» er visuelle seksjoner uten heading-markup. /tjenester/ har h1 + én
h2 på 254 ord. De sju tjenestesidene er derimot godt strukturert (h1 + 6×h2 +
5×h3) — det er nettopp autoritetssidene som mangler struktur, og det er de AI-
motorer leser for å avgjøre om avsenderen er til å stole på.

### 3.12 Tynt innhold på hub-sidene

/kontakt/ 174 ord · /tjenester/ 254 ord · /om/ 347 ord · forsiden 404 ord.
Tjenestesidene ligger på 583–815. /tjenester/ er hub-siden som skal rangere på
de generiske søkene og har under halvparten av innholdet til sine egne barn.

### 3.13 Udokumentert superlativ

«Norges spesialist på vannrelatert klimarisiko» står i meta-description,
i JSON-LD `description` (begge Organization-noder, alle 12 sider) og synlig på
/om/. Markedsføringsloven §26 krever at slike påstander kan dokumenteres.
Reell risiko, ikke en formalitet.

### 3.14 _headers-regelen for /assets/* virker ikke

Fila ber om `max-age=3600`. Live svarer `public, max-age=14400, must-revalidate`
— Cloudflares Browser Cache TTL på sonenivå (4 t standard) overstyrer.
`/*`-regelen slår derimot gjennom. Lav praktisk effekt, men fila beskriver en
tilstand som ikke gjelder, og neste person som redigerer den får ingen endring.

### 3.15 Bagateller

- `lang="no"` og `inLanguage: "no"` bør være `nb` / `nb-NO`.
- `/OM/` gir 404 — stier er versalfølsomme.
- FAQPage × 7: Google begrenset FAQ-rikt-resultat til myndighets- og helsesider
  i august 2023. Blokkene gir ingen stjerner i SERP lenger. De er fortsatt
  verdt å beholde — de er utmerket AI-ekstraherbare — men forvent ikke SERP-effekt.

## 4. Verifisert i orden — ikke funn

- Brotli-komprimering aktiv på HTML og CSS.
- `http://` → `https://` 301. Manglende trailing slash → 308.
- Alle 44 JSON-LD-blokker på tvers av 12 sider parser feilfritt.
- Canonical korrekt og selvrefererende på alle 12.
- Ingen foreldreløse sider — hver side har 21+ innkommende interne lenker.
- Alle titler og meta-descriptions er unike.
- Meta-descriptions 141–186 tegn — innenfor.
- robots.txt slipper inn alle relevante AI-crawlere eksplisitt.
- Sitemapen inneholder nøyaktig de 12 reelle sidene, ingen døde, ingen manglende.
- `Service`-noder har korrekt `provider` → `#organization`.
- BreadcrumbList korrekt på alle undersider.
- CLS godt innenfor terskel overalt.

## 4b. Rettet og deployet samme dag (bolk A + B)

Fem deploys 08.09. Alle tall målt med samme harness før og etter.

| Side | LCP før | LCP nå | KB før | KB nå |
|---|---|---|---|---|
| /tjenester/uavhengig-kontroll/ | 7772 | **2128** | 1489 | 382 |
| /tjenester/breeam-nor/ | 4396 | **2200** | 814 | 579 |
| /tjenester/overvannsradgivning/ | 4144 | **1716** | 730 | 374 |
| /tjenester/eu-taksonomi-crva/ | 3344 | **1380** | 603 | 335 |
| /tjenester/ | 3308 | **1724** | 593 | 274 |
| / | 2652 | **1980** | 1060 | 561 |
| /tjenester/klimatilpasning/ | 2620 | **1528** | 456 | 277 |
| /tjenester/havnivaastigning/ | 2120 | 1680 | 440 | 386 |
| /tjenester/va-prosjektering/ | 1856 | 712 | 308 | 294 |

**Sider over 2500 ms: 7 → 0.** Total overført 6980 → 3788 KB (46 % mindre).
Verste CLS 0,042 (uendret, godt under 0,1).

Gjort:
- `Flom under bro.webp` gjenopprettet fra arkivet 03.08 og lagt i markup.
- Alle hero-bilder fra CSS `background-image` til `<img>` med
  `fetchpriority="high"`. Løser LCP **og** at fem sider hadde null
  indekserbare bilder (funn 3.4).
- Nye hero-derivater i 3.2:1, som er formatet `.svc-hero` faktisk viser.
- `logo.jpg` var 806×806 og 56 KB, vist 38×38, eager, på hver side.
  Ny `logo-96.webp` er 2,5 KB. JSON-LD beholder den store `logo.jpg`.
- Inline brødtekstbilder oppga alle `1200x800` uansett fil — tre var
  portrett. Rettet til faktiske dimensjoner.
- Beskrivende alt-tekst på alle hero-bilder (var sidetittelen).

### 🔴 Lærdom: assets ligger 4 timer på edge

Første deploy tok **ikke** effekt. Cloudflare svarte `cf-cache-status: HIT`
med gammel `content-length`. Verre enn treg oppdatering: HTML-en var ny,
men `styles.css` var gammel, så forsiden ba fortsatt om det slettede
bakgrunnsbildet og ga 404 i prod *etter* at fiksen var deployet.

Rot: filnavn uten innholdshash + sonens Browser Cache TTL på 4 t.
DEPLOY.md påsto «1t cache på /assets/ — deploys vises uten manuell purge».
Begge deler var feil. Keychain-tokenet har ikke purge-tilgang.

Regelen står nå i DEPLOY.md: **endrer du innholdet i en assetfil, endre
også URL-en.** Bilder får nytt filnavn, `styles.css` har `?v=ÅÅÅÅMMDD`.

### Korreksjon til funn 3.12

Rapporten meldte først `Grønn grøft.webp` og `takvann…webp` som ubrukte.
Feil — de er inline brødtekstbilder på klimatilpasning og
overvannsradgivning. Søket bommet fordi HTML-en URL-koder mellomrom, men
ikke `ø`. **Det finnes ingen ubrukte assets.**

## 5. Prioritert rekkefølge

**Bolk A — brutt i prod**
1. ~~`Flom under bro.webp` 404 på forsiden~~ — RETTET 08.09.
2. 🔴 **www-vertsnavnet → 522. GJENSTÅR, krever Bengt.** DNS er allerede
   riktig (`www` CNAME-er til Pages-prosjektet, proxied). Feilen er at
   Pages-prosjektet ikke har `www.trygtovervann.no` i lista over custom
   domains, så Pages avviser Host-headeren. Wrangler 4.71 har ingen
   `pages domain`-kommando, og verken Keychain-tokenet eller wranglers
   OAuth-token autentiserer mot Pages-domene-API-et.
   **Dashbord → Workers & Pages → trygt-overvann-website → Custom domains
   → Set up a custom domain → `www.trygtovervann.no`.** DNS finnes, så
   den skal verifisere umiddelbart. Canonical peker allerede på apex,
   så ingen duplikatrisiko.

**Bolk B — ytelse** — FERDIG 08.09, se 4b.

**Bolk C — indeksering og måling**
6. Search Console + Bing Webmaster, verifiser via DNS TXT. Send inn sitemap.
7. Sitemap `lastmod` → faktiske datoer, og gjør det til et deploy-steg.
8. `dateModified` — krever en `WebPage`-node; det finnes ingen i dag.

**Bolk D — entitet og GEO**
9. Slå sammen `#organization` og `#localbusiness`.
10. `sameAs` på Person-noden (krever et valg, se 3.9).
11. Overskriftsstruktur på /om/ og /tjenester/.
12. og:image → landskap 1200×630, JPEG/PNG, med width/height/alt.

**Bolk E — tekst**
13. Kort ned de åtte titlene.
14. Avklar «tidligere hos COWI» + fjern `alumniOf`.
15. Dokumenter eller mykne «Norges spesialist».
16. Bygg ut /tjenester/ og /om/.

**Bolk F — kosmetikk**
17. 404 noindex · `lang="nb"` · `_headers`-kommentar.
