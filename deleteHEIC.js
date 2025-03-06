import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio donde se encuentran las imágenes HEIC
const imagesDir = path.join(__dirname, "pages/Inspections/villatiffany/images");

// Función para eliminar archivos HEIC
async function deleteHEICFiles() {
    try {
        // Verificar si el directorio existe
        if (!fs.existsSync(imagesDir)) {
            console.error(`El directorio ${imagesDir} no existe.`);
            return;
        }

        // Leer todos los archivos del directorio
        const files = fs.readdirSync(imagesDir);
        
        // Filtrar solo archivos HEIC
        const heicFiles = files.filter(file => 
            file.toLowerCase().endsWith('.heic')
        );
        
        if (heicFiles.length === 0) {
            console.log("No se encontraron archivos HEIC para eliminar.");
            return;
        }
        
        console.log(`Se encontraron ${heicFiles.length} archivos HEIC para eliminar.`);
        
        // Eliminar cada archivo HEIC
        let deletedCount = 0;
        for (const file of heicFiles) {
            const filePath = path.join(imagesDir, file);
            
            // Verificar si existe el archivo JPG correspondiente
            const jpgFile = file.replace(/\.heic$/i, '.jpg');
            const jpgPath = path.join(imagesDir, jpgFile);
            
            if (fs.existsSync(jpgPath)) {
                // Eliminar el archivo HEIC
                fs.unlinkSync(filePath);
                console.log(`Archivo eliminado: ${filePath}`);
                deletedCount++;
            } else {
                console.warn(`No se encontró el archivo JPG correspondiente para ${file}, no se eliminará.`);
            }
        }
        
        console.log(`Proceso completado. ${deletedCount} de ${heicFiles.length} archivos HEIC eliminados.`);
    } catch (error) {
        console.error("Error al eliminar los archivos HEIC:", error);
    }
}

// Ejecutar el proceso
deleteHEICFiles();
