# Endringslogg — trygt-overvann-website

Daterte notater og bakgrunn flyttet ut av CLAUDE.md.

## 29.09.2026 — skrifter, versjoner og deploy (ettermiddag)

Bengt: «fiks det du kan fikse, gjør mest mulig selv». Gjort, deployet og målt live:

- Google Fonts → egne woff2-filer. Null forespørsler til Google. LCP uendret
  (målt 3 runder, 4× CPU, 1,6 Mbit/s, 150 ms: prod 2056 ms, ny 2024–2056 ms).
- Hoppet på forsiden (CLS 0,025, hero-overskriften 3 → 2 linjer ved skriftbytte)
  fjernet med skalert Georgia som reserve: 0,0001 live. Forhåndslasting prøvd
  først og tilbakestilt (commit 1eadd5e, revert be39c3b): hoppet ble like stort
  og LCP 200 ms verre.
- Automatiske versjonsnumre (`scripts/oppdater-versjoner.py`) og ett
  deployskript (`scripts/deploy.sh`) med positiv liste. Funn underveis: den
  gamle utelukkingslista manglet `docs/`, som ville lekket denne fila.
- `.svc-arr`-kontrast, klebrig sidestolpe på /for-advokater/, wrangler 4.71 → 4.143.
- Måleskriptet mitt hadde en feil som først så ut som CLS 0,05–0,16: hver
  måling la til en ny `PerformanceObserver`. Registrer observatøren én gang per fane.

## 29.09.2026 — COWI-spørsmålet lukket

Bengts avgjørelse: påstandene står; uavhengighet vurderes per sak, og han trekker seg når COWI, Sweco eller andre med bånd er involvert. Analysen under var grunnlaget for spørsmålet (skrevet 08.–09.09), og er beholdt som referanse:

### (Historikk) AAPENT: skal ansettelsen opplyses eksplisitt?

Rettingen over fjernet det som var **uriktig**. Den tar ikke stilling til om
det loepende ansettelsesforholdet skal **opplyses**. Det er Bengts beslutning,
ikke en opprydding — den beroerer baade arbeidsgiverforholdet og habilitet.

Hvorfor det henger sammen med resten av sida:

- Forsiden har **«100 % Uavhengig»** som noekkeltall (to steder), /om/ sier
  «uavhengig raadgivning **uten interessekonflikter**» og «ingen binding til
  leverandoerer eller utbyggere». Alle er absolutte.
- Habilitetssvaret paa /for-advokater/ er formulert i **fortid**: «Hvis jeg
  *tidligere* har vaert involvert … Habilitetserklaering som beskriver
  eventuelle *tidligere* forbindelser.» Et loepende ansettelsesforhold hos et
  av landets stoerste raadgivende ingenioerfirmaer er en annen og sterkere
  kategori enn en historisk binding — og COWI prosjekterer VA og overvann i
  stort omfang, saa sannsynligheten for beroering i en konkret sak er reell.
- Uavhengig kontroll etter SAK10 har uavhengighet som **vilkaar**, ikke som
  markedsfoeringspoeng.
- Google Business Profile (M1) er langt mer synlig enn LinkedIn-lenken som
  allerede ble utelatt av COWI-hensyn.

Det som skader er ikke konflikten — den haandteres ved aa takke nei. Det er
**rekkefoelgen**: at motparten oppdager ansettelsen etter aa ha lest nettsida.
Da handler saken om hvorfor det sto som det sto.

**Presisering som avgjoer tyngden i dette (utledet 09.09):** det finnes to
slags sakkyndige, og Bengt er stort sett den andre.

- *Rettsoppnevnt sakkyndig:* habilitetsreglene gjelder formelt — tvisteloven
  § 25-3 viser til domstolloven, der § 108 er sekkebestemmelsen: «saeregne
  omstendigheter … skikket til aa svekke tilliten til hans uhildethet». Merk
  standarden: den spoer ikke om han VAR paavirket, men om omstendighetene er
  EGNET TIL aa svekke tilliten. En tilsynelatende-standard.
- *Privat engasjert sakkyndig* — som er det /for-advokater/ selger, oppdrag
  fra advokater og forsikringsselskap. Her finnes **ingen formell
  habilitetsregel** som kan diskvalifisere ham.

Det siste hoeres beskyttende ut, men er det motsatte: finnes det ingen regel
som diskvalifiserer, finnes det heller ingen prosedyre som RENVASKER. Retten
staar fritt i bevisvurderingen. Da er tilknytning og troverdighet ikke et
formelt spoersmaal ved siden av saken — de er hele spoersmaalet om hva
rapporten er verdt.

Derfor er den kommersielle risikoen stoerre enn den rettslige, og den ligger
i KANALEN, ikke i saken: advokaten som engasjerte ham blir overrumplet i
retten foran sin egen klient. Han ringer ikke igjen, og advokater snakker
sammen. Bengt er ikke jurist paa dette punktet, og beslutningen boer tas med
en advokat han allerede jobber med — saerlig ordlyden i habilitetserklaeringen,
som i dag bare dekker TIDLIGERE bindinger.

Ikke endre «100 % Uavhengig», habilitetssvaret eller GBP-planen uten at Bengt
har tatt denne beslutningen.


