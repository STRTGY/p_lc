---
toc: false
---

<div class="hero">
  <h1>Paragon | Lienzo Charro</h1>
  <h2>Análisis Geoespacial de Vocación para Tenant Mix Temático</h2>
  <p style="font-size: 18px; color: var(--theme-foreground-muted); max-width: 40em; margin: 2rem auto;">
    Ciudad Valles, San Luis Potosí
  </p>
</div>

```js
import {VerdictBadge, ROIIndicator, MetricCard, InsightCard} from "./components/InsightCard.js";
import {MetricCardWithTrend} from "./components/MetricCardWithTrend.js";
import {processIndicadoresBuffer} from "./data/loaders.js";
import * as Plot from "npm:@observablehq/plot";

// Cargar datos
const narrative = await FileAttachment("./data/narrative.json").json();
const indicadores_raw = await FileAttachment("./data/layers/06_lienzo_charro_indicadores_buffer.geojson").json();
const indicadores = processIndicadoresBuffer(indicadores_raw);
```

<!-- Veredicto y ROI -->

<div style="max-width: 960px; margin: 2rem auto; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">

```js
display(VerdictBadge({veredicto: narrative.executive_summary.veredicto, size: "large"}));
```

```js
display(ROIIndicator({
  rango: narrative.executive_summary.roi_estimado.rango,
  confianza: narrative.executive_summary.roi_estimado.confianza,
  horizonte: narrative.executive_summary.roi_estimado.horizonte
}));
```

</div>

<!-- Recomendación Principal -->

<div class="card" style="max-width: 960px; margin: 2rem auto; background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: white;">
  <h2 style="color: white; margin-top: 0;">💡 Recomendación Estratégica</h2>
  <p style="font-size: 18px; line-height: 1.6;">
    ${narrative.executive_summary.recomendacion_detalle}
  </p>
</div>

---

## 📊 KPIs Clave del Proyecto

<div class="grid grid-cols-4">

```js
display(MetricCard({
  label: "Población 1km",
  value: narrative.demographics.poblacion_1km.toLocaleString(),
  subtitle: `${narrative.demographics.poblacion_15_29_1km.toLocaleString()} jóvenes (15-29)`,
  color: "#3B82F6"
}));
```

```js
display(MetricCard({
  label: "NSE Promedio",
  value: narrative.nse_analysis.indice_1km.toFixed(1),
  subtitle: `Tier: ${narrative.nse_analysis.tier_dominante}`,
  color: "#10B981"
}));
```

```js
display(MetricCard({
  label: "Accesibilidad 15min",
  value: `${narrative.connectivity.isochrones[2].area_km2.toFixed(0)} km²`,
  subtitle: `Eficiencia: ${narrative.connectivity.isochrones[2].eficiencia}%`,
  color: narrative.connectivity.isochrones[2].eficiencia > 60 ? "#10B981" : "#F59E0B"
}));
```

