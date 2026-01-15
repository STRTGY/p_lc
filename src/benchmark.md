---
title: Benchmark
---

# Benchmark y Casos Análogos

```js
import {MetricCard, InsightCard} from "./components/InsightCard.js";
import * as Plot from "npm:@observablehq/plot";

const narrative = await FileAttachment("./data/narrative.json").json();
```

Comparación con plazas temáticas exitosas y análisis del contexto turístico de la Huasteca Potosina.

---

## 📈 Contexto: Mercado Gourmet en México 2024-2025

<div class="grid grid-cols-4">

```js
display(MetricCard({
  label: "Mercado Gourmet MX",
  value: "$335M",
  subtitle: "USD (2024)",
  color: "green",
  icon: "🍽️"
}));
```

```js
display(MetricCard({
  label: "Crecimiento CAGR",
  value: "8.8%",
  subtitle: "2025-2033 proyectado",
  color: "blue",
  icon: "📈"
}));
```

```js
display(MetricCard({
  label: "Renta Promedio MX",
  value: "$620",
  subtitle: "MXN/m²/mes retail",
  color: "purple",
  icon: "🏪"
}));
```

```js
display(MetricCard({
  label: "Renta Ciudades Medias",
  value: "$300-500",
  subtitle: "MXN/m²/mes",
  color: "gray",
  icon: "📍"
}));
```

</div>

```js
display(InsightCard({
  titulo: "Tendencias Clave 2024-2025",
  descripcion: "El sector de food halls en México muestra crecimiento sostenido con 4 tendencias dominantes: 1) Rescate de cocina regional reinterpretada con técnicas contemporáneas, 2) Comida callejera elevada a formato gourmet, 3) Experiencias sociales y eventos en vivo como diferenciador, 4) Compromiso con ingredientes locales y sustentabilidad. Fuente: IMARC Group, OpenTable, Fast Company MX.",
  tipo: "info"
}));
```

---

## 🌄 Oportunidad: Turismo en la Huasteca Potosina

<div class="grid grid-cols-4">

```js
display(MetricCard({
  label: "Crecimiento Turismo",
  value: "+65%",
  subtitle: "2024 vs años previos",
  color: "green",
  icon: "🚀"
}));
```

```js
display(MetricCard({
  label: "Semana Santa 2025",
  value: "300k",
  subtitle: "visitantes proyectados",
  color: "blue",
  icon: "👥"
}));
```

```js
display(MetricCard({
  label: "Ocupación Hotelera",
  value: "95%",
  subtitle: "temporada alta",
  color: "purple",
  icon: "🏨"
}));
```

```js
display(MetricCard({
  label: "Capacidad Hotelera",
  value: "2,500",
  subtitle: "habitaciones (hoteles + apps)",
  color: "gray",
  icon: "🛏️"
}));
```

</div>

```js
display(InsightCard({
  titulo: "Ciudad Valles como Hub Turístico",
  descripcion: "Ciudad Valles se consolida como la puerta de entrada a la Huasteca Potosina. En 2024, la región registró un crecimiento del 65% en afluencia turística. Para 2025, se proyectan 300,000 visitantes solo en Semana Santa con la FENEHUAP, con ocupación hotelera al 100%. El verano 2025 mostró +8% vs 2024. La ciudad cuenta con 1,700 habitaciones en hoteles formales + 800 en plataformas digitales. Esta demanda turística valida el potencial para una plaza temática cultural-gastronómica. Fuentes: Sectur SLP, Plano Empresarial, Pulso SLP.",
  tipo: "success"
}));
```

---

## 🏛️ Plazas Temáticas de Referencia Nacional

