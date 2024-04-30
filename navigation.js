// navigation.js
import { getUserRole, isAdminUser } from './auth.js';
import { openPage } from './content.js';



function loadNavigation(user) {
  const navContainer = document.getElementById('navContainer');
  if (navContainer) {
    fetch('nav.html')
      .then((response) => response.text())
      .then((html) => {
        navContainer.innerHTML = html;
        filterNavigation(user);
        addNavigationEventListeners();
      })
      .catch((error) => console.error('Error to load navigation', error));
  }
}

function filterNavigation(user) {
    const logoutOption = document.querySelector('.hidden-on-load');
    logoutOption.classList.remove('hidden-on-load');
    const menuBar = document.querySelector('.menu-bar');
    menuBar.classList.remove('hidden');
    const userRole = getUserRole(user);
    const isAdmin = isAdminUser(user);

    if (logoutOption && menuBar) {
      // Ocultar la opción de logout por defecto
      logoutOption.classList.add('hidden-on-load');
      menuBar.classList.remove('hidden');

      if (isAdmin || userRole === 'viewer' || userRole === 'cleaning' || userRole === 'calendar') {
          logoutOption.classList.remove('hidden-on-load');
      }
  }
  
    // Ocultar todos los menús principales
    const menuItems = document.querySelectorAll('.menu');
    menuItems.forEach((item) => {
      item.style.display = 'none';
    });
  
    // Mostrar todos los menús principales para el administrador
    if (isAdmin) {
      menuItems.forEach((item) => {
        item.style.display = 'inline-block';
      });
      return;
    }
  
    // Mostrar los menús principales correspondientes al rol del usuario
    const menusToShow = ['menu-payout', 'menu-owners', 'menu-calendar', 'menu-expenses'];
    if (userRole === 'viewer') {
      menusToShow.forEach((menuClass) => {
        const menu = document.querySelector(`.${menuClass}`);
        menu.style.display = 'inline-block';
  
        // Ocultar todas las opciones de submenú
        const subMenuItems = menu.querySelectorAll('.sub-menu li');
        subMenuItems.forEach((item) => {
          item.style.display = 'none';
        });
  
        // Mostrar solo la opción de submenú correspondiente a la propiedad del usuario
        const subMenuItemToShow = menu.querySelector(`.sub-menu .property[data-property="${user.property}"]`);
        if (subMenuItemToShow) {
          subMenuItemToShow.style.display = 'list-item';
        }
      });
    } else if (userRole === 'cleaning') {
      const cleaningMenu = document.querySelector('.menu-cleaning');
      cleaningMenu.style.display = 'inline-block';
  
      // Mostrar todas las opciones de submenú para el rol "cleaning"
      const cleaningMenuItems = cleaningMenu.querySelectorAll('.sub-menu li');
      cleaningMenuItems.forEach((item) => {
        item.style.display = 'list-item';
      });
    } else if (userRole === 'calendar') {
      const calendarMenu = document.querySelector('.menu-calendar');
      calendarMenu.style.display = 'inline-block';
  
      // Mostrar todas las opciones de submenú para el rol "calendar"
      const calendarMenuItems = calendarMenu.querySelectorAll('.sub-menu li');
      calendarMenuItems.forEach((item) => {
        item.style.display = 'list-item';
      });
    }
    if (user && user.username === 'Insp' && userRole === 'inspeccion') {
      window.location.href = 'inspecciones.html';
    }
  }

 



function addNavigationEventListeners() {
  const subMenuLinks = document.querySelectorAll('.sub-menu a');
  subMenuLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = event.target.getAttribute('href');
      openPage(href);
    });
  });
}

export { loadNavigation };