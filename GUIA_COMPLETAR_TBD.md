# Guía para Completar TBD - Lienzo Charro

**Fecha:** 2025-12-12  
**Páginas afectadas:** `afinidad-tematica.md`, `restaurante-ancla.md`

---

## 📋 Resumen de TBD Pendientes

| Página | Sección | TBD Count | Prioridad |
|--------|---------|-----------|-----------|
| **Afinidad Temática** | Giros afines, Densidad | 9 | Alta |
| **Restaurante Ancla** | Demanda, Competencia, Financieros | 23 | Alta |

---

## 🎨 Afinidad Temática - TBD a Completar

### 1. **Giros Afines Identificados** (3 cards)

**Datos a calcular desde DENUE:**

```js
// En afinidad-tematica.md, agregar al inicio:
const denue_json = await FileAttachment("./data/layers/09_lienzo_charro_denue_completo.geojson").json();

// Filtrar por códigos SCIAN específicos:
// Boutiques y retail: SCIAN 46 (Comercio al por menor)
const boutiques = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('46') && 
  (e.properties.nombre_act?.includes('ropa') || 
   e.properties.nombre_act?.includes('tienda'))
).length;

// Artesanía y galerías: SCIAN 45411 (Comercio de artesanías)
const artesania = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('454') ||
  e.properties.nombre_act?.includes('artesanía') ||
  e.properties.nombre_act?.includes('galería')
).length;

// Gastronomía temática: SCIAN 722 (Restaurantes)
const gastronomia = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('722')
).length;
```

**Afinidad (evaluar manualmente):**
- **Alta:** 🟢 Si hay < 5 establecimientos (white space)
- **Media:** 🟡 Si hay 5-15 establecimientos (competido)
- **Baja:** 🔴 Si hay > 15 establecimientos (saturado)

---

### 2. **Tabla de Análisis de Afinidad** (5 filas)

**Datos necesarios:**

| Campo | Cómo calcularlo |
|-------|----------------|
| **Densidad Actual** | `count / area_km2` para cada categoría SCIAN |
| **Gap/Oportunidad** | "White space" si densidad < 5/km², "Saturado" si > 15/km² |

**Fórmula:**
```js
const area_1km = 3.14; // π * 1² km²
const densidad_restaurantes = gastronomia / area_1km;
```

**Valores sugeridos para llenar:**
```markdown
| Categoría | Densidad Actual | Gap/Oportunidad |
|-----------|-----------------|-----------------|
| Restaurantes mexicanos | ${densidad_restaurantes.toFixed(1)}/km² | ${densidad_restaurantes < 5 ? 'White space - Alta oportunidad' : 'Competido'} |
| Artesanía y regalos | ${(artesania / area_1km).toFixed(1)}/km² | ${artesania < 3 ? 'White space - Alta oportunidad' : 'Existente'} |
...
```

---

## 🍽️ Restaurante Ancla - TBD a Completar

### 1. **Demanda Potencial** (9 valores)

#### Población 10 min
```js
// Ya calculamos esto en el resumen ejecutivo
const pob_10min = Math.round(narrative.connectivity.isochrones[1].area_km2 * narrative.demographics.densidad_1km);

// NSE C+ y superior (del narrative)
const pct_c_plus = narrative.nse_analysis.share_c_plus_1km + narrative.nse_analysis.share_ab_1km;

// Hogares (promedio 4 personas por hogar en México)
const hogares = Math.round(pob_10min / 4);
```

**Valores a poner:**
- Total: `${pob_10min.toLocaleString()}` habitantes
- NSE C+ y superior: `${pct_c_plus.toFixed(1)}%` (o "100% C" si es 0)
- Hogares: `${hogares.toLocaleString()}`

#### Consumo Estimado

**Supuestos de mercado (investigación externa):**
- **Gasto mensual F&B NSE C:** ~$3,500 - $5,000 MXN/hogar
- **Frecuencia restaurantes:** 2-4 veces/mes
- **Ticket promedio objetivo:** $250 - $400 MXN/persona (restaurante regional premium)

```js
const gasto_mensual_fb = 4000; // promedio
const frecuencia_mes = 3;
const ticket_objetivo = 350;
```

#### Capacidad de Captura

**Supuestos estratégicos:**
- **Market share objetivo:** 2-5% del gasto F&B en el área
- **Comensales/mes:** `(hogares * frecuencia_mes * market_share) * 2.5` (personas por visita promedio)
- **Venta mensual:** `comensales_mes * ticket_objetivo`

```js
const market_share = 0.03; // 3%
const comensales_mes = Math.round(hogares * frecuencia_mes * market_share * 2.5);
const venta_mensual = comensales_mes * ticket_objetivo;
```

---

### 2. **Competencia F&B** (4 filas x 3 columnas = 12 valores)

**Calcular desde DENUE:**

