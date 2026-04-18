# Trygt Overvann AS — nettside

Statisk multi-side nettside for Trygt Overvann AS, optimalisert for klassisk SEO og AI-SEO.

**Live:** https://trygtovervann.no
**Hosting:** Cloudflare Pages (auto-deploy fra `main`)

## Struktur

```
/                          — forside
/om/                       — om selskapet
/kontakt/                  — kontakt og henvendelse
/tjenester/                — tjeneste-oversikt
/tjenester/<slug>/         — 7 tjenestesider
/for-advokater/            — sakkyndig-landingsside
/404.html                  — 404-side (Cloudflare Pages konvensjon)

/assets/styles.css         — delt CSS
/assets/nav.js             — mobilnav + dropdown
/assets/*.webp             — optimaliserte hero- og galleri-bilder
/assets/logo.jpg           — firmalogo

/robots.txt                — hviteliste for AI-crawlere + klassiske bots
/sitemap.xml               — 12 URL-er
/llms.txt                  — llmstxt.org manifest for LLM-indeksering
/_redirects                — 301 redirects + 404-fallback
```

## SEO-funksjoner

- JSON-LD schemas: Organization, ProfessionalService, Service, FAQPage,
  BreadcrumbList, Person, AboutPage, ContactPage, OfferCatalog
- Open Graph og Twitter Card meta på alle sider
- Canonical URL-er og `og:locale` = `nb_NO`
- Eksplisitt `Allow` for GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  Applebot-Extended m.fl. i robots.txt
- llmstxt.org-manifest på `/llms.txt`

## Deploy

Se `DEPLOY.md` for full instruksjon. Kort versjon: push til `main` — Cloudflare Pages bygger og deployer automatisk.

## Kildestruktur

Denne repoen inneholder det ferdige HTML-outputet. Generator-scriptene ligger lokalt og brukes bare når innhold skal endres.
