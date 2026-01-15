# Análisis de Demanda y Nivel Socioeconómico

```js
import {BaseMap, ParagonLayerPresets} from "./components/BaseMap.js";
import {NSERadarChart} from "./components/RadarChart.js";
import {processIndicadoresBuffer, processAGEBsConDistancia, processNSEComponentes} from "./data/loaders.js";
import {InsightCard, MetricCard} from "./components/InsightCard.js";
import {NSELegend, IndexGradientLegend} from "./components/LegendBox.js";
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

// Cargar datos
const narrative = await FileAttachment("./data/narrative.json").json();
const sitio = await FileAttachment("./data/layers/01_lienzo_charro_sitio_terreno.geojson").json();
const buffers = await FileAttachment("./data/layers/02_lienzo_charro_buffers_analisis.geojson").json();
const agebs = await FileAttachment("./data/layers/03_lienzo_charro_agebs_nse.geojson").json();

// Cargar y procesar datos adicionales
const indicadores_raw = await FileAttachment("./data/layers/06_lienzo_charro_indicadores_buffer.geojson").json();
const nse_componentes_raw = await FileAttachment("./data/layers/12_lienzo_charro_nse_componentes.geojson").json();

const indicadores = processIndicadoresBuffer(indicadores_raw);
const agebs_data = processAGEBsConDistancia(agebs);
const nse_componentes = processNSEComponentes(nse_componentes_raw);
```

---

## 📊 Métricas Clave de NSE

<div class="grid grid-cols-4">

```js
display(MetricCard({
  label: "NSE Índice (1km)",
  value: narrative.nse_analysis.indice_1km.toFixed(1),
  subtitle: `Tier: ${narrative.nse_analysis.tier_dominante}`,
  color: "#3B82F6"
}));
```

```js
display(MetricCard({
  label: "Share NSE C",
  value: `${narrative.nse_analysis.share_c_1km.toFixed(0)}%`,
  subtitle: "Dominante en 1km",
  color: "#FBBF24"
}));
```

```js
display(MetricCard({
  label: "Población 1km",
  value: narrative.demographics.poblacion_1km.toLocaleString(),
  subtitle: `Densidad: ${narrative.demographics.densidad_1km}/km²`,
  color: "#10B981"
}));
```

```js
display(MetricCard({
  label: "Jóvenes 15-29",
  value: narrative.demographics.poblacion_15_29_1km.toLocaleString(),
  subtitle: `${Math.round((narrative.demographics.poblacion_15_29_1km / narrative.demographics.poblacion_1km) * 100)}% del total`,
  color: "#8B5CF6"
}));
```

</div>

---

## 🎯 Interpretación del NSE

```js
display(InsightCard({
  titulo: "Perfil Socioeconómico",
  descripcion: narrative.nse_analysis.interpretacion,
  tipo: "info"
}));
```

---

## 📈 Gradiente NSE por Distancia al Sitio

```js
{
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 450,
    marginLeft: 60,
    marginBottom: 60,
    color: {legend: true, scheme: "RdYlGn", domain: ["D/E", "D+", "C", "C+", "AB"]},
    x: {label: "Distancia al sitio (km) →", grid: true},
    y: {label: "↑ Índice NSE", domain: [50, 70], grid: true},
    marks: [
      Plot.ruleY([60.87], {stroke: "#DC2626", strokeWidth: 2, strokeDasharray: "4,4"}),
      Plot.text([{x: 0.1, y: 61.5, text: `NSE Sitio: ${narrative.nse_analysis.indice_1km}`}], {
        fill: "#DC2626",
        fontWeight: "600",
        fontSize: 12
      }),
      Plot.dot(agebs_data, {
        x: d => d.distancia_sitio_m / 1000,
        y: "nse_index",
        fill: "nse_nivel",
        r: d => Math.sqrt(d.poblacion_total) / 40,
        tip: true,
        title: d => `AGEB: ${d.CVEGEO}\nNSE: ${d.nse_index?.toFixed(1)} (${d.nse_nivel})\nPoblación: ${d.poblacion_total}\nDistancia: ${(d.distancia_sitio_m / 1000).toFixed(2)} km`
      }),
      Plot.linearRegressionY(agebs_data, {
        x: d => d.distancia_sitio_m / 1000,
        y: "nse_index",
        stroke: "#2563EB",
        strokeWidth: 2,
        strokeDasharray: "3,3"
      })
    ]
  });
  
  display(chart);
}
```

<div class="note">
**💡 Insight:** El gráfico muestra la distribución de AGEBs por distancia al sitio. El tamaño de cada punto representa la población. La línea punteada azul muestra la tendencia general del NSE a medida que nos alejamos del sitio.
</div>

---

## 🌐 Componentes del NSE: Radar Chart

<div class="grid grid-cols-2">

<div>

```js
{
  if (nse_componentes) {
    display(NSERadarChart(nse_componentes.componentes, {width: 420, height: 420}));
  } else {
    display(html`<p>Componentes NSE no disponibles</p>`);
  }
}
```

</div>

<div>

### Análisis por Componente

**🎓 Educación: ${narrative.nse_analysis.componentes.educacion.toFixed(1)}**
- ${narrative.nse_analysis.componentes.educacion < 50 ? "⚠️ Por debajo del promedio nacional" : "✓ Nivel aceptable"}

