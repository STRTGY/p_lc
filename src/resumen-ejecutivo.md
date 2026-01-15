# Resumen Ejecutivo

```js
import {VerdictBadge, ROIIndicator, InsightCard, MetricCard} from "./components/InsightCard.js";
import {processDENUEAgrupado} from "./data/loaders.js";
import * as Plot from "npm:@observablehq/plot";

// Cargar datos narrativos
const narrative = await FileAttachment("./data/narrative.json").json();

// Cargar datos DENUE para calcular competencia
const denue_json = await FileAttachment("./data/layers/09_lienzo_charro_denue_completo.geojson").json();
const denue_procesado = processDENUEAgrupado(denue_json);

// Calcular métricas de competencia
const establecimientos_1km = denue_procesado.total;
const densidad_comercial = Math.round(establecimientos_1km / 3.14); // estab/km²
const nivel_saturacion = densidad_comercial > 500 ? "Alta" : densidad_comercial > 200 ? "Media" : "Baja";

// Filtrar restaurantes F&B (SCIAN 72: Servicios de alojamiento temporal y de preparación de alimentos y bebidas)
const restaurantes_fb = denue_procesado.raw.filter(e => e.properties.codigo_act?.startsWith('72')).length;

// Top competidor (actividad más frecuente)
const top_competidor = denue_procesado.byActividad[0]?.actividad || "N/D";
```

Análisis de vocación y viabilidad para Tenant Mix temático - Lienzo Charro en Ciudad Valles, San Luis Potosí.

---

## 💡 Decisión Recomendada

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 960px; margin: 2rem auto;">

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

<div class="card" style="max-width: 960px; margin: 2rem auto;">
  <p style="font-size: 18px; line-height: 1.8;">
    <strong>Recomendación:</strong> ${narrative.executive_summary.recomendacion_detalle}
  </p>
</div>

---

## 📈 Hallazgos Clave

```js
display(html`
<div class="grid grid-cols-2">

<div class="card">
  <h3>1. Perfil de Demanda</h3>
  <ul>
    <li><strong>Población alcanzable (1km):</strong> ${narrative.demographics.poblacion_1km.toLocaleString()} habitantes</li>
    <li><strong>NSE predominante:</strong> ${narrative.nse_analysis.tier_dominante} (Índice: ${narrative.nse_analysis.indice_1km.toFixed(1)})</li>
    <li><strong>Densidad poblacional:</strong> ${Math.round(narrative.demographics.poblacion_1km / 3.14).toLocaleString()} hab/km²</li>
    <li><strong>Jóvenes 15-29:</strong> ${narrative.demographics.poblacion_15_29_1km.toLocaleString()} (${((narrative.demographics.poblacion_15_29_1km / narrative.demographics.poblacion_1km) * 100).toFixed(1)}%)</li>
  </ul>
</div>

<div class="card">
  <h3>2. Competencia y Saturación</h3>
  <ul>
    <li><strong>Establecimientos DENUE (1km):</strong> ${establecimientos_1km.toLocaleString()} unidades</li>
    <li><strong>Densidad comercial:</strong> ${densidad_comercial.toLocaleString()} estab/km² (${nivel_saturacion})</li>
    <li><strong>Restaurantes F&B:</strong> ${restaurantes_fb} establecimientos</li>
    <li><strong>Top competidor:</strong> ${top_competidor.substring(0, 50)}${top_competidor.length > 50 ? '...' : ''}</li>
  </ul>
</div>

<div class="card">
  <h3>3. Accesibilidad</h3>
  <ul>
    <li><strong>Población 15 min (auto):</strong> ~${Math.round(narrative.connectivity.isochrones[2].area_km2 * (narrative.demographics.poblacion_1km / 3.14)).toLocaleString()} habitantes (estimado)</li>
    <li><strong>Área alcanzable:</strong> ${narrative.connectivity.isochrones[2].area_km2.toFixed(1)} km²</li>
    <li><strong>Eficiencia vs buffer:</strong> ${narrative.connectivity.isochrones[2].eficiencia}%</li>
    <li><strong>Vialidades:</strong> Carretera Federal, vialidades locales</li>
  </ul>
