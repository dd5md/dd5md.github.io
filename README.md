# dd5md.github.io – xSDR64 erklärt

Interaktive Erklärseite: Screenshot der Software mit nummerierten Hotspots. Ein Klick zeigt die Erklärung.
Gebaut mit Middleman 4.

## Texte und Hotspots ändern
Alles steht in `data/ansichten.yml`: je Ansicht Bild, Größe, Beschreibung und die Liste der Hotspots
(`x` und `y` in Prozent vom Bild, `gruppe`, `titel`, `text`). Eine neue Ansicht ist ein weiterer Eintrag mit Bild in `source/images/`.

## Lokal ansehen
```
bundle install
bundle exec middleman server
```
Dann http://localhost:4567 öffnen.

## Bauen (Veröffentlichen)
```
bundle exec middleman build
```
Die fertige Seite liegt in `docs/`. GitHub Pages: Settings → Pages → Branch `main`, Ordner `/docs`.
Die Seite benutzt relative Links und läuft deshalb auch in einem Unterordner auf dem eigenen Webspace.

## Aufbau
- `source/layouts/layout.erb`, `source/index.html.erb`, `source/components/_ansicht.erb`
- `source/stylesheets/site.css`, `source/javascripts/site.js`
- `helpers/hotspot_helpers.rb`