<div class="card">
  <h2>Casos de Éxito en México</h2>
  <p>Food halls y plazas culturales con concepto temático y enfoque experiencial similar al propuesto para Lienzo Charro.</p>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>🎪 Mercado Roma (CDMX)</h3>
    <p><strong>Ubicación:</strong> Colonia Roma Norte, Ciudad de México</p>
    <p><strong>Concepto:</strong> Food hall gourmet pionero (desde 2014)</p>
    <p><strong>Locales:</strong> 50+ puestos de comida gourmet y autor</p>
    <p><strong>GLA:</strong> ~3,500 m²</p>
    <p><strong>Mix:</strong> 75% F&B gourmet, 15% Retail artesanal, 10% Bar/Rooftop</p>
    <p><strong>Ticket promedio:</strong> $300-450 MXN</p>
    <p><strong>Rentas estimadas:</strong> $550-700 MXN/m²/mes</p>
    <p class="muted"><strong>Aprendizaje:</strong> Pionero del formato; ambiente "hipster" con calidad gastronómica. Aparece en rankings de "mercados cool" de CDMX. Fuerte posicionamiento en medios.</p>
  </div>
  <div class="card">
    <h3>🍷 Parián Condesa (CDMX)</h3>
    <p><strong>Ubicación:</strong> Colonia Condesa, Ciudad de México</p>
    <p><strong>Concepto:</strong> Food hall con regionalismos mexicanos</p>
    <p><strong>Locales:</strong> ~10 propuestas gastronómicas</p>
    <p><strong>GLA:</strong> ~1,200 m²</p>
    <p><strong>Mix:</strong> 90% F&B regional, 10% Bar</p>
    <p><strong>Ticket promedio:</strong> $280-380 MXN</p>
    <p><strong>Rentas estimadas:</strong> $500-650 MXN/m²/mes</p>
    <p class="muted"><strong>Aprendizaje:</strong> Escala pequeña pero enfocada. Combina regionalismos de distintas partes del país. Popular entre foodies por variedad y autenticidad.</p>
  </div>
</div>

<div class="grid grid-cols-2" style="margin-top: 1rem;">
  <div class="card">
    <h3>🎨 Fábrica La Aurora (GTO)</h3>
    <p><strong>Ubicación:</strong> San Miguel de Allende, Guanajuato</p>
    <p><strong>Concepto:</strong> Centro Cultural de Arte y Diseño en fábrica textil de 1902</p>
    <p><strong>Inicio:</strong> Transformado en centro cultural en 2004</p>
    <p><strong>GLA:</strong> ~12,000 m²</p>
    <p><strong>Mix:</strong> 40% Galerías de arte, 30% F&B gourmet, 20% Talleres/estudios, 10% Eventos</p>
    <p><strong>Modelo:</strong> Renta de espacios + comisión sobre ventas + talleres + gastronomía</p>
    <p><strong>Turismo:</strong> ~80% del tráfico es turismo (SMA es Patrimonio UNESCO)</p>
    <p class="muted"><strong>Aprendizaje:</strong> El patrimonio histórico del edificio agrega valor distintivo. Diversificación de ingresos reduce riesgo. Dependencia de turismo es riesgo pero también ventaja.</p>
  </div>
  <div class="card">
    <h3>📦 Barrio Satélite / Barrio Alameda (CDMX)</h3>
    <p><strong>Ubicación:</strong> Naucalpan (Satélite) y Centro Histórico (Alameda)</p>
    <p><strong>Concepto:</strong> Food halls en contenedores marítimos adaptados</p>
    <p><strong>Locales:</strong> ~18 (Satélite) y ~25 (Alameda)</p>
    <p><strong>GLA:</strong> ~800-1,200 m² cada uno</p>
    <p><strong>Mix:</strong> 85% F&B gourmet accesible, 15% Bar/Café</p>
    <p><strong>Ticket promedio:</strong> $180-280 MXN</p>
    <p><strong>Rentas estimadas:</strong> $400-550 MXN/m²/mes</p>
    <p class="muted"><strong>Aprendizaje:</strong> Diseño industrial atractivo + precios accesibles = mayor afluencia. Combinar calidad gourmet con precios medios amplía mercado.</p>
  </div>
</div>

---

## 📊 Comparativa de Indicadores

