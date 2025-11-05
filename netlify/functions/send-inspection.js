const { Resend } = require('resend');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        const { inspectorName, villaName } = JSON.parse(event.body);

        // Validate required fields
        if (!inspectorName || !villaName) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Por favor proporciona el nombre del inspector y el nombre de la villa'
                })
            };
        }

        // Validate inspector name is not empty after trim
        if (inspectorName.trim() === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Por favor ingresa tu nombre'
                })
            };
        }

        // Initialize Resend with API key from environment
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send email
        // TEMPORAL: Agregado CC para recibir copias mientras se soluciona Google Groups
        const data = await resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: 'luxepr-forwards@googlegroups.com',
            cc: process.env.BACKUP_EMAIL || undefined, // Correo de respaldo si está configurado
            subject: `Inspección completada: ${villaName}`,
            html: `
                <h2>Notificación de Inspección Completada</h2>
                <p><strong>${inspectorName}</strong> informa que ha terminado de completar la inspección para <strong>${villaName}</strong> y cumple con los requisitos de Luxe Properties.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">Este mensaje fue generado automáticamente desde el sistema de inspecciones de Luxe Properties.</p>
            `
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Mensaje enviado con éxito',
                data
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al enviar el mensaje. Por favor intenta nuevamente.',
                error: error.message
            })
        };
    }
};
