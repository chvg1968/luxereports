const urlParams = new URLSearchParams(window.location.search);
const propertyName = urlParams.get('property');
const properties = fetch('/properties.json').then(response => response.json()).then(data => data.villas);
const user = JSON.parse(localStorage.getItem('user'));

// Redirigir si no está logueado
user || (window.location.href = '../pages/login.html');

document.addEventListener('DOMContentLoaded', function () {
   

    properties.then(propertiesData => {
        const property = propertiesData.find(p => p.name === propertyName);
        const propertyDetails = document.getElementById('property-details');

        // Propiedad no encontrada
        if (!property) {
            propertyDetails.innerHTML = '<p>Propiedad no encontrada.</p>';
            return;
        }

        // Definir los reportes para cada rol
        const reportsByRole = {
            admin: [
                { name: 'Expenses', src: property.reports.expenses?.src },
                { name: 'Calendar', src: property.reports.calendar?.src },
                { name: 'Cleaning', src: property.reports.cleaning?.src },
                { name: 'Payout', src: property.reports.payout?.src },
                { name: 'Owners Report', src: property.reports.owners_report?.src },
                ...(property.reports.cleaning_global_calendar ? [
                    { name: 'Cleaning global calendar', src: property.reports.cleaning_global_calendar.src },
                ] : []),
            ],
            calendar: [
                { name: 'Calendar', src: property.reports.calendar?.src },
            ],
            cleaning: [
                { name: 'Cleaning', src: property.reports.cleaning?.src },
                ...(property.reports.cleaning_global_calendar ? [
                    { name: 'Cleaning global calendar', src: property.reports.cleaning_global_calendar.src },
                ] : []),
            ],
            default: [
                { name: 'Expenses', src: property.reports.expenses?.src },
                { name: 'Calendar', src: property.reports.calendar?.src },
                { name: 'Payout', src: property.reports.payout?.src },
                { name: 'Owners Report', src: property.reports.owners_report?.src },
            ],
        };

        // Obtener los reportes para el rol del usuario
        const reports = reportsByRole[user.role] || reportsByRole.default;

        // Filtrar si el usuario tiene acceso a los reportes
        if (reports.length > 0 && (['admin', 'calendar', 'cleaning'].includes(user.role) || user.property === propertyName)) {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';

            const propertyHeader = document.createElement('div');
            propertyHeader.className = 'property-header';
            propertyHeader.innerHTML = `
                <h2>${property.name}</h2>
                <img src="${property.image}" alt="${property.name}" class="property-image">
            `;

            const iframeContainer = document.createElement('div');
            iframeContainer.id = 'iframe-container';

            reports.forEach(report => {
                if (report.src) {
                    const button = document.createElement('button');
                    button.textContent = report.name;
            
                    button.onclick = () => {
                        // Limpiar contenido previo del contenedor de iframes
                        iframeContainer.innerHTML = '';
            
                        // Crear un div contenedor para el iframe
                        const iframeWrapper = document.createElement('div');
                        iframeWrapper.classList.add('iframe-wrapper'); // Puedes agregar una clase para estilo personalizado
            
                        // Crear el iframe
                        const iframe = document.createElement('iframe');
                        iframe.src = report.src;
                        iframe.width = '100%';
                        iframe.height = '533'; 
                        iframe.overflow = scroll;// Puedes ajustar la altura según necesites
            
                        // Agregar el iframe al div contenedor
                        iframeWrapper.appendChild(iframe);
            
                        // Agregar el div contenedor al iframeContainer
                        iframeContainer.appendChild(iframeWrapper);
                    };
            
                    // Agregar el botón al contenedor de botones
                    buttonsContainer.appendChild(button);
                    buttonsContainer.classList.add('buttons-list'); 
                }
            });
            

            // Agregar todos los elementos al contenedor principal
            propertyDetails.innerHTML = ''; // Limpiar contenido previo
            propertyDetails.appendChild(propertyHeader);
            propertyDetails.appendChild(buttonsContainer);
            propertyDetails.appendChild(iframeContainer);
            // Activar el menu toggle
            const toggleButton = document.querySelector('.menu-toggle');
            const buttonsList = document.querySelector('.buttons-list');
            toggleButton.classList.add('initial');
          
            toggleButton.addEventListener('click', () => {
              toggleButton.classList.remove('initial');
              buttonsList.classList.toggle('active');
            });
        } else {
            propertyDetails.innerHTML = `<p>No tienes acceso a los reportes de esta propiedad.</p>`;
        }
    });
});