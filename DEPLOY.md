# Trygt Overvann AS — Deploy

Statisk multi-side nettside, ingen build-steg. Deployes til Cloudflare Pages via wrangler (manuell). Git-auto-deploy er bevisst AVSLÅTT — vi styrer deploy selv.

## Fakta
- Kanonisk repo: zseniclausenventures/trygt-overvann-website
- Lokal klon: ~/zsen-tovw-check
- Cloudflare Pages-prosjekt: trygt-overvann-website
- Domene: trygtovervann.no  |  Produksjonsbranch: main
- Auto-deploy i Cloudflare: AV
- Kontaktskjema: Formspree-ID xreyeavp, hardkodet i assets/nav.js
- Caching: _headers gir no-cache på HTML + 1t cache på /assets/ — deploys vises uten manuell purge

## Deploy til produksjon (live)

    cd ~/zsen-tovw-check
    git add -A && git commit -m "oppdater nettside" && git push
    rm -rf /tmp/tovw-dist
    rsync -a --exclude='.git' --exclude='DEPLOY.md' --exclude='README.md' --exclude='CLAUDE.md' --exclude='.gitignore' --exclude='.wrangler' ~/zsen-tovw-check/ /tmp/tovw-dist/
    wrangler pages deploy /tmp/tovw-dist --project-name=trygt-overvann-website --branch=main --commit-dirty=true

## Test mot preview (rører ikke live)
Samme kommando, men bytt --branch=main til --branch=tovw-preview.

## Viktig
- Internfiler (DEPLOY.md, README.md, CLAUDE.md, .gitignore, .wrangler) ekskluderes i rsync — skal ikke ut på web.
- _redirects, _headers, 404.html, sitemap.xml, robots.txt og llms.txt MÅ være med.
- Ikke skru på git-auto-deploy i Cloudflare igjen.
- Vises ikke en deploy: purge via trygtovervann.no-sonen (Caching, Purge Everything) — og si fra, da ligger det trolig en Cache Rule som overstyrer _headers.

## Etter deploy — sjekkliste (SEO)
- Google Rich Results-test på en tjenesteside (FAQPage + Service schema).
- Lighthouse på forsiden — mål 95+ på alle akser.
- Send inn sitemap.xml til Google Search Console og Bing Webmaster Tools.
- Verifiser at gamle URL-er (f.eks. /utbygger) 301-er til riktig tjenesteside.
- curl trygtovervann.no/llms.txt og trygtovervann.no/robots.txt.
