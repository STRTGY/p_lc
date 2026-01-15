/**
 * Radar Chart para Componentes NSE
 * Visualización D3 de los 4 componentes del Nivel Socioeconómico
 */

import * as d3 from "npm:d3";

/**
 * Crea un radar chart de componentes NSE
 * @param {Object} data - Datos de componentes NSE
 * @param {number} data.educacion - Componente educación (0-100)
 * @param {number} data.vivienda - Componente vivienda (0-100)
 * @param {number} data.bienes - Componente bienes/assets (0-100)
 * @param {number} data.economico - Componente económico (0-100)
 * @param {Object} options - Opciones de configuración
 * @param {number} options.width - Ancho del gráfico
 * @param {number} options.height - Alto del gráfico
 * @param {number} options.levels - Número de niveles circulares
 * @param {number} options.maxValue - Valor máximo del radar (default: 100)
 */
export function NSERadarChart(data, {
  width = 400,
  height = 400,
  levels = 5,
  maxValue = 100,
  margin = 60
} = {}) {
  
  const categories = [
    {key: "educacion", label: "Educación"},
    {key: "vivienda", label: "Vivienda"},
    {key: "bienes", label: "Bienes"},
    {key: "economico", label: "Económico"}
  ];
  
  const values = categories.map(cat => data[cat.key] || 0);
  
  // Crear SVG
  const svg = d3.create("svg")
    .attr("viewBox", [-width/2, -height/2, width, height])
    .attr("style", "max-width: 100%; height: auto; font-family: sans-serif;");
  
  const radius = Math.min(width, height) / 2 - margin;
  
  // Escalas
  const angleScale = d3.scaleLinear()
    .domain([0, categories.length])
    .range([0, 2 * Math.PI]);
  
  const radiusScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius]);
  
  // Función para convertir coordenadas polares a cartesianas
  const angleToCoords = (angle, r) => ({
    x: r * Math.cos(angle - Math.PI / 2),
    y: r * Math.sin(angle - Math.PI / 2)
  });
  
  // Grupo principal
  const g = svg.append("g");
  
  // Dibujar círculos de nivel
  const levelGroup = g.append("g").attr("class", "levels");
  
  for (let level = 1; level <= levels; level++) {
    const r = radius * (level / levels);
    
    levelGroup.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", r)
      .attr("fill", "none")
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1);
    
    // Etiquetas de valor
    levelGroup.append("text")
      .attr("x", 5)
      .attr("y", -r + 5)
      .attr("font-size", 10)
      .attr("fill", "#6B7280")
      .text(Math.round((level / levels) * maxValue));
  }
  
  // Dibujar ejes radiales
  const axisGroup = g.append("g").attr("class", "axes");
  
  categories.forEach((cat, i) => {
    const angle = angleScale(i);
    const coords = angleToCoords(angle, radius);
    
    // Línea del eje
    axisGroup.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", coords.x)
      .attr("y2", coords.y)
      .attr("stroke", "#D1D5DB")
      .attr("stroke-width", 1);
    
    // Etiqueta de categoría
    const labelCoords = angleToCoords(angle, radius + 30);
    
    axisGroup.append("text")
      .attr("x", labelCoords.x)
      .attr("y", labelCoords.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 14)
      .attr("font-weight", "600")
      .attr("fill", "#1F2937")
      .text(cat.label);
  });
  
  // Generar puntos del polígono de datos
  const dataPoints = values.map((value, i) => {
    const angle = angleScale(i);
    const r = radiusScale(value);
    return angleToCoords(angle, r);
  });
  
  // Crear path para el polígono
  const lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveLinearClosed);
  
  // Área rellena del polígono
  g.append("path")
    .datum(dataPoints)
    .attr("d", lineGenerator)
    .attr("fill", "#3B82F6")
    .attr("fill-opacity", 0.25)
    .attr("stroke", "#2563EB")
    .attr("stroke-width", 2);
  
  // Puntos de datos
  const pointsGroup = g.append("g").attr("class", "data-points");
  
  dataPoints.forEach((point, i) => {
    const value = values[i];
    const cat = categories[i];
    
    // Determinar color basado en el valor
    const color = value >= 60 ? "#10B981" : value >= 40 ? "#F59E0B" : "#EF4444";
    
    pointsGroup.append("circle")
      .attr("cx", point.x)
      .attr("cy", point.y)
      .attr("r", 6)
      .attr("fill", color)
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .append("title")
      .text(`${cat.label}: ${value.toFixed(1)}`);
    
    // Valor numérico cerca del punto
    const labelOffset = angleToCoords(angleScale(i), radiusScale(value) + 15);
    
    pointsGroup.append("text")
      .attr("x", labelOffset.x)
      .attr("y", labelOffset.y)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("font-weight", "700")
      .attr("fill", color)
      .text(value.toFixed(1));
  });
  
  // Línea de referencia (promedio 60)
  const referenceValue = 60;
  const referenceR = radiusScale(referenceValue);
  
  g.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", referenceR)
    .attr("fill", "none")
    .attr("stroke", "#DC2626")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5")
    .attr("opacity", 0.5);
  
  // Leyenda
  const legend = svg.append("g")
    .attr("transform", `translate(${-width/2 + 20}, ${height/2 - 40})`);
  
  legend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 4)
    .attr("fill", "none")
    .attr("stroke", "#DC2626")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "3,3");
  
  legend.append("text")
    .attr("x", 10)
    .attr("y", 4)
    .attr("font-size", 11)
    .attr("fill", "#6B7280")
    .text("Referencia: 60");
  
  return svg.node();
}

