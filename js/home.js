// Cargar los datos de las propiedades
const properties = fetch('/properties.json').then(response => response.json()).then(data => data.villas);
console.log(properties);

const user = JSON.parse(localStorage.getItem('user'));

import { showCurrentDate } from '../utils.js';

if (!user) {
    window.location.href = '../pages/login.html'; // Redirigir si no está logueado
}

document.addEventListener('DOMContentLoaded', function() {
    showCurrentDate();

    properties.then(propertiesData => {
        const propertiesContainer = document.getElementById('properties-container');
        let visiblePropertiesCount = 0;

        propertiesData.forEach(property => {
            // Mostrar propiedades basadas en el rol y propiedad asignada
            if (user.role === 'admin' || user.role === 'calendar' || user.role === 'cleaning' || user.property === property.name) {
                visiblePropertiesCount++;   
                const card = document.createElement('div');
                card.classList.add('property-card');
                card.innerHTML = `
                    <img src="${property.image}" alt="${property.name}" width="500" height="200">
                    <h3>${property.name}</h3>
                    <a href="property.html?property=${property.name}">Reports</a>
                `;
                propertiesContainer.appendChild(card);
            }
        });

        // Si solo hay una propiedad visible, añadir clase para centrado
        if (visiblePropertiesCount === 1) {
            propertiesContainer.classList.add('single-property');
        }
    });
});
