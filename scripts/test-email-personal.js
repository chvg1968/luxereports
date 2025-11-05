#!/usr/bin/env node

/**
 * Script de prueba para enviar correo a una dirección personal
 * Esto confirma que Resend funciona correctamente antes de revisar Google Groups
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';
import readline from 'readline';

// Cargar variables de entorno
dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function testPersonalEmail() {
    console.log('\n📧 Prueba de envío de correo a dirección personal\n');
    console.log('Este test confirma que Resend funciona correctamente');
    console.log('antes de diagnosticar el problema con Google Groups.\n');

    // Solicitar correo personal
    const personalEmail = await question('Ingresa tu correo personal para la prueba: ');

    if (!personalEmail || !personalEmail.includes('@')) {
        console.error('\n❌ Correo inválido. Saliendo...\n');
        rl.close();
        process.exit(1);
    }

    console.log('\n🔍 Verificando variables de entorno...');

    if (!process.env.RESEND_API_KEY) {
        console.error('❌ Error: RESEND_API_KEY no está configurado');
        rl.close();
        process.exit(1);
    }
    console.log('✓ RESEND_API_KEY: ' + process.env.RESEND_API_KEY.substring(0, 10) + '...');

    if (!process.env.SENDER_EMAIL) {
        console.error('❌ Error: SENDER_EMAIL no está configurado');
        rl.close();
        process.exit(1);
    }
    console.log('✓ SENDER_EMAIL: ' + process.env.SENDER_EMAIL);

    // Inicializar Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    console.log('\n📤 Enviando correo de prueba a: ' + personalEmail + '\n');

    try {
        const data = await resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: personalEmail,
            subject: '🧪 Prueba de Sistema de Inspecciones - Luxe Properties',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1976d2;">✅ Prueba de Inspección Exitosa</h2>

                    <p>Este es un correo de prueba del sistema de inspecciones de Luxe Properties.</p>

                    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #1976d2;">Detalles de la Prueba:</h3>
                        <p><strong>Inspector:</strong> Inspector de Prueba</p>
                        <p><strong>Villa:</strong> Ocean Grace</p>
                        <p><strong>Estado:</strong> Inspección completada</p>
                        <p><strong>Mensaje:</strong> Inspector de Prueba informa que ha terminado de completar la inspección para Ocean Grace y cumple con los requisitos de Luxe Properties.</p>
                    </div>

                    <p style="color: #666; font-size: 14px;">
                        Si recibiste este correo correctamente, significa que:
                    </p>
                    <ul style="color: #666; font-size: 14px;">
                        <li>✅ Tu configuración de Resend está correcta</li>
                        <li>✅ El dominio está verificado y autenticado</li>
                        <li>✅ El sistema de envío funciona</li>
                    </ul>

                    <p style="color: #666; font-size: 14px;">
                        El problema probablemente esté en la configuración de Google Groups, no en el sistema de envío.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">
                        Este es un mensaje de prueba generado automáticamente desde el sistema de inspecciones de Luxe Properties.
                    </p>
                </div>
            `
        });

        console.log('✅ Correo enviado exitosamente!');
        console.log('\n📋 Detalles de la respuesta:');
        console.log(JSON.stringify(data, null, 2));
        console.log('\n✨ Revisa tu bandeja de entrada: ' + personalEmail);
        console.log('   También revisa la carpeta de SPAM si no lo ves en 1-2 minutos\n');

        console.log('💡 Si recibes este correo correctamente:');
        console.log('   → El problema NO es Resend ni tu configuración');
        console.log('   → El problema ES Google Groups bloqueando/filtrando los correos\n');

    } catch (error) {
        console.error('\n❌ Error al enviar el correo:');
        console.error('Mensaje:', error.message);

        if (error.message.includes('from') || error.message.includes('domain')) {
            console.error('\n⚠️  PROBLEMA DE DOMINIO DETECTADO');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('\n💡 El dominio "' + process.env.SENDER_EMAIL.split('@')[1] + '" NO está verificado en Resend.');
            console.error('\nPara verificar tu dominio:');
            console.error('1. Ve a: https://resend.com/domains');
            console.error('2. Agrega el dominio: ' + process.env.SENDER_EMAIL.split('@')[1]);
            console.error('3. Configura los registros DNS (SPF, DKIM, DMARC)');
            console.error('4. Espera la verificación (puede tomar unos minutos)');
            console.error('\n📚 Guía: https://resend.com/docs/dashboard/domains/introduction\n');
        }

        if (error.message.includes('API key')) {
            console.error('\n💡 Sugerencia: Verifica que tu RESEND_API_KEY sea válido.');
            console.error('   Puedes obtener una nueva en: https://resend.com/api-keys\n');
        }

        console.error('\nDetalles completos del error:');
        console.error(error);
    }

    rl.close();
}

// Ejecutar
testPersonalEmail();
