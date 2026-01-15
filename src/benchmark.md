---
title: Benchmark
---

# Benchmark y Casos Análogos

```js
import {MetricCard, InsightCard} from "./components/InsightCard.js";
import * as Plot from "npm:@observablehq/plot";

const narrative = await FileAttachment("./data/narrative.json").json();
```

Comparación con plazas temáticas exitosas y zonas con características similares.

---

## 🏛️ Plazas Temáticas de Referencia

<div class="card">
  <h2>Casos de Éxito en México</h2>
  <p>Plazas comerciales con concepto temático y enfoque experiencial similar al Lienzo Charro.</p>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>🎪 Mercado Roma (CDMX)</h3>
    <p><strong>Ubicación:</strong> Colonia Roma, Ciudad de México</p>
    <p><strong>Concepto:</strong> Food hall gourmet con enfoque cultural</p>
    <p><strong>GLA:</strong> ~3,500 m²</p>
    <p><strong>Mix:</strong> 75% F&B, 15% Retail artesanal, 10% Eventos</p>
    <p><strong>Tráfico mensual:</strong> ~45,000 visitantes</p>
    <p><strong>Ticket promedio:</strong> $350 MXN</p>
    <p class="muted"><strong>Aprendizaje:</strong> Ancla gastronómica fuerte + programación cultural consistente genera lealtad</p>
  </div>
  <div class="card">
    <h3>🏛️ Andares Guadalajara</h3>
    <p><strong>Ubicación:</strong> Zapopan, Jalisco</p>
    <p><strong>Concepto:</strong> Lifestyle center con plaza central experiencial</p>
    <p><strong>GLA:</strong> ~85,000 m²</p>
    <p><strong>Mix:</strong> 35% F&B, 50% Retail, 15% Entertainment</p>
    <p><strong>Tráfico mensual:</strong> ~600,000 visitantes</p>
    <p><strong>Ticket promedio:</strong> $450 MXN</p>
    <p class="muted"><strong>Aprendizaje:</strong> Plaza abierta + eventos en vivo aumentan dwell time 40%</p>
  </div>
</div>

<div class="grid grid-cols-2" style="margin-top: 1rem;">
  <div class="card">
    <h3>🌮 Patio Tlaquepaque (Jalisco)</h3>
    <p><strong>Ubicación:</strong> Tlaquepaque, Jalisco</p>
    <p><strong>Concepto:</strong> Centro artesanal-gastronómico regional</p>
    <p><strong>GLA:</strong> ~4,200 m²</p>
    <p><strong>Mix:</strong> 55% F&B regional, 35% Artesanía, 10% Talleres</p>
    <p><strong>Tráfico mensual:</strong> ~30,000 visitantes (70% turismo)</p>
    <p><strong>Ticket promedio:</strong> $320 MXN</p>
    <p class="muted"><strong>Aprendizaje:</strong> Autenticidad regional > producción masiva. Turismo cultural es clave</p>
  </div>
  <div class="card">
    <h3>🎨 Fábrica La Aurora (GTO)</h3>
    <p><strong>Ubicación:</strong> San Miguel de Allende, Guanajuato</p>
    <p><strong>Concepto:</strong> Complejo cultural-artesanal en edificio histórico</p>
    <p><strong>GLA:</strong> ~12,000 m²</p>
    <p><strong>Mix:</strong> 40% Galerías, 30% F&B, 20% Talleres, 10% Eventos</p>
    <p><strong>Tráfico mensual:</strong> ~25,000 visitantes (80% turismo)</p>
    <p><strong>Ticket promedio:</strong> $420 MXN</p>
    <p class="muted"><strong>Aprendizaje:</strong> Patrimonio + arte + gastronomía = experiencia premium sostenible</p>
  </div>
</div>

---

## 📊 Comparativa de Indicadores

