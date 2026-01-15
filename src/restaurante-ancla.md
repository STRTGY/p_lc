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

// Calcular población 10 min (interpolación entre radios conocidos)
// Isócrona 10min tiene radio ~3.5km, usar interpolación entre poblacion_2km y poblacion_5km
const pob_2km = narrative.demographics.poblacion_2km || 48837;
const pob_5km = narrative.demographics.poblacion_5km || 117844;
const radio_10min_km = narrative.connectivity.isochrones[1].radio_aprox_m / 1000; // ~3.5km
const pob_10min = Math.round(pob_2km + (pob_5km - pob_2km) * (radio_10min_km - 2) / (5 - 2));
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

// Cocina regional: buscar por nombre de establecimiento Y descripción SCIAN
const cocina_regional = restaurantes.filter(e => {
  const nombre = e.properties.nom_estab?.toLowerCase() || '';
  const actividad = e.properties.nombre_act?.toLowerCase() || '';
  return nombre.includes('mexicana') || nombre.includes('regional') || 
         nombre.includes('típica') || nombre.includes('tipica') ||
         nombre.includes('huastec') || nombre.includes('potosina') ||
         nombre.includes('antojitos') || nombre.includes('pozole') ||
         nombre.includes('enchilada') || nombre.includes('mole') ||
         actividad.includes('mexicana') || actividad.includes('regional');
});

// Comida rápida: por nombre y actividad
const rapida = restaurantes.filter(e => {
  const nombre = e.properties.nom_estab?.toLowerCase() || '';
  const actividad = e.properties.nombre_act?.toLowerCase() || '';
  return actividad.includes('rápida') || actividad.includes('rapida') ||
         nombre.includes('tacos') || nombre.includes('tortas') ||
         nombre.includes('hamburguesa') || nombre.includes('burger') ||
         nombre.includes('pizza') || nombre.includes('hot dog') ||
         nombre.includes('pollo frito') || nombre.includes('carnitas');
});

// Cafeterías: por nombre y actividad
const cafeterias = restaurantes.filter(e => {
  const nombre = e.properties.nom_estab?.toLowerCase() || '';
  const actividad = e.properties.nombre_act?.toLowerCase() || '';
  return actividad.includes('cafetería') || actividad.includes('cafeteria') ||
         actividad.includes('café') || actividad.includes('cafe') ||
         nombre.includes('café') || nombre.includes('cafe') ||
         nombre.includes('coffee') || nombre.includes('starbucks');
});

