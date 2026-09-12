/* Trygt Overvann™ — værvarsel og farevarsler.
 *
 * Tegner to visninger fra samme kall til /api/vaer:
 *   .vaer-boks   sidestolpen, tre døgn + faretrekanter, hele boksen er en lenke
 *   #vaer-side   /vaervarsel/, ti døgn + varslene i sin helhet
 *
 * Symbolene er tegnet i nettstedets eget formspråk. Yrs offisielle ikoner er
 * avrundede og flerfargede og ville vært det eneste elementet med den stilen.
 */
(function () {
  'use strict';

  var bokser = [].slice.call(document.querySelectorAll('.vaer-boks'));
  var side = document.getElementById('vaer-side');
  if (!bokser.length && !side) return;


  /* ---------- symboler ---------- */

  var P = 'fill:none;stroke:currentColor;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round';
  var SKY = '<path d="M6.5 17.5h11a3.2 3.2 0 0 0 .3-6.4 5 5 0 0 0-9.6-1.2 3.3 3.3 0 0 0-1.7 7.6Z" style="' + P + '"/>';
  var DRAAPE = function (x, y) { return '<path d="M' + x + ' ' + y + 'v2.6" style="' + P + ';opacity:.75"/>'; };
  var STJERNE = function (x, y) { return '<path d="M' + x + ' ' + (y - 1) + 'v2.6M' + (x - 1.2) + ' ' + (y - .3) + 'l2.4 1.4M' + (x + 1.2) + ' ' + (y - .3) + 'l-2.4 1.4" style="' + P + ';stroke-width:1.1;opacity:.75"/>'; };

  var SOL = '<circle cx="12" cy="12" r="3.6" style="' + P + '"/>' +
    '<path d="M12 4.6V6m0 12v1.4M4.6 12H6m12 0h1.4M6.8 6.8l1 1m8.4 8.4 1 1m0-10.4-1 1m-8.4 8.4-1 1" style="' + P + '"/>';
  var MAANE = '<path d="M16.8 14.6A6.2 6.2 0 0 1 9.4 7.2a6.2 6.2 0 1 0 7.4 7.4Z" style="' + P + '"/>';

  var IKON = {
    sol: SOL,
    maane: MAANE,
    delvisdag: '<circle cx="9" cy="8.6" r="2.6" style="' + P + '"/><path d="M9 3.6V5M4 8.6h1.4M5.5 5.1l1 1" style="' + P + '"/>' + SKY,
    delvisnatt: '<path d="M11.6 8.4A4 4 0 0 1 6.8 3.6a4 4 0 1 0 4.8 4.8Z" style="' + P + '"/>' + SKY,
    skyet: SKY,
    taake: SKY + '<path d="M6 20h12M8 22.4h8" style="' + P + ';stroke-width:1.1"/>',
    regn: SKY + DRAAPE(9, 19.4) + DRAAPE(12, 20.2) + DRAAPE(15, 19.4),
    sludd: SKY + DRAAPE(9.5, 19.6) + STJERNE(14.5, 20.6),
    sno: SKY + STJERNE(9, 20.4) + STJERNE(12, 21.4) + STJERNE(15, 20.4),
    torden: SKY + '<path d="M12.6 18.4h2.4l-3.6 4.4.9-3H10l2.6-3.4Z" style="fill:currentColor;stroke:none"/>' + DRAAPE(8.6, 19.4)
  };

  function ikonNavn(kode) {
    var c = String(kode || '');
    if (c.indexOf('thunder') > -1) return 'torden';
    if (c.indexOf('sleet') > -1) return 'sludd';
    if (c.indexOf('snow') > -1) return 'sno';
    if (c.indexOf('rain') > -1) return 'regn';
    if (c.indexOf('fog') === 0) return 'taake';
    if (c.indexOf('cloudy') === 0) return 'skyet';
    var natt = c.indexOf('_night') > -1;
    if (c.indexOf('clearsky') === 0) return natt ? 'maane' : 'sol';
    if (c.indexOf('fair') === 0 || c.indexOf('partlycloudy') === 0) return natt ? 'delvisnatt' : 'delvisdag';
    return 'skyet';
  }

  var TEKST = {
    sol: 'Klarvær', maane: 'Klarvær', delvisdag: 'Delvis skyet', delvisnatt: 'Delvis skyet',
    skyet: 'Skyet', taake: 'Tåke', regn: 'Regn', sludd: 'Sludd', sno: 'Snø', torden: 'Tordenvær'
  };

  function ikon(kode, klasse) {
    var n = ikonNavn(kode);
    return '<svg class="' + (klasse || 'vaer-ikon') + '" viewBox="0 0 24 24" role="img" aria-label="' +
      TEKST[n] + '">' + IKON[n] + '</svg>';
  }

  var NIVANAVN = { gul: 'Gult nivå', oransje: 'Oransje nivå', rod: 'Rødt nivå' };

  // Bakgrunnsfargen leses fra RÅ symbol_code, ikke fra ikonnavnet: ikonet slår
  // sammen «fair» (lettskyet, sol dominerer) og «partlycloudy» (delvis skyet),
  // men fargen skal skille dem — den ene er sol, den andre er overskyet.
  function fargeFor(kode) {
    var c = String(kode || '');
    if (c.indexOf('snow') > -1) return 'v-sno';
    if (/rain|sleet|thunder/.test(c)) return 'v-regn';
    if (c.indexOf('clearsky') === 0 || c.indexOf('fair') === 0) {
      return c.indexOf('_night') > -1 ? 'v-natt' : 'v-sol';
    }
    return 'v-skyet'; // partlycloudy, cloudy, fog
  }

  function ikon(kode, klasse) {
    var n = ikonNavn(kode);
    return '<svg class="' + (klasse || 'vaer-ikon') + '" viewBox="0 0 24 24" role="img" aria-label="' +
      TEKST[n] + '">' + IKON[n] + '</svg>';
  }

  var NIVANAVN = { gul: 'Gult nivå', oransje: 'Oransje nivå', rod: 'Rødt nivå' };

  // Bakgrunnsfarge etter været i dag: gul sol, grå skyet, blå regn, hvit snø.
  var FARGE = {
    sol: 'v-sol', maane: 'v-sol',
    delvisdag: 'v-skyet', delvisnatt: 'v-skyet', skyet: 'v-skyet', taake: 'v-skyet',
    regn: 'v-regn', sludd: 'v-regn', torden: 'v-regn',
    sno: 'v-sno'
  };

  function trekant(niva) {
    return '<svg viewBox="0 0 24 24" role="img" aria-label="' + NIVANAVN[niva] + '">' +
      '<path d="M12 3.2 22.4 21H1.6Z" fill="var(--niva-' + niva + ')" stroke="var(--ink)" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<path d="M12 9.6v5m0 2.4v.1" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/></svg>';
  }

  /* ---------- datoer og tall ---------- */

  var DAGER = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];
  var IDAG = nyDato().toISOString().slice(0, 10);

  function nyDato() {
    // «I dag» må avgjøres i norsk tid, ikke i nettleserens tidssone.
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Oslo' }));
  }

  function dagNavn(iso, langt) {
    if (iso === IDAG) return 'I dag';
    var d = new Date(iso + 'T12:00:00Z');
    var n = DAGER[d.getUTCDay()];
    return langt ? n + ' ' + d.getUTCDate() + '.' + (d.getUTCMonth() + 1) + '.' : n;
  }

  var grad = function (v) { return v === null || v === undefined ? '–' : Math.round(v) + '°'; };
  // Norsk desimalskille er komma.
  var mm = function (v) { return v > 0 ? String(v < 1 ? v.toFixed(1) : Math.round(v)).replace('.', ',') + ' mm' : ''; };
  var trygg = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  function tidsrom(fra, til) {
    if (!fra) return '';
    var f = new Date(fra), t = til ? new Date(til) : null;
    var o = { timeZone: 'Europe/Oslo', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    var s = f.toLocaleString('nb-NO', o);
    return t ? s + ' – ' + t.toLocaleString('nb-NO', o) : s;
  }

  /* ---------- tegning ---------- */

  function tegnBoks(boks, d) {
    var tre = d.dogn.slice(0, 3).map(function (r) {
      return '<div class="vaer-dag"><p class="vaer-dag-navn">' + dagNavn(r.dato) + '</p>' +
        ikon(r.symbol) +
        '<p class="vaer-temp">' + grad(r.tempMax) + '</p>' +
        '<p class="vaer-mm' + (r.nedbor > 0 ? '' : ' tort') + '">' + (mm(r.nedbor) || '–') + '</p></div>';
    }).join('');

    var flagg = d.farevarsler.slice(0, 2).map(function (v) {
      return '<span class="vaer-flagg">' + trekant(v.niva) + '<span>' + trygg(v.type) +
        ', ' + NIVANAVN[v.niva].toLowerCase() + '</span></span>';
    }).join('');
    var fler = d.farevarsler.length > 2
      ? '<span class="vaer-flagg"><span style="width:15px"></span><span>+ ' + (d.farevarsler.length - 2) + ' varsler til</span></span>'
      : '';

    boks.className = boks.className.replace(/\s*\bv-\w+/g, '') + ' ' + fargeFor(d.dogn[0].symbol);
    boks.innerHTML =
      '<p class="vaer-boks-tittel">Varsel for ' + trygg(d.sted.navn) + '</p>' +
      '<div class="vaer-tredogn">' + tre + '</div>' +
      (flagg ? '<div class="vaer-boks-varsler">' + flagg + fler + '</div>' : '') +
      '<span class="vaer-boks-lenke">Ti døgn og alle varsler <span aria-hidden="true">&#8594;</span></span>';
  }

  function tegnSide(d) {
    var varsler = d.farevarsler.length
      ? d.farevarsler.map(function (v) {
          var felt = [['Situasjon', v.beskrivelse], ['Konsekvens', v.konsekvens], ['Råd', v.rad]]
            .filter(function (f) { return f[1]; })
            .map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + trygg(f[1]) + '</dd>'; }).join('');
          return '<article class="vaer-varsel ' + v.niva + '">' +
            '<div class="vaer-varsel-topp">' + trekant(v.niva) +
            '<h3 class="vaer-varsel-navn">' + trygg(v.type) + '</h3>' +
            '<span class="vaer-merke">' + NIVANAVN[v.niva] + '</span></div>' +
            '<p class="vaer-varsel-meta">' + trygg(v.omrade || d.sted.navn) +
            (v.fra ? ' &middot; ' + tidsrom(v.fra, v.til) : '') + ' &middot; ' + trygg(v.kilde) + '</p>' +
            (felt ? '<dl>' + felt + '</dl>' : '') + '</article>';
        }).join('')
      : '<p class="vaer-rolig">Ingen farevarsler er ute for ' + trygg(d.sted.navn) +
        ' nå. Meteorologisk institutt varsler styrtregn, regnflom, stormflo og vind; NVE varsler flom i vassdrag og jordskred.</p>';

    var maks = Math.max.apply(null, d.dogn.map(function (r) { return r.nedbor; }).concat([10]));
    var rader = d.dogn.map(function (r) {
      return '<div class="vaer-rad">' +
        '<span class="vaer-rad-dag">' + dagNavn(r.dato, true) + '</span>' +
        ikon(r.symbol) +
        '<span class="vaer-stolpe"><i style="width:' + Math.round((r.nedbor / maks) * 100) + '%"></i></span>' +
        '<span class="vaer-rad-tall' + (r.nedbor > 0 ? '' : ' tort') + '">' + (mm(r.nedbor) || '0 mm') + '</span>' +
        '<span class="vaer-rad-temp">' + grad(r.tempMax) +
          (grad(r.tempMin) !== grad(r.tempMax) ? '<small>' + grad(r.tempMin) + '</small>' : '') + '</span>' +
        '</div>';
    }).join('');

    side.innerHTML =
      '<div class="vaer-hode"><h2 class="vaer-sted">' + trygg(d.sted.navn) + '</h2>' +
      '<span class="vaer-stempel">Oppdatert ' +
      new Date(d.oppdatert).toLocaleString('nb-NO', { timeZone: 'Europe/Oslo', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) +
      '</span></div>' + varsler +
      '<h2 class="vaer-avsnitt" style="font-family:var(--serif);font-weight:400;font-size:1.35rem;margin:2.5rem 0 .25rem">Ti døgn</h2>' +
      '<div class="vaer-tidogn">' + rader + '</div>' +
      '<p class="vaer-kilde">Værdata fra Meteorologisk institutt, gjengitt under ' +
      '<a href="https://creativecommons.org/licenses/by/4.0/deed.no" rel="license noopener" target="_blank">CC BY 4.0</a>. ' +
      'Farevarsler fra Meteorologisk institutt og NVE. Stedet er anslått ut fra nettilkoblingen din og kan være unøyaktig. ' +
      'Dette gjengir de offisielle varslene og erstatter dem ikke &mdash; se ' +
      '<a href="https://www.yr.no/nb/farevarsler" rel="noopener" target="_blank">yr.no</a> og ' +
      '<a href="https://www.varsom.no/" rel="noopener" target="_blank">varsom.no</a>.</p>';
  }

  /* ---------- henting ---------- */

  function hent() {
    var test = /[?&]test=1/.test(location.search) ? '?test=1' : '';
    fetch('/api/vaer' + test, { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        if (!d.dogn || !d.dogn.length) throw new Error('tomt varsel');
        bokser.forEach(function (b) { tegnBoks(b, d); });
        if (side) tegnSide(d);
      })
      .catch(function () {
        // I sidestolpen skal en feil være usynlig — ingen feilmelding på en
        // tjenesteside. På varselsida sier vi fra og peker videre.
        bokser.forEach(function (b) { b.remove(); });
        if (side) {
          side.innerHTML = '<p class="vaer-feil">Varselet er ikke tilgjengelig akkurat nå. ' +
            'Se <a href="https://www.yr.no/" rel="noopener" target="_blank">yr.no</a> og ' +
            '<a href="https://www.varsom.no/" rel="noopener" target="_blank">varsom.no</a>.</p>';
        }
      });
  }

  // Etter load, aldri før: varselet skal ikke konkurrere med sidens egen last.
  if (document.readyState === 'complete') hent();
  else window.addEventListener('load', hent);
})();