</div>

<div class="card">
  <h3>4. Vocación de Giros Afines</h3>
  <ul>
    <li><strong>Score promedio (Top 10):</strong> ${narrative.vocation_analysis.average_score.toFixed(2)} / 6.0</li>
    <li><strong>Ranking Paragon:</strong> #${narrative.vocation_analysis.ranking_among_properties} de 5 propiedades</li>
    <li><strong>Vocación principal:</strong> ${narrative.vocation_analysis.top_10_industries[0].nombre}</li>
    <li><strong>Score vocación ancla:</strong> ${narrative.vocation_analysis.restaurante_gourmet_analysis.score}</li>
  </ul>
</div>

</div>
`);
```

---

## ✨ Hallazgos Estratégicos

```js
narrative.executive_summary.hallazgos.forEach(hallazgo => {
  display(InsightCard({
    titulo: hallazgo.titulo,
    descripcion: `${hallazgo.descripcion}${hallazgo.implicacion ? `\n\n→ Implicación: ${hallazgo.implicacion}` : ''}${hallazgo.oportunidad ? `\n\n► Oportunidad: ${hallazgo.oportunidad}` : ''}`,
    fuente: hallazgo.fuente,
    tipo: hallazgo.tipo || "info"
  }));
});
```

---

## ⚠️ Riesgos y Mitigantes

<div class="grid grid-cols-2">

<div class="card">

### 🔴 Riesgos Identificados

```js
{
  const riesgos = narrative.risks.slice(0, 3);
  riesgos.forEach((r, i) => {
    const color = r.probabilidad === 'Alta' ? 'error' : r.probabilidad === 'Media' ? 'warning' : 'success';
    display(InsightCard({
      titulo: `${i + 1}. ${r.tipo}`,
      descripcion: `${r.descripcion}\n\nProbabilidad: ${r.probabilidad} | Impacto: ${r.impacto}`,
      tipo: color
    }));
  });
}
```

</div>

<div class="card">

### 🟢 Mitigantes Propuestos

```js
{
  const riesgos = narrative.risks.slice(0, 3);
  riesgos.forEach((r, i) => {
    display(InsightCard({
      titulo: `${i + 1}. Mitigación`,
      descripcion: r.mitigacion,
      tipo: 'success'
    }));
  });
}
```

</div>

</div>

---

## 📋 Supuestos Críticos

<div class="note" style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">

<strong>⚠️ Supuestos clave del análisis:</strong>

<ol>
<li><strong>Demanda:</strong> NSE C se mantiene estable en el área y representa capacidad de gasto en experiencias gastronómicas premium ($250-400 MXN por persona)</li>
<li><strong>Competencia:</strong> Datos DENUE incompletos en 1km+ - se asume baja competencia directa hasta validación en campo</li>
<li><strong>Perfil de consumidor:</strong> Población local + flujo turístico regional combinados generan demanda suficiente para concepto temático-cultural</li>
</ol>

</div>

---

## 💼 Conclusión Ejecutiva

<div style="max-width: 960px; margin: 2rem auto;">

```js
display(VerdictBadge({veredicto: narrative.executive_summary.veredicto, size: "large"}));
```

</div>

### Síntesis del Análisis

El proyecto Lienzo Charro en Ciudad Valles presenta una oportunidad condicionada para el desarrollo de una plaza temática cultural-gastronómica. El análisis geoestadístico revela un equilibrio entre fortalezas estructurales y desafíos operativos que requieren estrategias específicas de mitigación.

---

### 🟢 Fortalezas Identificadas

<div class="grid grid-cols-2">

<div class="card" style="border-left: 4px solid #10B981;">

<strong>1. Estabilidad Socioeconómica</strong>

