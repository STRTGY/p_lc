---
title: Restaurante Ancla
---

# Viabilidad del Restaurante Ancla

```js
import {processDENUEAgrupado} from "./data/loaders.js";
import {BaseMap, ParagonLayerPresets} from "./components/BaseMap.js";
import {MetricCard, InsightCard} from "./components/InsightCard.js";
import * as Plot from "npm:@observablehq/plot";

// Cargar datos
const narrative = await FileAttachment("./data/narrative.json").json();
const denue_json = await FileAttachment("./data/layers/09_lienzo_charro_denue_completo.geojson").json();
const sitio = await FileAttachment("./data/layers/01_lienzo_charro_sitio_terreno.geojson").json();
const buffers = await FileAttachment("./data/layers/02_lienzo_charro_buffers_analisis.geojson").json();

const denue_procesado = processDENUEAgrupado(denue_json);

// Calcular población 10 min (usando densidad real del área de 1km)
const densidad_real_zona = narrative.demographics.poblacion_1km / 3.14; // Población 1km ÷ área círculo 1km
const pob_10min = Math.round(narrative.connectivity.isochrones[1].area_km2 * densidad_real_zona);
const hogares = Math.round(pob_10min / 4);
const pct_c_plus = narrative.nse_analysis.share_c_plus_1km + narrative.nse_analysis.share_ab_1km;

// Supuestos de mercado (benchmarks industria restaurantera)
const gasto_mensual_fb = 4000; // MXN promedio NSE C
const frecuencia_mes = 3; // veces/mes
const ticket_objetivo = 350; // MXN/persona
const market_share = 0.03; // 3%

// Cálculos de demanda
const personas_por_visita = 2.5;
const comensales_mes_demanda = Math.round(hogares * frecuencia_mes * market_share * personas_por_visita);
const venta_mensual_demanda = comensales_mes_demanda * ticket_objetivo;

// Cálculos operativos del restaurante
const capacidad_asientos = 80;
const rotacion_dia = 2.5; // turnos: almuerzo + cena
const dias_operacion_mes = 26; // 6 días/semana x 4.3 semanas
const ocupacion_promedio = 0.60; // 60%

const comensales_dia = Math.round(capacidad_asientos * rotacion_dia * ocupacion_promedio);
const venta_diaria = comensales_dia * ticket_objetivo;
const venta_mensual = venta_diaria * dias_operacion_mes;
const venta_anual = venta_mensual * 12;

// Indicadores financieros
const margen_operativo = 0.20; // 20% (industria)
const costos_fijos_mes = venta_mensual * 0.50;
const punto_equilibrio_dia = Math.ceil((costos_fijos_mes / dias_operacion_mes) / ticket_objetivo);
const m2_recomendados = Math.round(capacidad_asientos * 1.8);

// Competencia F&B
const restaurantes = denue_json.features.filter(e => e.properties.codigo_act?.startsWith('722'));

const cocina_regional = restaurantes.filter(e => 
  e.properties.nombre_act?.toLowerCase().includes('mexicana') ||
  e.properties.nombre_act?.toLowerCase().includes('regional') ||
  e.properties.nombre_act?.toLowerCase().includes('típica')
);

const casuales = restaurantes.filter(e => 
  !e.properties.nombre_act?.toLowerCase().includes('rápida') &&
  !e.properties.nombre_act?.toLowerCase().includes('cafetería') &&
  !e.properties.nombre_act?.toLowerCase().includes('mexicana') &&
  !e.properties.nombre_act?.toLowerCase().includes('regional')
);

const rapida = restaurantes.filter(e => 
  e.properties.nombre_act?.toLowerCase().includes('rápida') ||
  e.properties.nombre_act?.toLowerCase().includes('tortas') ||
  e.properties.nombre_act?.toLowerCase().includes('tacos') ||
  e.properties.nombre_act?.toLowerCase().includes('hamburguesa')
);

const cafeterias = restaurantes.filter(e => 
  e.properties.nombre_act?.toLowerCase().includes('cafetería') ||
  e.properties.nombre_act?.toLowerCase().includes('café')
);

// Veredicto basado en scores
const score_demanda = pob_10min > 20000 ? 2 : (pob_10min > 10000 ? 1 : 0);
const score_competencia = cocina_regional.length < 5 ? 2 : (cocina_regional.length < 10 ? 1 : 0);
const score_nse = narrative.nse_analysis.indice_1km > 60 ? 2 : 1;
const score_accesibilidad = narrative.connectivity.isochrones[1].eficiencia > 50 ? 2 : 1;

const score_total = score_demanda + score_competencia + score_nse + score_accesibilidad;

let veredicto;
let veredicto_color;
if (score_total >= 7) {
  veredicto = "GO";
  veredicto_color = "success";
} else if (score_total >= 5) {
  veredicto = "REFINAR";
  veredicto_color = "warning";
} else {
  veredicto = "NO-GO";
  veredicto_color = "error";
}
```

