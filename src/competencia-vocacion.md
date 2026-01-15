# Análisis de Competencia y Vocación

> **Nota:** Esta página ha sido dividida en dos secciones independientes para mejor navegación:
> - [Análisis de Competencia](./competencia) - DENUE, mapas, densidad
> - [Vocación y Tenant Mix](./vocacion) - Scores, tenant mix, roadmap

---

# ⚠️ Página Legada - Ver Nuevas Secciones

Esta página se mantiene por compatibilidad pero se recomienda usar las nuevas páginas individuales que ofrecen mejor experiencia de usuario y navegación más clara.

---

```js
import {BaseMap, ParagonLayerPresets} from "./components/BaseMap.js";
import {processDENUEAgrupado, calcularDensidadRadial} from "./data/loaders.js";
import {InsightCard, MetricCard, RiskMatrix} from "./components/InsightCard.js";
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
  label: "Score Vocación",
  value: narrative.vocation_analysis.average_score.toFixed(2),
  subtitle: `Ranking: #${narrative.vocation_analysis.ranking_among_properties} de 5`,
  color: narrative.vocation_analysis.average_score > 4 ? "#10B981" : "#F59E0B"
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

</div>

---

## 🎯 Top 10 Vocaciones del Sitio

```js
{
  const top10 = narrative.vocation_analysis.top_10_industries;
  
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 450,
    marginLeft: 250,
    marginRight: 60,
    x: {domain: [0, 6], label: "Score de Vocación →", grid: true},
    y: {label: null},
    marks: [
      Plot.ruleX([4, 5], {stroke: "#E5E7EB", strokeWidth: 1}),
      Plot.barX(top10, {
        y: "nombre",
        x: "score",
        fill: d => {
          if (d.score > 5.2) return "#10B981";
          if (d.score > 4.8) return "#3B82F6";
          if (d.score > 4.4) return "#F59E0B";
          return "#EF4444";
        },
        sort: {y: "-x"}
      }),
      Plot.text(top10, {
        y: "nombre",
        x: "score",
        text: d => d.score.toFixed(2),
        dx: 20,
        fill: "#1F2937",
        fontWeight: "600",
        fontSize: 12
      }),
      Plot.text(top10, {
        y: "nombre",
        x: 0,
        text: d => `#${d.rank}`,
        dx: -10,
        textAnchor: "end",
        fill: "#6B7280",
        fontWeight: "600",
        fontSize: 11
      })
    ]
  });
  
  display(chart);
}
```

---

## 🍽️ Análisis: Restaurante Gourmet

```js
display(InsightCard({
  titulo: `Restaurante Gourmet - Score: ${narrative.vocation_analysis.restaurante_gourmet_analysis.score}`,
  descripcion: `**Drivers:** ${narrative.vocation_analysis.restaurante_gourmet_analysis.drivers}\n\n**Limitantes:** ${narrative.vocation_analysis.restaurante_gourmet_analysis.limitantes}\n\n**Estrategia:** ${narrative.vocation_analysis.restaurante_gourmet_analysis.estrategia}`,
  tipo: "info"
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

## 📊 Tenant Mix Propuesto

```js
{
  const tenantMix = narrative.tenant_mix.propuesta;
  
  const table = Inputs.table(tenantMix, {
    columns: ["giro", "gla_m2", "rol", "cantidad", "descripcion"],
    header: {
      giro: "Giro / Concepto",
      gla_m2: "GLA (m²)",
      rol: "Rol en Mix",
      cantidad: "Cant.",
      descripcion: "Descripción"
    },
    width: {
      giro: 240,
      gla_m2: 100,
      rol: 160,
      cantidad: 70,
      descripcion: 300
    }
  });
  
  display(table);
}
```

**🎨 Diferenciadores del Concepto:**

${narrative.tenant_mix.diferenciacion.map(d => `- ${d}`).join('\n')}

---

## ⚠️ Matriz de Riesgos

```js
display(RiskMatrix(narrative.risks));
```

---

## 📅 Roadmap de Implementación

<div class="grid grid-cols-3">

<div class="card">

### Fase 0: ${narrative.roadmap.fase_0.nombre}
**${narrative.roadmap.fase_0.meses}**

${narrative.roadmap.fase_0.acciones.map(a => `- ${a}`).join('\n')}

</div>

<div class="card">

### Fase 1: ${narrative.roadmap.fase_1.nombre}
**${narrative.roadmap.fase_1.meses}**

${narrative.roadmap.fase_1.acciones.map(a => `- ${a}`).join('\n')}

**KPIs:**
${narrative.roadmap.fase_1.kpis.map(k => `- ${k}`).join('\n')}

</div>

<div class="card">

### Fase 2: ${narrative.roadmap.fase_2.nombre}
**${narrative.roadmap.fase_2.meses}**

${narrative.roadmap.fase_2.acciones.map(a => `- ${a}`).join('\n')}

</div>

</div>

---

## 🎯 Próximos Pasos (30 días)

```js
{
  const table = Inputs.table(narrative.next_steps_30_days, {
    columns: ["accion", "responsable", "entregable"],
    header: {
      accion: "Acción",
      responsable: "Responsable",
      entregable: "Entregable"
    },
    width: {
      accion: 300,
      responsable: 200,
      entregable: 300
    }
  });
  
  display(table);
}
```

---

## 🔗 Navegación

<div class="grid grid-cols-2">
  <a href="./accesibilidad" class="card">← Anterior: Accesibilidad</a>
  <a href="./" class="card">Volver al Dashboard →</a>
</div>
