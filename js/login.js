document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginError.textContent = '';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch('/.netlify/functions/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));

            switch (user.role) {
                case 'admin':
                    window.location.href = 'home.html';
                    break;
                case 'inspeccion':
                    window.location.href = 'inspecciones.html';
                    break;
                default:
                    window.location.href = 'home.html';
            }
        } catch (error) {
            loginError.textContent = 'Usuario o contraseña incorrectos.';
        }
    });
});