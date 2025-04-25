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