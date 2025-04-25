const fs = require('fs');
const path = require('path');

// Usa rutas absolutas para evitar confusiones
const inputFile = path.resolve(__dirname, 'VillaTiffany.html');
const outputFile = path.resolve(__dirname, 'VillaTiffany-limpio.html');

if (!fs.existsSync(inputFile)) {
  console.error('No se encontró el archivo de entrada:', inputFile);
  process.exit(1);
}

let html = fs.readFileSync(inputFile, 'utf8');

// 1. Reemplazar clases con "start" en <ul> y <ol> por solo lista-inspeccion
html = html.replace(
  /<(ul|ol)([^>]*class="[^"]*\bstart\b[^"]*"[^>]*)>/gi,
  (match, tag, attrs) => {
    // Eliminar el atributo style="text-indent:...;"
    let cleanAttrs = attrs.replace(/\s*style="[^"]*text-indent:[^";]*;?[^"]*"/gi, '');
    // Reemplazar el atributo class por solo lista-inspeccion
    cleanAttrs = cleanAttrs.replace(/class="[^"]*"/gi, 'class="lista-inspeccion"');
    return `<${tag}${cleanAttrs}>`;
  }
);

// 2. Eliminar style="text-indent:..." en cualquier ul/ol que quede
html = html.replace(
  /(<(ul|ol)[^>]*?)\s+style="[^"]*text-indent:[^";]*;?[^"]*"/gi,
  '$1'
);

fs.writeFileSync(outputFile, html, 'utf8');
console.log(`Archivo limpio generado como ${outputFile}`);