import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import heicConvert from 'heic-convert';
import { promisify } from 'util';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio donde se encuentran las imágenes HEIC
const inputDir = path.join(__dirname, "pages/Inspections/villatiffany/images");
const outputDir = inputDir; // Guardar en el mismo directorio

// Función para convertir un archivo HEIC a JPG
async function convertHEICtoJPG(inputPath, outputPath) {
    try {
        // Leer el archivo HEIC
        const inputBuffer = await fs.promises.readFile(inputPath);
        
        // Convertir HEIC a JPEG
        const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 0.8
        });
        
        // Escribir el archivo JPEG
        await fs.promises.writeFile(outputPath, outputBuffer);
        
        console.log(`Conversión exitosa: ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`Error al convertir la imagen ${path.basename(inputPath)}:`, error);
        return false;
    }
}

// Función para procesar todos los archivos HEIC en un directorio
async function processDirectory() {
    try {
        // Verificar si el directorio existe
        if (!fs.existsSync(inputDir)) {
            console.error(`El directorio ${inputDir} no existe.`);
            return;
        }

        // Leer todos los archivos del directorio
        const files = fs.readdirSync(inputDir);
        
        // Filtrar solo archivos HEIC
        const heicFiles = files.filter(file => 
            file.toLowerCase().endsWith('.heic')
        );
        
        if (heicFiles.length === 0) {
            console.log("No se encontraron archivos HEIC para convertir.");
            return;
        }
        
        console.log(`Se encontraron ${heicFiles.length} archivos HEIC para convertir.`);
        
        // Convertir cada archivo HEIC a JPG
        let successCount = 0;
        for (const file of heicFiles) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file.replace(/\.heic$/i, '.jpg'));
            
            const success = await convertHEICtoJPG(inputPath, outputPath);
            if (success) successCount++;
        }
        
        console.log(`Conversión completada. ${successCount} de ${heicFiles.length} archivos convertidos exitosamente.`);
    } catch (error) {
        console.error("Error al procesar el directorio:", error);
    }
}

// Ejecutar el proceso
processDirectory();
