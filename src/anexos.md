---
title: Anexos y Descargas
---

# Anexos y Descargas

```js
// Cargar archivos GeoJSON
const sitio = FileAttachment("./data/layers/01_lienzo_charro_sitio_terreno.geojson");
const buffers = FileAttachment("./data/layers/02_lienzo_charro_buffers_analisis.geojson");
const agebs = FileAttachment("./data/layers/03_lienzo_charro_agebs_nse.geojson");
const indicadores = FileAttachment("./data/layers/06_lienzo_charro_indicadores_buffer.geojson");
const poligono = FileAttachment("./data/layers/07_lienzo_charro_poligono_terreno.geojson");
const isocronas = FileAttachment("./data/layers/08_lienzo_charro_isocronas_here.geojson");
const denue = FileAttachment("./data/layers/09_lienzo_charro_denue_completo.geojson");
const heatmap = FileAttachment("./data/layers/10_lienzo_charro_heatmap_competencia.geojson");
const nse_comp = FileAttachment("./data/layers/12_lienzo_charro_nse_componentes.geojson");
```

Documentación técnica, capas GeoJSON, metodología y datos del análisis.

---

## 📥 Descargas de Capas QGIS

<div class="card">
  <h2>Capas Geoestadísticas Disponibles</h2>
  <p>Todas las capas están en formato <strong>GeoJSON</strong> para uso en QGIS 3.28+, ArcGIS, o cualquier herramienta GIS.</p>
</div>

### Capas Principales

<div class="grid grid-cols-3">

<div class="card">

#### 📍 Sitio del Terreno

```js
html`<a href="${sitio.href}" download="01_sitio_terreno.geojson" class="download-btn" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### ⭕ Buffers de Análisis

```js
html`<a href="${buffers.href}" download="02_buffers_analisis.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### 🗺️ AGEBs con NSE

```js
html`<a href="${agebs.href}" download="03_agebs_nse.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### 📊 Indicadores por Buffer

```js
html`<a href="${indicadores.href}" download="06_indicadores_buffer.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### 🔷 Polígono del Terreno

```js
html`<a href="${poligono.href}" download="07_poligono_terreno.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### 🚗 Isócronas HERE

```js
html`<a href="${isocronas.href}" download="08_isocronas_here.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### 🏪 DENUE Completo

```js
html`<a href="${denue.href}" download="09_denue_completo.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### 🔥 Heatmap Competencia

```js
html`<a href="${heatmap.href}" download="10_heatmap_competencia.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

<div class="card">

#### 📈 NSE Componentes

```js
html`<a href="${nse_comp.href}" download="12_nse_componentes.geojson" style="display:block;text-align:center;padding:0.6rem;background:#3B82F6;color:white;border-radius:6px;text-decoration:none;font-weight:500;">⬇️ Descargar</a>`
```

</div>

</div>

---

## 🗺️ Cómo Usar en QGIS

<div class="grid grid-cols-2">

<div class="card">

### 1. Cargar Capas

1. Abrir **QGIS 3.28** o superior
2. Ir a **Layer → Add Layer → Add Vector Layer**
3. Seleccionar los archivos `.geojson` descargados
4. Las capas se cargarán con geometrías y atributos

</div>

<div class="card">

### 2. Orden Recomendado

De abajo hacia arriba en el panel de capas:

1. 🚗 Isócronas (fondo)
2. ⭕ Buffers de análisis
3. 🗺️ AGEBs NSE (coropleta)
4. 🔥 Heatmap competencia
5. 🏪 DENUE establecimientos
6. 🔷 Polígono del terreno
7. 📍 Punto del sitio (arriba)

</div>

</div>

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

## 🔄 Regeneración de Datos

<div class="note">
<strong>Para desarrolladores:</strong> Los datos pueden regenerarse ejecutando los pipelines de STRTGY Geointelligence. Contactar al equipo técnico para instrucciones específicas.
</div>

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