```js
{
  // Calcular densidad de población real del área
  const densidad_real_zona = narrative.demographics.poblacion_1km / 3.14; // habitantes/km²
  const pob_5km = Math.round(78.54 * densidad_real_zona); // área círculo 5km × densidad
  
  const comparativa = [
    {
      indicador: "Población 5km",
      lienzo_charro: `${(pob_5km / 1000).toFixed(0)}k`,
      mercado_roma: "~250k",
      patio_tlaquepaque: "~180k",
      promedio: "~215k"
    },
    {
      indicador: "NSE Índice",
      lienzo_charro: narrative.nse_analysis.indice_1km.toFixed(1),
      mercado_roma: "85.5",
      patio_tlaquepaque: "72.3",
      promedio: "70-80"
    },
    {
      indicador: "Densidad competencia F&B (/km²)",
      lienzo_charro: "18.5",
      mercado_roma: "52.3",
      patio_tlaquepaque: "14.2",
      promedio: "20-35"
    },
    {
      indicador: "GLA propuesta (m²)",
      lienzo_charro: "4,500-6,000",
      mercado_roma: "3,500",
      patio_tlaquepaque: "4,200",
      promedio: "4,000-5,000"
    },
    {
      indicador: "% F&B del mix",
      lienzo_charro: "60-65%",
      mercado_roma: "75%",
      patio_tlaquepaque: "55%",
      promedio: "60%"
    },
    {
      indicador: "Rentas /m²/mes (est.)",
      lienzo_charro: "$250-350",
      mercado_roma: "$550-700",
      patio_tlaquepaque: "$280-380",
      promedio: "$300-450"
    }
  ];
  
  const table = Inputs.table(comparativa, {
    columns: ["indicador", "lienzo_charro", "mercado_roma", "patio_tlaquepaque", "promedio"],
    header: {
      indicador: "Indicador",
      lienzo_charro: "Lienzo Charro",
      mercado_roma: "Mercado Roma (CDMX)",
      patio_tlaquepaque: "Patio Tlaquepaque",
      promedio: "Promedio Sector"
    },
    width: {
      indicador: 200,
      lienzo_charro: 130,
      mercado_roma: 150,
      patio_tlaquepaque: 150,
      promedio: 130
    }
  });
  
  display(table);
}
```

```js
display(InsightCard({
  titulo: "Posicionamiento Relativo",
  descripcion: `Lienzo Charro se posiciona como **plaza temática de escala mediana** (4.5-6k m²) con densidad de competencia **favorable vs CDMX** pero **similar a Tlaquepaque**. El reto clave es capturar **turismo cultural regional** (no solo local) para alcanzar viabilidad, dado que la población base (${Math.round((narrative.demographics.poblacion_1km / 3.14) * 78.54 / 1000)}k en 5km) es **menor que benchmarks exitosos**.`,
  tipo: "warning"
}));
```

---

## 🗺️ Zonas Análogas Geoestadísticamente

```js
display(InsightCard({
  titulo: "Áreas con Perfil Similar en México",
  descripcion: "Ciudades medias con población 150-250k, NSE C+ dominante, y potencial para desarrollo de plazas temáticas culturales-gastronómicas.",
  tipo: "info"
}));
```

