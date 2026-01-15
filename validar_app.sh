#!/bin/bash

echo "🔍 VALIDACIÓN COMPLETA DE LA APLICACIÓN OBSERVABLE"
echo "=================================================="
echo ""

# 1. Verificar servidor
echo "1. 🌐 Verificando servidor..."
if curl -s http://127.0.0.1:3000/ > /dev/null; then
    echo "   ✅ Servidor respondiendo en http://127.0.0.1:3000/"
else
    echo "   ❌ Servidor NO está respondiendo"
    echo "   💡 Ejecuta: npm run dev"
    exit 1
fi

# 2. Verificar archivos GeoJSON
echo ""
echo "2. 📁 Verificando archivos GeoJSON..."
geojson_count=$(ls src/data/layers/*.geojson 2>/dev/null | wc -l)
if [ "$geojson_count" -eq 9 ]; then
    echo "   ✅ 9 archivos GeoJSON encontrados"
    ls src/data/layers/*.geojson | while read file; do
        echo "      - $(basename $file)"
    done
else
    echo "   ❌ Solo $geojson_count archivos encontrados (se esperaban 9)"
fi

# 3. Verificar narrative.json
echo ""
echo "3. 📋 Verificando narrative.json..."
if [ -f "src/data/narrative.json" ]; then
    echo "   ✅ narrative.json existe"
    # Verificar tamaño
    size=$(wc -c < src/data/narrative.json)
    if [ "$size" -gt 1000 ]; then
        echo "      Tamaño: $size bytes ✅"
    else
        echo "      ⚠️ Archivo parece pequeño: $size bytes"
    fi
else
    echo "   ❌ narrative.json NO existe"
fi

# 4. Verificar componentes
echo ""
echo "4. 🧩 Verificando componentes JavaScript..."
components=("BaseMap.js" "InsightCard.js" "RadarChart.js")
for comp in "${components[@]}"; do
    if [ -f "src/components/$comp" ]; then
        echo "   ✅ $comp"
    else
        echo "   ❌ $comp NO EXISTE"
    fi
done

# 5. Verificar loaders.js
echo ""
echo "5. 📦 Verificando data/loaders.js..."
if [ -f "src/data/loaders.js" ]; then
    echo "   ✅ loaders.js existe"
    # Contar funciones exportadas
    funcs=$(grep -c "export" src/data/loaders.js)
    echo "      Funciones exportadas: $funcs"
else
    echo "   ❌ loaders.js NO existe"
fi

# 6. Verificar páginas principales
echo ""
echo "6. 📄 Verificando páginas Markdown..."
pages=("index.md" "ficha-sitio.md" "demanda-nse.md" "accesibilidad.md" "competencia-vocacion.md")
for page in "${pages[@]}"; do
    if [ -f "src/$page" ]; then
        echo "   ✅ $page"
    else
        echo "   ❌ $page NO EXISTE"
    fi
done

# 7. Verificar referencias de archivos en código
echo ""
echo "7. 🔗 Verificando referencias de archivos..."
missing=0
while IFS= read -r line; do
    if echo "$line" | grep -q "FileAttachment.*geojson"; then
        filename=$(echo "$line" | sed -n 's/.*FileAttachment("\([^"]*\)").*/\1/p')
        if [ -f "src/$filename" ]; then
            echo "   ✅ $(basename $filename)"
        else
            echo "   ❌ FALTA: $filename"
            missing=$((missing + 1))
        fi
    fi
done < <(grep -h "FileAttachment.*geojson" src/*.md 2>/dev/null)

if [ "$missing" -eq 0 ]; then
    echo "   ✅ Todas las referencias de archivos son correctas"
else
    echo "   ⚠️ $missing referencias tienen archivos faltantes"
fi

# 8. Verificar build
echo ""
echo "8. 🏗️ Verificando capacidad de build..."
if npm run build > build_test.log 2>&1; then
    echo "   ✅ Build exitoso"
    rm build_test.log
else
    echo "   ❌ Build falló"
    echo "   Ver errores en build_test.log"
fi

# Resumen final
echo ""
echo "=================================================="
echo "📊 RESUMEN"
echo "=================================================="
echo "✅ Verificación completada"
echo ""
echo "🌐 Abre tu navegador en: http://127.0.0.1:3000/"
echo "🔍 Presiona F12 para ver la consola y buscar errores"
echo ""
echo "Si ves errores, ejecuta:"
echo "  1. Ctrl+Shift+R para recargar sin caché"
echo "  2. Copia los errores de la consola"
echo "  3. Compártelos para ayudarte a resolver"