```js
{
  const comparativa = [
    {
      indicador: "Población 5km",
      lienzo_charro: `${(narrative.demographics.poblacion_5km / 1000).toFixed(0)}k`,
      mercado_roma: "~250k",
      fabrica_aurora: "~95k",
      barrio_satelite: "~320k",
      benchmark: "Variable"
    },
    {
      indicador: "NSE Índice",
      lienzo_charro: narrative.nse_analysis.indice_1km.toFixed(1),
      mercado_roma: "82-85",
      fabrica_aurora: "75-80",
      barrio_satelite: "70-75",
      benchmark: "65-85"
    },
    {
      indicador: "Turismo anual (est.)",
      lienzo_charro: "300k+ (Huasteca)",
      mercado_roma: "N/A (local)",
      fabrica_aurora: "~400k (SMA)",
      barrio_satelite: "N/A (local)",
      benchmark: ">100k para viabilidad"
    },
    {
      indicador: "GLA (m²)",
      lienzo_charro: "4,500-6,000",
      mercado_roma: "3,500",
      fabrica_aurora: "12,000",
      barrio_satelite: "800-1,200",
      benchmark: "1,000-12,000"
    },
    {
      indicador: "% F&B del mix",
      lienzo_charro: "60-65%",
      mercado_roma: "75%",
      fabrica_aurora: "30%",
      barrio_satelite: "85%",
      benchmark: "55-85%"
    },
    {
      indicador: "Rentas /m²/mes",
      lienzo_charro: "$280-380",
      mercado_roma: "$550-700",
      fabrica_aurora: "$350-500",
      barrio_satelite: "$400-550",
      benchmark: "$300-700"
    },
    {
      indicador: "Ticket promedio",
      lienzo_charro: "$300-400",
      mercado_roma: "$300-450",
      fabrica_aurora: "$400-500",
      barrio_satelite: "$180-280",
      benchmark: "$200-500"
    }
  ];
  
  const table = Inputs.table(comparativa, {
    select: false,
    columns: ["indicador", "lienzo_charro", "mercado_roma", "fabrica_aurora", "barrio_satelite", "benchmark"],
    header: {
      indicador: "Indicador",
      lienzo_charro: "Lienzo Charro",
      mercado_roma: "Mercado Roma",
      fabrica_aurora: "Fábrica Aurora",
      barrio_satelite: "Barrio Satélite",
      benchmark: "Rango Sector"
    },
    width: {
      indicador: 150,
      lienzo_charro: 130,
      mercado_roma: 120,
      fabrica_aurora: 120,
      barrio_satelite: 120,
      benchmark: 130
    }
  });
  
  display(table);
}
```

```js
display(InsightCard({
  titulo: "Posicionamiento Estratégico",
  descripcion: `Lienzo Charro tiene una ventaja competitiva única: el flujo turístico de la Huasteca Potosina (300k+ visitantes en temporada alta, crecimiento del 65% en 2024). Esto lo posiciona más cercano al modelo de Fábrica La Aurora (turismo cultural) que a Mercado Roma (mercado local). La población base de ${(narrative.demographics.poblacion_5km / 1000).toFixed(0)}k en 5km es menor que CDMX, pero el turismo puede compensar si se ejecuta correctamente el concepto temático huasteco.`,
  tipo: "info"
}));
```

---

## 🗺️ Destinos Turísticos Análogos

```js
display(InsightCard({
  titulo: "Ciudades con Modelo Turístico-Cultural Similar",
  descripcion: "Destinos mexicanos que han desarrollado exitosamente plazas o centros culturales-gastronómicos aprovechando el flujo turístico. Ciudad Valles comparte características clave: turismo natural/cultural, población media, y demanda de experiencias auténticas.",
  tipo: "info"
}));
```

