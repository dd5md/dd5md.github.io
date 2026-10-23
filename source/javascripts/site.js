// xSDR64-Erklärseite: Klick auf einen Punkt zeigt die Erklärung in einer Blase.
(function () {
  'use strict';

  document.querySelectorAll('.ansicht').forEach(function (ansicht) {
    var bild = ansicht.querySelector('.bild');
    var blase = ansicht.querySelector('.blase');
    var daten = JSON.parse(ansicht.querySelector('.hotspot-daten').textContent);
    var punkte = ansicht.querySelectorAll('.hotspot');
    var aktiv = null;

    function zu() {
      blase.hidden = true;
      if (aktiv) aktiv.classList.remove('aktiv');
      aktiv = null;
    }

    function auf(nr) {
      var punkt = ansicht.querySelector('.hotspot[data-nr="' + nr + '"]');
      var d = daten[nr - 1];
      if (!punkt || !d) return;
      if (aktiv) aktiv.classList.remove('aktiv');
      aktiv = punkt;
      punkt.classList.add('aktiv');

      blase.querySelector('.blase-gruppe').textContent = d.gruppe;
      blase.querySelector('.blase-titel').textContent = d.titel;
      blase.querySelector('.blase-text').textContent = d.text;
      blase.hidden = false;

      // Blase neben den Punkt setzen: rechts davon, am rechten Rand links; unten nach oben klappen
      var b = bild.getBoundingClientRect();
      var px = d.x / 100 * b.width;
      var py = d.y / 100 * b.height;
      var bw = blase.offsetWidth, bh = blase.offsetHeight;
      var links = px + 22;
      if (links + bw > b.width - 8) links = px - bw - 22;
      if (links < 8) links = Math.max(8, (b.width - bw) / 2);
      var oben = py - 16;
      if (oben + bh > b.height - 8) oben = b.height - bh - 8;
      if (oben < 8) oben = 8;
      blase.style.left = links + 'px';
      blase.style.top = oben + 'px';

      // Auf kleinen Bildschirmen ins Sichtfeld holen
      if (window.matchMedia('(max-width: 800px)').matches) {
        blase.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    punkte.forEach(function (p) {
      p.addEventListener('click', function (e) {
        e.stopPropagation();
        if (aktiv === p && !blase.hidden) { zu(); } else { auf(p.dataset.nr); }
      });
    });

    ansicht.querySelectorAll('.listenpunkt').forEach(function (l) {
      l.addEventListener('click', function () {
        auf(l.dataset.nr);
        bild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    });

    blase.querySelector('.blase-zu').addEventListener('click', zu);
    bild.addEventListener('click', function (e) {
      if (!blase.contains(e.target)) zu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') zu();
    });
  });

  var aus = document.getElementById('punkte-aus');
  if (aus) {
    aus.addEventListener('change', function () {
      document.body.classList.toggle('ohne-punkte', aus.checked);
    });
  }
})();