// Casuales: resto de restaurantes que no son regional, rápida ni café
const cocina_regional_set = new Set(cocina_regional);
const rapida_set = new Set(rapida);
const cafeterias_set = new Set(cafeterias);
const casuales = restaurantes.filter(e => 
  !cocina_regional_set.has(e) && !rapida_set.has(e) && !cafeterias_set.has(e)
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
    select: false,
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
<strong>🍽️ Análisis visual:</strong> El mapa muestra todos los establecimientos F&B (SCIAN 722) en el área. Observa la distribución espacial para identificar clusters de competencia y white spaces geográficos donde el concepto podría tener ventaja.
</div>

---

## 💰 Viabilidad Financiera Preliminar

### Métricas Clave de Operación

<div class="grid grid-cols-4">

```js
display(MetricCard({
  label: "Venta Anual Estimada",
  value: `$${(venta_anual / 1000000).toFixed(1)}M`,
  subtitle: `$${(venta_mensual / 1000).toFixed(0)}k MXN/mes`,
  color: "green",
  icon: "💰"
}));
```

```js
display(MetricCard({
  label: "Comensales/Día",
  value: comensales_dia.toString(),
  subtitle: `${capacidad_asientos} asientos × ${rotacion_dia} turnos × ${(ocupacion_promedio * 100).toFixed(0)}%`,
  color: "blue",
  icon: "👥"
}));
```

```js
display(MetricCard({
  label: "Punto de Equilibrio",
  value: `${punto_equilibrio_dia}`,
  subtitle: "comensales/día mínimo",
  color: punto_equilibrio_dia < comensales_dia * 0.7 ? "green" : "orange",
  icon: "⚖️"
}));
```

```js
display(MetricCard({
  label: "Margen Operativo",
  value: `${(margen_operativo * 100).toFixed(0)}%`,
  subtitle: "Benchmark: 15-25%",
  color: "purple",
  icon: "📊"
}));
```

</div>

### Modelo de Ingresos

<div class="grid grid-cols-4">

```js
display(MetricCard({
  label: "Ticket Promedio",
  value: `$${ticket_objetivo}`,
  subtitle: "MXN por persona",
  color: "gray",
  icon: "🎫"
}));
```

```js
display(MetricCard({
  label: "Venta Diaria",
  value: `$${(venta_diaria/1000).toFixed(0)}k`,
  subtitle: `${comensales_dia} comensales × $${ticket_objetivo}`,
  color: "gray",
  icon: "📅"
}));
```

```js
display(MetricCard({
  label: "Días Operación",
  value: `${dias_operacion_mes}`,
  subtitle: "días por mes",
  color: "gray",
  icon: "🗓️"
}));
```

```js
display(MetricCard({
  label: "Venta Mensual",
  value: `$${(venta_mensual/1000).toFixed(0)}k`,
  subtitle: "MXN proyectado",
  color: "green",
  icon: "📈"
}));
```

</div>

### Curva de Ramp-Up (12 meses)

```js
{
  // Gráfico de proyección mejorado
  const proyeccion = [
    {mes: "M1", mesNum: 1, venta: venta_mensual * 0.40, ocupacion: 40, estado: "Apertura"},
    {mes: "M3", mesNum: 3, venta: venta_mensual * 0.55, ocupacion: 55, estado: "Crecimiento"},
    {mes: "M6", mesNum: 6, venta: venta_mensual * 0.70, ocupacion: 70, estado: "Crecimiento"},
    {mes: "M9", mesNum: 9, venta: venta_mensual * 0.80, ocupacion: 80, estado: "Maduración"},
    {mes: "M12", mesNum: 12, venta: venta_mensual * 0.85, ocupacion: 85, estado: "Estable"},
    {mes: "M18+", mesNum: 18, venta: venta_mensual * 1.0, ocupacion: 100, estado: "Objetivo"}
  ];
  
  const puntoEquilibrio = punto_equilibrio_dia * ticket_objetivo * dias_operacion_mes;
  
  const chart = Plot.plot({
    height: 320,
    marginLeft: 80,
    marginRight: 40,
    marginBottom: 50,
    style: {
      background: "#fafafa",
      fontSize: "12px"
    },
    x: {
      label: "Periodo →",
      tickFormat: d => d,
      domain: proyeccion.map(d => d.mes)
    },
    y: {
      label: "↑ Venta Mensual (MXN)",
      grid: true,
      tickFormat: d => `$${(d/1000).toFixed(0)}k`,
      domain: [0, venta_mensual * 1.15]
    },
    marks: [
      // Línea de punto de equilibrio
      Plot.ruleY([puntoEquilibrio], {
        stroke: "#EF4444",
        strokeWidth: 2,
        strokeDasharray: "6,4"
      }),
      // Etiqueta punto equilibrio
      Plot.text([{x: "M18+", y: puntoEquilibrio}], {
        x: "x",
        y: "y",
        text: ["← Punto Equilibrio"],
        textAnchor: "end",
        dx: -10,
        fill: "#EF4444",
        fontWeight: "600",
        fontSize: 11
      }),
      // Barras de venta
      Plot.barY(proyeccion, {
        x: "mes",
        y: "venta",
        fill: d => d.venta >= puntoEquilibrio ? "#10B981" : "#F59E0B",
        rx: 4
      }),
      // Etiquetas de ocupación
      Plot.text(proyeccion, {
        x: "mes",
        y: "venta",
        text: d => `${d.ocupacion}%`,
        dy: -12,
        fill: "#1F2937",
        fontWeight: "600",
        fontSize: 12
      })
    ]
  });
  
  display(chart);
}
```

<div class="note" style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
  <span>🟩 Sobre punto de equilibrio</span>
  <span>🟨 Bajo punto de equilibrio</span>
  <span>🔴 Línea = Punto de equilibrio</span>
</div>

### Supuestos del Modelo

<div class="grid grid-cols-2">

<div class="card">

#### 📐 Capacidad Operativa

```js
display(html`
<ul>
  <li><strong>${capacidad_asientos}</strong> asientos de capacidad</li>
  <li><strong>${rotacion_dia}</strong> rotaciones/día (almuerzo + cena)</li>
  <li><strong>${(ocupacion_promedio * 100).toFixed(0)}%</strong> ocupación promedio objetivo</li>
  <li><strong>${dias_operacion_mes}</strong> días de operación/mes</li>
  <li><strong>${m2_recomendados} m²</strong> espacio recomendado</li>
</ul>
`);
```

</div>

<div class="card">

#### 💵 Benchmarks Industria

- Margen operativo: **15-25%**
- Costo de alimentos: **28-32%**
- Nómina: **22-28%**
- Renta y otros: **20-28%**

</div>

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

1. <strong>Diferenciación clara:</strong> Posicionamiento como "experiencia cultural-gastronómica" vs restaurante tradicional
   - Escenografía temática consistente
   - Programación cultural (música en vivo, talleres)
   - Menú storytelling (historia de cada platillo)

2. <strong>Flexibilidad de precios:</strong> Menú con rango $180-600 MXN
   - Platillos entrada: $180-250
   - Platillos fuertes: $280-400
   - Experiencias premium: $450-600

3. <strong>Marketing regional:</strong> Radio 50km, no solo local
   - Alianzas con hoteles y tour operadores
   - Presencia en guías gastronómicas regionales
   - Redes sociales enfocadas en turismo cultural

4. <strong>Due diligence de operador:</strong>
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
  descripcion: `El restaurante ancla de cocina regional obtiene un score de ${score_total}/8 puntos en la evaluación de viabilidad:\n\n• Demanda (${score_demanda}/2): ${pob_10min.toLocaleString()} hab en 10 min ${pob_10min > 20000 ? '✓' : '⚠️'}\n• Competencia (${score_competencia}/2): ${cocina_regional.length} competidores directos ${cocina_regional.length < 5 ? '✓' : '⚠️'}\n• NSE (${score_nse}/2): Índice ${narrative.nse_analysis.indice_1km.toFixed(1)} ${narrative.nse_analysis.indice_1km > 60 ? '✓' : '⚠️'}\n• Accesibilidad (${score_accesibilidad}/2): Eficiencia ${narrative.connectivity.isochrones[1].eficiencia}% ${narrative.connectivity.isochrones[1].eficiencia > 50 ? '✓' : '⚠️'}`,
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
    select: false,
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

```js
{
  const titulo = veredicto === "GO" ? "✅ Proceder con el ancla gastronómica" : 
                 veredicto === "REFINAR" ? "⚠️ Refinar concepto antes de comprometer" : 
                 "🔴 No viable como planteado";
  
  let contenido;
  if (veredicto === "GO") {
    contenido = "El análisis sugiere viabilidad del restaurante ancla. Proceder con prospección de operadores y negociación de términos. Priorizar operador con experiencia comprobada en cocina regional premium y capacidad de ejecución del concepto temático.";
  } else if (veredicto === "REFINAR") {
    contenido = `El concepto requiere ajustes antes de comprometer inversión. Opciones de refinamiento:
      <ol>
        <li>Reducir ticket promedio a $250-280 para ampliar mercado objetivo</li>
        <li>Validar con pop-up temporal (3 meses) para testear demanda real</li>
        <li>Formato híbrido: Restaurante + delivery/catering para diversificar ingresos</li>
        <li>Considerar co-ancla: Restaurante + galería artesanal como concepto dual</li>
      </ol>
      Revisar estas opciones en Fase 0 y repetir análisis de viabilidad.`;
  } else {
    contenido = `El concepto no es viable como planteado. Considerar:
      <ol>
        <li>Cambiar a food court multi-operador con menor riesgo</li>
        <li>Reducir dependencia de ancla gastronómica única</li>
        <li>Enfocar en retail experiencial + F&B complementario</li>
        <li>Reevaluar ubicación o concepto fundamental</li>
      </ol>`;
  }
  
  display(html`
    <div class="card" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: white; padding: 2rem; border-radius: 8px;">
      <strong>${titulo}</strong>
      <p style="margin-top: 1rem;">${contenido}</p>
    </div>
  `);
}
```

---

<div class="note">
<strong>📋 Disclaimer:</strong> Esta es una evaluación preliminar basada en datos geoestadísticos. Se requiere estudio de factibilidad financiera completo (pro-forma 5 años, análisis de sensibilidad, TIR/VPN) y validación con operadores especializados antes de comprometer CAPEX.
</div>

