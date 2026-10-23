# Hilfsfunktionen für die Hotspot-Ansichten
module HotspotHelpers
  # Alle Ansichten aus data/ansichten.yml
  def ansichten
    data.ansichten
  end

  # Gruppen der Hotspots einer Ansicht in der Reihenfolge ihres ersten Auftretens
  def hotspot_gruppen(ansicht)
    ansicht.hotspots.map(&:gruppe).uniq
  end

  # style-Attribut für die Lage eines Hotspots (Prozent vom Bild)
  def hotspot_lage(h)
    "left:#{h.x}%;top:#{h.y}%"
  end
end

::Middleman::TemplateContext.send(:include, HotspotHelpers)
