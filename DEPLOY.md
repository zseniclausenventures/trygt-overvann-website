# Trygt Overvann AS — Deploy

Statisk multi-side nettside, ingen build-steg. Deployes til Cloudflare Pages via wrangler (manuell). Git-auto-deploy er bevisst AVSLATT — vi styrer deploy selv.

## Fakta
- Kanonisk repo: zseniclausenventures/trygt-overvann-website
- Lokal klon: ~/zsen-tovw-check
- Cloudflare Pages-prosjekt: trygt-overvann-website
- Domene: trygtovervann.no  |  Produksjonsbranch: main
- Auto-deploy i Cloudflare: AV
- Kontaktskjema: Formspree-ID xreyeavp, hardkodet i assets/nav.js

## Deploy til produksjon (live)

    cd ~/zsen-tovw-check
    git add -A && git commit -m "oppdater nettside" && git push
    rm -rf /tmp/tovw-dist
    rsync -a --exclude='.git' --exclude='DEPLOY.md' --exclude='README.md' --exclude='CLAUDE.md' --exclude='.gitignore' ~/zsen-tovw-check/ /tmp/tovw-dist/
    wrangler pages deploy /tmp/tovw-dist --project-name=trygt-overvann-website --branch=main --commit-dirty=true

## Test mot preview (rorer ikke live)
Samme kommando, men bytt --branch=main til --branch=tovw-preview.

## Viktig
- Internfiler (DEPLOY.md, README.md, CLAUDE.md, .gitignore) ekskluderes i rsync — skal ikke ut paa web.
- _redirects, 404.html, sitemap.xml, robots.txt og llms.txt MAA vaere med (SEO/AI-SEO).
- Ikke skru paa git-auto-deploy i Cloudflare igjen.

## Etter deploy — sjekkliste (SEO)
- Google Rich Results-test paa en tjenesteside (FAQPage + Service schema).
- Lighthouse paa forsiden — maal 95+ paa alle akser.
- Send inn sitemap.xml til Google Search Console og Bing Webmaster Tools.
- Verifiser at gamle URL-er (f.eks. /utbygger) 301-er til riktig tjenesteside.
- curl trygtovervann.no/llms.txt og trygtovervann.no/robots.txt.
