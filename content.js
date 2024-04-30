// content.js
import { loadNavigation } from './navigation.js';




function openPage(url) {
  const main = document.querySelector('main');//
  
  if (main) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const content = document.createElement('div');
        content.innerHTML = html;

        const newMain = content.querySelector('main');

        main.innerHTML = '';
        if (newMain) {
          main.appendChild(newMain);
        } else {
          main.innerHTML = html;
        }

        loadNavigation(user); // Cargar el menú de navegación después de cargar el contenido
      })
      .catch((error) => console.error(`Error al cargar la página ${url}:`, error));
  }
}

export { openPage };