```js
{
  const zonas_analogas = [
    {
      ciudad: "📍 San Miguel de Allende, GTO",
      turismo: "~1.5M/año",
      modelo: "Fábrica La Aurora",
      poblacion: "~175k",
      similitud: "★★★★★",
      aprendizaje: "Patrimonio UNESCO + arte + gastronomía. Turismo internacional alto. Modelo a escala mayor."
    },
    {
      ciudad: "📍 Pátzcuaro, Michoacán",
      turismo: "~800k/año",
      modelo: "Centros artesanales",
      poblacion: "~95k",
      similitud: "★★★★★",
      aprendizaje: "Cultura purépecha, artesanía premium, gastronomía regional. Escala similar a Cd Valles."
    },
    {
      ciudad: "📍 Xilitla, SLP (Huasteca)",
      turismo: "~200k/año",
      modelo: "Jardín surrealista + F&B",
      poblacion: "~55k",
      similitud: "★★★★☆",
      aprendizaje: "Mismo ecosistema turístico Huasteca. Demuestra demanda de experiencias culturales en la región."
    },
    {
      ciudad: "📍 Tepoztlán, Morelos",
      turismo: "~600k/año",
      modelo: "Mercado + tianguis cultural",
      poblacion: "~45k",
      similitud: "★★★★☆",
      aprendizaje: "Turismo wellness + cultural de CDMX. Precios premium sostenibles. Fin de semana fuerte."
    },
    {
      ciudad: "📍 Tequila, Jalisco",
      turismo: "~500k/año",
      modelo: "Ruta del Tequila",
      poblacion: "~42k",
      similitud: "★★★☆☆",
      aprendizaje: "Pueblo Mágico con producto ancla (tequila). Integración con experiencias gastronómicas."
    },
    {
      ciudad: "📍 Tlaquepaque, Jalisco",
      turismo: "~700k/año",
      modelo: "Patios artesanales",
      poblacion: "~680k (ZMG)",
      similitud: "★★★☆☆",
      aprendizaje: "Artesanía + gastronomía en zona metropolitana. Mayor población base pero competencia alta."
    }
  ];
  
  const table = Inputs.table(zonas_analogas, {
    select: false,
    columns: ["ciudad", "turismo", "modelo", "poblacion", "similitud", "aprendizaje"],
    header: {
      ciudad: "Destino",
      turismo: "Turismo Anual",
      modelo: "Modelo Exitoso",
      poblacion: "Población",
      similitud: "Similitud",
      aprendizaje: "Aprendizaje Clave"
    },
    width: {
      ciudad: 180,
      turismo: 100,
      modelo: 150,
      poblacion: 80,
      similitud: 80,
      aprendizaje: 280
    }
  });
  
  display(table);
}
```

<div class="note">
<strong>🔍 Análisis:</strong> Ciudad Valles tiene una ventaja única en la Huasteca Potosina: es el hub logístico y de servicios de la región con 300k+ turistas en temporada alta (crecimiento 65% en 2024). Los destinos análogos más relevantes son Pátzcuaro (escala similar, turismo cultural) y San Miguel de Allende (modelo Fábrica La Aurora). Fuentes: Sectur, INEGI, estudios de mercado.
</div>

---

## 🎯 Aprendizajes y Mejores Prácticas (2024-2025)

