# Estructura ideal del reporte Observable HQ - Paragon | Lienzo Charro

## Objetivo del proyecto
- Definir tenant mix tematico que respete el Lienzo Charro y validar viabilidad de restaurante ancla; analizar afinidad y vocacion para giros afines (boutiques, artesania high-end) con benchmark de plazas tematicas.

## Sitemap propuesto (paginas)
- `index`: portada con objetivo, CTA a descarga de capas y tarjetas de hallazgos.
- `resumen-ejecutivo`: decision y supuestos criticos.
- `ficha-sitio`: coordenadas, foto/render, mapa ubicacion y radios (01, 02, 07).
- `demanda-nse`: coropleta NSE + indicadores por buffer (03, 06, 12).
- `accesibilidad`: isocronas 5/10/15 min con poblacion/POIs (08 + 06/09).
- `competencia-vocacion`: heatmap competencia + puntos DENUE filtrables (09, 10).
- `afinidad-tematica`: filtros por categorias afines (boutiques, artesania, restaurantes) y tarjetas de afinidad.
- `restaurante-ancla`: isocronas + NSE objetivo + competencia F&B dentro de 10–15 min; KPI de demanda y ticket esperado.
- `benchmark`: casos analogos de plazas tematicas con KPIs comparables.
- `anexos`: descargas GeoJSON/QML, metodologia, comandos.

## Graficos y mapas clave
- Mapa ubicacion + buffers + poligono (01_lienzo_charro_sitio_terreno, 02_lienzo_charro_buffers_analisis, 07_lienzo_charro_poligono_terreno).
- Coropleta NSE (03_lienzo_charro_agebs_nse) con leyenda AMAI.
- Indicadores por buffer (06_lienzo_charro_indicadores_buffer) en tabla y barras apiladas.
- Isocronas HERE (08_lienzo_charro_isocronas_here) con tarjetas de poblacion/POIs.
- Puntos y heatmap competencia (09_lienzo_charro_denue_completo, 10_lienzo_charro_heatmap_competencia) con filtros por categoria.
- Panel afinidad: filtrado de categorias y ranking de brechas positivas para giros tematicos.

## Descargas y datos
- GeoJSON + QML: all layers 01-12.
- Comandos: `python scripts/paragon_qgis_map_images.py --project lienzo_charro --dpi 300`.