```js
// Filtrar restaurantes por código SCIAN 722
const restaurantes = denue_json.features.filter(e => e.properties.codigo_act?.startsWith('722'));

// Clasificar por tipo (basado en nombre_act)
const cocina_regional = restaurantes.filter(e => 
  e.properties.nombre_act?.toLowerCase().includes('mexicana') ||
  e.properties.nombre_act?.toLowerCase().includes('regional') ||
  e.properties.nombre_act?.toLowerCase().includes('típica')
).length;

const casuales = restaurantes.filter(e => 
  !e.properties.nombre_act?.toLowerCase().includes('rápida') &&
  !e.properties.nombre_act?.toLowerCase().includes('cafetería')
).length - cocina_regional;

const rapida = restaurantes.filter(e => 
  e.properties.nombre_act?.toLowerCase().includes('rápida') ||
  e.properties.nombre_act?.toLowerCase().includes('tortas') ||
  e.properties.nombre_act?.toLowerCase().includes('tacos')
).length;

const cafeterias = restaurantes.filter(e => 
  e.properties.nombre_act?.toLowerCase().includes('cafetería') ||
  e.properties.nombre_act?.toLowerCase().includes('café')
).length;
```

**Ticket promedio estimado (benchmarks de mercado):**
- Cocina regional/mexicana: $250-400
- Restaurantes casuales: $150-250
- Comida rápida: $80-120
- Cafeterías: $60-100

---

### 3. **Viabilidad Financiera** (12 valores)

#### Ingresos Estimados

**Supuestos operativos:**

```js
// Capacidad del restaurante
const capacidad_asientos = 80; // personas
const rotacion_dia = 2.5; // veces (almuerzo + cena)
const dias_operacion_mes = 26; // 6 días/semana
const ocupacion_promedio = 0.60; // 60%

// Cálculos
const comensales_dia = Math.round(capacidad_asientos * rotacion_dia * ocupacion_promedio);
const venta_diaria = comensales_dia * ticket_objetivo;
const venta_mensual = venta_diaria * dias_operacion_mes;
const venta_anual = venta_mensual * 12;
```

**Valores para la tabla:**
- Comensales/día: `${comensales_dia}`
- Ticket promedio: `$${ticket_objetivo}`
- Venta diaria: `$${venta_diaria.toLocaleString()}`
- Venta mensual: `$${venta_mensual.toLocaleString()}`
- Venta anual: `$${venta_anual.toLocaleString()}`

#### Indicadores

**Supuestos de la industria restaurantera:**

```js
// Costos operativos (% de ventas)
const costo_alimentos = 0.30; // 30%
const costo_nomina = 0.25; // 25%
const costo_renta_otros = 0.25; // 25%
const margen_operativo = 1 - (costo_alimentos + costo_nomina + costo_renta_otros); // 20%

// Punto de equilibrio
const costos_fijos_mes = venta_mensual * 0.50; // 50% costos fijos
const punto_equilibrio_dia = Math.ceil((costos_fijos_mes / dias_operacion_mes) / ticket_objetivo);

// M² recomendados (regla industria: 1.5-2 m² por asiento)
const m2_recomendados = Math.round(capacidad_asientos * 1.8);
```

**Valores para la tabla:**
- Rentabilidad esperada: `${(margen_operativo * 100).toFixed(0)}%`
- Punto de equilibrio: `${punto_equilibrio_dia}` comensales/día
- Capacidad sugerida: `${capacidad_asientos}` personas
- M² recomendados: `${m2_recomendados}` m²

---

### 4. **Riesgos Específicos**

**Saturación F&B:** Usar el count de restaurantes calculado arriba:
```markdown
- **Saturación F&B:** ${restaurantes.length} establecimientos F&B en el área, ${cocina_regional} de cocina regional/mexicana
```

---

### 5. **Conclusión y Recomendación** (Veredicto + 3 condiciones)

**Lógica de decisión:**

```js
// Evaluar factores
const score_demanda = pob_10min > 20000 ? 2 : (pob_10min > 10000 ? 1 : 0);
const score_competencia = cocina_regional < 5 ? 2 : (cocina_regional < 10 ? 1 : 0);
const score_nse = narrative.nse_analysis.indice_1km > 60 ? 2 : 1;
const score_accesibilidad = narrative.connectivity.isochrones[1].eficiencia > 50 ? 2 : 1;

const score_total = score_demanda + score_competencia + score_nse + score_accesibilidad;

// Veredicto
let veredicto;
if (score_total >= 7) veredicto = "GO";
else if (score_total >= 5) veredicto = "REFINAR";
else veredicto = "NO-GO";
```

**Condiciones críticas sugeridas:**

**Si GO:**
1. Validar flujos turísticos reales mediante conteo de campo
2. Asegurar operador con mínimo 5 años experiencia en cocina regional
3. Inversión en marketing regional (radio 50km) mínimo 6 meses pre-apertura

**Si REFINAR:**
1. Reducir ticket promedio a $250-280 para ampliar mercado
2. Validar demanda con pop-up temporal (3 meses)
3. Considerar formato híbrido (restaurante + delivery/catering)

**Si NO-GO:**
1. Cambiar concepto a food court multi-operador
2. Reducir dependencia de ancla gastronómica
3. Enfocar en retail experiencial en lugar de F&B

