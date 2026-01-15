---
title: Afinidad Temática
---

# Afinidad Temática del Concepto

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

// Filtrar por categorías afines al concepto Lienzo Charro
const boutiques = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('46') && 
  (e.properties.nombre_act?.toLowerCase().includes('ropa') || 
   e.properties.nombre_act?.toLowerCase().includes('boutique') ||
   e.properties.nombre_act?.toLowerCase().includes('tienda'))
);

const artesania = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('454') ||
  e.properties.nombre_act?.toLowerCase().includes('artesanía') ||
  e.properties.nombre_act?.toLowerCase().includes('artesania') ||
  e.properties.nombre_act?.toLowerCase().includes('galería') ||
  e.properties.nombre_act?.toLowerCase().includes('regalo')
);

const gastronomia_tematica = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('722') &&
  (e.properties.nombre_act?.toLowerCase().includes('mexicana') ||
   e.properties.nombre_act?.toLowerCase().includes('regional') ||
   e.properties.nombre_act?.toLowerCase().includes('típica'))
);

const area_1km = 3.14; // π * 1²

// Calcular densidades
const count_boutiques = boutiques.length;
const count_artesania = artesania.length;
const count_gastronomia = gastronomia_tematica.length;

const densidad_boutiques = count_boutiques / area_1km;
const densidad_artesania = count_artesania / area_1km;
const densidad_gastronomia = count_gastronomia / area_1km;

