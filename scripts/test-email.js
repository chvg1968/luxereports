#!/usr/bin/env node

/**
 * Script de prueba para verificar el envío de correos con Resend
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testEmail() {
    console.log('\n📧 Prueba de envío de correo con Resend\n');

    // Verificar variables de entorno
    console.log('🔍 Verificando variables de entorno...');

    if (!process.env.RESEND_API_KEY) {
        console.error('❌ Error: RESEND_API_KEY no está configurado');
        process.exit(1);
    }
    console.log('✓ RESEND_API_KEY: ' + process.env.RESEND_API_KEY.substring(0, 10) + '...');

    if (!process.env.SENDER_EMAIL) {
        console.error('❌ Error: SENDER_EMAIL no está configurado');
        process.exit(1);
    }
    console.log('✓ SENDER_EMAIL: ' + process.env.SENDER_EMAIL);

    // Inicializar Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('\n📤 Enviando correo de prueba...\n');

    try {
        const data = await resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: 'luxepr-forwards@googlegroups.com',
            cc: process.env.BACKUP_EMAIL || undefined,
            subject: 'Prueba de Inspección - Ocean Grace',
            html: `
                <h2>Notificación de Inspección Completada</h2>
                <p><strong>Inspector de Prueba</strong> informa que ha terminado de completar la inspección para <strong>Ocean Grace</strong> y cumple con los requisitos de Luxe Properties.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">Este es un mensaje de prueba generado automáticamente desde el sistema de inspecciones de Luxe Properties.</p>
            `
        });

        console.log('✅ Correo enviado exitosamente!');
        console.log('\n📋 Detalles de la respuesta:');
        console.log(JSON.stringify(data, null, 2));
        console.log('\n✨ Revisa la bandeja de entrada de luxepr-forwards@googlegroups.com');
        console.log('   También revisa la carpeta de SPAM/Correo no deseado\n');

    } catch (error) {
        console.error('\n❌ Error al enviar el correo:');
        console.error('Mensaje:', error.message);

        if (error.message.includes('from')) {
            console.error('\n💡 Sugerencia: Verifica que el dominio "' + process.env.SENDER_EMAIL.split('@')[1] + '" esté verificado en tu cuenta de Resend.');
            console.error('   Puedes verificar esto en: https://resend.com/domains\n');
        }

        if (error.message.includes('API key')) {
            console.error('\n💡 Sugerencia: Verifica que tu RESEND_API_KEY sea válido.');
            console.error('   Puedes obtener una nueva en: https://resend.com/api-keys\n');
        }

        console.error('\nDetalles completos del error:');
        console.error(error);
        process.exit(1);
    }
}

// Ejecutar
testEmail();
