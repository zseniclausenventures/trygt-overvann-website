# trygt-overvann-website

Trygt Overvann AS sin offentlige nettside (trygtovervann.no). Statisk multi-side, ingen build.

Deploy: git-auto-deploy er AV. Deploy skjer manuelt via wrangler — se DEPLOY.md for full instruks og den eksakte kommandoen.

## SEO-status (sist oppdatert 2026-06-12)

Full SEO-audit gjennomført (claude-seo). Health score ~87/100. Fullført, deployet og live:
- K1: tre brutte innholdsbilder rettet (filer lagt til assets/, src URL-encodet).
- H1: NAP-konsistens — all e-post standardisert til kontakt@trygtovervann.no; for-advokater-telefon rettet.
- H2: entitet/varemerke i schema — Organization name="Trygt Overvann", legalName="OhJoy Ventures AS", parentOrganization="Green Harmony Holding AS". vatID/taxID beholdt.
- H3: rå mellomrom i og:image/twitter:image/inline <img> URL-encodet (%20).
- M2: sameAs utvidet med Brønnøysund Enhetsregisteret + Proff.no (personlig LinkedIn bevisst utelatt pga COWI-ansettelse).
- M3: llms.txt synket med eierskap (OhJoy Ventures AS / varemerke).
- M4: presis plassering fjernet fra schema (geo + streetAddress + postalCode); synlig "Landås, Bergen" → "Bergen". Beholder Bergen som område.

Gjenstår fra auditen:
- M1 (utenfor repo): Google Business Profile + NAP-konsistente siteringer (Proff/1881/Gulesider). Høyeste lokale løftestang.
- M5: kontekstuell krysslinking i løpende tjenestetekst (ikke bare meny/footer/sidebar).
- Lav prioritet: 404.html noindex, render-blocking Google Fonts, background-image URL-encoding.

Merk: interne docs (tasks/, handoff) skal IKKE ligge i web-root — rsync ekskluderer kun .git/DEPLOY.md/README.md/CLAUDE.md/.gitignore/.wrangler, så alt annet deployes. Handoff-docs lagres i ~/ClaudeCode/active/trygt-overvann/tasks/.

Schema-redigering: Organization-noden er duplisert identisk i alle 13 HTML-filer — bruk perl -0777 over alle filer for konsistens, og valider JSON-LD etterpå. NB: escape "@type" som "\@type" i Perl-erstatninger (ellers tolkes @ som array).
