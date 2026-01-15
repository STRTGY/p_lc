# Análisis de Vocación y Tenant Mix

```js
import {InsightCard, MetricCard, RiskMatrix} from "./components/InsightCard.js";
import * as Plot from "npm:@observablehq/plot";

// Cargar datos
const narrative = await FileAttachment("./data/narrative.json").json();
```

---

## 🎯 Métricas Clave de Vocación

<div class="grid grid-cols-3">

```js
display(MetricCard({
  label: "Score Promedio",
  value: narrative.vocation_analysis.average_score.toFixed(2),
  subtitle: `Top 10 industrias`,
  color: narrative.vocation_analysis.average_score > 4.5 ? "#10B981" : "#F59E0B"
}));
```

```js
display(MetricCard({
  label: "Ranking",
  value: `#${narrative.vocation_analysis.ranking_among_properties}`,
  subtitle: "De 5 propiedades Paragon",
  color: "#3B82F6"
}));
```

```js
display(MetricCard({
  label: "Vocación Principal",
  value: narrative.vocation_analysis.top_10_industries[0].nombre.substring(0, 20) + "...",
  subtitle: `Score: ${narrative.vocation_analysis.top_10_industries[0].score.toFixed(2)}`,
  color: "#8B5CF6"
}));
```

</div>

---

## 💡 Interpretación Estratégica

```js
display(InsightCard({
  titulo: "Vocación del Sitio",
  descripcion: narrative.vocation_analysis.strategic_insight,
  tipo: "info"
}));
```

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

<div class="note">
<strong>📊 Código de colores del Score:</strong>
<ul>
<li>🟢 Verde (&gt; 5.2): Vocación excelente, aprovechar</li>
<li>🔵 Azul (4.8-5.2): Vocación alta, considerar fuertemente</li>
<li>🟡 Amarillo (4.4-4.8): Vocación moderada, analizar caso por caso</li>
<li>🔴 Rojo (&lt; 4.4): Vocación baja, evitar</li>
</ul>
El score de vocación combina múltiples factores: demanda (NSE, población, poder adquisitivo), oferta (competencia, saturación), accesibilidad (isócronas, conectividad) y condiciones del sitio (visibilidad, flujo vehicular).
</div>

---

## 🍽️ Análisis: Restaurante Gourmet

```js
display(InsightCard({
  titulo: `Restaurante Gourmet - Score: ${narrative.vocation_analysis.restaurante_gourmet_analysis.score}`,
  descripcion: `Drivers: ${narrative.vocation_analysis.restaurante_gourmet_analysis.drivers}\n\nLimitantes: ${narrative.vocation_analysis.restaurante_gourmet_analysis.limitantes}\n\nEstrategia: ${narrative.vocation_analysis.restaurante_gourmet_analysis.estrategia}`,
  tipo: "info"
}));
```

---

## 📊 Tenant Mix Propuesto

**Concepto:** ${narrative.tenant_mix.concepto_general}

```js
{
  const tenantMix = narrative.tenant_mix.propuesta;
  
  const table = Inputs.table(tenantMix, {
    select: false,
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

### 🎨 Diferenciadores del Concepto

${narrative.tenant_mix.diferenciacion.map(d => `- ${d}`).join('\n')}

---

## 💡 Recomendaciones de Tenant Mix

```js
{
  const recomendaciones = [
    {
      categoria: "Ancla Gastronómica",
      recomendacion: "Restaurante de cocina regional mexicana premium (600-900 m²) como atractor principal. Menú con rango $180-600 MXN para capturar NSE C+ y turismo cultural.",
      prioridad: "Alta"
    },
    {
      categoria: "Retail Complementario",
      recomendacion: "Boutiques artesanales (80-150 m² c/u), galerías de arte y tiendas de regalos. Enfoque en productos regionales auténticos y diseño contemporáneo.",
      prioridad: "Media"
    },
    {
      categoria: "Servicios",
      recomendacion: "Cafeterías especializadas (100-150 m²), espacios de co-working temáticos, talleres culturales. Complementan la experiencia gastronómica-cultural.",
      prioridad: "Media"
    },
    {
      categoria: "Experiencial",
      recomendacion: "Área de eventos culturales (música, danza), plaza central con escenario, talleres artesanales. Crea atmósfera única y genera tráfico recurrente.",
      prioridad: "Alta"
    }
  ];
  
  const table = Inputs.table(recomendaciones, {
    select: false,
    columns: ["categoria", "recomendacion", "prioridad"],
    header: {
      categoria: "Categoría",
      recomendacion: "Recomendación Específica",
      prioridad: "Prioridad"
    }
  });
  
  display(table);
}
```

---

## ⚠️ Matriz de Riesgos

```js
display(RiskMatrix(narrative.risks));
```

<div class="note">
<strong>📋 Mitigación de Riesgos:</strong> La matriz muestra riesgos identificados por probabilidad e impacto. Para cada riesgo alto (rojo), se han definido estrategias específicas de mitigación en el roadmap de implementación.
</div>

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
    select: false,
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

## 💼 Conclusión Ejecutiva

```js
display(InsightCard({
  titulo: "Veredicto Final",
  descripcion: narrative.executive_summary.conclusion_ejecutiva,
  tipo: narrative.executive_summary.veredicto === "GO" ? "success" : narrative.executive_summary.veredicto === "REFINAR" ? "warning" : "error"
}));
```

---

## 🔗 Navegación

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">

```js
html`<a href="./competencia" style="text-decoration: none;">
  <div class="card" style="text-align: center; padding: 1.5rem;">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">←</div>
    <div style="font-weight: 600;">Análisis de Competencia</div>
  </div>
</a>`
```

```js
html`<a href="./afinidad-tematica" style="text-decoration: none;">
  <div class="card" style="text-align: center; padding: 1.5rem;">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">→</div>
    <div style="font-weight: 600;">Afinidad Temática</div>
  </div>
</a>`
```

</div>

