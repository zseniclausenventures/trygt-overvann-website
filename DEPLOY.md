# Trygt Overvann™ — Deploy

Statisk multi-side nettside, ingen build-steg. Deployes til Cloudflare Pages via wrangler (manuell). Git-auto-deploy er bevisst AVSLÅTT — vi styrer deploy selv.

## Fakta
- Kanonisk repo: zseniclausenventures/trygt-overvann-website
- Lokal klon: ~/ClaudeCode/active/trygt-overvann-website
- Cloudflare Pages-prosjekt: trygt-overvann-website
- Domene: trygtovervann.no  |  Produksjonsbranch: main
- Auto-deploy i Cloudflare: AV
- Kontaktskjema: Formspree-ID xreyeavp, hardkodet i assets/nav.js
- Caching: _headers gir no-cache på HTML + 1t cache på /assets/ — deploys vises uten manuell purge

## Deploy til produksjon (live)

    cd ~/ClaudeCode/active/trygt-overvann-website
    git add -A && git commit -m "oppdater nettside" && git push
    DIST=$(mktemp -d /tmp/tovw-dist.XXXXXX)
    rsync -a --exclude='.git' --exclude='DEPLOY.md' --exclude='README.md' --exclude='CLAUDE.md' --exclude='AGENTS.md' --exclude='tasks' --exclude='.gitignore' --exclude='.wrangler' ~/ClaudeCode/active/trygt-overvann-website/ "$DIST"/
    wrangler pages deploy "$DIST" --project-name=trygt-overvann-website --branch=main --commit-dirty=true

## Test mot preview (rører ikke live)
Samme kommando, men bytt --branch=main til --branch=tovw-preview.

Staging-mappa lages med `mktemp -d` framfor `rm -rf` paa en fast sti: bash-portvakten
blokkerer `rm -rf`, og en fersk mappe kan uansett ikke arve rester fra forrige deploy.

## Viktig
- Internfiler (DEPLOY.md, README.md, CLAUDE.md, AGENTS.md, tasks/, .gitignore, .wrangler) ekskluderes i rsync — skal ikke ut på web.
- _redirects, _headers, 404.html, sitemap.xml, robots.txt og llms.txt MÅ være med.
- Ikke skru på git-auto-deploy i Cloudflare igjen.
- Vises ikke en deploy: purge via trygtovervann.no-sonen (Caching, Purge Everything) — og si fra, da ligger det trolig en Cache Rule som overstyrer _headers.

## Etter deploy — sjekkliste (SEO)
- Google Rich Results-test på en tjenesteside (FAQPage + Service schema).
- Lighthouse på forsiden — mål 95+ på alle akser.
- Send inn sitemap.xml til Google Search Console og Bing Webmaster Tools.
- Verifiser at gamle URL-er (f.eks. /utbygger) 301-er til riktig tjenesteside.
- curl trygtovervann.no/llms.txt og trygtovervann.no/robots.txt.
