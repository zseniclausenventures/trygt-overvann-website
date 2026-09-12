/* Trygt Overvann™ — værvarsel og farevarsler.
 *
 * Henter fra fire kilder og normaliserer til én form, slik at nettleseren
 * gjør ett kall og ikke trenger å kjenne noe av dette:
 *
 *   Kartverket  koordinat  -> kommunenummer (NVE slår opp på kommune, ikke koordinat)
 *   MET         locationforecast -> ti døgn
 *   MET         metalerts        -> farevarsel (styrtregn, regnflom, stormflo, vind ...)
 *   NVE         flood + landslide -> flom i vassdrag og jordskred
 *
 * Posisjon kommer fra request.cf (Cloudflares egen stedfesting av
 * forespørselen). Den besøkendes IP sendes aldri videre — kildene ser bare en
 * avrundet koordinat. Ingenting lagres, ingen informasjonskapsel settes.
 */

const UA = 'trygtovervann.no kontakt@trygtovervann.no';
const BERGEN = { lat: 60.39, lon: 5.32 };

// Mellomlagring på kanten. Kartverket står i 30 døgn fordi en koordinat ikke
// bytter kommune; farevarsler kort, fordi de er ferskvare.
const TTL = { sted: 2592000, varsel: 1800, farevarsel: 300, nve: 1800 };

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const pos = posisjon(request, url);
  const test = url.searchParams.get('test') === '1';

  const base = url.origin;
  const sted = await stedFor(pos, base);

  // Alle fire kallene samtidig. Feiler én, skal de andre fortsatt leveres —
  // widgeten skal ikke forsvinne fordi NVE er nede.
  const [dogn, metVarsler, nveFlom, nveSkred] = await Promise.all([
    hentVarsel(pos, base).catch(() => null),
    hentMetAlerts(pos, test, base).catch(() => []),
    sted.kommunenummer ? hentNve('flood', sted.kommunenummer, base).catch(() => []) : [],
    sted.kommunenummer ? hentNve('landslide', sted.kommunenummer, base).catch(() => []) : []
  ]);

  const svar = {
    sted,
    oppdatert: new Date().toISOString(),
    dogn: dogn || [],
    farevarsler: uten_duplikat([...metVarsler, ...nveFlom, ...nveSkred]).sort(rangerVarsel)
  };

  return new Response(JSON.stringify(svar), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Kort nettleser-cache; kanten holder den lengre via cachedJson().
      'cache-control': 'public, max-age=300'
    }
  });
}

/* ---------- posisjon ---------- */

function posisjon(request, url) {
  const q = (n) => {
    const v = parseFloat(url.searchParams.get(n));
    return Number.isFinite(v) ? v : null;
  };
  const lat = q('lat') ?? tall(request.cf && request.cf.latitude);
  const lon = q('lon') ?? tall(request.cf && request.cf.longitude);

  // Utenfor Norge, eller ukjent posisjon (robot, VPN): fall tilbake til Bergen.
  const iNorge = lat !== null && lon !== null &&
                 lat > 57 && lat < 72 && lon > 4 && lon < 32;
  const p = iNorge ? { lat, lon } : BERGEN;

  // To desimaler: ~1 km. Grovt nok til å være uinteressant som
  // personopplysning, presist nok for et værvarsel — og gjør at mange
  // besøkende deler samme mellomlagrede svar.
  return { lat: rund(p.lat, 2), lon: rund(p.lon, 2), fallback: !iNorge };
}

const tall = (v) => (typeof v === 'string' ? parseFloat(v) : v) || null;
const rund = (v, n) => Math.round(v * 10 ** n) / 10 ** n;

/* ---------- kilder ---------- */

async function stedFor({ lat, lon, fallback }, base) {
  const u = `https://api.kartverket.no/kommuneinfo/v1/punkt?nord=${lat}&ost=${lon}&koordsys=4258`;
  try {
    const d = await cachedJson(u, TTL.sted, base);
    return {
      navn: d.kommunenavn || 'Bergen',
      kommunenummer: d.kommunenummer || null,
      fylke: d.fylkesnavn || null,
      antatt: fallback
    };
  } catch {
    return { navn: 'Bergen', kommunenummer: '4601', fylke: 'Vestland', antatt: true };
  }
}

async function hentVarsel({ lat, lon }, base) {
  const d = await cachedJson(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
    TTL.varsel, base
  );
  return tilDogn(d.properties.timeseries);
}

async function hentMetAlerts({ lat, lon }, test, base) {
  const u = test
    ? 'https://api.met.no/weatherapi/metalerts/2.0/test_all.json?lang=no'
    : `https://api.met.no/weatherapi/metalerts/2.0/current.json?lat=${lat}&lon=${lon}&lang=no&geographicDomain=land`;
  const d = await cachedJson(u, test ? 60 : TTL.farevarsel, base);
  return (d.features || []).map(fraMet).filter(Boolean);
}

async function hentNve(type, knr, base) {
  const fra = dagStreng(0), til = dagStreng(3);
  const d = await cachedJson(
    `https://api01.nve.no/hydrology/forecast/${type}/v1.0.6/api/Warning/Municipality/${knr}/1/${fra}/${til}`,
    TTL.nve, base
  );
  return (Array.isArray(d) ? d : []).map((w) => fraNve(w, type)).filter(Boolean);
}