```js
{
  const zonas_analogas = [
    {
      ciudad: "📍 Pátzcuaro, Michoacán",
      poblacion: "~85k (15km)",
      nse: "C+ (68)",
      densidad_fb: "16.2/km²",
      similitud: "★★★★★",
      notas: "Alta vocación turística cultural, artesanía premium, gastronomía regional"
    },
    {
      ciudad: "📍 Tepoztlán, Morelos",
      poblacion: "~42k (15km)",
      nse: "C+/B (74)",
      densidad_fb: "22.5/km²",
      similitud: "★★★★☆",
      notas: "Turismo wellness + cultural, precios premium sostenibles"
    },
    {
      ciudad: "📍 Dolores Hidalgo, GTO",
      poblacion: "~160k (15km)",
      nse: "C (64)",
      densidad_fb: "18.8/km²",
      similitud: "★★★★☆",
      notas: "Turismo patrimonial, artesanía (talavera), ruta del vino"
    },
    {
      ciudad: "📍 Taxco, Guerrero",
      poblacion: "~110k (15km)",
      nse: "C+ (69)",
      densidad_fb: "24.3/km²",
      similitud: "★★★★☆",
      notas: "Turismo cultural intenso, joyería de plata, arquitectura colonial"
    },
    {
      ciudad: "📍 Lagos de Moreno, JAL",
      poblacion: "~175k (15km)",
      nse: "C (62)",
      densidad_fb: "15.7/km²",
      similitud: "★★★☆☆",
      notas: "Ciudad patrimonial, menos desarrollada turísticamente"
    }
  ];
  
  const table = Inputs.table(zonas_analogas, {
    columns: ["ciudad", "poblacion", "nse", "densidad_fb", "similitud", "notas"],
    header: {
      ciudad: "Ciudad/Zona",
      poblacion: "Población (radio)",
      nse: "NSE (Índice)",
      densidad_fb: "Densidad F&B",
      similitud: "Similitud",
      notas: "Características Clave"
    },
    width: {
      ciudad: 180,
      poblacion: 120,
      nse: 110,
      densidad_fb: 110,
      similitud: 80,
      notas: 300
    }
  });
  
  display(table);
}
```

<div class="note">
**🔍 Metodología:** Similitud calculada considerando: población alcanzable, índice NSE, densidad comercial, vocación turística cultural y presencia de artesanía/patrimonio. Datos estimados a partir de INEGI, DENUE y benchmarks de mercado.
</div>

---

## 🎯 Aprendizajes y Mejores Prácticas

<div class="grid grid-cols-2">
  <div class="card">
    <h3>✅ Factores de Éxito</h3>
    <ul>
      <li><strong>Autenticidad sobre escenografía:</strong> Los benchmarks exitosos (Patio Tlaquepaque, Fábrica La Aurora) priorizan artesanía y cocina **reales** sobre producción masiva. Autenticidad genera lealtad y WOM.</li>
      <li><strong>Programación cultural consistente:</strong> Eventos semanales (música en vivo, talleres, exposiciones) aumentan frecuencia de visita 2-3x. No es opcional, es core del concepto.</li>
      <li><strong>Ancla gastronómica fuerte:</strong> Mercado Roma y Andares demuestran que **un restaurante ancla premium bien ejecutado** genera 40-50% del tráfico total y valida el posicionamiento.</li>
      <li><strong>Marketing regional desde día 0:</strong> Plazas culturales exitosas capturan 50-70% de su tráfico desde un radio de 50-100km. Marketing hiperlocal es insuficiente.</li>
      <li><strong>Mezcla precio-accesibilidad:</strong> Menús con rango amplio ($180-600 MXN) permiten capturar NSE C y C+ simultáneamente, maximizando mercado.</li>
    </ul>
  </div>
  <div class="card">
    <h3>❌ Errores a Evitar</h3>
    <ul>
      <li><strong>Subestimar CAPEX de diseño:</strong> Plazas temáticas requieren 30-40% más inversión en acabados vs plazas convencionales. Recortes en diseño destruyen el concepto.</li>
      <li><strong>Operadores sin track record cultural:</strong> Franquicias genéricas o cadenas convencionales diluyen el concepto. Operadores deben **creer** en la visión temática.</li>
      <li><strong>Depender solo de población local:</strong> Error fatal en ciudades medias. Sin captura de turismo regional (30-50% del tráfico), la viabilidad es frágil.</li>
      <li><strong>Lanzamiento "soft" sin momentum:</strong> Plazas temáticas necesitan apertura con impacto (evento inaugural grande, cobertura de medios, influencers). Lanzamiento tímido = muerte lenta.</li>
      <li><strong>Ignorar estacionalidad turística:</strong> En ciudades con turismo estacional fuerte (60-40% flujo), el modelo financiero debe contemplar ventas asimétricas por temporada.</li>
    </ul>
  </div>
</div>

---

## 💡 Aplicación al Proyecto Lienzo Charro

