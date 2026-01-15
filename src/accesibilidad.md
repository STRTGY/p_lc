# Análisis de Accesibilidad

```js
import {BaseMap, ParagonLayerPresets} from "./components/BaseMap.js";
import {processIsocronasHERE} from "./data/loaders.js";
import {InsightCard, MetricCard} from "./components/InsightCard.js";
import {IsochroneLegend} from "./components/LegendBox.js";
import * as Plot from "npm:@observablehq/plot";

// Cargar datos
const narrative = await FileAttachment("./data/narrative.json").json();
const sitio = await FileAttachment("./data/layers/01_lienzo_charro_sitio_terreno.geojson").json();
const buffers = await FileAttachment("./data/layers/02_lienzo_charro_buffers_analisis.geojson").json();
const isocronas = await FileAttachment("./data/layers/08_lienzo_charro_isocronas_here.geojson").json();

const isocronas_data = processIsocronasHERE(isocronas);
```

---

## 📊 Métricas de Accesibilidad

<div class="grid grid-cols-3">

```js
display(MetricCard({
  label: "Área 5 min",
  value: `${narrative.connectivity.isochrones[0].area_km2.toFixed(1)} km²`,
  subtitle: `Eficiencia: ${narrative.connectivity.isochrones[0].eficiencia}%`,
  color: narrative.connectivity.isochrones[0].eficiencia > 50 ? "#10B981" : "#EF4444",
  trend: narrative.connectivity.isochrones[0].eficiencia > 50 ? "up" : "down"
}));
```

```js
display(MetricCard({
  label: "Área 10 min",
  value: `${narrative.connectivity.isochrones[1].area_km2.toFixed(1)} km²`,
  subtitle: `Eficiencia: ${narrative.connectivity.isochrones[1].eficiencia}%`,
  color: narrative.connectivity.isochrones[1].eficiencia > 50 ? "#10B981" : "#F59E0B"
}));
```

```js
display(MetricCard({
  label: "Área 15 min",
  value: `${narrative.connectivity.isochrones[2].area_km2.toFixed(1)} km²`,
  subtitle: `Eficiencia: ${narrative.connectivity.isochrones[2].eficiencia}%`,
  color: narrative.connectivity.isochrones[2].eficiencia > 60 ? "#10B981" : "#F59E0B",
  trend: narrative.connectivity.isochrones[2].eficiencia > 60 ? "up" : "neutral"
}));
```

</div>

---

## 💡 Interpretación de Accesibilidad

```js
display(InsightCard({
  titulo: "Análisis de Conectividad",
  descripcion: narrative.connectivity.interpretacion,
  tipo: "warning"
}));
```

---

## 🗺️ Mapa: Isócronas HERE API

```js
{
  const mapa = BaseMap({
    center: [sitio.features[0].geometry.coordinates[0], sitio.features[0].geometry.coordinates[1]],
    zoom: 11,
    height: 600,
    layers: [
      ParagonLayerPresets.isocronas(isocronas),
      ParagonLayerPresets.buffers(buffers),
      ParagonLayerPresets.sitio(sitio)
    ]
  });
  
  display(mapa);
}
```

```js
display(IsochroneLegend());
```

<div class="note">
<strong>🚗 Acerca de las Isócronas HERE:</strong> Calculadas con la API HERE, estas áreas consideran la red vial real, límites de velocidad y patrones de flujo de tráfico. Representan las zonas alcanzables en automóvil desde el sitio en los tiempos indicados.
</div>

---

## 📊 Comparativa: Buffers Euclidianos vs Isócronas HERE

