---
title: Anexos y Descargas
---

# Anexos y Descargas

Documentación técnica, capas GeoJSON, metodología y comandos de regeneración.

---

## 📥 Descargas de Capas QGIS

<div class="card">
  <h2>Capas Geoestadísticas Disponibles</h2>
  <p>Todas las capas están en formato <strong>GeoJSON + estilos QML</strong> para uso en QGIS 3.28 o superior.</p>
  <p><strong>Directorio:</strong> <code>data/qgis_layers_paragon/lienzo_charro/</code></p>
</div>

### Capas Principales

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Capa</th>
      <th>Descripción</th>
      <th>Features</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>01</td>
      <td><code>01_lienzo_charro_sitio_terreno.geojson</code></td>
      <td>Punto de ubicación del terreno</td>
      <td>1</td>
    </tr>
    <tr>
      <td>02</td>
      <td><code>02_lienzo_charro_buffers_analisis.geojson</code></td>
      <td>Buffers de análisis (100m - 5km)</td>
      <td>6</td>
    </tr>
    <tr>
      <td>03</td>
      <td><code>03_lienzo_charro_agebs_nse.geojson</code></td>
      <td>AGEBs con NSE (5km radio)</td>
      <td>105</td>
    </tr>
    <tr>
      <td>06</td>
      <td><code>06_lienzo_charro_indicadores_buffer.geojson</code></td>
      <td>Indicadores demográficos por buffer</td>
      <td>6</td>
    </tr>
    <tr>
      <td>07</td>
      <td><code>07_lienzo_charro_poligono_terreno.geojson</code></td>
      <td>Polígono del terreno (KMZ)</td>
      <td>1</td>
    </tr>
    <tr>
      <td>08</td>
      <td><code>08_lienzo_charro_isocronas_here.geojson</code></td>
      <td>Isócronas HERE (5/10/15 min)</td>
      <td>3</td>
    </tr>
    <tr>
      <td>09</td>
      <td><code>09_lienzo_charro_denue_completo.geojson</code></td>
      <td>DENUE completo (SCIAN repository)</td>
      <td>Variable</td>
    </tr>
    <tr>
      <td>10</td>
      <td><code>10_lienzo_charro_heatmap_competencia.geojson</code></td>
      <td>Heatmap densidad competencia</td>
      <td>Variable</td>
    </tr>
    <tr>
      <td>12</td>
      <td><code>12_lienzo_charro_nse_componentes.geojson</code></td>
      <td>Componentes NSE (educación, vivienda, bienes, economía)</td>
      <td>105</td>
    </tr>
  </tbody>
</table>

---

## 🗺️ Cómo Usar en QGIS

### 1. Cargar Capas

```bash
# Abrir QGIS 3.28 o superior
# Layer > Add Layer > Add Vector Layer
# Navegar a: data/qgis_layers_paragon/lienzo_charro/
# Seleccionar archivos .geojson
```

### 2. Aplicar Estilos

```bash
# Doble clic en la capa
# Ir a: Symbology > Style > Load Style
# Seleccionar archivo .qml correspondiente
```

### 3. Orden Recomendado de Capas (de abajo hacia arriba)

1. `08_isocronas_here` - Isócronas (fondo con transparencia)
2. `02_buffers_analisis` - Buffers de análisis
3. `03_agebs_nse` - Coropleta NSE
4. `10_heatmap_competencia` - Heatmap de competencia
5. `09_denue_completo` - Todos los establecimientos DENUE
6. `07_poligono_terreno` - Polígono del predio
7. `01_sitio_terreno` - Punto del sitio (arriba)

---

## 📚 Metodología

### Fuentes de Datos

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Datos Demográficos</h3>
    <ul>
      <li><strong>SCINCE 2020</strong> (INEGI) - Población, vivienda, educación</li>
      <li><strong>Marco Geoestadístico 2020</strong> - AGEBs y límites</li>
      <li><strong>CRS oficial:</strong> EPSG:6372 (México)</li>
    </ul>
  </div>
  <div class="card">
    <h3>Datos Económicos</h3>
    <ul>
      <li><strong>DENUE 2024</strong> (INEGI) - Establecimientos económicos</li>
      <li><strong>Clasificación SCIAN</strong> - Categorías de actividad</li>
      <li><strong>Actualización:</strong> Datos a diciembre 2024</li>
    </ul>
  </div>
  <div class="card">
    <h3>Datos de Accesibilidad</h3>
    <ul>
      <li><strong>HERE Routing API</strong> - Isócronas premium</li>
      <li><strong>Red vial:</strong> Actualizada 2024</li>
      <li><strong>Modo:</strong> Automóvil, condiciones promedio</li>
    </ul>
  </div>
  <div class="card">
    <h3>Índice NSE</h3>
    <ul>
      <li><strong>Modelo propio STRTGY</strong> - Componentes principales</li>
      <li><strong>Variables:</strong> Educación, vivienda, bienes, economía</li>
      <li><strong>Clasificación:</strong> AMAI (AB, C+, C, D+, DE)</li>
    </ul>
  </div>