/**
 * Radar chart comparativo (múltiples datasets)
 * @param {Array<Object>} datasets - Array de objetos con datos
 * @param {Object} options - Opciones de configuración
 */
export function NSERadarChartComparative(datasets, {
  width = 500,
  height = 500,
  levels = 5,
  maxValue = 100,
  margin = 80
} = {}) {
  
  const categories = [
    {key: "educacion", label: "Educación"},
    {key: "vivienda", label: "Vivienda"},
    {key: "bienes", label: "Bienes"},
    {key: "economico", label: "Económico"}
  ];
  
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  
  // Crear SVG
  const svg = d3.create("svg")
    .attr("viewBox", [-width/2, -height/2, width, height])
    .attr("style", "max-width: 100%; height: auto; font-family: sans-serif;");
  
  const radius = Math.min(width, height) / 2 - margin;
  
  // Escalas
  const angleScale = d3.scaleLinear()
    .domain([0, categories.length])
    .range([0, 2 * Math.PI]);
  
  const radiusScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius]);
  
  // Función para convertir coordenadas polares a cartesianas
  const angleToCoords = (angle, r) => ({
    x: r * Math.cos(angle - Math.PI / 2),
    y: r * Math.sin(angle - Math.PI / 2)
  });
  
  // Grupo principal
  const g = svg.append("g");
  
  // Dibujar círculos de nivel
  const levelGroup = g.append("g").attr("class", "levels");
  
  for (let level = 1; level <= levels; level++) {
    const r = radius * (level / levels);
    
    levelGroup.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", r)
      .attr("fill", "none")
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1);
    
    levelGroup.append("text")
      .attr("x", 5)
      .attr("y", -r + 5)
      .attr("font-size", 10)
      .attr("fill", "#6B7280")
      .text(Math.round((level / levels) * maxValue));
  }
  
  // Dibujar ejes radiales
  const axisGroup = g.append("g").attr("class", "axes");
  
  categories.forEach((cat, i) => {
    const angle = angleScale(i);
    const coords = angleToCoords(angle, radius);
    
    axisGroup.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", coords.x)
      .attr("y2", coords.y)
      .attr("stroke", "#D1D5DB")
      .attr("stroke-width", 1);
    
    const labelCoords = angleToCoords(angle, radius + 35);
    
    axisGroup.append("text")
      .attr("x", labelCoords.x)
      .attr("y", labelCoords.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 14)
      .attr("font-weight", "600")
      .attr("fill", "#1F2937")
      .text(cat.label);
  });
  
  // Dibujar cada dataset
  datasets.forEach((dataset, datasetIndex) => {
    const values = categories.map(cat => dataset.data[cat.key] || 0);
    const dataPoints = values.map((value, i) => {
      const angle = angleScale(i);
      const r = radiusScale(value);
      return angleToCoords(angle, r);
    });
    
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinearClosed);
    
    const color = colors[datasetIndex % colors.length];
    
    g.append("path")
      .datum(dataPoints)
      .attr("d", lineGenerator)
      .attr("fill", color)
      .attr("fill-opacity", 0.15)
      .attr("stroke", color)
      .attr("stroke-width", 2);
  });
  
  // Leyenda
  const legend = svg.append("g")
    .attr("transform", `translate(${-width/2 + 20}, ${-height/2 + 20})`);
  
  datasets.forEach((dataset, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);
    
    legendRow.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", colors[i % colors.length])
      .attr("fill-opacity", 0.5);
    
    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("font-size", 12)
      .attr("fill", "#1F2937")
      .text(dataset.name);
  });
  
  return svg.node();
}

