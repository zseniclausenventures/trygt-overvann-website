#!/usr/bin/env bash
# Hele deployen i én kommando. Bruk:
#   scripts/deploy.sh            produksjon (trygtovervann.no)
#   scripts/deploy.sh preview    tovw-preview.trygt-overvann-website.pages.dev
#
# 1. Setter datoer (sitemap + JSON-LD) og versjonsnumre (?v=) fra innholdet.
# 2. Stopper hvis noe er ucommittet eller upushet — prod skal alltid være en commit.
# 3. Kopierer KUN nettsidefiler til en fersk staging-mappe (positiv liste, så en ny
#    intern mappe aldri følger med av seg selv) og stopper ved alt uventet.
# 4. Deployer, og sjekker at alle ruter svarer (kun produksjon).
set -euo pipefail
cd "$(dirname "$0")/.."

GREN=main
[ "${1:-}" = preview ] && GREN=tovw-preview

scripts/oppdater-datoer.sh >/dev/null
scripts/oppdater-versjoner.py

if [ -n "$(git status --porcelain)" ]; then
  git status --short
  echo "STOPP: ucommitterte endringer (datoer/versjoner over kan ha endret filer). Commit, push og kjør på nytt." >&2
  exit 1
fi
if [ "$GREN" = main ] && [ -n "$(git log '@{u}..HEAD' --oneline)" ]; then
  echo "STOPP: commits som ikke er pushet. Kjør git push først." >&2
  exit 1
fi

DIST=$(mktemp -d /tmp/tovw-dist.XXXXXX)
# Interne mapper utelukkes FØR *.html-regelen, så en HTML-kladd i tasks/ ikke slipper ut.
rsync -a --prune-empty-dirs --exclude='.DS_Store' \
  --exclude='/.git/' --exclude='/.wrangler/' --exclude='/tasks/' --exclude='/docs/' \
  --exclude='/scripts/' --exclude='/node_modules/' \
  --include='*/' --include='*.html' \
  --include='/assets/***' --include='/functions/***' \
  --include='/_headers' --include='/_redirects' \
  --include='/favicon.png' --include='/favicon.ico' --include='/apple-touch-icon.png' \
  --include='/robots.txt' --include='/sitemap.xml' --include='/llms.txt' \
  --exclude='*' \
  ./ "$DIST"/

# Alt som ikke har en kjent nettside-endelse, eller som er en .md, stopper deployen.
UVENTET=$(cd "$DIST" && find -E . -type f ! -name '_headers' ! -name '_redirects' \
  ! -regex '.*\.(html|css|js|woff2|webp|jpg|png|ico|xml)' \
  ! -path './robots.txt' ! -path './llms.txt' ! -path './assets/fonts/OFL.txt')
if [ -n "$UVENTET" ]; then
  echo "STOPP: uventede filer i staging-mappa ($DIST):" >&2
  echo "$UVENTET" >&2
  exit 1
fi
for f in 404.html index.html _headers _redirects sitemap.xml robots.txt llms.txt functions/api/vaer.js; do
  [ -e "$DIST/$f" ] || { echo "STOPP: $f mangler i staging-mappa" >&2; exit 1; }
done
echo "Staging: $(cd "$DIST" && find . -type f | wc -l | tr -d ' ') filer i $DIST"

wrangler pages deploy "$DIST" --project-name=trygt-overvann-website --branch="$GREN" --commit-dirty=true

[ "$GREN" = main ] || exit 0

# Produksjon kan henge noen sekunder etter «Deployment complete» (DEPLOY.md).
sleep 5
FEIL=0
for u in / /om/ /kontakt/ /for-advokater/ /tjenester/ \
         /tjenester/overvannsradgivning/ /tjenester/va-prosjektering/ \
         /tjenester/klimatilpasning/ /tjenester/uavhengig-kontroll/ \
         /tjenester/havnivaastigning/ /tjenester/eu-taksonomi-crva/ \
         /tjenester/breeam-nor/ /vaervarsel/ /llms.txt /robots.txt /sitemap.xml; do
  kode=$(curl -s -o /dev/null -w '%{http_code}' "https://trygtovervann.no$u?cb=$RANDOM")
  [ "$kode" = 200 ] || { echo "  FEIL $kode $u"; FEIL=1; }
done
kode=$(curl -s -o /dev/null -w '%{http_code}' "https://trygtovervann.no/finnes-ikke-$RANDOM")
[ "$kode" = 404 ] || { echo "  FEIL: ukjent sti ga $kode, ikke 404"; FEIL=1; }
curl -s 'https://trygtovervann.no/api/vaer?lat=60.39&lon=5.32' | head -c 1 | grep -q '{' \
  || { echo "  FEIL: /api/vaer svarer ikke med JSON"; FEIL=1; }
[ "$FEIL" = 0 ] && echo "Live: alle ruter 200, ukjent sti 404, /api/vaer svarer JSON." || exit 1