---

## 🚀 Pasos para Implementar

### Paso 1: Actualizar `afinidad-tematica.md`

```bash
# Editar el archivo
code reports/Paragon_v2/ohq_paragon_lienzo_charro/src/afinidad-tematica.md
```

1. Agregar imports y cálculos de DENUE al inicio
2. Reemplazar los 3 TBD en las cards con valores calculados
3. Completar la tabla con densidades
4. Agregar mapa con filtro de DENUE (opcional)

### Paso 2: Actualizar `restaurante-ancla.md`

```bash
# Editar el archivo
code reports/Paragon_v2/ohq_paragon_lienzo_charro/src/restaurante-ancla.md
```

1. Agregar imports y cálculos al inicio
2. Completar sección "Demanda Potencial" (9 valores)
3. Completar tabla "Competencia F&B" (12 valores)
4. Completar "Viabilidad Financiera" (12 valores)
5. Actualizar riesgo de saturación (1 valor)
6. Definir veredicto y condiciones (4 valores)

### Paso 3: Validar

```bash
cd reports/Paragon_v2/ohq_paragon_lienzo_charro
npm run build
```

---

## 📊 Template de Código Completo

### Para `afinidad-tematica.md`:

```js
// Agregar al inicio del archivo (después del título)
import {processDENUEAgrupado} from "./data/loaders.js";
import * as Plot from "npm:@observablehq/plot";

const narrative = await FileAttachment("./data/narrative.json").json();
const denue_json = await FileAttachment("./data/layers/09_lienzo_charro_denue_completo.geojson").json();
const denue_procesado = processDENUEAgrupado(denue_json);

// Filtrar por categorías afines
const boutiques = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('46') && 
  (e.properties.nombre_act?.toLowerCase().includes('ropa') || 
   e.properties.nombre_act?.toLowerCase().includes('boutique'))
).length;

const artesania = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('454') ||
  e.properties.nombre_act?.toLowerCase().includes('artesanía') ||
  e.properties.nombre_act?.toLowerCase().includes('galería')
).length;

const gastronomia = denue_json.features.filter(e => 
  e.properties.codigo_act?.startsWith('722')
).length;

const area_1km = 3.14;
```

### Para `restaurante-ancla.md`:

```js
// Agregar al inicio del archivo (después del título)
import {processDENUEAgrupado} from "./data/loaders.js";
import {MetricCard} from "./components/InsightCard.js";

const narrative = await FileAttachment("./data/narrative.json").json();
const denue_json = await FileAttachment("./data/layers/09_lienzo_charro_denue_completo.geojson").json();
const denue_procesado = processDENUEAgrupado(denue_json);

// Calcular población 10 min
const pob_10min = Math.round(narrative.connectivity.isochrones[1].area_km2 * narrative.demographics.densidad_1km);
const hogares = Math.round(pob_10min / 4);

// Supuestos de mercado
const gasto_mensual_fb = 4000;
const frecuencia_mes = 3;
const ticket_objetivo = 350;
const market_share = 0.03;

// Cálculos de demanda
const comensales_mes = Math.round(hogares * frecuencia_mes * market_share * 2.5);
const venta_mensual_demanda = comensales_mes * ticket_objetivo;

// Cálculos operativos
const capacidad_asientos = 80;
const rotacion_dia = 2.5;
const dias_operacion_mes = 26;
const ocupacion_promedio = 0.60;

const comensales_dia = Math.round(capacidad_asientos * rotacion_dia * ocupacion_promedio);
const venta_diaria = comensales_dia * ticket_objetivo;
const venta_mensual = venta_diaria * dias_operacion_mes;
const venta_anual = venta_mensual * 12;

// Indicadores
const margen_operativo = 0.20;
const punto_equilibrio_dia = Math.ceil((venta_mensual * 0.50 / dias_operacion_mes) / ticket_objetivo);
const m2_recomendados = Math.round(capacidad_asientos * 1.8);

// Competencia F&B
const restaurantes = denue_json.features.filter(e => e.properties.codigo_act?.startsWith('722'));
const cocina_regional = restaurantes.filter(e => 
  e.properties.nombre_act?.toLowerCase().includes('mexicana') ||
  e.properties.nombre_act?.toLowerCase().includes('regional')
).length;

// Veredicto
const score_total = (pob_10min > 20000 ? 2 : 1) + (cocina_regional < 5 ? 2 : 1) + 2 + 1;
const veredicto = score_total >= 7 ? "GO" : (score_total >= 5 ? "REFINAR" : "NO-GO");
```

---

## ✅ Checklist Final

- [ ] `afinidad-tematica.md` - 9 TBD completados
- [ ] `restaurante-ancla.md` - 23 TBD completados
- [ ] `resumen-ejecutivo.md` - Errores de competencia corregidos
- [ ] Build exitoso (`npm run build`)
- [ ] Preview visual (`npm run dev`)
- [ ] Datos tienen sentido lógico (validación manual)

---

**¿Necesitas ayuda implementando alguna sección específica?** Puedo generar el código completo para cada página si prefieres.

