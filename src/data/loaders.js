/**
 * Data Loaders para Lienzo Charro
 * Funciones centralizadas de carga y procesamiento de datos GeoJSON
 */

import * as d3 from "npm:d3";

/**
 * Obtiene el NSE dominante basado en los shares
 */
function getNSEDominante(props) {
  const shares = {
    'AB': props.nse_share_AB || 0,
    'C+': props.nse_share_C_plus || 0,
    'C': props.nse_share_C || 0,
    'D+': props.nse_share_D_plus || 0,
    'DE': props.nse_share_DE || 0
  };
  
  let maxNivel = 'C';
  let maxShare = 0;
  
  for (const [nivel, share] of Object.entries(shares)) {
    if (share > maxShare) {
      maxShare = share;
      maxNivel = nivel;
    }
  }
  
  return maxNivel;
}

/**
 * Procesa indicadores por buffer desde GeoJSON ya cargado
 * @param {Object} geojson - GeoJSON FeatureCollection cargado
 */
export function processIndicadoresBuffer(geojson) {
  return geojson.features.map(f => ({
    ...f.properties,
    // Calcular métricas derivadas
    densidad_pob: Math.round(f.properties.poblacion_total / f.properties.area_km2),
    nse_dominante: getNSEDominante(f.properties),
    // Formatear label
    radio_display: f.properties.radio_label
  })).sort((a, b) => a.radio_m - b.radio_m);
}

/**
 * Agrupa y procesa datos DENUE desde GeoJSON ya cargado
 * @param {Object} geojson - GeoJSON FeatureCollection de DENUE
 */
export function processDENUEAgrupado(geojson) {
  // Agrupar por código SCIAN de 2 dígitos (sector)
  const bySector = d3.rollup(
    geojson.features, 
    v => ({
      count: v.length,
      nombres: v.map(d => d.properties.nom_estab),
      establecimientos: v
    }),
    d => d.properties.codigo_act.substring(0, 2)
  );
  
  // Agrupar por actividad completa
  const byActividad = d3.rollup(
    geojson.features,
    v => v.length,
    d => d.properties.nombre_act
  );
  
  // Agrupar por tamaño de empresa
  const byTamano = d3.rollup(
    geojson.features,
    v => v.length,
    d => d.properties.per_ocu
  );
  
  return {
    bySector: Array.from(bySector, ([sector, data]) => ({sector, ...data})),
    byActividad: Array.from(byActividad, ([actividad, count]) => ({actividad, count}))
      .sort((a, b) => b.count - a.count),
    byTamano: Array.from(byTamano, ([tamano, count]) => ({tamano, count})),
    total: geojson.features.length,
    raw: geojson.features
  };
}

/**
 * Procesa AGEBs y los ordena por distancia al sitio
 * @param {Object} geojson - GeoJSON FeatureCollection de AGEBs
 */
export function processAGEBsConDistancia(geojson) {
  // Ordenar por distancia al sitio para análisis de gradiente
  return geojson.features
    .map(f => ({
      ...f.properties,
      geometry: f.geometry
    }))
    .sort((a, b) => a.distancia_sitio_m - b.distancia_sitio_m);
}

/**
 * Procesa isócronas HERE con métricas calculadas
 * @param {Object} geojson - GeoJSON FeatureCollection de isócronas
 */
export function processIsocronasHERE(geojson) {
  return geojson.features.map(f => {
    const props = f.properties;
    // Calcular buffer equivalente (radio aproximado)
    const radioEquivalente = props.radio_aprox_m;
    const areaBufferEquivalente = Math.PI * Math.pow(radioEquivalente / 1000, 2);
    
    // Eficiencia = área isócrona / área buffer equivalente
    const eficiencia = (props.area_km2 / areaBufferEquivalente) * 100;
    
    return {
      ...props,
      geometry: f.geometry,
      eficiencia: Math.round(eficiencia * 10) / 10,
      area_buffer_equiv: Math.round(areaBufferEquivalente * 100) / 100
    };
  }).sort((a, b) => a.tiempo_min - b.tiempo_min);
}

/**
 * Procesa componentes NSE desde GeoJSON ya cargado
 * @param {Object} geojson - GeoJSON FeatureCollection de componentes NSE
 */
export function processNSEComponentes(geojson) {
  if (geojson.features.length === 0) return null;
  
  const props = geojson.features[0].properties;
  
  return {
    nse_index: props.nse_index,
    componentes: {
      educacion: props.nse_education,
      vivienda: props.nse_housing,
      bienes: props.nse_assets,
      economico: props.nse_economic
    },
    geometry: geojson.features[0].geometry
  };
}

/**
 * Calcula distancia entre dos puntos en metros (aproximación)
 */
export function calcularDistancia(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371000; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
}

/**
 * Calcula densidad radial de establecimientos DENUE
 */
export function calcularDensidadRadial(denueFeatures, sitioCoords, radios = [100, 250, 500, 1000, 2000, 5000]) {
  return radios.map(radio => {
    const count = denueFeatures.filter(f => {
      const dist = calcularDistancia(f.geometry.coordinates, sitioCoords);
      return dist <= radio;
    }).length;
    
    const areaKm2 = Math.PI * Math.pow(radio / 1000, 2);
    const densidad = Math.round((count / areaKm2) * 10) / 10;
    
    return {
      radio: `${radio}m`,
      radio_m: radio,
      count,
      area_km2: Math.round(areaKm2 * 100) / 100,
      densidad
    };
  });
}