<div class="grid grid-cols-2">
  <div class="card">
    <h3>✅ Factores de Éxito</h3>
    <ul>
      <li><strong>Cocina regional reinterpretada:</strong> Tendencia 2024-2025. Ingredientes tradicionales + técnicas contemporáneas. La Huasteca tiene ingredientes únicos (zacahuil, enchiladas huastecas, cecina) que pueden elevarse a formato gourmet.</li>
      <li><strong>Comida callejera elevada:</strong> Los food halls exitosos (Barrio Alameda, Parián Condesa) demuestran que la comida callejera refinada atrae tanto a locales como turistas. Accesible pero premium.</li>
      <li><strong>Experiencias sociales y eventos:</strong> OpenTable 2024: la demanda de experiencias grupales, brunch, cenas especiales y música en vivo creció significativamente. El "dwell time" aumenta 40% con programación cultural.</li>
      <li><strong>Diversificación de ingresos:</strong> Modelo Fábrica La Aurora: renta de espacios + comisión sobre ventas + talleres + eventos + gastronomía. Reduce dependencia de un solo flujo de ingresos.</li>
      <li><strong>Diseño "instagrameable":</strong> 60% del marketing de food halls exitosos es orgánico (UGC). Invertir en photopoints, iluminación arquitectónica, señalética visual desde el diseño inicial.</li>
      <li><strong>Compromiso con lo local:</strong> Tendencia fuerte hacia ingredientes locales, proveedores regionales, trazabilidad. La Huasteca tiene historia y productos diferenciadores.</li>
    </ul>
  </div>
  <div class="card">
    <h3>❌ Errores a Evitar</h3>
    <ul>
      <li><strong>Subestimar CAPEX de diseño:</strong> Plazas temáticas requieren 30-40% más inversión en acabados vs plazas convencionales. Recortes en diseño destruyen el concepto y la experiencia.</li>
      <li><strong>Operadores genéricos:</strong> Franquicias o cadenas convencionales diluyen el concepto. Operadores deben creer en la visión temática huasteca y tener experiencia en cocina regional.</li>
      <li><strong>Depender solo de población local:</strong> Con ~118k habitantes en 5km (vs 250k+ en CDMX), la viabilidad depende de capturar 30-50% del tráfico del turismo Huasteca.</li>
      <li><strong>Ignorar estacionalidad:</strong> La Huasteca tiene temporadas altas definidas (Semana Santa, verano, puentes). El modelo financiero debe contemplar distribución 60-40 entre temporadas.</li>
      <li><strong>Lanzamiento sin momentum:</strong> Sincronizar apertura con FENEHUAP u otro evento regional. Cobertura de medios, influencers y alianzas con hoteles desde día 0.</li>
      <li><strong>No integrarse al ecosistema turístico:</strong> Alianzas con Sectur SLP, hoteles, tour operadores, y Pueblos Mágicos de la zona (Xilitla, Aquismón) son críticas para captura de turismo.</li>
    </ul>
  </div>
</div>

---

## 💡 Recomendaciones Estratégicas para Lienzo Charro

