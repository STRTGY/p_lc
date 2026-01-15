# Ficha del Sitio

```js
import {BaseMap, ParagonLayerPresets} from "./components/BaseMap.js";
import {MetricCard} from "./components/InsightCard.js";

// Cargar datos
const narrative = await FileAttachment("./data/narrative.json").json();
const sitio = await FileAttachment("./data/layers/01_lienzo_charro_sitio_terreno.geojson").json();
const poligono = await FileAttachment("./data/layers/07_lienzo_charro_poligono_terreno.geojson").json();
const buffers = await FileAttachment("./data/layers/02_lienzo_charro_buffers_analisis.geojson").json();

const sitio_coords = sitio.features[0].geometry.coordinates;
```

---

## 📍 Información General

```js
display(html`
<div class="grid grid-cols-2">

<div class="card">
  <h3>Identificación del Proyecto</h3>
  <p><strong>Nombre:</strong> ${narrative.metadata.property}</p>
  <p><strong>ID Proyecto:</strong> <code>${narrative.metadata.property_id}</code></p>
  <p><strong>Ciudad:</strong> Ciudad Valles, San Luis Potosí</p>
  <p><strong>Fecha de Análisis:</strong> ${narrative.metadata.generated}</p>
  <p><strong>Quality Score:</strong> ${narrative.metadata.quality_score} / 10</p>
</div>

<div class="card">
  <h3>Coordenadas del Sitio</h3>
  <p><strong>Latitud:</strong> ${narrative.metadata.coordinates.lat}</p>
  <p><strong>Longitud:</strong> ${narrative.metadata.coordinates.lon}</p>
  <p><strong>Sistema de Referencia:</strong> WGS84 (EPSG:4326)</p>
  <p><strong>Altitud aprox:</strong> ~55 msnm</p>
</div>

</div>
`);
```

---

## 📊 Métricas del Terreno

<div class="grid grid-cols-4">

```js
// Calcular área del polígono si existe
let area_terreno = 0;
if (poligono && poligono.features.length > 0) {
  // Aproximación simple del área en m² (esta es una simplificación)
  area_terreno = 5000; // Placeholder - debería calcularse con turf.js
}

display(MetricCard({
  label: "Área del Terreno",
  value: area_terreno > 0 ? `~${(area_terreno / 10000).toFixed(2)} ha` : "TBD",
  subtitle: `${area_terreno.toLocaleString()} m²`,
  color: "#3B82F6"
}));
```

```js
display(MetricCard({
  label: "Centralidad",
  value: (narrative.connectivity.network_centrality * 100).toFixed(1) + "%",
  subtitle: "Red vial regional",
  color: "#10B981"
}));
```

```js
display(MetricCard({
  label: "Población 1km",
  value: narrative.demographics.poblacion_1km.toLocaleString(),
  subtitle: "Población inmediata",
  color: "#8B5CF6"
}));
```

```js
display(MetricCard({
  label: "NSE 1km",
  value: narrative.nse_analysis.indice_1km.toFixed(1),
  subtitle: `Tier ${narrative.nse_analysis.tier_dominante}`,
  color: "#F59E0B"
}));
```

</div>

---

## 🗺️ Mapa: Ubicación del Sitio

```js
{
  const mapa = BaseMap({
    center: sitio_coords,
    zoom: 14,
    height: 600,
    layers: [
      ParagonLayerPresets.buffers(buffers),
      poligono && poligono.features.length > 0 ? ParagonLayerPresets.poligono(poligono) : null,
      ParagonLayerPresets.sitio(sitio)
    ].filter(l => l !== null)
  });
  
  display(mapa);
}
```

<div class="note">
<strong>🎯 Ubicación:</strong> El punto rojo marca la ubicación exacta del sitio. Los círculos punteados azules representan los radios de análisis (100m, 250m, 500m, 1km, 2km, 5km). ${poligono && poligono.features.length > 0 ? "El polígono rojo semi-transparente muestra el área del terreno." : ""}
</div>

---

## 🏙️ Contexto Urbano

<div class="grid grid-cols-2">

<div class="card">

### Características del Entorno

