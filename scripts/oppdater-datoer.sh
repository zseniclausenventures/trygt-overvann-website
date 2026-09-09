#!/usr/bin/env bash
# Setter <lastmod> i sitemap.xml og "dateModified" i hver sides JSON-LD til datoen
# fila sist ble endret i git (ucommitterte endringer = i dag). Kjør FØR commit og deploy.
set -euo pipefail
cd "$(dirname "$0")/.."
for f in index.html */index.html */*/index.html; do
  if ! git diff --quiet -- "$f" 2>/dev/null || ! git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
    d=$(date +%F)
  else
    d=$(git log -1 --format=%ad --date=short -- "$f")
  fi
  loc="https://trygtovervann.no/${f%index.html}"
  # sitemap: <loc>…</loc> etterfølges av <lastmod> på neste linje
  perl -0pi -e "s|(<loc>\Q$loc\E</loc>\s*<lastmod>)[^<]*|\${1}$d|" sitemap.xml
  perl -pi -e "s|\"dateModified\": \"[^\"]*\"|\"dateModified\": \"$d\"|" "$f"
done
grep -o '<lastmod>[^<]*' sitemap.xml | sort | uniq -c