```js
{
  const comparativa = [
    {tipo: "Buffer 500m", area: 0.79, metodo: "Euclidiano", tiempo: null},
    {tipo: "Buffer 1km", area: 3.14, metodo: "Euclidiano", tiempo: null},
    {tipo: "Isócrona 5min", area: isocronas_data[0].area_km2, metodo: "HERE API", tiempo: 5},
    {tipo: "Buffer 2km", area: 12.57, metodo: "Euclidiano", tiempo: null},
    {tipo: "Isócrona 10min", area: isocronas_data[1].area_km2, metodo: "HERE API", tiempo: 10},
    {tipo: "Buffer 5km", area: 78.54, metodo: "Euclidiano", tiempo: null},
    {tipo: "Isócrona 15min", area: isocronas_data[2].area_km2, metodo: "HERE API", tiempo: 15}
  ];
  
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 400,
    marginLeft: 150,
    x: {label: "Área (km²) →", grid: true},
    y: {label: null},
    color: {
      domain: ["Euclidiano", "HERE API"],
      range: ["#3B82F6", "#10B981"],
      legend: true
    },
    marks: [
      Plot.barX(comparativa, {
        y: "tipo",
        x: "area",
        fill: "metodo",
        sort: {y: null}
      }),
      Plot.text(comparativa, {
        y: "tipo",
        x: "area",
        text: d => `${d.area.toFixed(1)} km²`,
        dx: 10,
        textAnchor: "start",
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
<strong>📐 Diferencias clave:</strong> Las isócronas HERE consideran la red vial real, mientras que los buffers euclidianos asumen distancia en línea recta. En áreas urbanas con infraestructura vial compleja, las isócronas ofrecen una representación más precisa del alcance real.
</div>

---

## 📈 Eficiencia de Isócronas

```js
{
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 350,
    x: {label: "Tiempo (minutos) →"},
    y: {domain: [0, 100], label: "↑ Eficiencia (%)", grid: true},
    color: {legend: false},
    marks: [
      Plot.ruleY([50, 70], {stroke: "#D1D5DB", strokeDasharray: "4,4"}),
      Plot.text([{x: 5.5, y: 52, text: "Umbral bajo"}], {fill: "#6B7280", fontSize: 11}),
      Plot.text([{x: 5.5, y: 72, text: "Umbral aceptable"}], {fill: "#6B7280", fontSize: 11}),
      Plot.barY(isocronas_data, {
        x: "tiempo_min",
        y: "eficiencia",
        fill: d => d.eficiencia < 50 ? "#EF4444" : d.eficiencia < 70 ? "#F59E0B" : "#10B981"
      }),
      Plot.text(isocronas_data, {
        x: "tiempo_min",
        y: "eficiencia",
        text: d => `${d.eficiencia}%`,
        dy: -10,
        fontWeight: "600",
        fill: "#1F2937"
      }),
      Plot.line(isocronas_data, {
        x: "tiempo_min",
        y: "eficiencia",
        stroke: "#2563EB",
        strokeWidth: 2,
        marker: "circle"
      })
    ]
  });
  
  display(chart);
}
```

<div class="note">
<strong>🔢 Cálculo de Eficiencia:</strong> La eficiencia se calcula como (Área Isócrona / Área Buffer Equivalente) × 100. Una eficiencia del 100% significaría que el área alcanzable en tiempo real es igual a un círculo perfecto. Valores menores indican restricciones viales.

<strong>⚠️ Interpretación:</strong>
<ul>
<li><strong>&lt; 50%:</strong> Conectividad muy limitada (alta fricción vial)</li>
<li><strong>50-70%:</strong> Conectividad aceptable con restricciones</li>
<li><strong>&gt; 70%:</strong> Buena conectividad vial</li>
</ul>
</div>

---

## 📊 Área Acumulada por Tiempo

```js
{
  const chart = Plot.plot({
    width: Math.min(960, width),
    height: 350,
    x: {label: "Tiempo (minutos) →"},
    y: {label: "↑ Área acumulada (km²)", grid: true},
    marks: [
      Plot.areaY(isocronas_data, {
        x: "tiempo_min",
        y: "area_km2",
        fill: "#3B82F6",
        fillOpacity: 0.3,
        curve: "catmull-rom"
      }),
      Plot.line(isocronas_data, {
        x: "tiempo_min",
        y: "area_km2",
        stroke: "#2563EB",
        strokeWidth: 3,
        marker: "circle",
        curve: "catmull-rom"
      }),
      Plot.text(isocronas_data, {
        x: "tiempo_min",
        y: "area_km2",
        text: d => `${d.area_km2.toFixed(1)} km²`,
        dy: -15,
        fontWeight: "600",
        fill: "#2563EB"
      })
    ]
  });
  
  display(chart);
}
```

---

## 📋 Tabla Detallada de Isócronas

```js
{
  const table = Inputs.table(isocronas_data, {
    select: false,
    columns: ["tiempo_min", "area_km2", "radio_aprox_m", "eficiencia", "area_buffer_equiv", "interpretacion"],
    header: {
      tiempo_min: "Tiempo (min)",
      area_km2: "Área Real (km²)",
      radio_aprox_m: "Radio Aprox (m)",
      eficiencia: "Eficiencia (%)",
      area_buffer_equiv: "Área Buffer (km²)",
      interpretacion: "Nivel"
    },
    format: {
      area_km2: d => d.toFixed(2),
      radio_aprox_m: d => d.toLocaleString(),
      eficiencia: d => `${d}%`
    },
    width: {
      tiempo_min: 100,
      area_km2: 130,
      radio_aprox_m: 130,
      eficiencia: 120,
      area_buffer_equiv: 140,
      interpretacion: 120
    }
  });
  
  display(table);
}
```

---

## 🎯 Implicaciones para el Proyecto

```js
{
  const implicaciones = [
    {
      factor: "Posicionamiento",
      evaluacion: "Destino vs Tránsito",
      recomendacion: "Posicionar como destino gastronómico-cultural que amerite el desplazamiento intencional"
    },
    {
      factor: "Marketing",
      evaluacion: "Radio primario limitado",
      recomendacion: "Expandir alcance con marketing regional (10-15 min) y eventos para atraer desde mayor distancia"
    },
    {
      factor: "Estacionamiento",
      evaluacion: "Crítico para acceso",
      recomendacion: "Dimensionar parking generoso (120-150 plazas) con señalización clara desde vialidades principales"
    },
    {
      factor: "Horarios",
      evaluacion: "Dependencia de viajes planeados",
      recomendacion: "Concentrar operación en horarios pico (comidas, fines de semana) con eventos nocturnos"
    }
  ];
  
  const table = Inputs.table(implicaciones, {
    select: false,
    width: {
      factor: 150,
      evaluacion: 200,
      recomendacion: 400
    }
  });
  
  display(table);
}
```

---

## 🔗 Navegación

<div class="grid grid-cols-2">
  <a href="./demanda-nse" class="card">← Anterior: Demanda y NSE</a>
  <a href="./competencia" class="card">Siguiente: Competencia →</a>
</div>
