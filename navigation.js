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
      .catch((error) => console.error('Error al cargar el menú de navegación', error));
  }
}

function filterNavigation(user) {
    const menuBar = document.querySelector('.menu-bar');
    const userRole = getUserRole(user);
    const isAdmin = isAdminUser(user);
  
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
    const menusToShow = ['menu-payout', 'menu-owners', 'menu-calendar'];
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