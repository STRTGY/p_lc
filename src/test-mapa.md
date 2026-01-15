---
title: Test de Mapas
---

# Test de MapBox GL

Página de prueba para verificar que MapBox funciona correctamente.

---

## Test 1: Import básico

```js
import {testMapbox} from "./components/test-mapbox.js";
```

```js
const mapa = testMapbox();
display(mapa);
```

---

## Test 2: Componente BaseMap

```js
import {BaseMap} from "./components/BaseMap.js";
```

```js
const mapaBase = BaseMap({
  center: [-99.025119, 21.997459],
  zoom: 12,
  height: 400
});
display(mapaBase);
```

---

## Test 3: Con datos GeoJSON

```js
const sitio = FileAttachment("./data/layers/01_lienzo_charro_sitio_terreno.geojson").json();
```

```js
import {ParagonLayerPresets} from "./components/BaseMap.js";
```

```js
const mapaConDatos = BaseMap({
  center: [-99.025119, 21.997459],
  zoom: 13,
  height: 500,
  layers: [
    ParagonLayerPresets.sitio(await sitio)
  ]
});
display(mapaConDatos);
```

---

<div class="note">
Si ves los mapas arriba, ¡todo funciona correctamente! 🎉
</div>