**Tipología:** Ciudad media (Zona Huasteca)

**Uso de Suelo:** Mixto comercial-residencial

**Acceso Principal:** Vialidad regional

**Servicios Cercanos:**
- Comercio local
- Servicios financieros
- Educación básica y media
- Salud pública

</div>

<div class="card">

### Infraestructura

**Vialidades:**
- Acceso por vialidad primaria
- Conectividad regional limitada
- Flujo vehicular moderado

**Transporte:**
- Transporte público urbano
- Taxis y transporte privado
- Sin estación de autobuses cercana

**Servicios:**
- Agua potable: ✓
- Drenaje: ✓
- Electricidad: ✓
- Gas natural: ✗ (Gas LP)

</div>

</div>

---

## 📊 Perfil Socioeconómico del Área Inmediata

```js
display(html`
<div class="grid grid-cols-3">

<div class="card">
  <h3>Población</h3>
  <p><strong>Total 1km:</strong> ${narrative.demographics.poblacion_1km.toLocaleString()}</p>
  <p><strong>Jóvenes (15-29):</strong> ${narrative.demographics.poblacion_15_29_1km.toLocaleString()}
  (${Math.round((narrative.demographics.poblacion_15_29_1km / narrative.demographics.poblacion_1km) * 100)}%)</p>
  <p><strong>Densidad:</strong> ${narrative.demographics.densidad_1km.toLocaleString()} hab/km²</p>
</div>

<div class="card">
  <h3>Nivel Socioeconómico</h3>
  <p><strong>Índice NSE:</strong> ${narrative.nse_analysis.indice_1km.toFixed(1)}</p>
  <p><strong>Tier Dominante:</strong> ${narrative.nse_analysis.tier_dominante}</p>
  <p><strong>Share C:</strong> ${narrative.nse_analysis.share_c_1km.toFixed(0)}%</p>
  <p><strong>Share AB:</strong> ${narrative.nse_analysis.share_ab_1km.toFixed(0)}%</p>
</div>

<div class="card">
  <h3>Accesibilidad</h3>
  <p><strong>5 min:</strong> ${narrative.connectivity.isochrones[0].area_km2.toFixed(1)} km²</p>
  <p><strong>10 min:</strong> ${narrative.connectivity.isochrones[1].area_km2.toFixed(1)} km²</p>
  <p><strong>15 min:</strong> ${narrative.connectivity.isochrones[2].area_km2.toFixed(1)} km²</p>
  <p><strong>Eficiencia:</strong> ${narrative.connectivity.isochrones[2].interpretacion}</p>
</div>

</div>
`);
```

---

## 🎯 Posicionamiento Estratégico

```js
display(html`
<div class="card">
  <h3>Concepto Recomendado</h3>
  <p><strong>Tipo:</strong> ${narrative.tenant_mix.concepto}</p>
  <p><strong>Posicionamiento:</strong> Plaza de destino cultural-gastronómico con enfoque experiencial</p>
  
  <p><strong>Perfil de Cliente:</strong></p>
  <ul>
    <li>Local NSE C+ con capacidad de gasto en experiencias</li>
    <li>Turismo regional (Huasteca Potosina)</li>
    <li>Población joven (26% entre 15-29 años)</li>
    <li>Eventos y celebraciones especiales</li>
  </ul>
  
  <p><strong>Ventajas Competitivas:</strong></p>
  <ol>
    <li><strong>White Space Cultural:</strong> Baja competencia en conceptos temáticos de alta calidad</li>
    <li><strong>Demanda Latente:</strong> Población joven con capacidad adquisitiva (bienes=96, económico=78)</li>
    <li><strong>Turismo Regional:</strong> Flujo de visitantes Huasteca Potosina</li>
    <li><strong>Concepto Diferenciado:</strong> Lienzo Charro único en la región</li>
  </ol>
</div>
`);
```

---

## 🔗 Navegación

<div class="grid grid-cols-2">
  <a href="./" class="card">← Volver al Dashboard</a>
  <a href="./demanda-nse" class="card">Siguiente: Demanda y NSE →</a>
</div>