```js
{
  const recomendaciones = [
    {
      num: 1,
      recomendacion: "Alianza con Sectur SLP y FENEHUAP",
      fundamento: "La Huasteca creció 65% en turismo en 2024. Sincronizar apertura con FENEHUAP (300k visitantes en Semana Santa) e integrarse a rutas turísticas oficiales puede generar 30-40% del tráfico desde día 1.",
      prioridad: "Crítica",
      timeline: "Inmediato - 6 meses pre-apertura"
    },
    {
      num: 2,
      recomendacion: "Convenios con hoteles de Ciudad Valles",
      fundamento: "La ciudad tiene 1,700 habitaciones formales + 800 en apps digitales. Con ocupación de 95%+ en temporada alta, alianzas con hoteles para promoción cruzada y referidos son críticas.",
      prioridad: "Alta",
      timeline: "3 meses pre-apertura"
    },
    {
      num: 3,
      recomendacion: "Menú ancla: Cocina huasteca reinterpretada",
      fundamento: "Tendencia 2024-2025: cocina regional con presentación contemporánea. La Huasteca tiene ingredientes únicos (zacahuil, enchiladas huastecas, cecina, palmito) que pueden elevarse a formato gourmet premium.",
      prioridad: "Alta",
      timeline: "Fase de diseño - 6 meses"
    },
    {
      num: 4,
      recomendacion: "Integración con Pueblos Mágicos (Xilitla, Aquismón)",
      fundamento: "El turismo de la Huasteca es un ecosistema. Alianzas con operadores de tours a Xilitla (Jardín Surrealista), cascadas de Tamul, posiciona a Lienzo Charro como parada obligada en la ruta turística.",
      prioridad: "Alta",
      timeline: "Pre-apertura"
    },
    {
      num: 5,
      recomendacion: "Modelo financiero con estacionalidad 65-35",
      fundamento: "La Huasteca tiene picos muy marcados: Semana Santa, verano, puentes. Modelar 65% de ventas en 5 meses de temporada alta y 35% en 7 meses de temporada baja.",
      prioridad: "Media",
      timeline: "Fase de factibilidad"
    },
    {
      num: 6,
      recomendacion: "Presupuesto marketing: $250-400k MXN pre-apertura",
      fundamento: "Radio objetivo: 100km (incluye Tampico, Monterrey, SLP capital). Canales: influencers de viajes, medios regionales, alianzas con hoteles. El 60% del marketing de food halls exitosos es orgánico (UGC).",
      prioridad: "Media",
      timeline: "6 meses pre-apertura"
    },
    {
      num: 7,
      recomendacion: "Diversificar ingresos: talleres, eventos, tienda",
      fundamento: "Modelo Fábrica La Aurora: renta + ventas + talleres + eventos. Talleres de cocina huasteca, noches de huapango, venta de productos regionales (café, piloncillo, artesanía) reducen dependencia de F&B.",
      prioridad: "Media",
      timeline: "Fase de diseño"
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
    {mes: 1, escenario: "Conservador", venta_m2: 1200},
    {mes: 3, escenario: "Conservador", venta_m2: 1600},
    {mes: 6, escenario: "Conservador", venta_m2: 1900},
    {mes: 12, escenario: "Conservador", venta_m2: 2000},
    // Base
    {mes: 1, escenario: "Base", venta_m2: 1800},
    {mes: 3, escenario: "Base", venta_m2: 2400},
    {mes: 6, escenario: "Base", venta_m2: 3000},
    {mes: 12, escenario: "Base", venta_m2: 3200},
    // Optimista
    {mes: 1, escenario: "Optimista", venta_m2: 2500},
    {mes: 3, escenario: "Optimista", venta_m2: 3500},
    {mes: 6, escenario: "Optimista", venta_m2: 4500},
    {mes: 12, escenario: "Optimista", venta_m2: 4800}
  ];
  
  const chart = Plot.plot({
    height: 350,
    marginRight: 80,
    x: {
      label: "Mes →",
      tickFormat: d => `M${d}`,
      ticks: [1, 3, 6, 12]
    },
    y: {
      label: "↑ Venta/m²/mes (MXN)", 
      grid: true,
      tickFormat: d => `$${d.toLocaleString()}`
    },
    color: {
      domain: ["Conservador", "Base", "Optimista"],
      range: ["#EF4444", "#3B82F6", "#10B981"],
      legend: true
    },
    marks: [
      Plot.line(proyeccion_anual, {
        x: "mes",
        y: "venta_m2",
        stroke: "escenario",
        strokeWidth: 3,
        marker: "circle"
      }),
      Plot.text(proyeccion_anual.filter(d => d.mes === 12), {
        x: "mes",
        y: "venta_m2",
        text: d => `$${d.venta_m2.toLocaleString()}`,
        dx: 10,
        textAnchor: "start",
        fill: "escenario",
        fontWeight: 600,
        fontSize: 11
      })
    ]
  });
  
  display(chart);
}
```

<div class="note">
<strong>⚠️ Disclaimer:</strong> Proyecciones basadas en benchmarks de mercado y supuestos. No sustituyen un estudio de factibilidad financiera completo (pro-forma 5 años, análisis de sensibilidad, TIR/VPN). El escenario Base asume captura de 30-40% del turismo regional, lo cual debe validarse antes de comprometer CAPEX.
</div>

---

<div class="note">
  <strong>📚 Fuentes y Metodología:</strong>
  <ul style="margin: 0.5rem 0; padding-left: 1.25rem;">
    <li><strong>Turismo Huasteca:</strong> Sectur SLP, Plano Empresarial, Pulso SLP, Realidad San Luis (2024-2025)</li>
    <li><strong>Mercado Gourmet MX:</strong> IMARC Group Mexico Gourmet Foods Market Report 2024</li>
    <li><strong>Tendencias F&B:</strong> OpenTable Tendencias 2024-2025, Fast Company MX</li>
    <li><strong>Rentas Comerciales:</strong> CBRE México MarketView Retail 2T 2024</li>
    <li><strong>Plazas de Referencia:</strong> Forbes México, Wikipedia, Food and Pleasure, Milenio</li>
    <li><strong>Datos Demográficos:</strong> INEGI, DENUE, Pipeline STRTGY Geointelligence</li>
  </ul>
  <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #6B7280;">Última actualización: Enero 2026</p>
</div>

