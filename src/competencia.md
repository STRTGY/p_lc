# Análisis de Competencia

```js
import {BaseMap, ParagonLayerPresets} from "./components/BaseMap.js";
import {processDENUEAgrupado, calcularDensidadRadial} from "./data/loaders.js";
import {InsightCard, MetricCard} from "./components/InsightCard.js";
import {CompetitionDensityLegend} from "./components/LegendBox.js";
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

// Cargar datos
const narrative = await FileAttachment("./data/narrative.json").json();
const sitio = await FileAttachment("./data/layers/01_lienzo_charro_sitio_terreno.geojson").json();
const buffers = await FileAttachment("./data/layers/02_lienzo_charro_buffers_analisis.geojson").json();
const denue_json = await FileAttachment("./data/layers/09_lienzo_charro_denue_completo.geojson").json();
const heatmap = await FileAttachment("./data/layers/10_lienzo_charro_heatmap_competencia.geojson").json();

const denue_procesado = processDENUEAgrupado(denue_json);
const sitio_coords = sitio.features[0].geometry.coordinates;
const densidad_radial = calcularDensidadRadial(denue_json.features, sitio_coords);
```

---

## 📊 Métricas de Competencia

<div class="grid grid-cols-4">

```js
display(MetricCard({
  label: "Total Establecimientos",
  value: denue_procesado.total.toLocaleString(),
  subtitle: "En área de análisis",
  color: "#8B5CF6"
}));
```

```js
display(MetricCard({
  label: "Sectores SCIAN",
  value: denue_procesado.bySector.length,
  subtitle: "Diversidad económica",
  color: "#3B82F6"
}));
```

```js
display(MetricCard({
  label: "Densidad 1km",
  value: densidad_radial[3].densidad,
  subtitle: "Estab./km²",
  color: "#F59E0B"
}));
```

```js
display(MetricCard({
  label: "Actividad Principal",
  value: denue_procesado.byActividad[0].actividad.substring(0, 20) + "...",
  subtitle: `${denue_procesado.byActividad[0].count} establecimientos`,
  color: "#10B981"
}));
```

</div>

---

## 💡 Insight Estratégico

```js
display(InsightCard({
  titulo: "Análisis de Saturación de Mercado",
  descripcion: `El área de análisis cuenta con ${denue_procesado.total} establecimientos registrados en DENUE, distribuidos en ${denue_procesado.bySector.length} sectores económicos diferentes. La densidad de establecimientos ${densidad_radial[3].densidad > 500 ? 'alta' : 'moderada'} en el radio de 1km sugiere ${densidad_radial[3].densidad > 500 ? 'un mercado maduro con alta competencia' : 'oportunidades de crecimiento en categorías específicas'}.`,
  tipo: densidad_radial[3].densidad > 500 ? "warning" : "info"
}));
```

---

## 📊 Top 15 Actividades Económicas (DENUE)

```js
{
  const top15 = denue_procesado.byActividad.slice(0, 15);
  
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 500,
    marginLeft: 320,
    marginRight: 60,
    x: {label: "Número de Establecimientos →", grid: true},
    y: {label: null},
    marks: [
      Plot.ruleX([50, 100], {stroke: "#E5E7EB", strokeDasharray: "2,2"}),
      Plot.barX(top15, {
        y: d => d.actividad.substring(0, 55),
        x: "count",
        fill: d => {
          if (d.count > 100) return "#EF4444";
          if (d.count > 50) return "#F59E0B";
          return "#10B981";
        },
        sort: {y: "-x"}
      }),
      Plot.text(top15, {
        y: d => d.actividad.substring(0, 55),
        x: "count",
        text: d => d.count,
        dx: 15,
        fill: "#1F2937",
        fontWeight: "600",
        fontSize: 11
      })
    ]
  });
  
  display(chart);
}
```

<div class="note">
**📈 Interpretación:** Las actividades más frecuentes indican el perfil económico del área. Alta concentración en ciertas categorías puede señalar saturación, mientras que baja presencia puede indicar oportunidades de white space.

