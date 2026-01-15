/**
 * LegendBox - Leyenda reutilizable para mapas y visualizaciones
 * Componente para explicar el significado de colores y símbolos
 */

/**
 * Crea una leyenda visual para mapas
 * @param {Object} config - Configuración de la leyenda
 * @param {string} config.title - Título de la leyenda
 * @param {Array} config.items - Items de la leyenda [{color, label, description}]
 * @param {string} config.type - Tipo: "categorical", "gradient", "size"
 * @returns {HTMLElement}
 */
export function LegendBox({ title, items, type = "categorical" }) {
  const container = document.createElement("div");
  container.style.cssText = `
    background: var(--theme-background-alt, #f8f9fa);
    border: 1px solid var(--theme-foreground-faint, #e5e7eb);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    font-size: 14px;
  `;

  // Título
  if (title) {
    const titleEl = document.createElement("div");
    titleEl.style.cssText = `
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    `;
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }

  // Items de leyenda
  const itemsContainer = document.createElement("div");
  
  if (type === "categorical") {
    itemsContainer.style.display = "flex";
    itemsContainer.style.flexDirection = "column";
    itemsContainer.style.gap = "8px";

    items.forEach(item => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "12px";

      // Color box
      const colorBox = document.createElement("div");
      colorBox.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background: ${item.color};
        flex-shrink: 0;
        border: 1px solid rgba(0,0,0,0.1);
      `;
      row.appendChild(colorBox);

      // Label y descripción
      const textContainer = document.createElement("div");
      textContainer.style.flex = "1";
      
      const label = document.createElement("span");
      label.style.fontWeight = "500";
      label.textContent = item.label;
      textContainer.appendChild(label);

      if (item.description) {
        const desc = document.createElement("span");
        desc.style.cssText = "opacity: 0.6; font-size: 12px; margin-left: 8px;";
        desc.textContent = `(${item.description})`;
        textContainer.appendChild(desc);
      }

      row.appendChild(textContainer);
      itemsContainer.appendChild(row);
    });
  } else if (type === "gradient") {
    // Gradiente continuo
    const gradient = document.createElement("div");
    gradient.style.cssText = `
      height: 24px;
      border-radius: 4px;
      background: linear-gradient(to right, ${items.map(i => i.color).join(", ")});
      margin-bottom: 8px;
      border: 1px solid rgba(0,0,0,0.1);
    `;
    itemsContainer.appendChild(gradient);

    // Labels de gradiente
    const labels = document.createElement("div");
    labels.style.cssText = `
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      opacity: 0.7;
    `;
    labels.innerHTML = `
      <span>${items[0].label}</span>
      <span>${items[items.length - 1].label}</span>
    `;
    itemsContainer.appendChild(labels);
  } else if (type === "size") {
    itemsContainer.style.cssText = "display: flex; align-items: center; gap: 20px;";

    items.forEach(item => {
      const sizeItem = document.createElement("div");
      sizeItem.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 4px;";

      const circle = document.createElement("div");
      circle.style.cssText = `
        width: ${item.size}px;
        height: ${item.size}px;
        border-radius: 50%;
        background: ${item.color || "#3b82f6"};
        opacity: 0.7;
      `;
      sizeItem.appendChild(circle);

      const label = document.createElement("span");
      label.style.cssText = "font-size: 12px; opacity: 0.7;";
      label.textContent = item.label;
      sizeItem.appendChild(label);

      itemsContainer.appendChild(sizeItem);
    });
  }

  container.appendChild(itemsContainer);
  return container;
}

/**
 * Leyenda predefinida para NSE
 */
export function NSELegend() {
  return LegendBox({
    title: "Nivel Socioeconómico",
    type: "categorical",
    items: [
      { color: "#059669", label: "AB", description: "Alto" },
      { color: "#10B981", label: "C+", description: "Medio Alto" },
      { color: "#FBBF24", label: "C", description: "Medio" },
      { color: "#F59E0B", label: "D+", description: "Medio Bajo" },
      { color: "#EF4444", label: "D/E", description: "Bajo" }
    ]
  });
}

/**
 * Leyenda predefinida para Isócronas
 */
export function IsochroneLegend() {
  return LegendBox({
    title: "Tiempo de Viaje",
    type: "categorical",
    items: [
      { color: "#10B981", label: "5 minutos", description: "Automóvil" },
      { color: "#FBBF24", label: "10 minutos", description: "Automóvil" },
      { color: "#EF4444", label: "15 minutos", description: "Automóvil" }
    ]
  });
}

/**
 * Leyenda predefinida para Densidad de Competencia
 */
export function CompetitionDensityLegend() {
  return LegendBox({
    title: "Densidad de Competencia",
    type: "categorical",
    items: [
      { color: "#10B981", label: "Baja", description: "< 5 establecimientos" },
      { color: "#FBBF24", label: "Media", description: "5-15 establecimientos" },
      { color: "#F59E0B", label: "Alta", description: "15-30 establecimientos" },
      { color: "#EF4444", label: "Muy Alta", description: "> 30 establecimientos" }
    ]
  });
}

/**
 * Leyenda de gradiente para índices continuos
 */
export function IndexGradientLegend({ title, minLabel, maxLabel, colors }) {
  return LegendBox({
    title,
    type: "gradient",
    items: [
      { color: colors[0], label: minLabel },
      { color: colors[1], label: "" },
      { color: colors[2], label: maxLabel }
    ]
  });
}

