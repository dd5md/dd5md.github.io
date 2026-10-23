// xSDR64-Erklärseite: Maus über einen Punkt oder Klick zeigt die Erklärung, Rundgang führt Punkt für Punkt durch.
(function () {
  'use strict';

  var ansichten = document.querySelectorAll('.ansicht');
  var leiste = {
    rundgang: document.getElementById('rundgang'),
    liste: document.getElementById('liste-auf'),
    aus: document.getElementById('punkte-aus')
  };
  var hatMaus = window.matchMedia('(hover: hover)').matches;
  var steuerung = []; // je Ansicht: { auf, zu, weiter, zurueck, listeUmschalten }

  ansichten.forEach(function (ansicht) {
    var bild = ansicht.querySelector('.bild');
    var blase = ansicht.querySelector('.blase');
    var liste = ansicht.querySelector('.liste');
    var daten = JSON.parse(ansicht.querySelector('.hotspot-daten').textContent);
    var nr = 0;        // gezeigter Punkt (1…n), 0 = keiner
    var fest = false;  // per Klick, Rundgang oder Liste festgehalten
    var zeit = null;

    function stop() { clearTimeout(zeit); zeit = null; }

    function zu() {
      stop();
      blase.hidden = true;
      var alt = ansicht.querySelector('.hotspot.aktiv');
      if (alt) alt.classList.remove('aktiv');
      nr = 0; fest = false;
    }

    function auf(n, festhalten) {
      var punkt = ansicht.querySelector('.hotspot[data-nr="' + n + '"]');
      var d = daten[n - 1];
      if (!punkt || !d) return;
      stop();
      var alt = ansicht.querySelector('.hotspot.aktiv');
      if (alt) alt.classList.remove('aktiv');
      punkt.classList.add('aktiv');
      nr = n;
      fest = !!festhalten;

      blase.querySelector('.blase-gruppe').textContent = d.gruppe;
      blase.querySelector('.blase-titel').textContent = d.titel;
      blase.querySelector('.blase-text').textContent = d.text;
      blase.querySelector('.nav-zaehler').textContent = n + ' / ' + daten.length;
      blase.hidden = false;

      // Blase neben den Punkt: rechts davon, am Rand links; unten nach oben schieben
      var b = bild.getBoundingClientRect();
      var px = d.x / 100 * b.width, py = d.y / 100 * b.height;
      var bw = blase.offsetWidth, bh = blase.offsetHeight;
      var links = px + 24;
      if (links + bw > b.width - 8) links = px - bw - 24;
      if (links < 8) links = Math.max(8, (b.width - bw) / 2);
      var oben = py - 18;
      if (oben + bh > b.height - 8) oben = b.height - bh - 8;
      if (oben < 8) oben = 8;
      blase.style.left = links + 'px';
      blase.style.top = oben + 'px';
    }

    function weiter(schritt) {
      var n = nr + schritt;
      if (n < 1) n = daten.length;
      if (n > daten.length) n = 1;
      auf(n, true);
      var p = ansicht.querySelector('.hotspot[data-nr="' + n + '"]');
      if (p && p.scrollIntoView) p.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }

    function schliesseLater() {
      if (fest) return;
      stop();
      zeit = setTimeout(zu, 350);
    }

    ansicht.querySelectorAll('.hotspot').forEach(function (p) {
      var n = parseInt(p.dataset.nr, 10);
      if (hatMaus) {
        p.addEventListener('mouseenter', function () {
          if (fest) return;
          stop();
          zeit = setTimeout(function () { auf(n, false); }, 140);
        });
        p.addEventListener('mouseleave', schliesseLater);
      }
      p.addEventListener('click', function (e) {
        e.stopPropagation();
        if (nr === n && fest) { zu(); } else { auf(n, true); }
      });
    });

    if (hatMaus) {
      blase.addEventListener('mouseenter', stop);
      blase.addEventListener('mouseleave', schliesseLater);
    }

    ansicht.querySelectorAll('.listenpunkt').forEach(function (l) {
      l.addEventListener('click', function () {
        auf(parseInt(l.dataset.nr, 10), true);
        liste.classList.remove('offen');
        if (leiste.liste) leiste.liste.classList.remove('an');
      });
    });

    blase.querySelector('.blase-zu').addEventListener('click', zu);
    blase.querySelector('.nav-weiter').addEventListener('click', function () { weiter(1); });
    blase.querySelector('.nav-zurueck').addEventListener('click', function () { weiter(-1); });
    bild.addEventListener('click', function (e) { if (!blase.contains(e.target)) zu(); });
    liste.querySelector('.liste-zu').addEventListener('click', function () {
      liste.classList.remove('offen');
      if (leiste.liste) leiste.liste.classList.remove('an');
    });

    steuerung.push({
      rundgang: function () { auf(1, true); },
      weiter: weiter,
      offen: function () { return nr > 0; },
      zu: zu,
      listeUmschalten: function () {
        var an = liste.classList.toggle('offen');
        if (leiste.liste) leiste.liste.classList.toggle('an', an);
      }
    });
  });

  var erste = steuerung[0];
  if (erste) {
    if (leiste.rundgang) leiste.rundgang.addEventListener('click', erste.rundgang);
    if (leiste.liste) leiste.liste.addEventListener('click', erste.listeUmschalten);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { erste.zu(); }
      else if (e.key === 'ArrowRight' && erste.offen()) { erste.weiter(1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' && erste.offen()) { erste.weiter(-1); e.preventDefault(); }
    });
  }

  if (leiste.aus) {
    leiste.aus.addEventListener('change', function () {
      document.body.classList.toggle('ohne-punkte', leiste.aus.checked);
    });
  }
})();
