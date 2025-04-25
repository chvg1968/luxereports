import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Emula __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.resolve(__dirname, 'VillaClara.html');
const outputFile = path.resolve(__dirname, 'VillaClara-limpio.html');

if (!fs.existsSync(inputFile)) {
  console.error('No se encontró el archivo de entrada:', inputFile);
  process.exit(1);
}

let html = fs.readFileSync(inputFile, 'utf8');

// 1. Todos los <h3> deben tener la clase 'titulo-principal'.
html = html.replace(/<h3(?![^>]*class)/gi, '<h3 class="titulo-principal"');
html = html.replace(/<h3([^>]*class=["'][^"'>]*)/gi, (match, attrs) => {
  // Si ya tiene clase, añade 'titulo-principal' si no está
  if (!/titulo-principal/.test(attrs)) {
    return match.replace(/class=["']([^"'>]*)/, (m, c) => `class="${c} titulo-principal"`);
  }
  return match;
});

// 2. Reemplazar style="text-indent: 2em" en <h3> por la clase 'subtítulo' (y quitar el style)
html = html.replace(/<h3([^>]*?) style=["']text-indent:\s*2em;?["']([^>]*)>/gi, (match, before, after) => {
  // Si ya tiene clase, añade 'subtítulo', si no, crea class
  if (/class=["']/.test(before)) {
    return `<h3${before.replace(/class=["']([^"'>]*)/, (m, c) => `class="${c} subtítulo"`)}${after}>`;
  } else {
    return `<h3${before} class="subtítulo"${after}>`;
  }
});

// 3. Para <ul style="text-indent: 2em" class="c4 lst-kix_list_5-0">, reemplazar ambos por class="lista-inspeccion"
html = html.replace(/<ul[^>]*style=["']text-indent:\s*2em;?["'][^>]*class=["']c4 lst-kix_list_5-0["'][^>]*>/gi, '<ul class="lista-inspeccion">');

// 3b. También limpiar casos invertidos: class antes del style
html = html.replace(/<ul[^>]*class=["']c4 lst-kix_list_5-0["'][^>]*style=["']text-indent:\s*2em;?["'][^>]*>/gi, '<ul class="lista-inspeccion">');

html = html.replace(
  /<(ul|ol)([^>]*class="[^"]*\bstart\b[^>]*)>/gi,
  (match, tag, attrs) => {
    let cleanAttrs = attrs.replace(/\s*style="[^"]*text-indent:[^";]*;?[^"]*"/gi, '');
    cleanAttrs = cleanAttrs.replace(/class="[^"]*"/gi, 'class="lista-inspeccion"');
    return `<${tag}${cleanAttrs}>`;
  }
);

html = html.replace(
  /(<(ul|ol)[^>]*?)\s+style="[^"]*text-indent:[^";]*;?[^"]*"/gi,
  '$1'
);

fs.writeFileSync(outputFile, html, 'utf8');
console.log(`Archivo limpio generado como ${outputFile}`);