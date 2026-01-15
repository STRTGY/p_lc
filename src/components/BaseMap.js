import mapboxgl from "npm:mapbox-gl@3";

/**
 * BaseMap Component for Paragon Projects
 * Creates a MapBox GL map with customizable layers
 * 
 * @param {Object} options - Configuration options
 * @param {Array<number>} options.center - [longitude, latitude] center coordinates
 * @param {number} options.zoom - Initial zoom level
 * @param {number} options.width - Map width (default: 100%)
 * @param {number} options.height - Map height (default: 600px)
 * @param {Array<Object>} options.layers - Array of GeoJSON layer objects to display
 * @param {string} options.mapboxToken - MapBox access token
 * @param {string} options.style - MapBox style URL
 * @returns {HTMLElement} Map container with initialized MapBox map
 */
export function BaseMap({
  center = [-99.133209, 19.432608], // Default: CDMX
  zoom = 12,
  width = "100%",
  height = 600,
  layers = [],
  mapboxToken = typeof process !== 'undefined' && process.env?.MAPBOX_TOKEN 
    ? process.env.MAPBOX_TOKEN 
    : "pk.eyJ1IjoiZmVpcG93ZXIiLCJhIjoiY21hbjd5bnQ4MG93NTJsc2Z3dzdzNnRiNiJ9.942M6p7lPTB0M2wU4p7cHg", // Fallback for dev
  style = "mapbox://styles/mapbox/light-v11"
} = {}) {
  
  // Inject MapBox CSS synchronously and wait for it to load
  if (typeof document !== 'undefined' && !document.getElementById('mapbox-gl-css')) {
    const styleLink = document.createElement("link");
    styleLink.id = 'mapbox-gl-css';
    styleLink.rel = "stylesheet";
    styleLink.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css";
    styleLink.crossOrigin = "anonymous";
    
    // Insert at the beginning of head to load early
    if (document.head.firstChild) {
      document.head.insertBefore(styleLink, document.head.firstChild);
    } else {
      document.head.appendChild(styleLink);
    }
  }
  
  // Create container with explicit dimensions
  const container = document.createElement("div");
  container.style.width = typeof width === "number" ? `${width}px` : width;
  container.style.height = typeof height === "number" ? `${height}px` : height;
  container.style.minHeight = typeof height === "number" ? `${height}px` : "600px";
  container.style.borderRadius = "8px";
  container.style.overflow = "hidden";
  container.style.position = "relative";
  container.style.backgroundColor = "#e0e0e0"; // Fondo visible mientras carga
  
  // Set MapBox token
  mapboxgl.accessToken = mapboxToken;
  
  // Initialize map with error handling
  let map;
  try {
    map = new mapboxgl.Map({
      container,
      style,
      center,
      zoom,
      attributionControl: true,
      preserveDrawingBuffer: true // Ayuda con el rendering
    });
    
    // Force resize when map loads to fix incomplete rendering
    map.on('load', () => {
      // Small delay to ensure container is fully visible
      setTimeout(() => {
        map.resize();
      }, 100);
    });
    
    // Resize map when window resizes
    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        map.resize();
      }
    });
    resizeObserver.observe(container);
    
    // Handle map errors
    map.on('error', (e) => {
      console.error('MapBox Error:', e.error);
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center; flex-direction: column;">
          <h3 style="color: #DC2626; margin-bottom: 1rem;">⚠️ Error al cargar el mapa</h3>
          <p style="color: #666; margin-bottom: 1rem;">${e.error?.message || 'Error desconocido'}</p>
          <details style="text-align: left; width: 100%; max-width: 500px;">
            <summary style="cursor: pointer; color: #2563EB;">Ver solución</summary>
            <div style="margin-top: 1rem; padding: 1rem; background: #F3F4F6; border-radius: 4px;">
              <p><strong>Recarga la página</strong></p>
              <p>Presiona Ctrl+R o F5 para recargar completamente.</p>
              <p style="margin-top: 1rem;"><strong>Si persiste:</strong></p>
              <p>Verifica tu conexión a Internet y el token de MapBox.</p>
            </div>
          </details>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error al inicializar MapBox:', error);
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center; background: #FEF2F2;">
        <div>
          <h3 style="color: #DC2626;">⚠️ Error al inicializar el mapa</h3>
          <p style="color: #666; margin-top: 0.5rem;">${error.message}</p>
        </div>
      </div>
    `;
    return container;
  }
  
  // Add navigation controls
  if (map) {
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-left');
    
    // Load layers when map is ready
    map.on('load', () => {
      layers.forEach((layer, index) => {
        addGeoJSONLayer(map, layer, index);
      });
    });
  }
  
  return container;
}

/**
 * Add a GeoJSON layer to the map
 * @param {mapboxgl.Map} map - MapBox map instance
 * @param {Object} layer - Layer configuration
 * @param {string} layer.id - Unique layer ID
 * @param {Object} layer.data - GeoJSON data
 * @param {Object} layer.paint - MapBox paint properties
 * @param {Object} layer.layout - MapBox layout properties
 * @param {string} layer.type - Layer type (fill, line, circle, symbol)
 * @param {boolean} layer.showPopup - Show popup on click (default: true)
 * @param {Function} layer.popupContent - Function to generate popup HTML
 * @param {number} index - Layer index
 */
function addGeoJSONLayer(map, layer, index) {
  const {
    id = `layer-${index}`,
    data,
    paint = {},
    layout = {},
    type = 'line',
    showPopup = true,
    popupContent = (feature) => formatDefaultPopup(feature)
  } = layer;
  
  if (!data) {
    console.warn(`Layer ${id} has no data, skipping`);
    return;
  }
  
  // Add source
  const sourceId = `source-${id}`;
  map.addSource(sourceId, {
    type: 'geojson',
    data
  });
  
  // Add layer based on geometry type
  map.addLayer({
    id,
    type,
    source: sourceId,
    paint,
    layout
  });
  
  // Add popup interaction
  if (showPopup) {
    map.on('click', id, (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const feature = e.features[0];
      
      // Handle different geometry types
      let lngLat;
      if (feature.geometry.type === 'Point') {
        lngLat = coordinates;
      } else if (feature.geometry.type === 'Polygon') {
        lngLat = e.lngLat;
      } else {
        lngLat = e.lngLat;
      }
      
      new mapboxgl.Popup()
        .setLngLat(lngLat)
        .setHTML(popupContent(feature))
        .addTo(map);
    });
    
    // Change cursor on hover
    map.on('mouseenter', id, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', id, () => {
      map.getCanvas().style.cursor = '';
    });
  }
}

/**
 * Format default popup content
 */
function formatDefaultPopup(feature) {
  const props = feature.properties;
  let html = '<div style="font-family: sans-serif; font-size: 12px;">';
  
  for (const [key, value] of Object.entries(props)) {
    if (value !== null && value !== undefined) {
      html += `<p style="margin: 4px 0;"><strong>${key}:</strong> ${value}</p>`;
    }
  }
  
  html += '</div>';
  return html;
}

/**
 * Preset layer configurations for common Paragon layers
 */
export const ParagonLayerPresets = {
  sitio: (data) => ({
    id: 'sitio-punto',
    type: 'circle',
    data,
    paint: {
      'circle-radius': 8,
      'circle-color': '#FF0000',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFFFFF'
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #FF0000;">📍 Sitio del Proyecto</h3>
        <p><strong>Coordenadas:</strong><br/>
        Lat: ${feature.geometry.coordinates[1].toFixed(6)}<br/>
        Lng: ${feature.geometry.coordinates[0].toFixed(6)}</p>
      </div>
    `
  }),
  
  buffers: (data) => ({
    id: 'buffers-analisis',
    type: 'line',
    data,
    paint: {
      'line-color': '#2563EB',
      'line-width': 2,
      'line-opacity': 0.6,
      'line-dasharray': [2, 2]
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #2563EB;">📏 Radio de Análisis</h3>
        <p><strong>Distancia:</strong> ${feature.properties.radio_label || 'N/A'}</p>
        <p><strong>Área:</strong> ${feature.properties.area_km2?.toFixed(2) || 'N/A'} km²</p>
        <p><strong>Proyecto:</strong> ${feature.properties.proyecto || 'N/A'}</p>
      </div>
    `
  }),
  
  agebs_nse: (data) => ({
    id: 'agebs-nse',
    type: 'fill',
    data,
    paint: {
      'fill-color': [
        'match',
        ['get', 'nse_nivel'],
        'AB', '#059669',
        'C+', '#10B981',
        'C', '#FBBF24',
        'D+', '#F59E0B',
        'D/E', '#EF4444',
        '#9CA3AF' // default
      ],
      'fill-opacity': 0.6,
      'fill-outline-color': '#1F2937'
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0;">🏠 AGEB ${feature.properties.CVEGEO || ''}</h3>
        <p><strong>NSE:</strong> ${feature.properties.nse_nivel || 'N/A'}</p>
        <p><strong>Índice NSE:</strong> ${feature.properties.nse_index?.toFixed(2) || 'N/A'}</p>
        <p><strong>Población:</strong> ${feature.properties.poblacion_total?.toLocaleString() || 'N/A'}</p>
        <p><strong>Densidad:</strong> ${feature.properties.densidad_pob_km2?.toLocaleString() || 'N/A'} hab/km²</p>
      </div>
    `
  }),
  
  poligono: (data) => ({
    id: 'poligono-terreno',
    type: 'fill',
    data,
    paint: {
      'fill-color': '#DC2626',
      'fill-opacity': 0.3,
      'fill-outline-color': '#DC2626'
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #DC2626;">📐 Polígono del Terreno</h3>
        <p><strong>Nombre:</strong> ${feature.properties.Name || 'N/A'}</p>
        <p><strong>Descripción:</strong> ${feature.properties.Description || 'N/A'}</p>
      </div>
    `
  }),
  
  isocronas: (data) => ({
    id: 'isocronas-here',
    type: 'fill',
    data,
    paint: {
      'fill-color': [
        'match',
        ['get', 'tiempo_min'],
        5, '#10B981',   // 5 min
        10, '#FBBF24',  // 10 min
        15, '#EF4444',  // 15 min
        '#9CA3AF' // default
      ],
      'fill-opacity': 0.2,
      'fill-outline-color': '#1F2937'
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0;">🚗 Isócrona ${feature.properties.tiempo_min || 0} min</h3>
        <p><strong>Área:</strong> ${feature.properties.area_km2?.toFixed(2) || 'N/A'} km²</p>
        <p><strong>Radio aprox:</strong> ${((feature.properties.radio_aprox_m || 0) / 1000).toFixed(1)} km</p>
        <p><strong>Fuente:</strong> ${feature.properties.fuente || 'HERE API'}</p>
      </div>
    `
  }),
  
  heatmap_competencia: (data) => ({
    id: 'heatmap-competencia',
    type: 'fill',
    data,
    paint: {
      'fill-color': [
        'match',
        ['get', 'densidad_nivel'],
        'Baja', '#10B981',
        'Media', '#FBBF24',
        'Alta', '#F59E0B',
        'Muy Alta', '#EF4444',
        'Muy alta', '#EF4444',  // Variante con minúscula
        '#E5E7EB' // default
      ],
      'fill-opacity': 0.5,
      'fill-outline-color': '#9CA3AF'
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0;">🔥 Densidad de Competencia</h3>
        <p><strong>Nivel:</strong> ${feature.properties.densidad_nivel || 'N/A'}</p>
        <p><strong>Establecimientos:</strong> ${feature.properties.count || 0}</p>
        <p><strong>Densidad:</strong> ${feature.properties.density_km2 || 0} por km²</p>
      </div>
    `
  }),
  
  agebs_gradient: (data) => ({
    id: 'agebs-gradient-nse',
    type: 'fill',
    data,
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'nse_index'],
        50, '#EF4444',  // Bajo
        55, '#F59E0B',
        60, '#FBBF24',
        65, '#10B981',
        70, '#059669'   // Alto
      ],
      'fill-opacity': 0.6,
      'fill-outline-color': '#1F2937'
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0;">🏠 AGEB ${feature.properties.CVEGEO || ''}</h3>
        <p><strong>Índice NSE:</strong> ${feature.properties.nse_index?.toFixed(2) || 'N/A'}</p>
        <p><strong>Nivel:</strong> ${feature.properties.nse_nivel || 'N/A'}</p>
        <p><strong>Población:</strong> ${feature.properties.poblacion_total?.toLocaleString() || 'N/A'}</p>
        <p><strong>Distancia sitio:</strong> ${((feature.properties.distancia_sitio_m || 0) / 1000).toFixed(2)} km</p>
      </div>
    `
  }),
  
  denue: (data) => ({
    id: 'denue-establecimientos',
    type: 'circle',
    data,
    paint: {
      'circle-radius': 4,
      'circle-color': '#8B5CF6',
      'circle-opacity': 0.7,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#FFFFFF'
    },
    popupContent: (feature) => `
      <div style="font-family: sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #8B5CF6;">🏢 ${feature.properties.nom_estab || 'Establecimiento'}</h3>
        <p><strong>Actividad:</strong> ${feature.properties.nombre_act || 'N/A'}</p>
        <p><strong>Código SCIAN:</strong> ${feature.properties.codigo_act || 'N/A'}</p>
        <p><strong>Empleados:</strong> ${feature.properties.per_ocu || 'N/A'}</p>
      </div>
    `
  })
};

