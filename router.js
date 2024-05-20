document.addEventListener('DOMContentLoaded', () => {
    console.log("Script cargado correctamente");
    const contentDiv = document.getElementById('content-insp');
    const nav = document.getElementById('main-nav');
    const menuToggle = nav.querySelector('.menu-toggle');
    const menuItems = nav.querySelector('ul');
    const menuLinks = nav.querySelectorAll('a');

    menuToggle.addEventListener('click', () => {
        menuItems.classList.toggle('show');
    });

    
   

    function logout() {
        // Limpiar la sesión u otras tareas de cierre de sesión
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = "index.html";
    }
});


