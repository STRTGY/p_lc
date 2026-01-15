/**
 * MetricCardWithTrend - Card de métrica con tendencia visual
 * Componente reutilizable para mostrar KPIs con sparkline
 */

import * as Plot from "npm:@observablehq/plot";

/**
 * Crea una tarjeta de métrica con valor, label y tendencia opcional
 * @param {Object} config - Configuración del card
 * @param {string} config.label - Etiqueta de la métrica
 * @param {number|string} config.value - Valor principal
 * @param {string} config.subtitle - Subtítulo opcional
 * @param {Array} config.trend - Datos de tendencia [opcional]
 * @param {string} config.color - Color del card (green, yellow, red, blue)
 * @param {string} config.icon - Emoji o icono
 * @returns {HTMLElement}
 */
export function MetricCardWithTrend({
  label,
  value,
  subtitle = "",
  trend = null,
  color = "blue",
  icon = "📊"
}) {
  const colorMap = {
    green: "#10B981",
    yellow: "#FBBF24",
    red: "#EF4444",
    blue: "#3b82f6",
    purple: "#8b5cf6"
  };

  const card = document.createElement("div");
  card.className = "card";
  card.style.borderLeft = `4px solid ${colorMap[color] || colorMap.blue}`;
  card.style.padding = "16px";
  card.style.minHeight = "120px";

  // Header con icono y label
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.gap = "8px";
  header.style.marginBottom = "8px";
  header.innerHTML = `
    <span style="font-size: 24px;">${icon}</span>
    <span style="font-size: 12px; text-transform: uppercase; opacity: 0.7; font-weight: 600;">${label}</span>
  `;
  card.appendChild(header);

  // Valor principal
  const valueEl = document.createElement("div");
  valueEl.style.fontSize = "32px";
  valueEl.style.fontWeight = "bold";
  valueEl.style.color = colorMap[color];
  valueEl.style.marginBottom = "4px";
  valueEl.textContent = value;
  card.appendChild(valueEl);

  // Subtítulo
  if (subtitle) {
    const subtitleEl = document.createElement("div");
    subtitleEl.style.fontSize = "14px";
    subtitleEl.style.opacity = "0.6";
    subtitleEl.textContent = subtitle;
    card.appendChild(subtitleEl);
  }

  // Sparkline (si hay datos de tendencia)
  if (trend && trend.length > 0) {
    const sparkline = Plot.plot({
      width: 200,
      height: 40,
      margin: 0,
      marginTop: 8,
      x: { axis: null },
      y: { axis: null },
      marks: [
        Plot.lineY(trend, {
          x: (d, i) => i,
          y: d => d,
          stroke: colorMap[color],
          strokeWidth: 2
        }),
        Plot.areaY(trend, {
          x: (d, i) => i,
          y: d => d,
          fill: colorMap[color],
          fillOpacity: 0.2
        })
      ]
    });
    card.appendChild(sparkline);
  }

  return card;
}

/**
 * Grid de Metric Cards
 * @param {Array} metrics - Array de configuraciones de métricas
 * @param {number} cols - Número de columnas (default: 4)
 */
export function MetricCardsGrid(metrics, cols = 4) {
  const grid = document.createElement("div");
  grid.className = `grid grid-cols-${cols}`;
  grid.style.gap = "16px";
  grid.style.marginBottom = "24px";

  metrics.forEach(metric => {
    grid.appendChild(MetricCardWithTrend(metric));
  });

  return grid;
}