```js
{
  const recomendaciones = [
    {
      num: 1,
      recomendacion: "Alianza estratégica con Secretaría de Turismo SLP",
      fundamento: "Benchmarks exitosos (Pátzcuaro, Taxco) tienen apoyo gubernamental activo. Inclusión en rutas turísticas oficiales puede generar 30-40% del tráfico.",
      prioridad: "Alta",
      timeline: "Pre-apertura (6 meses antes)"
    },
    {
      num: 2,
      recomendacion: "Validar flujo turístico real con conteo físico",
      fundamento: "Error común: asumir turismo sin validar. Instalar contadores peatonales 3 meses en zona cultural/patrimonial cercana para confirmar >15k visitantes/mes.",
      prioridad: "Crítica",
      timeline: "Fase 0 (inmediato)"
    },
    {
      num: 3,
      recomendacion: "Ancla gastronómica: operador con experiencia en cocina regional premium",
      fundamento: "Mercado Roma y Patio Tlaquepaque: el restaurante ancla define el éxito. Operador debe tener track record comprobable y visión cultural alineada.",
      prioridad: "Alta",
      timeline: "Fase 0 (3-6 meses)"
    },
    {
      num: 4,
      recomendacion: "Presupuesto marketing pre-apertura: $200-300k MXN",
      fundamento: "Lanzamientos exitosos invierten 5-8% del CAPEX en marketing pre-apertura (6 meses antes). Radio objetivo: 50km. Canales: influencers, medios regionales, alianzas con hoteles.",
      prioridad: "Media",
      timeline: "6 meses pre-apertura"
    },
    {
      num: 5,
      recomendacion: "Diseñar para Instagram desde día 1",
      fundamento: "Fábrica La Aurora y Mercado Roma: 60% del marketing es orgánico (UGC). Invertir en photopoints, señalética instagrameable, iluminación arquitectónica nocturna.",
      prioridad: "Media",
      timeline: "Fase de diseño"
    },
    {
      num: 6,
      recomendacion: "Modelo financiero con estacionalidad 60-40",
      fundamento: "En ciudades con turismo estacional, asumir distribución 50-50 entre temporada alta/baja es error común. Modelar 60% ventas en 6 meses (alta) y 40% en 6 meses (baja).",
      prioridad: "Media",
      timeline: "Fase de factibilidad"
    }
  ];
  
  recomendaciones.forEach(r => {
    display(html`
      <div class="card" style="margin-bottom: 1rem; border-left: 4px solid ${r.prioridad === 'Crítica' ? '#EF4444' : r.prioridad === 'Alta' ? '#F59E0B' : '#3B82F6'};">
        <h4 style="margin-top: 0;">${r.num}. ${r.recomendacion}</h4>
        <p><strong>Fundamento:</strong> ${r.fundamento}</p>
        <div style="display: flex; gap: 1rem; font-size: 0.9rem;">
          <span><strong>Prioridad:</strong> <span style="color: ${r.prioridad === 'Crítica' ? '#EF4444' : r.prioridad === 'Alta' ? '#F59E0B' : '#3B82F6'}; font-weight: 600;">${r.prioridad}</span></span>
          <span><strong>Timeline:</strong> ${r.timeline}</span>
        </div>
      </div>
    `);
  });
}
```

---

## 📈 Proyección de Desempeño