Análisis de viabilidad para un restaurante de cocina regional como ancla del proyecto Lienzo Charro.

---

## 🍽️ Concepto del Restaurante Ancla

<div class="card">
  <h2>Propuesta de Valor</h2>
  <p>
    Restaurante de <strong>cocina regional de San Luis Potosí</strong> con enfoque en:
  </p>
  <ul>
    <li><strong>Platillos tradicionales</strong> con presentación contemporánea</li>
    <li><strong>Ingredientes locales</strong> y de temporada</li>
    <li><strong>Experiencia gastronómica</strong> completa (ambiente, servicio, entretenimiento)</li>
    <li><strong>Ticket promedio medio-alto</strong> acorde al perfil NSE del área</li>
  </ul>
</div>

---

## 📊 Demanda Potencial

<div class="grid grid-cols-3">

```js
display(MetricCard({
  label: "Población 10 min",
  value: pob_10min.toLocaleString(),
  subtitle: `${pct_c_plus > 0 ? `NSE C+: ${pct_c_plus.toFixed(1)}%` : "NSE C: 100%"} | ${hogares.toLocaleString()} hogares`,
  color: "blue",
  icon: "👥"
}));
```

```js
display(MetricCard({
  label: "Consumo Estimado",
  value: `$${gasto_mensual_fb.toLocaleString()}`,
  subtitle: `${frecuencia_mes}x/mes | Ticket: $${ticket_objetivo}`,
  color: "green",
  icon: "💰"
}));
```

```js
display(MetricCard({
  label: "Captura Estimada",
  value: `${(market_share * 100).toFixed(1)}%`,
  subtitle: `${comensales_mes_demanda.toLocaleString()} com/mes | $${(venta_mensual_demanda / 1000).toFixed(0)}k`,
  color: "purple",
  icon: "🎯"
}));
```

</div>

```js
display(InsightCard({
  titulo: "Modelo de Demanda",
  descripcion: `Basado en ${hogares.toLocaleString()} hogares alcanzables en 10 minutos, con gasto promedio mensual en F&B de $${gasto_mensual_fb.toLocaleString()} MXN y frecuencia de ${frecuencia_mes} visitas/mes, capturando un ${(market_share * 100).toFixed(1)}% de market share, se estiman ${comensales_mes_demanda.toLocaleString()} comensales mensuales con venta potencial de $${(venta_mensual_demanda / 1000).toFixed(0)}k MXN/mes.`,
  tipo: "info"
}));
```

---

## 🏪 Competencia F&B en el Área

```js
{
  const competencia_fb = [
    {
      tipo: "Cocina regional/mexicana",
      cantidad: cocina_regional.length,
      ticket_promedio: "$250-400",
      similitud: "Alta",
      color: cocina_regional.length < 5 ? "#10B981" : cocina_regional.length < 10 ? "#F59E0B" : "#EF4444"
    },
    {
      tipo: "Restaurantes casuales",
      cantidad: casuales.length,
      ticket_promedio: "$150-250",
      similitud: "Media",
      color: "#3B82F6"
    },
    {
      tipo: "Comida rápida",
      cantidad: rapida.length,
      ticket_promedio: "$80-120",
      similitud: "Baja",
      color: "#6B7280"
    },
    {
      tipo: "Cafeterías",
      cantidad: cafeterias.length,
      ticket_promedio: "$60-100",
      similitud: "Baja",
      color: "#6B7280"
    }
  ];
  
  const table = Inputs.table(competencia_fb, {
    columns: ["tipo", "cantidad", "ticket_promedio", "similitud"],
    header: {
      tipo: "Tipo",
      cantidad: "Cantidad",
      ticket_promedio: "Ticket Promedio Est.",
      similitud: "Similitud Concepto"
    },
    width: {
      tipo: 250,
      cantidad: 100,
      ticket_promedio: 180,
      similitud: 150
    }
  });
  
  display(table);
}
```

