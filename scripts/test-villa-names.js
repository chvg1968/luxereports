#!/usr/bin/env node

/**
 * Test para verificar la extracción de nombres de villa
 */

// Simular la función extractVillaName
function extractVillaName(fullText) {
    // Patrón 1: "Inspección [número] [Nombre]"
    let match = fullText.match(/Inspección\s+[\d-]+\s+(.+)/i);
    if (match && match[1]) {
        return match[1].trim();
    }

    // Patrón 2: "Inspección de [código] [Nombre]"
    match = fullText.match(/Inspección\s+de\s+[A-Za-z]+\.\s*[\dA-Za-z-]+\s+(.+)/i);
    if (match && match[1]) {
        return match[1].trim();
    }

    // Si no coincide con ningún patrón, devolver el texto completo sin "Inspección"
    return fullText.replace(/Inspección\s+/i, '').trim();
}

// Test cases
const testCases = [
    { input: 'Inspección 10180 Villa Flora', expected: 'Villa Flora' },
    { input: 'Inspección 3325 Villa Clara', expected: 'Villa Clara' },
    { input: 'Inspección 10389 Villa Tiffany', expected: 'Villa Tiffany' },
    { input: 'Inspección de Est. 24 Casa Paraíso', expected: 'Casa Paraíso' },
    { input: 'Inspección 2-208 Ocean Haven', expected: 'Ocean Haven' },
    { input: 'Inspección 7256 Villa Palacio', expected: 'Villa Palacio' },
    { input: 'Inspección 2-105 Ocean Grace', expected: 'Ocean Grace' },
    { input: 'Inspección de Atl. G7 Casa Prestige', expected: 'Casa Prestige' },
    { input: 'Inspección 5138 Villa Paloma', expected: 'Villa Paloma' },
];

console.log('\n🧪 Test de extracción de nombres de villa\n');

let passed = 0;
let failed = 0;

testCases.forEach(({ input, expected }) => {
    const result = extractVillaName(input);
    const status = result === expected ? '✅' : '❌';

    if (result === expected) {
        passed++;
        console.log(`${status} "${input}" → "${result}"`);
    } else {
        failed++;
        console.log(`${status} "${input}"`);
        console.log(`   Esperado: "${expected}"`);
        console.log(`   Obtenido: "${result}"`);
    }
});

console.log('\n📊 Resultados:');
console.log(`  ✅ Pasaron: ${passed}/${testCases.length}`);
console.log(`  ❌ Fallaron: ${failed}/${testCases.length}`);

if (failed === 0) {
    console.log('\n🎉 Todos los tests pasaron!\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Algunos tests fallaron\n');
    process.exit(1);
}
