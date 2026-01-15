/**
 * Insight Card Components
 * Componentes para mostrar insights y narrativa estratégica del Deep Agent
 */

import * as htl from "npm:htl";

/**
 * Tarjeta de insight con estilo STRTGY
 * @param {Object} options
 * @param {string} options.titulo - Título del insight
 * @param {string} options.descripcion - Descripción detallada
 * @param {string} options.fuente - Fuente de datos (opcional)
 * @param {string} options.tipo - Tipo de insight: success, warning, info, danger
 */
export function InsightCard({titulo, descripcion, fuente = null, tipo = "info"}) {
  const colors = {
    success: {
      bg: "#ECFDF5",
      border: "#10B981",
      icon: "✓",
      iconBg: "#10B981"
    },
    warning: {
      bg: "#FFFBEB",
      border: "#F59E0B",
      icon: "⚠",
      iconBg: "#F59E0B"
    },
    info: {
      bg: "#EFF6FF",
      border: "#3B82F6",
      icon: "ℹ",
      iconBg: "#3B82F6"
    },
    danger: {
      bg: "#FEF2F2",
      border: "#EF4444",
      icon: "✕",
      iconBg: "#EF4444"
    }
  };
  
  const style = colors[tipo] || colors.info;
  
  return htl.html`
    <div style="
      background: ${style.bg};
      border-left: 4px solid ${style.border};
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    ">
      <div style="display: flex; align-items: start; gap: 1rem;">
        <div style="
          background: ${style.iconBg};
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        ">${style.icon}</div>
        <div style="flex: 1;">
          <h4 style="margin: 0 0 0.5rem 0; color: #1F2937; font-size: 1.125rem; font-weight: 600;">
            ${titulo}
          </h4>
          <p style="margin: 0; color: #4B5563; line-height: 1.5;">
            ${descripcion}
          </p>
          ${fuente ? htl.html`
            <p style="margin: 0.75rem 0 0 0; font-size: 0.875rem; color: #6B7280; font-style: italic;">
              Fuente: ${fuente}
            </p>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Badge de veredicto prominente
 * @param {Object} options
 * @param {string} options.veredicto - GO, CONDICIONAL, NO-GO
 * @param {string} options.size - small, medium, large
 */
export function VerdictBadge({veredicto, size = "medium"}) {
  const styles = {
    "GO": {
      bg: "#10B981",
      text: "✓ RECOMENDADO",
      color: "#FFFFFF"
    },
    "CONDICIONAL": {
      bg: "#F59E0B",
      text: "⚠ CONDICIONAL",
      color: "#FFFFFF"
    },
    "NO-GO": {
      bg: "#EF4444",
      text: "✕ NO RECOMENDADO",
      color: "#FFFFFF"
    }
  };
  
  const sizes = {
    small: {fontSize: "0.875rem", padding: "0.5rem 1rem"},
    medium: {fontSize: "1rem", padding: "0.75rem 1.5rem"},
    large: {fontSize: "1.25rem", padding: "1rem 2rem"}
  };
  
  const style = styles[veredicto] || styles.CONDICIONAL;
  const sizeStyle = sizes[size] || sizes.medium;
  
  return htl.html`
    <div style="
      background: ${style.bg};
      color: ${style.color};
      padding: ${sizeStyle.padding};
      border-radius: 0.5rem;
      font-weight: 700;
      font-size: ${sizeStyle.fontSize};
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: inline-block;
      letter-spacing: 0.05em;
    ">
      ${style.text}
    </div>
  `;
}

/**
 * Indicador visual de ROI
 * @param {Object} options
 * @param {string} options.rango - Rango de ROI (ej: "12-18% IRR")
 * @param {string} options.confianza - Nivel de confianza: ALTO, MEDIO, BAJO
 * @param {string} options.horizonte - Horizonte temporal (opcional)
 */
export function ROIIndicator({rango, confianza, horizonte = null}) {
  const confianzaColors = {
    "ALTO": {color: "#10B981", bg: "#D1FAE5"},
    "MEDIO": {color: "#F59E0B", bg: "#FEF3C7"},
    "BAJO": {color: "#EF4444", bg: "#FEE2E2"}
  };
  
  const confStyle = confianzaColors[confianza] || confianzaColors.MEDIO;
  
  return htl.html`
    <div style="
      background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    ">
      <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">
        ROI Estimado
      </div>
      <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
        ${rango}
      </div>
      ${horizonte ? htl.html`
        <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 1rem;">
          ${horizonte}
        </div>
      ` : ''}
      <div style="
        background: ${confStyle.bg};
        color: ${confStyle.color};
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 600;
        display: inline-block;
      ">
        Confianza: ${confianza}
      </div>
    </div>
  `;
}

/**
 * Métrica destacada (KPI card)
 * @param {Object} options
 * @param {string} options.label - Etiqueta de la métrica
 * @param {string|number} options.value - Valor principal
 * @param {string} options.subtitle - Subtítulo o descripción (opcional)
 * @param {string} options.trend - Tendencia: up, down, neutral (opcional)
 * @param {string} options.color - Color primario (opcional)
 */
export function MetricCard({label, value, subtitle = null, trend = null, color = "#3B82F6"}) {
  const trendIcons = {
    up: {icon: "↑", color: "#10B981"},
    down: {icon: "↓", color: "#EF4444"},
    neutral: {icon: "→", color: "#6B7280"}
  };
  
  const trendStyle = trend ? trendIcons[trend] : null;
  
  return htl.html`
    <div style="
      background: white;
      border: 1px solid #E5E7EB;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    ">
      <div style="
        font-size: 0.875rem;
        color: #6B7280;
        margin-bottom: 0.5rem;
        font-weight: 500;
      ">
        ${label}
      </div>
      <div style="
        font-size: 2rem;
        font-weight: 700;
        color: ${color};
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      ">
        ${value}
        ${trendStyle ? htl.html`
          <span style="
            font-size: 1.5rem;
            color: ${trendStyle.color};
          ">${trendStyle.icon}</span>
        ` : ''}
      </div>
      ${subtitle ? htl.html`
        <div style="font-size: 0.875rem; color: #6B7280;">
          ${subtitle}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Lista de riesgos con mitigaciones
 * @param {Array} risks - Array de objetos de riesgo
 */
export function RiskMatrix(risks) {
  return htl.html`
    <div style="
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 0.5rem;
      overflow: hidden;
    ">
      <div style="
        background: #F9FAFB;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #E5E7EB;
      ">
        <h3 style="margin: 0; font-size: 1.125rem; color: #1F2937;">
          ⚠️ Matriz de Riesgos
        </h3>
      </div>
      <div style="padding: 1.5rem;">
        ${risks.map(risk => htl.html`
          <div style="
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #E5E7EB;
          ">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
              <h4 style="margin: 0; color: #1F2937; font-weight: 600;">
                ${risk.tipo}
              </h4>
              ${risk.probabilidad && risk.impacto ? htl.html`
                <div style="display: flex; gap: 0.5rem;">
                  <span style="
                    background: #FEE2E2;
                    color: #DC2626;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                  ">P: ${risk.probabilidad}</span>
                  <span style="
                    background: #DBEAFE;
                    color: #2563EB;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                  ">I: ${risk.impacto}</span>
                </div>
              ` : ''}
            </div>
            <p style="margin: 0 0 0.75rem 0; color: #4B5563;">
              ${risk.descripcion}
            </p>
            <div style="
              background: #F0FDF4;
              border-left: 3px solid #10B981;
              padding: 0.75rem;
              border-radius: 0.25rem;
            ">
              <div style="font-size: 0.875rem; font-weight: 600; color: #059669; margin-bottom: 0.25rem;">
                ✓ Mitigación
              </div>
              <div style="font-size: 0.875rem; color: #166534;">
                ${risk.mitigacion}
              </div>
            </div>
          </div>
        `).slice(0, -1)}
        ${risks.length > 0 ? htl.html`
          <div style="
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
          ">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
              <h4 style="margin: 0; color: #1F2937; font-weight: 600;">
                ${risks[risks.length - 1].tipo}
              </h4>
              ${risks[risks.length - 1].probabilidad && risks[risks.length - 1].impacto ? htl.html`
                <div style="display: flex; gap: 0.5rem;">
                  <span style="
                    background: #FEE2E2;
                    color: #DC2626;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                  ">P: ${risks[risks.length - 1].probabilidad}</span>
                  <span style="
                    background: #DBEAFE;
                    color: #2563EB;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.25rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                  ">I: ${risks[risks.length - 1].impacto}</span>
                </div>
              ` : ''}
            </div>
            <p style="margin: 0 0 0.75rem 0; color: #4B5563;">
              ${risks[risks.length - 1].descripcion}
            </p>
            <div style="
              background: #F0FDF4;
              border-left: 3px solid #10B981;
              padding: 0.75rem;
              border-radius: 0.25rem;
            ">
              <div style="font-size: 0.875rem; font-weight: 600; color: #059669; margin-bottom: 0.25rem;">
                ✓ Mitigación
              </div>
              <div style="font-size: 0.875rem; color: #166534;">
                ${risks[risks.length - 1].mitigacion}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

