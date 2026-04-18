# Trygt Overvann AS — Deploy-instruks

Denne mappen er en komplett statisk nettside (ingen build-steg). Bare push til GitHub, så deployer Cloudflare Pages automatisk.

## Hva ligger her

```
trygtovervann-website/
├── index.html                          Forside
├── 404.html                            Feilside for ukjente URL-er
├── om/index.html                       Om Trygt Overvann AS + Bengt
├── kontakt/index.html                  Formspree-skjema + ContactPage
├── for-advokater/index.html            Sakkyndig-landingsside
├── tjenester/
│   ├── index.html                      Oversikt over alle 7 tjenester
│   ├── overvannsradgivning/index.html
│   ├── va-prosjektering/index.html
│   ├── klimatilpasning/index.html
│   ├── uavhengig-kontroll/index.html
│   ├── havnivaastigning/index.html
│   ├── eu-taksonomi-crva/index.html
│   └── breeam-nor/index.html
├── assets/
│   ├── styles.css                      Delt CSS for alle sider
│   ├── nav.js                          Mobilmeny + Formspree-handler
│   └── logo.jpg                        Firmalogo (806×806)
├── robots.txt                          Tillater AI-crawlere eksplisitt
├── sitemap.xml                         Alle 12 innholdssider
├── llms.txt                            AI-manifest (llmstxt.org-spec)
└── _redirects                          301-er fra gamle SPA-URL-er
```

## Før deploy — kritisk

**1. WebP-bilder mangler**
Alle sider refererer til 15+ `.webp`-bilder under `/assets/`. Disse er IKKE inkludert i denne leveransen fordi kun TOhtml.txt ble lastet opp til arbeidssesjonen. Sjekk om de allerede ligger i den eksisterende GitHub-repoen. Hvis ikke: last dem opp før første deploy. Minimum:

- `overvannsrenne steinsatt med rist ensjø.webp`
- `Dyp brosteinsgrøft.webp`
- `Regn plen_1.webp`
- `NyeSUS_Adkomstvei_Regnbed.webp`
- `Vann Bryggen.webp`
- `Verdensparken regnbed 1.webp`
- `Trappet regnbed Nydalen.webp`
- `regnbed med trær og møblering thorvald meyers gate.webp`
- `brosteinsgrøft lillehammer1.webp`

**2. Favicon**
Forsiden lenker til `/favicon.png` og `/apple-touch-icon.png`. Legg dem til, eller fjern lenken fra `build_site.py` og regenerer.

## Deploy via GitHub → Cloudflare Pages

1. Kopiér innholdet i `trygtovervann-website/` inn i repoen som er koblet til Cloudflare Pages.
2. `git add -A && git commit -m "Refaktor: SPA → flat multi-side for SEO" && git push`
3. Cloudflare bygger automatisk. Ingen build-kommando. Output-directory: `/`.

## Etter deploy — sjekkliste

- Test i Google Rich Results-tester: `https://search.google.com/test/rich-results?url=https://trygtovervann.no/tjenester/overvannsradgivning/`
- Kontroller at **FAQPage** og **Service** schema blir lest korrekt
- Kjør **Lighthouse** på forsiden: mål 95+ på alle fire akser
- Send inn `https://trygtovervann.no/sitemap.xml` til **Google Search Console** og **Bing Webmaster Tools**
- Verifiser at gamle URL-er som `/utbygger` 301-er til riktig tjenesteside
- Test `llms.txt`: `curl https://trygtovervann.no/llms.txt`
- Test `robots.txt`: `curl https://trygtovervann.no/robots.txt`

## Formspree

Kontaktskjemaet bruker Formspree-ID `xreyeavp`. Det er hardkodet i `/assets/nav.js`. Skift hvis nødvendig.
