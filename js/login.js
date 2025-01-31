// Función para validar acceso de usuario
function validateUserAccess(user, requiredRole) {
    if (!user) return false;
    
    const allowedRoles = ['admin', 'inspeccion'];
    
    return user.role === requiredRole && 
           allowedRoles.includes(user.role);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginError.textContent = ''; // Limpiar mensaje de error previo

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            // Cargar datos de usuarios
            const response = await fetch('/users.json');
            const { users } = await response.json();

            // Buscar usuario
            const user = users.find(u => 
                u.username === username && u.password === password
            );

            // Validar usuario
            if (user) {
                // Guardar usuario en sesión
                localStorage.setItem('user', JSON.stringify(user));

                // Redirigir según el rol
                switch (user.role) {
                    case 'admin':
                        window.location.href = 'home.html';
                        break;
                    case 'inspeccion':
                        window.location.href = 'inspecciones.html';
                        break;
                    case 'calendar':
                        window.location.href = 'home.html';
                        break;
                    case 'cleaning':
                        window.location.href = 'home.html';
                        break;
                    default:
                        window.location.href = 'home.html';
                }
            } else {
                // Mostrar error de login
                loginError.textContent = 'Usuario o contraseña incorrectos.';
            }
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            loginError.textContent = 'Error al iniciar sesión. Intente nuevamente.';
        }
    });
});

// Exportar la función de validación para usar en otras páginas
export { validateUserAccess };