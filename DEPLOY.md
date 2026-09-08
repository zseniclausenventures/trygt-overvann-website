# Trygt Overvann™ — Deploy

Statisk multi-side nettside, ingen build-steg. Deployes til Cloudflare Pages via wrangler (manuell). Git-auto-deploy er bevisst AVSLÅTT — vi styrer deploy selv.

## Fakta
- Kanonisk repo: zseniclausenventures/trygt-overvann-website
- Lokal klon: ~/ClaudeCode/active/trygt-overvann-website
- Cloudflare Pages-prosjekt: trygt-overvann-website
- Domene: trygtovervann.no  |  Produksjonsbranch: main
- Auto-deploy i Cloudflare: AV
- Kontaktskjema: Formspree-ID xreyeavp, hardkodet i assets/nav.js
- Caching: HTML er no-cache og oppdateres straks. **/assets/ er IKKE 1 time.**
  `_headers` ber om 3600, men sonens Browser Cache TTL (4 t) overstyrer, og
  `/assets/*`-regelen slår aldri gjennom. Overskriver du en assetfil UTEN å
  endre navnet, ligger den gamle på edge i inntil 4 timer — også når HTML-en
  allerede er ny. Det traff oss 08.09: ny HTML møtte gammel styles.css og ba
  om et bakgrunnsbilde som var fjernet. Tokenet i Keychain har ikke
  purge-tilgang, så purge må gjøres i dashbordet.
  **Regel: endrer du innholdet i en assetfil, endre også URL-en.** Bilder får
  nytt filnavn; `styles.css` har `?v=ÅÅÅÅMMDD` som skal bumpes ved CSS-endring.

## Innlogging (verifisert 07.09.2026)

Wrangler er allerede innlogget som Zseniclausenventures@gmail.com på konto
`a883a1ff61882fbcf8756f078097748f`, med `pages (write)` i scope. **Ingen
interaktiv innlogging trengs** — `wrangler pages deploy` går rett igjennom.

Sjekk med `wrangler whoami` før du deployer. Får du ikke `pages (write)` i
lista, er det først da du trenger `wrangler login` i et ekte terminalvindu.

Merk: dette er en ANNEN legitimasjon enn Cloudflare-tokenet i macOS Keychain
(`trygtovervann-cf-token`). Det tokenet dekker e-post og DNS, ikke Pages.
Tidligere notater påsto at wrangler manglet Pages-tilgang; det stemmer ikke.

## Deploy til produksjon (live)

    cd ~/ClaudeCode/active/trygt-overvann-website
    git add -A && git commit -m "oppdater nettside" && git push
    DIST=$(mktemp -d /tmp/tovw-dist.XXXXXX)
    rsync -a --exclude='.git' --exclude='DEPLOY.md' --exclude='README.md' --exclude='CLAUDE.md' --exclude='AGENTS.md' --exclude='tasks' --exclude='.gitignore' --exclude='.wrangler' ~/ClaudeCode/active/trygt-overvann-website/ "$DIST"/
    wrangler pages deploy "$DIST" --project-name=trygt-overvann-website --branch=main --commit-dirty=true

Kontrollér staging-mappa FØR opplasting — rsync-ekskluderingene er lange og
lette å brekke ved redigering:

    for f in DEPLOY.md README.md CLAUDE.md AGENTS.md tasks .git; do
      [ -e "$DIST/$f" ] && echo "  LEKKASJE: $f" || echo "  ok, ikke med: $f"
    done

## Test mot preview (rører ikke live)
Samme kommando, men bytt --branch=main til --branch=tovw-preview.

Staging-mappa lages med `mktemp -d` framfor `rm -rf` paa en fast sti: bash-portvakten
blokkerer `rm -rf`, og en fersk mappe kan uansett ikke arve rester fra forrige deploy.

## Viktig
- Internfiler (DEPLOY.md, README.md, CLAUDE.md, AGENTS.md, tasks/, .gitignore, .wrangler) ekskluderes i rsync — skal ikke ut på web.
- _redirects, _headers, 404.html, sitemap.xml, robots.txt og llms.txt MÅ være med.
- Ikke skru på git-auto-deploy i Cloudflare igjen.
- Vises ikke en deploy: purge via trygtovervann.no-sonen (Caching, Purge Everything) — og si fra, da ligger det trolig en Cache Rule som overstyrer _headers.

## Etter deploy — maskinell verifisering mot LIVE

Deployen svarer med et preview-alias (`https://<hash>.trygt-overvann-website.pages.dev`).
Det er ikke produksjon. Verifiser alltid mot trygtovervann.no.

    for u in / /om/ /kontakt/ /for-advokater/ /tjenester/ \
             /tjenester/overvannsradgivning/ /tjenester/va-prosjektering/ \
             /tjenester/klimatilpasning/ /tjenester/uavhengig-kontroll/ \
             /tjenester/havnivaastigning/ /tjenester/eu-taksonomi-crva/ \
             /tjenester/breeam-nor/ /llms.txt /robots.txt /sitemap.xml; do
      printf "%-42s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://trygtovervann.no$u)"
    done
    curl -s -o /dev/null -w '/utbygger: %{http_code} -> %{redirect_url}\n' https://trygtovervann.no/utbygger

🔴 **Kildesøk er ikke nok.** Navneryddingen 02.09 ble erklært ferdig og
verifisert mot live, men logolenken sto likevel med «AS» på alle 13 sidene i
fem dager — «AS» lå i en egen `<small>`-tag, så tekstsøket traff aldri. Og en
knapp med usynlig tekst (samme farge som bakgrunnen) gir null treff i ethvert
grep. Endringer som gjelder utseende eller navnebruk skal verifiseres i
RENDRET side.

Nettleserutvidelsen er ofte ikke tilkoblet. Chrome headless mot
DevTools-protokollen er et fullverdig alternativ og krever ingen installasjon
— Node har innebygd WebSocket:

    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
      --headless=new --remote-debugging-port=9340 --disable-gpu \
      --user-data-dir=/tmp/cc-live about:blank &
    # hent ws-URL fra http://127.0.0.1:9340/json/list, koble til, og kjør
    # Page.navigate + Runtime.evaluate med getComputedStyle-sjekker.

Arbeidseksempler fra 07.09.2026 (kontrastrevisjon av alle 13 sider, og
live-kontroll av /for-advokater/) er beskrevet i CLAUDE.md under
«Rendringsfeil funnet og rettet 07.09.2026».

## Etter deploy — sjekkliste (SEO, manuell)
- Google Rich Results-test på en tjenesteside (FAQPage + Service schema).
- Lighthouse på forsiden — mål 95+ på alle akser.
- Send inn sitemap.xml til Google Search Console og Bing Webmaster Tools.