<p>El área mantiene un NSE consistente alrededor de 60.9 (segmento C) en todos los radios de análisis, con 100% de concentración C en el radio de 1km. Los componentes de bienes (96.01) y económico (78.07) son notablemente altos, indicando capacidad de consumo en productos y experiencias, aunque con brechas en infraestructura educativa y de vivienda.</p>

<p><strong>Implicación:</strong> Existe poder adquisitivo para conceptos de ticket medio-alto ($250-400 MXN), pero debe equilibrarse con accesibilidad de precios.</p>

</div>

<div class="card" style="border-left: 4px solid #10B981;">

<strong>2. White Space Competitivo</strong>

<p>El análisis DENUE revela baja densidad de competencia directa para conceptos temáticos culturales y gastronomía premium. Con ${establecimientos_1km.toLocaleString()} establecimientos totales y solo ${restaurantes_fb} en F&B dentro del radio de 1km, existe espacio para diferenciación.</p>

<p><strong>Implicación:</strong> Oportunidad de posicionarse como concepto único sin competencia directa inmediata.</p>

</div>

</div>

---

### 🔴 Desafíos Críticos

<div class="grid grid-cols-2">

<div class="card" style="border-left: 4px solid #EF4444;">

<strong>1. Conectividad Limitada</strong>

<p>Las isócronas HERE muestran eficiencias bajas en tiempos cortos (41.2% a 5 min, 49% a 10 min), mejorando solo a 64.4% en 15 minutos. Esto posiciona al sitio más como destino que como comercio de paso.</p>

<p><strong>Mitigación Requerida:</strong> Estrategia de marketing regional agresiva, programación cultural consistente para generar visitas intencionales, y alianzas con tour operadores.</p>

</div>

<div class="card" style="border-left: 4px solid #EF4444;">

<strong>2. Dependencia de Validación</strong>

<p>Los datos DENUE presentan inconsistencias en radios > 1km (valores 0 registrados), y no existe validación de campo sobre flujos turísticos reales hacia conceptos culturales en la zona.</p>

<p><strong>Mitigación Requerida:</strong> Query DENUE en vivo, conteos de tráfico vehicular y peatonal, estudio de patrones de consumo cultural-gastronómico mediante encuestas locales.</p>

</div>

</div>

---

### 🎯 Estrategia Recomendada

```js
display(InsightCard({
  titulo: "Desarrollo en Fases con Validación Temprana",
  descripcion: narrative.executive_summary.recomendacion_detalle,
  tipo: "info"
}));
```

<strong>Enfoque Phased:</strong>

1. <strong>Fase 0 (Meses 0-3):</strong> Validación y planeación
   - Validar datos de competencia con query DENUE en vivo
   - Estudio de flujo turístico mediante datos municipales
   - Definición de tenant mix específico y prospección de ancla gastronómica

2. <strong>Fase 1 (Meses 4-9):</strong> Plaza temática + Ancla F&B
   - Restaurante mexicano premium (80-120 pax)
   - 4-6 locales boutique (artesanía, cafés, retail cultural)
   - Programación cultural semanal (música, talleres, eventos)

3. <strong>Fase 2 (Meses 10-24):</strong> Consolidación y expansión
   - Sala de eventos/museo regional
   - Ampliación de oferta gastronómica
   - Hospedaje experiencial (opcional, según demanda validada)

---

### 💰 Consideraciones Financieras

<div class="grid grid-cols-3">

```js
display(MetricCard({
  label: "ROI Estimado",
  value: narrative.executive_summary.roi_estimado.rango,
  subtitle: narrative.executive_summary.roi_estimado.horizonte,
  color: "blue",
  icon: "💰"
}));
```

```js
display(MetricCard({
  label: "Nivel de Confianza",
  value: narrative.executive_summary.roi_estimado.confianza,
  subtitle: "Sujeto a validación de campo",
  color: "yellow",
  icon: "⚠️"
}));
```

