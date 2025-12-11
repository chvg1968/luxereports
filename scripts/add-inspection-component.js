#!/usr/bin/env node

/**
 * Script para agregar el componente de inspección a todos los archivos HTML
 * Uso: node scripts/add-inspection-component.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const PAGES_DIR = path.join(__dirname, '../pages/Inspections');
const CSS_LINK = '<link rel="stylesheet" href="/css/inspection-submit.css">';
const SCRIPT_TAG = '\n  <!-- Componente de envío de inspección -->\n  <script src="/js/inspection-submit.js"></script>\n\n</body>\n</html>';

// Archivos a procesar
const inspectionFiles = [
  'casaparaiso/CasaParaiso.html',
  'casaprestige/CasaPrestige.html',
  'villapaloma/VillaPaloma.html',
  'villaclara/VillaClara.html',
  'villaflora/VillaFlora.html',
  'villapalacio/VillaPalacio.html',
  'villatiffany/VillaTiffany.html',
  'oceangrace/OceanGrace.html',
  'oceanhaven/OceanHaven.html',
  'oceansoundvilla/OceanSoundVilla.html'
];

/**
 * Verifica si un archivo ya tiene el componente instalado
 */
function hasComponent(content) {
  return content.includes('inspection-submit.js') || content.includes('inspection-submit.css');
}

/**
 * Agrega el CSS en el head si no existe
 */
function addCSSLink(content) {
  if (content.includes('inspection-submit.css')) {
    return content;
  }

  // Buscar el último link de stylesheet en el head
  const styleRegex = /(<link[^>]*stylesheet[^>]*>)/gi;
  const matches = [...content.matchAll(styleRegex)];

  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const insertPosition = lastMatch.index + lastMatch[0].length;
    return content.slice(0, insertPosition) + '\n  ' + CSS_LINK + content.slice(insertPosition);
  }

  // Si no hay links, agregar después del viewport meta
  const viewportRegex = /<meta[^>]*viewport[^>]*>/i;
  const viewportMatch = content.match(viewportRegex);

  if (viewportMatch) {
    const insertPosition = content.indexOf(viewportMatch[0]) + viewportMatch[0].length;
    return content.slice(0, insertPosition) + '\n  ' + CSS_LINK + content.slice(insertPosition);
  }

  console.warn('  ⚠️  No se pudo encontrar dónde insertar el CSS');
  return content;
}

/**
 * Agrega el script antes del cierre de body
 */
function addScript(content) {
  if (content.includes('inspection-submit.js')) {
    return content;
  }

  // Verificar si ya tiene </body> y </html>
  if (content.includes('</body>') && content.includes('</html>')) {
    // Reemplazar el cierre existente
    return content.replace(/<\/body>\s*<\/html>\s*$/i, SCRIPT_TAG);
  }

  // Si no tiene cierre, agregarlo al final
  return content.trimEnd() + '\n' + SCRIPT_TAG;
}

/**
 * Procesa un archivo HTML
 */
function processFile(filePath) {
  const fullPath = path.join(PAGES_DIR, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  Archivo no encontrado: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Verificar si ya tiene el componente
    if (hasComponent(content)) {
      console.log(`  ℹ️  Ya tiene el componente: ${filePath}`);
      return false;
    }

    // Agregar CSS
    content = addCSSLink(content);

    // Agregar Script
    content = addScript(content);

    // Guardar el archivo
    fs.writeFileSync(fullPath, content, 'utf8');

    console.log(`  ✓ Actualizado: ${filePath}`);
    return true;

  } catch (error) {
    console.error(`  ✗ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Función principal
 */
function main() {
  console.log('\n🚀 Agregando componente de inspección a los archivos HTML...\n');

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of inspectionFiles) {
    const result = processFile(file);
    if (result === true) {
      updated++;
    } else if (result === false && fs.existsSync(path.join(PAGES_DIR, file))) {
      skipped++;
    } else {
      errors++;
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`  ✓ Archivos actualizados: ${updated}`);
  console.log(`  ℹ️  Archivos omitidos: ${skipped}`);
  console.log(`  ✗ Errores: ${errors}`);
  console.log('\n✨ Proceso completado!\n');
}

// Ejecutar
main();