/* ---------- normalisering ---------- */

const NIVA = { yellow: 'gul', orange: 'oransje', red: 'rod' };
const RANG = { rod: 0, oransje: 1, gul: 2 };

function fraMet(f) {
  const p = f.properties || {};
  const niva = NIVA[String(p.riskMatrixColor || '').toLowerCase()];
  if (!niva) return null; // grønt eller ukjent er ikke et varsel
  const iv = (f.when && f.when.interval) || [];
  return {
    kilde: 'Meteorologisk institutt',
    type: p.eventAwarenessName || p.event || 'Farevarsel',
    niva,
    omrade: p.area || null,
    fra: iv[0] || null,
    til: iv[1] || null,
    beskrivelse: reins(p.description),
    konsekvens: reins(p.consequences),
    rad: reins(p.instruction),
    lenke: p.web || 'https://www.yr.no/nb/farevarsler'
  };
}

function fraNve(w, type) {
  // NVE-nivå 1 er «grønt nivå» og betyr INGEN varsel. Tas det ikke bort,
  // fylles siden av grønne ikke-varsler.
  const n = { 2: 'gul', 3: 'oransje', 4: 'rod' }[w.ActivityLevel];
  if (!n) return null;
  return {
    kilde: 'NVE',
    type: w.DangerTypeName || (type === 'flood' ? 'Flom' : 'Jordskredfare'),
    niva: n,
    omrade: w.Area || null,
    fra: w.ValidFrom || null,
    til: w.ValidTo || null,
    beskrivelse: reins(w.WarningText || w.MainText),
    konsekvens: reins(w.ConsequenceText),
    rad: reins(w.AdviceText),
    lenke: 'https://www.varsom.no/'
  };
}

const reins = (s) => (s ? String(s).replace(/\s+/g, ' ').trim() || null : null);

// MET sender samme hendelse som flere CAP-meldinger når den dekker flere
// polygoner. Uten dette står varselet to ganger i lista og ser ødelagt ut.
function uten_duplikat(liste) {
  const sett = new Set();
  return liste.filter((v) => {
    const n = [v.type, v.omrade, v.fra, v.niva].join('|');
    return sett.has(n) ? false : sett.add(n);
  });
}
const rangerVarsel = (a, b) =>
  RANG[a.niva] - RANG[b.niva] || String(a.fra || '').localeCompare(String(b.fra || ''));

/* ---------- døgn ---------- */

const OSLO = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit'
});
const TIME = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Oslo', hour: '2-digit', hour12: false });

const dagStreng = (n) => OSLO.format(new Date(Date.now() + n * 864e5));

function tilDogn(ts) {
  const kart = new Map();

  for (const p of ts) {
    const d = new Date(p.time);
    const dato = OSLO.format(d);
    let rad = kart.get(dato);
    if (!rad) kart.set(dato, (rad = { dato, temp: [], nedbor: 0, vind: [], symbol: null, symbolDag: null }));

    const inst = p.data.instant && p.data.instant.details;
    if (inst) {
      if (typeof inst.air_temperature === 'number') rad.temp.push(inst.air_temperature);
      if (typeof inst.wind_speed === 'number') rad.vind.push(inst.wind_speed);
    }

    // MET leverer timevis de første døgnene og 6-timers etterpå — aldri begge
    // for samme intervall etter overgangen. Derfor dobbelttelles ikke nedbøren.
    const en = p.data.next_1_hours, seks = p.data.next_6_hours;
    const bolk = en || seks;
    if (bolk && bolk.details && typeof bolk.details.precipitation_amount === 'number') {
      rad.nedbor += bolk.details.precipitation_amount;
    }

    // Dagsymbolet tas fra midt på dagen, ikke fra natta.
    const s = (seks && seks.summary) || (p.data.next_12_hours && p.data.next_12_hours.summary) ||
              (en && en.summary);
    if (s && s.symbol_code) {
      const t = parseInt(TIME.format(d), 10);
      if (t >= 11 && t <= 14) rad.symbolDag = s.symbol_code;
      if (!rad.symbol) rad.symbol = s.symbol_code;
    }
  }

  return [...kart.values()].slice(0, 10).map((r) => ({
    dato: r.dato,
    symbol: r.symbolDag || r.symbol || 'cloudy',
    tempMax: r.temp.length ? rund(Math.max(...r.temp), 1) : null,
    tempMin: r.temp.length ? rund(Math.min(...r.temp), 1) : null,
    nedbor: rund(r.nedbor, 1),
    vind: r.vind.length ? rund(Math.max(...r.vind), 1) : null
  }));
}

/* ---------- mellomlagring ---------- */

async function cachedJson(url, ttl, base) {
  const cache = caches.default;
  // Nøkkelen MÅ ligge på eget domene; Cache API tar ikke en fremmed vert.
  const nokkel = new Request(new URL('/__vaer-cache/' + encodeURIComponent(url), base), { method: 'GET' });

  const truffet = await cache.match(nokkel);
  if (truffet) return truffet.json();

  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!r.ok) throw new Error(`${url} svarte ${r.status}`);

  const kropp = await r.text();
  const lagre = new Response(kropp, {
    headers: { 'content-type': 'application/json', 'cache-control': `public, max-age=${ttl}` }
  });
  await cache.put(nokkel, lagre.clone());
  return JSON.parse(kropp);
}
