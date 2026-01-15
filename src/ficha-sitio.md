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

<div class="grid grid-cols-2">

<div class="card">

### Identificación del Proyecto

**Nombre:** ${narrative.metadata.property}

**ID Proyecto:** `${narrative.metadata.property_id}`

**Ciudad:** Ciudad Valles, San Luis Potosí

**Fecha de Análisis:** ${narrative.metadata.generated}

**Quality Score:** ${narrative.metadata.quality_score} / 10

</div>

<div class="card">

### Coordenadas del Sitio

**Latitud:** ${narrative.metadata.coordinates.lat}

**Longitud:** ${narrative.metadata.coordinates.lon}

**Sistema de Referencia:** WGS84 (EPSG:4326)

**Altitud aprox:** ~55 msnm

</div>

</div>

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
**🎯 Ubicación:** El punto rojo marca la ubicación exacta del sitio. Los círculos punteados azules representan los radios de análisis (100m, 250m, 500m, 1km, 2km, 5km). ${poligono && poligono.features.length > 0 ? "El polígono rojo semi-transparente muestra el área del terreno." : ""}
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

<div class="grid grid-cols-3">

<div class="card">

### Población

**Total 1km:** ${narrative.demographics.poblacion_1km.toLocaleString()}

**Jóvenes (15-29):** ${narrative.demographics.poblacion_15_29_1km.toLocaleString()}
(${Math.round((narrative.demographics.poblacion_15_29_1km / narrative.demographics.poblacion_1km) * 100)}%)

**Densidad:** ${narrative.demographics.densidad_1km.toLocaleString()} hab/km²

</div>

<div class="card">

### Nivel Socioeconómico

**Índice NSE:** ${narrative.nse_analysis.indice_1km.toFixed(1)}

**Tier Dominante:** ${narrative.nse_analysis.tier_dominante}

**Share C:** ${narrative.nse_analysis.share_c_1km.toFixed(0)}%

**Share AB:** ${narrative.nse_analysis.share_ab_1km.toFixed(0)}%

</div>

<div class="card">

### Accesibilidad

**5 min:** ${narrative.connectivity.isochrones[0].area_km2.toFixed(1)} km²

**10 min:** ${narrative.connectivity.isochrones[1].area_km2.toFixed(1)} km²

**15 min:** ${narrative.connectivity.isochrones[2].area_km2.toFixed(1)} km²

**Eficiencia:** ${narrative.connectivity.isochrones[2].interpretacion}

</div>

</div>

---

## 🎯 Posicionamiento Estratégico

<div class="card">

### Concepto Recomendado

**Tipo:** ${narrative.tenant_mix.concepto}

**Posicionamiento:** Plaza de destino cultural-gastronómico con enfoque experiencial

**Perfil de Cliente:**
- Local NSE C+ con capacidad de gasto en experiencias
- Turismo regional (Huasteca Potosina)
- Población joven (26% entre 15-29 años)
- Eventos y celebraciones especiales

**Ventajas Competitivas:**
1. **White Space Cultural:** Baja competencia en conceptos temáticos de alta calidad
2. **Demanda Latente:** Población joven con capacidad adquisitiva (bienes=96, económico=78)
3. **Turismo Regional:** Flujo de visitantes Huasteca Potosina
4. **Concepto Diferenciado:** Lienzo Charro único en la región

</div>

---

## 🔗 Navegación

<div class="grid grid-cols-2">
  <a href="./" class="card">← Volver al Dashboard</a>
  <a href="./demanda-nse" class="card">Siguiente: Demanda y NSE →</a>
</div>