```js
display(InsightCard({
  titulo: "Análisis de Saturación F&B",
  descripcion: `Se identificaron ${restaurantes.length} establecimientos F&B totales en el área, de los cuales ${cocina_regional.length} son de cocina regional/mexicana (competencia directa). ${cocina_regional.length < 5 ? '✅ Baja saturación - white space para concepto premium' : cocina_regional.length < 10 ? '⚠️ Competencia moderada - requiere diferenciación fuerte' : '🔴 Alta saturación - evaluar viabilidad'}`,
  tipo: cocina_regional.length < 5 ? "success" : cocina_regional.length < 10 ? "warning" : "error"
}));
```

---

## 🗺️ Mapa de Competencia F&B

```js
{
  // Crear GeoJSON solo con restaurantes
  const restaurantes_geojson = {
    type: "FeatureCollection",
    features: restaurantes
  };
  
  const mapa = BaseMap({
    center: [sitio.features[0].geometry.coordinates[0], sitio.features[0].geometry.coordinates[1]],
    zoom: 13,
    height: 600,
    layers: [
      ParagonLayerPresets.denue(restaurantes_geojson),
      ParagonLayerPresets.buffers(buffers),
      ParagonLayerPresets.sitio(sitio)
    ]
  });
  
  display(mapa);
}
```

<div class="note">
**🍽️ Análisis visual:** El mapa muestra todos los establecimientos F&B (SCIAN 722) en el área. Observa la distribución espacial para identificar clusters de competencia y white spaces geográficos donde el concepto podría tener ventaja.
</div>

---

## 💰 Viabilidad Financiera Preliminar

<div class="grid grid-cols-2">

<div class="card">

### Ingresos Estimados

| Métrica | Valor |
|---------|-------|
| **Comensales/día:** | ${comensales_dia} personas |
| **Ticket promedio:** | $${ticket_objetivo} MXN |
| **Venta diaria:** | $${venta_diaria.toLocaleString()} MXN |
| **Venta mensual:** | $${venta_mensual.toLocaleString()} MXN |
| **Venta anual:** | $${venta_anual.toLocaleString()} MXN |

**Supuestos:** ${capacidad_asientos} asientos, ${rotacion_dia} rotaciones/día, ${(ocupacion_promedio * 100).toFixed(0)}% ocupación promedio, ${dias_operacion_mes} días/mes.

</div>

<div class="card">

### Indicadores Clave

| Métrica | Valor |
|---------|-------|
| **Rentabilidad esperada:** | ${(margen_operativo * 100).toFixed(0)}% |
| **Punto de equilibrio:** | ${punto_equilibrio_dia} comensales/día |
| **Capacidad sugerida:** | ${capacidad_asientos} personas |
| **M² recomendados:** | ${m2_recomendados} m² |

**Benchmark industria:** Margen operativo 15-25%, costo alimentos 28-32%, nómina 22-28%, renta y otros 20-28%.

</div>

</div>

```js
{
  // Gráfico de proyección de ventas
  const proyeccion = [
    {mes: "Mes 1", venta: venta_mensual * 0.4, ocupacion: 0.40},
    {mes: "Mes 3", venta: venta_mensual * 0.55, ocupacion: 0.55},
    {mes: "Mes 6", venta: venta_mensual * 0.70, ocupacion: 0.70},
    {mes: "Mes 9", venta: venta_mensual * 0.80, ocupacion: 0.80},
    {mes: "Mes 12", venta: venta_mensual * 0.85, ocupacion: 0.85},
    {mes: "Estable", venta: venta_mensual, ocupacion: 1.0}
  ];
  
  const chart = Plot.plot({
    height: 300,
    y: {label: "↑ Venta Mensual (MXN)", grid: true},
    marks: [
      Plot.areaY(proyeccion, {
        x: "mes",
        y: "venta",
        fill: "#10B981",
        fillOpacity: 0.2
      }),
      Plot.lineY(proyeccion, {
        x: "mes",
        y: "venta",
        stroke: "#10B981",
        strokeWidth: 3,
        marker: "circle"
      }),
      Plot.text(proyeccion, {
        x: "mes",
        y: "venta",
        text: d => `${(d.ocupacion * 100).toFixed(0)}%`,
        dy: -10,
        fill: "#1F2937",
        fontSize: 11
      })
    ]
  });
  
  display(chart);
}
```

