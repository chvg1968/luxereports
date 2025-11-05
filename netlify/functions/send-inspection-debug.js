const { Resend } = require('resend');

/**
 * Versión de debug de la función send-inspection
 * Proporciona más información sobre errores y el estado del envío
 */

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    console.log('=== DEBUG: Inicio de send-inspection ===');
    console.log('Timestamp:', new Date().toISOString());

    try {
        const { inspectorName, villaName } = JSON.parse(event.body);

        console.log('DEBUG: Datos recibidos:', { inspectorName, villaName });

        // Validate required fields
        if (!inspectorName || !villaName) {
            console.log('DEBUG: Validación falló - campos vacíos');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Por favor proporciona el nombre del inspector y el nombre de la villa'
                })
            };
        }

        // Validate inspector name is not empty after trim
        if (inspectorName.trim() === '') {
            console.log('DEBUG: Validación falló - nombre vacío después de trim');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Por favor ingresa tu nombre'
                })
            };
        }

        // Check environment variables
        console.log('DEBUG: Verificando variables de entorno...');
        console.log('DEBUG: RESEND_API_KEY existe:', !!process.env.RESEND_API_KEY);
        console.log('DEBUG: SENDER_EMAIL:', process.env.SENDER_EMAIL);

        if (!process.env.RESEND_API_KEY) {
            console.error('DEBUG: RESEND_API_KEY no está configurado');
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Error de configuración: RESEND_API_KEY no está configurado'
                })
            };
        }

        if (!process.env.SENDER_EMAIL) {
            console.error('DEBUG: SENDER_EMAIL no está configurado');
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Error de configuración: SENDER_EMAIL no está configurado'
                })
            };
        }

        // Initialize Resend with API key from environment
        console.log('DEBUG: Inicializando Resend...');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const emailPayload = {
            from: process.env.SENDER_EMAIL,
            to: 'luxepr-forwards@googlegroups.com',
            subject: `Inspección completada: ${villaName}`,
            html: `
                <h2>Notificación de Inspección Completada</h2>
                <p><strong>${inspectorName}</strong> informa que ha terminado de completar la inspección para <strong>${villaName}</strong> y cumple con los requisitos de Luxe Properties.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">Este mensaje fue generado automáticamente desde el sistema de inspecciones de Luxe Properties.</p>
            `
        };

        console.log('DEBUG: Payload del correo:', JSON.stringify(emailPayload, null, 2));
        console.log('DEBUG: Enviando correo...');

        // Send email
        const data = await resend.emails.send(emailPayload);

        console.log('DEBUG: Respuesta de Resend:', JSON.stringify(data, null, 2));
        console.log('DEBUG: Correo enviado exitosamente!');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Mensaje enviado con éxito',
                debug: {
                    emailId: data.id,
                    timestamp: new Date().toISOString(),
                    recipient: 'luxepr-forwards@googlegroups.com',
                    sender: process.env.SENDER_EMAIL
                },
                data
            })
        };

    } catch (error) {
        console.error('DEBUG: ERROR CAPTURADO');
        console.error('DEBUG: Error message:', error.message);
        console.error('DEBUG: Error stack:', error.stack);
        console.error('DEBUG: Error completo:', JSON.stringify(error, null, 2));

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al enviar el mensaje. Por favor intenta nuevamente.',
                error: error.message,
                debug: {
                    timestamp: new Date().toISOString(),
                    errorType: error.name,
                    errorDetails: error.toString()
                }
            })
        };
    }
};