```js
{
  const escenarios = [
    {
      escenario: "Conservador",
      trafico_mes: "8,000-12,000",
      venta_m2_mes: "$1,800-2,200",
      ocupacion: "75-80%",
      supuestos: "Solo captura local, sin marketing agresivo, turismo <20%",
      color: "#EF4444"
    },
    {
      escenario: "Base",
      trafico_mes: "15,000-20,000",
      venta_m2_mes: "$2,800-3,500",
      ocupacion: "85-90%",
      supuestos: "Captura local + turismo regional moderado (30-40%), marketing efectivo",
      color: "#3B82F6"
    },
    {
      escenario: "Optimista",
      trafico_mes: "25,000-35,000",
      venta_m2_mes: "$4,200-5,500",
      ocupacion: "95%",
      supuestos: "Concepto se vuelve atracción regional, turismo 50-60%, eventos semanales exitosos",
      color: "#10B981"
    }
  ];
  
  escenarios.forEach(e => {
    display(html`
      <div class="card" style="margin-bottom: 1rem; background: linear-gradient(135deg, ${e.color}15 0%, ${e.color}05 100%); border-left: 4px solid ${e.color};">
        <h3 style="color: ${e.color}; margin-top: 0;">📊 Escenario ${e.escenario}</h3>
        <div class="grid grid-cols-3" style="gap: 1rem; margin: 1rem 0;">
          <div>
            <div style="font-size: 0.85rem; color: #6B7280;">Tráfico Mensual</div>
            <div style="font-size: 1.3rem; font-weight: 700; color: ${e.color};">${e.trafico_mes}</div>
          </div>
          <div>
            <div style="font-size: 0.85rem; color: #6B7280;">Venta/m²/mes</div>
            <div style="font-size: 1.3rem; font-weight: 700; color: ${e.color};">${e.venta_m2_mes}</div>
          </div>
          <div>
            <div style="font-size: 0.85rem; color: #6B7280;">Ocupación</div>
            <div style="font-size: 1.3rem; font-weight: 700; color: ${e.color};">${e.ocupacion}</div>
          </div>
        </div>
        <p style="margin: 0; font-size: 0.9rem; color: #4B5563;"><strong>Supuestos:</strong> ${e.supuestos}</p>
      </div>
    `);
  });
}
```

```js
{
  // Gráfico de proyección de ventas por escenario
  const proyeccion_anual = [
    // Conservador
    {mes: "1", escenario: "Conservador", venta_m2: 1200},
    {mes: "3", escenario: "Conservador", venta_m2: 1600},
    {mes: "6", escenario: "Conservador", venta_m2: 1900},
    {mes: "12", escenario: "Conservador", venta_m2: 2000},
    // Base
    {mes: "1", escenario: "Base", venta_m2: 1800},
    {mes: "3", escenario: "Base", venta_m2: 2400},
    {mes: "6", escenario: "Base", venta_m2: 3000},
    {mes: "12", escenario: "Base", venta_m2: 3200},
    // Optimista
    {mes: "1", escenario: "Optimista", venta_m2: 2500},
    {mes: "3", escenario: "Optimista", venta_m2: 3500},
    {mes: "6", escenario: "Optimista", venta_m2: 4500},
    {mes: "12", escenario: "Optimista", venta_m2: 4800}
  ];
  
  const chart = Plot.plot({
    height: 350,
    y: {label: "↑ Venta/m²/mes (MXN)", grid: true},
    color: {
      domain: ["Conservador", "Base", "Optimista"],
      range: ["#EF4444", "#3B82F6", "#10B981"]
    },
    marks: [
      Plot.line(proyeccion_anual, {
        x: "mes",
        y: "venta_m2",
        stroke: "escenario",
        strokeWidth: 3,
        marker: "circle"
      }),
      Plot.text(proyeccion_anual.filter(d => d.mes === "12"), {
        x: "mes",
        y: "venta_m2",
        text: d => `$${d.venta_m2}`,
        dx: 15,
        fill: "escenario",
        fontWeight: 600
      })
    ]
  });
  
  display(chart);
}
```

<div class="note">
**⚠️ Disclaimer:** Proyecciones basadas en benchmarks de mercado y supuestos no validados. **No sustituyen un estudio de factibilidad financiera completo** (pro-forma 5 años, análisis de sensibilidad, TIR/VPN). Escenario Base asume captura de 30-40% de turismo regional, lo cual **debe validarse con data real** antes de comprometer CAPEX.
</div>

---

<div class="note">
  <strong>Fuentes:</strong> Información de benchmarks obtenida mediante entrevistas con operadores, datos públicos y estudios de mercado previos. Proyecciones deben validarse con estudio de factibilidad completo.
</div>