<div class="note">
**📈 Curva de Ramp-Up:** La proyección asume una ocupación gradual desde 40% en el mes 1 hasta estabilización en 85-100% al año. Los porcentajes mostrados indican el nivel de ocupación esperado.
</div>

---

## 🎯 Diferenciación Competitiva

<div class="card">
  <h3>Factores Diferenciadores</h3>
  <ol>
    <li><strong>Concepto temático integrado:</strong> El restaurante como parte de una experiencia cultural completa (no solo un local aislado).</li>
    <li><strong>Calidad sobre volumen:</strong> Enfoque en ticket alto con productos premium vs competencia de volumen.</li>
    <li><strong>Atractivo turístico:</strong> Concepto que atraiga visitantes regionales, no solo locales.</li>
    <li><strong>Eventos y experiencias:</strong> Noches temáticas, música en vivo, catas, talleres de cocina.</li>
  </ol>
</div>

---

## ⚠️ Riesgos Específicos

<div class="grid grid-cols-2">

<div class="card">

### 🔴 Riesgos

```js
{
  const riesgos = [
    {
      riesgo: "Saturación F&B",
      detalle: `${cocina_regional.length} establecimientos de cocina regional ya operando`,
      nivel: cocina_regional.length < 5 ? "Bajo" : cocina_regional.length < 10 ? "Medio" : "Alto"
    },
    {
      riesgo: "Ticket promedio alto",
      detalle: "$350 MXN puede limitar frecuencia de visita en NSE C",
      nivel: "Medio"
    },
    {
      riesgo: "Dependencia de concepto",
      detalle: "Si el tema cultural no resuena, el ancla falla",
      nivel: "Alto"
    },
    {
      riesgo: "Operador clave",
      detalle: "Requiere operador con track record en cocina regional premium",
      nivel: "Alto"
    }
  ];
  
  riesgos.forEach(r => {
    const color = r.nivel === "Alto" ? "error" : r.nivel === "Medio" ? "warning" : "success";
    display(InsightCard({
      titulo: `${r.riesgo} (${r.nivel})`,
      descripcion: r.detalle,
      tipo: color
    }));
  });
}
```

</div>

<div class="card">

### 🟢 Mitigantes

1. **Diferenciación clara:** Posicionamiento como "experiencia cultural-gastronómica" vs restaurante tradicional
   - Escenografía temática consistente
   - Programación cultural (música en vivo, talleres)
   - Menú storytelling (historia de cada platillo)

2. **Flexibilidad de precios:** Menú con rango $180-600 MXN
   - Platillos entrada: $180-250
   - Platillos fuertes: $280-400
   - Experiencias premium: $450-600

3. **Marketing regional:** Radio 50km, no solo local
   - Alianzas con hoteles y tour operadores
   - Presencia en guías gastronómicas regionales
   - Redes sociales enfocadas en turismo cultural

4. **Due diligence de operador:**
   - Mínimo 5 años experiencia en cocina regional
   - Referencias de restaurantes previos
   - Capacidad financiera demostrada
   - Alineación con visión del concepto

</div>

</div>

---

## 💡 Conclusión y Recomendación

```js
{
  const verdictBadge = html`
    <div style="text-align: center; margin: 2rem 0;">
      <div style="display: inline-block; padding: 1.5rem 3rem; border-radius: 12px; background: ${veredicto === 'GO' ? '#10B981' : veredicto === 'REFINAR' ? '#F59E0B' : '#EF4444'}; color: white;">
        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 0.5rem;">Veredicto Preliminar</div>
        <div style="font-size: 36px; font-weight: 700;">${veredicto}</div>
        <div style="font-size: 14px; opacity: 0.9; margin-top: 0.5rem;">Score: ${score_total}/8 puntos</div>
      </div>
    </div>
  `;
  display(verdictBadge);
}
```

