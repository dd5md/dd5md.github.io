###-----------------------------------
#  xSDR64 – Erklärseite mit Hotspots
#  ~> https://dd5md.github.io
###-----------------------------------

# HELPERS
Dir['helpers/*.rb'].each(&method(:load))

set :css_dir,    'stylesheets'
set :js_dir,     'javascripts'
set :images_dir, 'images'

# Alle Links relativ, damit die Seite auch in einem Unterordner (zum Beispiel auf dem eigenen Webspace) läuft
activate :relative_assets
set :relative_links, true

# Gebaute Seite liegt in docs/ (GitHub Pages: Branch main, Ordner /docs)
set :build_dir, 'docs'

# GitHub Pages: keine Jekyll-Verarbeitung
after_build do
  File.write(File.join(config[:build_dir], '.nojekyll'), '')
end
