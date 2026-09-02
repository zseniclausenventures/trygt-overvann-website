# trygt-overvann-website

Trygt Overvann™ sin offentlige nettside (trygtovervann.no). Varemerket drives av
OhJoy Ventures AS. Statisk multi-side, ingen build.

Deploy: git-auto-deploy er AV. Deploy skjer manuelt via wrangler — se DEPLOY.md for full instruks og den eksakte kommandoen.

## Lokal klon (sist oppdatert 2026-08-03)

Mappa er `~/trygt-overvann-website`. Den het `~/zsen-tovw-check` fram til 03.08.2026.

Bakgrunn: hjemmemappa hadde fire mapper som alle lignet nettsiden, og denne — den eneste
som faktisk er trygtovervann.no — hadde det minst gjenkjennelige navnet. Mappa som het
`to-hjemmeside` var en nedlagt forgjenger (én 99 kB-side, eget privat repo), ikke en eldre
versjon av denne siden. De tre nedlagte er arkivert til
`~/Backups/nettside-arkiv-2026-08-03/` med forklaring i `LES-MEG.md` der.

🔴 Én av dem, `bzsc-tohj-check`, er klonet fra en gammel GitHub-konto der repoet er
slettet (404). Arkivmappa er derfor den eneste kopien som finnes.

To lærdommer for neste gang:
- Sjekk live mot lokal kilde før du redigerer — mappenavn er ikke bevis.
- Cloudflares e-postobfuskering roterer et token ved hver forespørsel, så to hentinger av
  samme uendrede side gir ulik hash. Bruk diff, ikke hash, når du verifiserer mot prod.

## SEO-status (sist oppdatert 2026-06-12)

Full SEO-audit gjennomført (claude-seo). Health score ~87/100. Fullført, deployet og live:
- K1: tre brutte innholdsbilder rettet (filer lagt til assets/, src URL-encodet).
- H1: NAP-konsistens — all e-post standardisert til kontakt@trygtovervann.no; for-advokater-telefon rettet.
- H2: entitet/varemerke i schema — Organization name="Trygt Overvann", legalName="OhJoy Ventures AS", parentOrganization="Green Harmony Holding AS". vatID/taxID beholdt.
- H3: rå mellomrom i og:image/twitter:image/inline <img> URL-encodet (%20).
- M2: sameAs utvidet med Brønnøysund Enhetsregisteret + Proff.no (personlig LinkedIn bevisst utelatt pga COWI-ansettelse).
- M3: llms.txt synket med eierskap (OhJoy Ventures AS / varemerke).
- M4: presis plassering fjernet fra schema (geo + streetAddress + postalCode); synlig "Landås, Bergen" → "Bergen". Beholder Bergen som område.
- M5: kontekstuell krysslinking (02.09.2026) — 16 lenker i brødteksten på de sju tjenestesidene, alle som lenke rundt ord som allerede sto der. Hver side har nå både utgående og innkommende kontekstlenker; `uavhengig-kontroll` og `breeam-nor` hadde null innkommende før. NB: FAQ-teksten er duplisert i JSON-LD — forankre mot `</p>` så bare den synlige varianten treffes.

Gjenstår fra auditen:
- M1 (utenfor repo): Google Business Profile + NAP-konsistente siteringer (Proff/1881/Gulesider). Høyeste lokale løftestang.
- Lav prioritet: 404.html noindex, render-blocking Google Fonts, background-image URL-encoding.

Merk: interne docs (tasks/, handoff) ligger i repoets egen `tasks/`, men deployes IKKE til web-root — rsync ekskluderer .git/DEPLOY.md/README.md/CLAUDE.md/AGENTS.md/tasks/.gitignore/.wrangler (se DEPLOY.md).

Schema-redigering: Organization-noden er duplisert identisk i alle 13 HTML-filer — bruk perl -0777 over alle filer for konsistens, og valider JSON-LD etterpå. NB: escape "@type" som "\@type" i Perl-erstatninger (ellers tolkes @ som array).

## E-post: Cloudflare Email Routing (satt opp 02.09.2026)

`kontakt@trygtovervann.no` videresendes til `trygt.overvann@gmail.com`. Sonen tar
imot e-post via Cloudflare; det sendes ingenting ut derfra.

| Ressurs | Verdi |
|---|---|
| zone_id | `377d254ff31245a9e6a50dc5e38ca54d` |
| account_id | `a883a1ff61882fbcf8756f078097748f` |
| Regel «kontakt» | `05ea119562d846a8b956e9dac0b66b4c` |
| Catch-all | `314a59add4d44523ba8163518c65d2f6` — `drop`, enabled |
| Destination | `trygt.overvann@gmail.com`, verifisert 02.09.2026 |

DNS lagt til (fem poster; CNAME-ene til Pages er urørt): MX route1/2/3
.mx.cloudflare.net (prio 5/33/78), TXT SPF `v=spf1 include:_spf.mx.cloudflare.net ~all`,
TXT DKIM `cf2024-1._domainkey`, TXT `_dmarc` med
`v=DMARC1; p=quarantine; rua=mailto:kontakt@trygtovervann.no; adkim=r; aspf=r`.

### Feller (kostet tid 02.09.2026)

🔴 **Email Routing ligger IKKE under sonen lenger.** Det er flyttet til kontonivå:
dashboard → **Compute → Email Service → Email Routing → Onboard Domain**. Sonens
egen Email-meny viser bare DMARC Management og Email Security, så det ser ut som
produktet mangler.

🔴 **Sone-endepunktene for aktivering svarer 403 uansett token.**
`GET/POST /zones/{id}/email/routing`, `/enable` og `/dns` ga «Authentication error»
med et token som hadde Email Routing Rules:Edit, DNS:Edit, Zone:Read og
Account Email Routing Addresses:Edit — mens `/email/routing/rules` og
`/dns_records` virket fint på samme token. Aktivering må gjøres i dashboardet;
resten (regler, catch-all, DNS) går utmerket via API.

- `zones`-objektets `permissions`-liste nevner ikke Email Routing i det hele tatt,
  selv når tokenet har tilgang. Den listen er ikke et sannhetsvitne — test kallet.
- Catch-all med `enabled: true` + `drop` tar imot posten og kaster den stille.
  Deaktivert catch-all ville avvist i SMTP og gitt avsender en bounce. Valgt: drop.
- DKIM-posten kom med på kjøpet fra Email Service (utgående e-post). Ufarlig, men
  den var ikke bestilt.

### API-token

Ligger i macOS Keychain, ikke i Doppler (workspace står på 10 av 10 prosjekter og
flere krever betalt plan). Hentes med
`security find-generic-password -a cloudflare -s trygtovervann-cf-token -w`.
Skal det legges inn på nytt: kjør kommandoen under i et **ekte terminalvindu** —
en skjult prompt kjørt via `!` inne i Claude Code får EOF og lagrer tom streng
uten å feile:

    security add-generic-password -a cloudflare -s trygtovervann-cf-token -U -w