### Análisis de Viabilidad

```js
display(InsightCard({
  titulo: "Evaluación Integral",
  descripcion: `El restaurante ancla de cocina regional obtiene un score de **${score_total}/8 puntos** en la evaluación de viabilidad:\n\n• Demanda (${score_demanda}/2): ${pob_10min.toLocaleString()} hab en 10 min ${pob_10min > 20000 ? '✓' : '⚠️'}\n• Competencia (${score_competencia}/2): ${cocina_regional.length} competidores directos ${cocina_regional.length < 5 ? '✓' : '⚠️'}\n• NSE (${score_nse}/2): Índice ${narrative.nse_analysis.indice_1km.toFixed(1)} ${narrative.nse_analysis.indice_1km > 60 ? '✓' : '⚠️'}\n• Accesibilidad (${score_accesibilidad}/2): Eficiencia ${narrative.connectivity.isochrones[1].eficiencia}% ${narrative.connectivity.isochrones[1].eficiencia > 50 ? '✓' : '⚠️'}`,
  tipo: veredicto_color
}));
```

### Condiciones Críticas para Éxito

```js
{
  const condiciones_go = [
    {
      condicion: "Validar flujos turísticos reales",
      detalle: "Conteo de visitantes a zona cultural/patrimonial >15,000/mes",
      status: "⏳ Pendiente"
    },
    {
      condicion: "Asegurar operador con experiencia",
      detalle: "Mínimo 5 años en cocina regional, referencias comprobables, capital mínimo $2M MXN",
      status: "⏳ Pendiente"
    },
    {
      condicion: "Marketing regional pre-apertura",
      detalle: "Campaña 6 meses antes, inversión $150k-250k MXN, radio 50km",
      status: "⏳ Pendiente"
    },
    {
      condicion: "Validación de datos DENUE",
      detalle: "Query en vivo para confirmar baja competencia (esperado: 3-8 competidores adicionales)",
      status: "⏳ Pendiente"
    }
  ];
  
  const table = Inputs.table(condiciones_go, {
    columns: ["condicion", "detalle", "status"],
    header: {
      condicion: "Condición Crítica",
      detalle: "Especificación",
      status: "Estado"
    },
    width: {
      condicion: 220,
      detalle: 350,
      status: 100
    }
  });
  
  display(table);
}
```

---

### 💼 Recomendación Ejecutiva

<div class="card" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: white; padding: 2rem; border-radius: 8px;">

**${veredicto === "GO" ? "✅ Proceder con el ancla gastronómica" : veredicto === "REFINAR" ? "⚠️ Refinar concepto antes de comprometer" : "🔴 No viable como planteado"}**

${veredicto === "GO" ? 
  `El análisis sugiere viabilidad del restaurante ancla. Proceder con prospección de operadores y negociación de términos. Priorizar operador con experiencia comprobada en cocina regional premium y capacidad de ejecución del concepto temático.` : 
  veredicto === "REFINAR" ? 
    `El concepto requiere ajustes antes de comprometer inversión. **Opciones de refinamiento:**\n\n1. **Reducir ticket promedio** a $250-280 para ampliar mercado objetivo\n2. **Validar con pop-up temporal** (3 meses) para testear demanda real\n3. **Formato híbrido:** Restaurante + delivery/catering para diversificar ingresos\n4. **Considerar co-ancla:** Restaurante + galería artesanal como concepto dual\n\nRevisar estas opciones en Fase 0 y repetir análisis de viabilidad.` :
    `El concepto no es viable como planteado. Considerar:\n\n1. Cambiar a **food court multi-operador** con menor riesgo\n2. Reducir dependencia de ancla gastronómica única\n3. Enfocar en **retail experiencial** + F&B complementario\n4. Reevaluar ubicación o concepto fundamental`
}

</div>

---

<div class="note">
**📋 Disclaimer:** Esta es una evaluación preliminar basada en datos geoestadísticos. Se requiere estudio de factibilidad financiera completo (pro-forma 5 años, análisis de sensibilidad, TIR/VPN) y validación con operadores especializados antes de comprometer CAPEX.
</div>