// Evaluar afinidad (white space = alta, saturado = baja)
const afinidad_boutiques = count_boutiques < 5 ? "Alta" : count_boutiques < 15 ? "Media" : "Baja";
const afinidad_artesania = count_artesania < 3 ? "Alta" : count_artesania < 10 ? "Media" : "Baja";
const afinidad_gastronomia = count_gastronomia < 5 ? "Alta" : count_gastronomia < 15 ? "Media" : "Baja";
```

Análisis de giros afines al concepto de Lienzo Charro: boutiques, artesanía high-end y establecimientos culturales.

---

## 🎨 Concepto Lienzo Charro

<div class="card">
  <h2>Identidad del Proyecto</h2>
  <p>
    El Lienzo Charro busca consolidarse como un <strong>espacio temático que celebra la tradición mexicana</strong> con un enfoque premium, combinando:
  </p>
  <ul>
    <li><strong>Gastronomía regional</strong> de alto nivel</li>
    <li><strong>Artesanía y productos locales</strong> con estándares de calidad</li>
    <li><strong>Experiencias culturales</strong> auténticas</li>
    <li><strong>Comercio boutique</strong> con identidad mexicana</li>
  </ul>
</div>

---

## 📊 Giros Afines Identificados

<div class="grid grid-cols-3">

```js
display(MetricCard({
  label: "Boutiques y Retail",
  value: count_boutiques,
  subtitle: `${densidad_boutiques.toFixed(1)}/km² - Afinidad: ${afinidad_boutiques}`,
  color: afinidad_boutiques === "Alta" ? "green" : afinidad_boutiques === "Media" ? "yellow" : "red",
  icon: "🛍️"
}));
```

```js
display(MetricCard({
  label: "Artesanía y Galerías",
  value: count_artesania,
  subtitle: `${densidad_artesania.toFixed(1)}/km² - Afinidad: ${afinidad_artesania}`,
  color: afinidad_artesania === "Alta" ? "green" : afinidad_artesania === "Media" ? "yellow" : "red",
  icon: "🎨"
}));
```

```js
display(MetricCard({
  label: "Gastronomía Temática",
  value: count_gastronomia,
  subtitle: `${densidad_gastronomia.toFixed(1)}/km² - Afinidad: ${afinidad_gastronomia}`,
  color: afinidad_gastronomia === "Alta" ? "green" : afinidad_gastronomia === "Media" ? "yellow" : "red",
  icon: "🍽️"
}));
```

</div>

<div class="note">
**💡 Interpretación de Afinidad:**
- 🟢 **Alta:** < 5 establecimientos/km² - White space, alta oportunidad
- 🟡 **Media:** 5-15 establecimientos/km² - Mercado competido, requiere diferenciación
- 🔴 **Baja:** > 15 establecimientos/km² - Saturación, evitar o posicionar muy premium
</div>

---

## 🗺️ Mapa de Giros Afines

```js
{
  // Filtrar solo establecimientos afines
  const afines_geojson = {
    type: "FeatureCollection",
    features: [...boutiques, ...artesania, ...gastronomia_tematica]
  };
  
  const mapa = BaseMap({
    center: [sitio.features[0].geometry.coordinates[0], sitio.features[0].geometry.coordinates[1]],
    zoom: 13,
    height: 600,
    layers: [
      ParagonLayerPresets.denue(afines_geojson),
      ParagonLayerPresets.buffers(buffers),
      ParagonLayerPresets.sitio(sitio)
    ]
  });
  
  display(mapa);
}
```

<div class="note">
**🎨 Categorías visualizadas:** El mapa muestra únicamente establecimientos con afinidad al concepto Lienzo Charro (boutiques, artesanía, gastronomía temática). Haz clic en cualquier punto para ver detalles del establecimiento.
</div>

---

## 📈 Análisis de Afinidad por Categoría

```js
display(InsightCard({
  titulo: "Índice de Afinidad al Concepto",
  descripcion: "Evaluación de qué tan bien se alinea cada categoría con el concepto del Lienzo Charro, considerando afinidad conceptual (fit temático) y oportunidad de mercado (white space).",
  tipo: "info"
}));
```

```js
{
  // Calcular más categorías
  const cafeterias = denue_json.features.filter(e => 
    e.properties.nombre_act?.toLowerCase().includes('cafetería') ||
    e.properties.nombre_act?.toLowerCase().includes('café')
  ).length;
  
  const joyerias = denue_json.features.filter(e => 
    e.properties.codigo_act?.startsWith('465') ||
    e.properties.nombre_act?.toLowerCase().includes('joyería') ||
    e.properties.nombre_act?.toLowerCase().includes('bisutería')
  ).length;
  
  const categorias = [
    {
      categoria: "Restaurantes mexicanos",
      afinidad_estrellas: "★★★★★",
      afinidad_num: 5,
      densidad: densidad_gastronomia.toFixed(1),
      gap: count_gastronomia < 5 ? "White space - Alta oportunidad" : count_gastronomia < 15 ? "Mercado competido" : "Saturado",
      prioridad: "Alta"
    },
    {
      categoria: "Artesanía y regalos",
      afinidad_estrellas: "★★★★★",
      afinidad_num: 5,
      densidad: densidad_artesania.toFixed(1),
      gap: count_artesania < 3 ? "White space - Alta oportunidad" : count_artesania < 10 ? "Existente - Diferenciación" : "Saturado",
      prioridad: "Alta"
    },
    {
      categoria: "Boutiques de ropa",
      afinidad_estrellas: "★★★★☆",
      afinidad_num: 4,
      densidad: densidad_boutiques.toFixed(1),
      gap: count_boutiques < 5 ? "White space - Oportunidad" : count_boutiques < 15 ? "Mercado moderado" : "Competido",
      prioridad: "Media-Alta"
    },
    {
      categoria: "Cafeterías especializadas",
      afinidad_estrellas: "★★★★☆",
      afinidad_num: 4,
      densidad: (cafeterias / area_1km).toFixed(1),
      gap: cafeterias < 3 ? "White space - Oportunidad" : cafeterias < 10 ? "Mercado moderado" : "Competido",
      prioridad: "Media-Alta"
    },
    {
      categoria: "Joyerías y accesorios",
      afinidad_estrellas: "★★★☆☆",
      afinidad_num: 3,
      densidad: (joyerias / area_1km).toFixed(1),
      gap: joyerias < 3 ? "White space - Considerar" : joyerias < 8 ? "Existente - Niche" : "Competido",
      prioridad: "Media"
    }
  ];
  
  const table = Inputs.table(categorias, {
    columns: ["categoria", "afinidad_estrellas", "densidad", "gap", "prioridad"],
    header: {
      categoria: "Categoría SCIAN",
      afinidad_estrellas: "Afinidad Conceptual",
      densidad: "Densidad Actual (/km²)",
      gap: "Gap/Oportunidad",
      prioridad: "Prioridad"
    },
    width: {
      categoria: 200,
      afinidad_estrellas: 150,
      densidad: 150,
      gap: 250,
      prioridad: 100
    }
  });
  
  display(table);
}
```

```js
{
  // Gráfico de barras horizontal de afinidad
  const categorias = [
    {nombre: "Restaurantes mexicanos", score: 5},
    {nombre: "Artesanía y regalos", score: 5},
    {nombre: "Boutiques de ropa", score: 4},
    {nombre: "Cafeterías especializadas", score: 4},
    {nombre: "Joyerías y accesorios", score: 3}
  ];
  
  const chart = Plot.plot({
    marginLeft: 220,
    height: 250,
    x: {domain: [0, 5], label: "Score de Afinidad →"},
    marks: [
      Plot.barX(categorias, {
        y: "nombre",
        x: "score",
        fill: d => d.score >= 5 ? "#10B981" : d.score >= 4 ? "#3B82F6" : "#F59E0B",
        sort: {y: "-x"}
      }),
      Plot.text(categorias, {
        y: "nombre",
        x: "score",
        text: d => "★".repeat(d.score),
        dx: 10,
        fill: "#1F2937"
      })
    ]
  });
  
  display(chart);
}
```

---

## 🎯 Tenant Mix Sugerido

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Anclas Temáticas (20-30%)</h3>
    <ul>
      <li><strong>Restaurante principal:</strong> Cocina regional de alta gama</li>
      <li><strong>Galería/Tienda artesanal:</strong> Showcase de artesanos locales</li>
    </ul>
  </div>
  <div class="card">
    <h3>Comercio Complementario (40-50%)</h3>
    <ul>
      <li>Boutiques de ropa y accesorios mexicanos</li>
      <li>Tiendas de productos gourmet regionales</li>
      <li>Joyería y bisutería artesanal</li>
    </ul>
  </div>
  <div class="card">
    <h3>Servicios y F&B (20-30%)</h3>
    <ul>
      <li>Cafeterías especializadas</li>
      <li>Heladerías/neverías tradicionales</li>
      <li>Servicios de eventos/workshops</li>
    </ul>
  </div>
  <div class="card">
    <h3>Experiencias (10-15%)</h3>
    <ul>
      <li>Talleres de artesanía</li>
      <li>Espacio para eventos culturales</li>
      <li>Fotografía/memorabilia</li>
    </ul>
  </div>
</div>

---

## 💡 Recomendaciones Estratégicas

<div class="card">
  <h3>Diferenciadores Clave</h3>
  <ol>
    <li><strong>Autenticidad premium:</strong> Curaduría cuidadosa de inquilinos que representen auténticamente la cultura mexicana con estándares de calidad altos.</li>
    <li><strong>Mix experiencial:</strong> No solo comercio, sino experiencias memorables (talleres, degustaciones, eventos).</li>
    <li><strong>Diseño temático consistente:</strong> Arquitectura y ambientación que refuercen el concepto del Lienzo Charro.</li>
    <li><strong>Perfil de inquilino:</strong> Priorizar emprendedores locales y marcas boutique sobre cadenas genéricas.</li>
  </ol>
</div>

---

<div class="tip">
  <strong>Siguiente paso:</strong> Revisar la <a href="./restaurante-ancla">viabilidad del restaurante ancla</a> como principal atractor del concepto.
</div>