**Código de colores:**
- 🟢 Verde: < 50 establecimientos (oportunidad)
- 🟡 Amarillo: 50-100 establecimientos (mercado competido)
- 🔴 Rojo: > 100 establecimientos (alta saturación)
</div>

---

## 📊 Distribución por Tamaño de Empresa

```js
{
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 350,
    x: {label: "Personal Ocupado →"},
    y: {label: "↑ Número de Establecimientos", grid: true},
    marks: [
      Plot.barY(denue_procesado.byTamano, {
        x: d => d.tamano,
        y: d => d.count,
        fill: "#8B5CF6"
      }),
      Plot.text(denue_procesado.byTamano, {
        x: d => d.tamano,
        y: d => d.count,
        text: d => d.count,
        dy: -8,
        fontWeight: "600",
        fill: "#1F2937"
      })
    ]
  });
  
  display(chart);
}
```

---

## 📊 Densidad Radial de Establecimientos

```js
{
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 400,
    x: {label: "Radio →"},
    y: {label: "↑ Densidad (Establecimientos / km²)", grid: true},
    marks: [
      Plot.barY(densidad_radial, {
        x: "radio",
        y: "densidad",
        fill: "#8B5CF6"
      }),
      Plot.line(densidad_radial, {
        x: "radio",
        y: "densidad",
        stroke: "#1F2937",
        strokeWidth: 2,
        marker: "circle"
      }),
      Plot.text(densidad_radial, {
        x: "radio",
        y: "densidad",
        text: d => d.densidad,
        dy: -12,
        fontWeight: "600",
        fill: "#1F2937"
      })
    ]
  });
  
  display(chart);
}
```

<div class="note">
**🎯 Análisis de Densidad:** La densidad de establecimientos por km² nos indica qué tan competido está el espacio comercial en cada radio. Una densidad decreciente sugiere menor competencia conforme nos alejamos del sitio.
</div>

---

## 🗺️ Mapa: Establecimientos DENUE

```js
{
  const mapa = BaseMap({
    center: sitio_coords,
    zoom: 13,
    height: 600,
    layers: [
      ParagonLayerPresets.denue(denue_json),
      ParagonLayerPresets.buffers(buffers),
      ParagonLayerPresets.sitio(sitio)
    ]
  });
  
  display(mapa);
}
```

<div class="note">
**💼 Establecimientos DENUE:** Cada punto morado representa un establecimiento económico registrado en el Directorio Estadístico Nacional de Unidades Económicas (DENUE) del INEGI. Haz clic en cualquier punto para ver detalles del establecimiento.
</div>

---

## 🔥 Mapa: Heatmap de Competencia

```js
{
  const mapa = BaseMap({
    center: sitio_coords,
    zoom: 12.5,
    height: 600,
    layers: [
      ParagonLayerPresets.heatmap_competencia(heatmap),
      ParagonLayerPresets.buffers(buffers),
      ParagonLayerPresets.sitio(sitio)
    ]
  });
  
  display(mapa);
}
```

```js
display(CompetitionDensityLegend());
```

<div class="note">
**💡 Interpretación:** Las áreas verdes (baja densidad) representan "white spaces" con menor competencia directa, mientras que las rojas indican saturación de mercado. Busca oportunidades en zonas amarillas o verdes cerca de vialidades principales.
</div>

---

## 🔗 Navegación

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">

```js
html`<a href="./accesibilidad" style="text-decoration: none;">
  <div class="card" style="text-align: center; padding: 1.5rem;">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">←</div>
    <div style="font-weight: 600;">Accesibilidad</div>
  </div>
</a>`
```

```js
html`<a href="./vocacion" style="text-decoration: none;">
  <div class="card" style="text-align: center; padding: 1.5rem;">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">→</div>
    <div style="font-weight: 600;">Vocación y Tenant Mix</div>
  </div>
</a>`
```

</div>

