/**
 * Inspection Submit Component
 * Componente reutilizable para enviar notificaciones de inspección completada
 */

class InspectionSubmit {
    constructor() {
        this.villaName = this.extractVillaName();
        this.init();
    }

    /**
     * Extrae el nombre de la villa del H1 de la página
     * Formato esperado: "Inspección [número] [Nombre de Villa]"
     * Ejemplo: "Inspección 2-208 Ocean Haven" -> "Ocean Haven"
     */
    extractVillaName() {
        const h1Element = document.querySelector('.title_inspect');

        if (!h1Element) {
            console.error('No se encontró el elemento .title_inspect');
            return 'Villa Desconocida';
        }

        const fullText = h1Element.textContent.trim();

        // Patrón 1: "Inspección [número] [Nombre]"
        // Ejemplo: "Inspección 2-208 Ocean Haven"
        let match = fullText.match(/Inspección\s+[\d-]+\s+(.+)/i);
        if (match && match[1]) {
            return match[1].trim();
        }

        // Patrón 2: "Inspección de [código] [Nombre]"
        // Ejemplo: "Inspección de Est. 24 Casa Paraíso" o "Inspección de Atl. G7 Casa Prestige"
        match = fullText.match(/Inspección\s+de\s+[A-Za-z]+\.\s*[\dA-Za-z-]+\s+(.+)/i);
        if (match && match[1]) {
            return match[1].trim();
        }

        // Si no coincide con ningún patrón, devolver el texto completo sin "Inspección"
        return fullText.replace(/Inspección\s+/i, '').trim();
    }

    /**
     * Inicializa el componente creando el formulario e inyectándolo en el DOM
     */
    init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    /**
     * Renderiza el formulario de inspección al final del body
     */
    render() {
        const container = document.createElement('div');
        container.className = 'inspection-submit-container';
        container.innerHTML = `
            <div class="inspection-submit-form">
                <h3 class="inspection-submit-title">Completar Inspección</h3>
                <div class="inspection-submit-input-group">
                    <label for="inspector-name" class="inspection-submit-label">
                        Nombre del Inspector
                    </label>
                    <input
                        type="text"
                        id="inspector-name"
                        class="inspection-submit-input"
                        placeholder="Ingresa tu nombre"
                        required
                    />
                </div>
                <button
                    type="button"
                    id="submit-inspection-btn"
                    class="inspection-submit-btn"
                >
                    Enviar Inspección
                </button>
                <div id="inspection-submit-message" class="inspection-submit-message"></div>
            </div>
        `;

        // Insertar al final del body
        document.body.appendChild(container);

        // Agregar event listeners
        this.attachEventListeners();
    }

    /**
     * Adjunta los event listeners al formulario
     */
    attachEventListeners() {
        const submitBtn = document.getElementById('submit-inspection-btn');
        const inputField = document.getElementById('inspector-name');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleSubmit());
        }

        // Permitir enviar con Enter
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmit();
                }
            });
        }
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit() {
        const inputField = document.getElementById('inspector-name');
        const submitBtn = document.getElementById('submit-inspection-btn');
        const messageDiv = document.getElementById('inspection-submit-message');

        const inspectorName = inputField.value.trim();

        // Validación
        if (!inspectorName) {
            this.showMessage('Por favor ingresa tu nombre', 'error');
            inputField.focus();
            return;
        }

        // Deshabilitar botón y mostrar loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        this.showMessage('', ''); // Limpiar mensajes previos

        try {
            const response = await fetch('/.netlify/functions/send-inspection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inspectorName,
                    villaName: this.villaName
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Mensaje enviado con éxito', 'success');
                inputField.value = ''; // Limpiar input

                // Mantener el botón deshabilitado después del éxito
                submitBtn.textContent = 'Enviado ✓';
                submitBtn.classList.add('success');
            } else {
                throw new Error(data.message || 'Error al enviar el mensaje');
            }

        } catch (error) {
            console.error('Error:', error);
            this.showMessage(
                error.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.',
                'error'
            );

            // Re-habilitar el botón en caso de error
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Inspección';
        }
    }

    /**
     * Muestra un mensaje de feedback al usuario
     * @param {string} message - El mensaje a mostrar
     * @param {string} type - El tipo de mensaje: 'success' o 'error'
     */
    showMessage(message, type) {
        const messageDiv = document.getElementById('inspection-submit-message');

        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = 'inspection-submit-message';

        if (type) {
            messageDiv.classList.add(`inspection-submit-message-${type}`);
        }

        // Auto-ocultar mensaje de éxito después de 5 segundos
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'inspection-submit-message';
            }, 5000);
        }
    }
}

// Inicializar el componente automáticamente cuando se carga el script
new InspectionSubmit();