```js
display(MetricCard({
  label: "Población Alcanzable",
  value: `${Math.round(narrative.connectivity.isochrones[2].area_km2 * narrative.demographics.densidad_1km / 1000)}k`,
  subtitle: "En 15 minutos (auto)",
  color: "green",
  icon: "👥"
}));
```

</div>

<strong>Nota crítica:</strong> El ROI proyectado de 12-18% IRR asume:
- Validación exitosa de flujos turísticos (20-30% de demanda total)
- Corrección de inconsistencias en datos DENUE
- Obtención de ancla gastronómica con track record comprobado
- CAPEX controlado en Fase 1 (<60% del total)

---

### ⚖️ Balance Riesgo-Oportunidad

<div class="card" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: white; padding: 2rem; border-radius: 8px;">

<strong>Veredicto: ${narrative.executive_summary.veredicto}</strong>

<p>Este proyecto NO es un "GO" automático debido a las brechas de información y desafíos de accesibilidad. Sin embargo, NO es un "NO-GO" porque los fundamentales de NSE, white space competitivo y vocación temática son sólidos.</p>

<p><strong>Recomendación:</strong> Proceder con Fase 0 de validación (3 meses, CAPEX mínimo) antes de comprometer inversión full. Los deliverables de esta fase (query DENUE en vivo, estudio de flujo, contratos preliminares con ancla) determinarán si se avanza a GO o se pivotea el concepto.</p>

<p><strong>Criterios de avance a GO:</strong></p>
<ol style="margin-left: 1rem;">
<li>✓ Identificación de mínimo 50 establecimientos F&B adicionales en query DENUE en vivo (validando mercado)</li>
<li>✓ Conteo de tráfico vehicular > 5,000 vehículos/día en vialidad principal</li>
<li>✓ Compromiso formal de operador ancla con experiencia >5 años en cocina regional</li>
<li>✓ Validación de flujo turístico regional > 15,000 visitantes/mes hacia zona cultural</li>
</ol>

<p style="margin-top: 1rem;">
Si estos 4 criterios se cumplen → <strong>GO a Fase 1</strong><br/>
Si 2-3 se cumplen → <strong>REFINAR concepto y repetir validación</strong><br/>
Si &lt;2 se cumplen → <strong>NO-GO o cambio radical de concepto</strong>
</p>

</div>

---

### 📋 Documentación Adicional

Para profundizar en cada aspecto del análisis, consulte las secciones especializadas del reporte:

- **[Ficha del Sitio](./ficha-sitio)** - Ubicación, coordenadas, contexto geográfico
- **[Demanda y NSE](./demanda-nse)** - Análisis detallado del perfil socioeconómico
- **[Accesibilidad](./accesibilidad)** - Isócronas HERE y análisis de conectividad
- **[Competencia](./competencia)** - Saturación DENUE y análisis de mercado
- **[Vocación](./vocacion)** - Scores de vocación y tenant mix propuesto
- **[Roadmap Completo](./vocacion)** - Plan de implementación por fases (ver sección final)

</div>

---

## 🔗 Navegación Rápida

<div class="grid grid-cols-3">
  
```js
html`<a href="./ficha-sitio" style="text-decoration: none;">
  <div class="card" style="text-align: center; padding: 1rem;">
    <div style="font-size: 2rem;">📍</div>
    <div style="font-weight: 600; margin-top: 0.5rem;">Ficha del Sitio</div>
  </div>
</a>`
```

```js
html`<a href="./demanda-nse" style="text-decoration: none;">
  <div class="card" style="text-align: center; padding: 1rem;">
    <div style="font-size: 2rem;">📊</div>
    <div style="font-weight: 600; margin-top: 0.5rem;">Demanda y NSE</div>
  </div>
</a>`
```

```js
html`<a href="./vocacion" style="text-decoration: none;">
  <div class="card" style="text-align: center; padding: 1rem;">
    <div style="font-size: 2rem;">🎯</div>
    <div style="font-weight: 600; margin-top: 0.5rem;">Vocación</div>
  </div>
</a>`
```

</div>