</div>

### Cálculos Clave

<div class="card">
  <h3>Indicadores por Buffer</h3>
  <ul>
    <li><strong>Población total:</strong> Suma ponderada de AGEBs intersectados por buffer</li>
    <li><strong>NSE promedio:</strong> Media ponderada por población</li>
    <li><strong>Densidad:</strong> Habitantes / área km² del buffer</li>
    <li><strong>Distribución NSE:</strong> % de población en cada nivel</li>
  </ul>
</div>

<div class="card">
  <h3>Análisis de Brechas</h3>
  <ul>
    <li><strong>Densidad esperada:</strong> Benchmarks por población y NSE</li>
    <li><strong>Densidad observada:</strong> Establecimientos DENUE / población</li>
    <li><strong>Gap:</strong> (Esperada - Observada) / Esperada</li>
    <li><strong>Interpretación:</strong> Gap > 0 = oportunidad, Gap < 0 = saturación</li>
  </ul>
</div>

---

## 🔄 Comandos de Regeneración

### Regenerar Capas QGIS

```bash
# Para proyecto específico
python scripts/paragon_qgis_all_layers.py --project lienzo_charro

# Para todos los proyectos Paragon
python scripts/paragon_qgis_all_layers.py --all

# Incluir isócronas (si disponibles)
python scripts/paragon_qgis_all_layers.py --project lienzo_charro --include-isochrones
```

### Regenerar Mapas de Alta Calidad

```bash
# Mapas PNG 300 DPI para presentación
python scripts/paragon_qgis_map_images.py --project lienzo_charro --dpi 300

# Mapas de alta resolución para pósters
python scripts/paragon_qgis_map_images.py --project lienzo_charro --dpi 600

# Todos los proyectos
python scripts/paragon_qgis_map_images.py --all --dpi 300
```

---

## 📋 Diccionario de Datos

### Buffers de Análisis (02)
- `radio_m`: Radio del buffer en metros
- `radio_label`: Etiqueta legible (500m, 1km, etc.)
- `area_km2`: Área del buffer en km²

### AGEBs NSE (03)
- `CVEGEO`: Clave geoestadística del AGEB
- `nse_index`: Índice NSE (0-100)
- `nse_nivel`: Nivel NSE (AB, C+, C, D+, DE)
- `poblacion_total`: Población total
- `densidad_pob_km2`: Densidad de población

### DENUE Completo (09)
- `nom_estab`: Nombre del establecimiento
- `codigo_act`: Código SCIAN de actividad
- `nombre_act`: Nombre de la actividad económica
- `per_ocu`: Personal ocupado

### Indicadores por Buffer (06)
- `poblacion_total`: Población en el buffer
- `nse_index`: NSE promedio ponderado
- `nse_share_*`: Distribución por nivel NSE
- `establecimientos_total`: Total DENUE

---

## 🔧 Especificaciones Técnicas

<div class="card">
  <h3>Sistemas de Coordenadas</h3>
  <ul>
    <li><strong>Almacenamiento:</strong> EPSG:4326 (WGS84) - todas las capas</li>
    <li><strong>Análisis:</strong> EPSG:6372 (México oficial) - cálculos de área/distancia</li>
    <li><strong>Visualización web:</strong> EPSG:3857 (Web Mercator)</li>
  </ul>
</div>

<div class="card">
  <h3>Formatos y Herramientas</h3>
  <ul>
    <li><strong>GeoJSON:</strong> Formato de intercambio (QGIS 3.x compatible)</li>
    <li><strong>Encoding:</strong> UTF-8</li>
    <li><strong>Generado con:</strong> GeoPandas 0.14+, QGIS 3.28+</li>
    <li><strong>Python:</strong> 3.10+</li>
  </ul>
</div>

---

## 📞 Contacto

<div class="card">
  <h3>STRTGY AI Geointelligence</h3>
  <p>Para preguntas sobre los datos, metodología o personalización de análisis:</p>
  <p><strong>Equipo de Geointeligencia</strong></p>
  <p>Paragon Real Estate - Proyecto Lienzo Charro</p>
</div>

---

<div class="note">
  <strong>Versión del reporte:</strong> 1.0 | <strong>Fecha de generación:</strong> Diciembre 2024 | <strong>Framework:</strong> Observable Framework
</div>