**🏠 Vivienda: ${narrative.nse_analysis.componentes.vivienda.toFixed(1)}**
- ${narrative.nse_analysis.componentes.vivienda < 50 ? "⚠️ Calidad de vivienda limitada" : "✓ Nivel aceptable"}

**💰 Bienes: ${narrative.nse_analysis.componentes.bienes.toFixed(1)}**
- ${narrative.nse_analysis.componentes.bienes > 70 ? "✓ Alta posesión de activos" : "→ Nivel medio"}

**📊 Económico: ${narrative.nse_analysis.componentes.economico.toFixed(1)}**
- ${narrative.nse_analysis.componentes.economico > 70 ? "✓ Buena capacidad de consumo" : "→ Nivel medio"}

</div>

</div>

---

## 📊 Distribución de Población por Nivel NSE

```js
{
  const nseDistrib = d3.rollup(
    agebs_data,
    v => d3.sum(v, d => d.poblacion_total),
    d => d.nse_nivel
  );
  
  const nseArray = Array.from(nseDistrib, ([nivel, poblacion]) => ({nivel, poblacion}))
    .sort((a, b) => {
      const orden = ["AB", "C+", "C", "D+", "D/E"];
      return orden.indexOf(a.nivel) - orden.indexOf(b.nivel);
    });
  
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 400,
    marginLeft: 80,
    x: {label: "Población →", grid: true},
    y: {label: null},
    color: {
      domain: ["AB", "C+", "C", "D+", "D/E"],
      range: ["#059669", "#10B981", "#FBBF24", "#F59E0B", "#EF4444"]
    },
    marks: [
      Plot.barX(nseArray, {
        y: "nivel",
        x: "poblacion",
        fill: "nivel",
        sort: {y: null}
      }),
      Plot.text(nseArray, {
        y: "nivel",
        x: "poblacion",
        text: d => `${d.poblacion.toLocaleString()} (${((d.poblacion / d3.sum(nseArray, d => d.poblacion)) * 100).toFixed(1)}%)`,
        dx: 10,
        textAnchor: "start",
        fill: "#1F2937",
        fontWeight: "600"
      })
    ]
  });
  
  display(chart);
}
```

---

## 📍 NSE por Radio de Análisis

```js
{
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 350,
    marginLeft: 100,
    x: {label: "NSE Índice →", domain: [58, 62]},
    y: {label: null},
    marks: [
      Plot.barX(indicadores, {
        y: "radio_display",
        x: "nse_index",
        fill: d => d.nse_index > 61 ? "#10B981" : "#3B82F6",
        sort: {y: "x"}
      }),
      Plot.text(indicadores, {
        y: "radio_display",
        x: "nse_index",
        text: d => d.nse_index.toFixed(2),
        dx: 15,
        fontWeight: "600",
        fill: "#1F2937"
      }),
      Plot.ruleX([60.87], {stroke: "#DC2626", strokeDasharray: "4,4"})
    ]
  });
  
  display(chart);
}
```

---

## 🗺️ Mapa: Coropleta NSE por AGEB

```js
{
  const mapa = BaseMap({
    center: [sitio.features[0].geometry.coordinates[0], sitio.features[0].geometry.coordinates[1]],
    zoom: 11.5,
    height: 600,
    layers: [
      ParagonLayerPresets.agebs_gradient(agebs),
      ParagonLayerPresets.buffers(buffers),
      ParagonLayerPresets.sitio(sitio)
    ]
  });
  
  display(mapa);
}
```

```js
{
  const legend = IndexGradientLegend({
    title: "Índice NSE por AGEB",
    minLabel: "Bajo (50)",
    maxLabel: "Alto (70)",
    colors: ["#EF4444", "#FBBF24", "#10B981"]
  });
  display(legend);
}
```

<div class="note">
**📍 Nota:** Los círculos punteados representan los radios de análisis (250m, 500m, 1km), y el punto rojo marca la ubicación exacta del sitio.
</div>

---

## 📋 Tabla Detallada por Radio

```js
{
  const table = Inputs.table(indicadores, {
    columns: ["radio_display", "nse_index", "poblacion_total", "densidad_pob", "area_km2", "nse_dominante"],
    header: {
      radio_display: "Radio",
      nse_index: "NSE Índice",
      poblacion_total: "Población",
      densidad_pob: "Densidad (hab/km²)",
      area_km2: "Área (km²)",
      nse_dominante: "NSE Dominante"
    },
    format: {
      nse_index: d => d.toFixed(2),
      poblacion_total: d => d.toLocaleString(),
      densidad_pob: d => d.toLocaleString(),
      area_km2: d => d.toFixed(2)
    },
    width: {
      radio_display: 120,
      nse_index: 100,
      poblacion_total: 120,
      densidad_pob: 150,
      area_km2: 100,
      nse_dominante: 140
    }
  });
  
  display(table);
}
```

---

## 🔗 Navegación

<div class="grid grid-cols-2">
  <a href="./" class="card">← Volver al Dashboard</a>
  <a href="./accesibilidad" class="card">Siguiente: Accesibilidad →</a>
</div>