```js
display(MetricCard({
  label: "Score Vocación",
  value: narrative.vocation_analysis.average_score.toFixed(2),
  subtitle: `Ranking: #${narrative.vocation_analysis.ranking_among_properties} de 5`,
  color: "#8B5CF6"
}));
```

</div>

<!-- Sparkline NSE por radio -->

```js
{
  const nseSparkline = Plot.plot({
    width: 200,
    height: 60,
    axis: null,
    margin: 5,
    marks: [
      Plot.line(indicadores, {
        x: "radio_m",
        y: "nse_index",
        stroke: "#2563EB",
        strokeWidth: 2
      }),
      Plot.dot(indicadores, {
        x: "radio_m",
        y: "nse_index",
        r: 3,
        fill: "#2563EB"
      })
    ]
  });
  
  const container = html`<div style="text-align: center; margin: 1rem auto;">
    <p style="font-size: 14px; color: #6B7280; margin-bottom: 0.5rem;">Tendencia NSE por Radio</p>
    ${nseSparkline}
  </div>`;
  
  display(container);
}
```

---

## ✨ Hallazgos Principales

```js
narrative.executive_summary.hallazgos.forEach(hallazgo => {
  display(InsightCard({
    titulo: hallazgo.titulo,
    descripcion: hallazgo.descripcion + (hallazgo.implicacion ? ` → ${hallazgo.implicacion}` : '') + (hallazgo.oportunidad ? ` ► ${hallazgo.oportunidad}` : ''),
    fuente: hallazgo.fuente,
    tipo: hallazgo.tipo || "info"
  }));
});
```

---

## 🎯 Top 5 Vocaciones Identificadas

<div class="card" style="max-width: 960px; margin: 2rem auto;">

```js
{
  const top5 = narrative.vocation_analysis.top_10_industries.slice(0, 5);
  
  const chart = Plot.plot({
    marginLeft: 200,
    marginRight: 60,
    height: 280,
    x: {domain: [0, 6], label: "Score →"},
    marks: [
      Plot.barX(top5, {
        y: "nombre",
        x: "score",
        fill: d => d.score > 5.2 ? "#10B981" : d.score > 4.8 ? "#3B82F6" : "#F59E0B",
        sort: {y: "-x"}
      }),
      Plot.text(top5, {
        y: "nombre",
        x: "score",
        text: d => d.score.toFixed(2),
        dx: 20,
        fill: "#1F2937",
        fontWeight: "600"
      }),
      Plot.ruleX([4, 5], {stroke: "#D1D5DB", strokeDasharray: "2,2"})
    ]
  });
  
  display(chart);
}
```

</div>

---

## 📱 Tenant Mix Propuesto

<div class="card" style="max-width: 960px; margin: 2rem auto;">

```js
{
  const tenantMix = narrative.tenant_mix.propuesta;
  
  const table = Inputs.table(tenantMix, {
    columns: ["giro", "gla_m2", "rol", "cantidad"],
    header: {
      giro: "Giro / Concepto",
      gla_m2: "GLA (m²)",
      rol: "Rol en Mix",
      cantidad: "Cant."
    },
    width: {
      giro: 300,
      gla_m2: 120,
      rol: 180,
      cantidad: 80
    }
  });
  
  display(table);
}
```

**Mix de Uso:**
- 🍽️ **Gastronomía**: ${narrative.tenant_mix.mix_porcentajes.gastronomia}%
- 🛍️ **Retail Artesanal**: ${narrative.tenant_mix.mix_porcentajes.retail_artesanal}%
- 🎭 **Eventos/Cultural**: ${narrative.tenant_mix.mix_porcentajes.eventos_cultural}%
- 💼 **Servicios**: ${narrative.tenant_mix.mix_porcentajes.servicios}%
- 🔧 **Back of House**: ${narrative.tenant_mix.mix_porcentajes.back_of_house}%

</div>

---

## 🗺️ Navegación del Reporte

<div class="grid grid-cols-3">
  <div class="card">
    <h3><a href="./ficha-sitio">Ficha del Sitio</a></h3>
    <p>Ubicación, coordenadas y contexto geográfico</p>
  </div>
  <div class="card">
    <h3><a href="./demanda-nse">Demanda y NSE</a></h3>
    <p>Perfil socioeconómico y población por radio</p>
  </div>
  <div class="card">
    <h3><a href="./accesibilidad">Accesibilidad</a></h3>
    <p>Isócronas HERE y análisis de eficiencia</p>
  </div>
  <div class="card">
    <h3><a href="./competencia-vocacion">Competencia y Vocación</a></h3>
    <p>Análisis DENUE y heatmap de competencia</p>
  </div>
</div>

---

## 📥 Recursos y Datos

<div class="note">
  <strong>💾 Datos Estructurados:</strong> Todos los insights estratégicos provienen del análisis Deep Agent de STRTGY Geointelligence. Las capas GeoJSON están disponibles en el directorio <code>src/data/layers/</code>.
</div>

<style>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 4rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 40em;
  font-size: 22px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}
</style>
