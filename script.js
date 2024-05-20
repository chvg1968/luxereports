// script.js
import { authenticateUser, isAdminUser } from './auth.js';
import { loadNavigation } from './navigation.js';
import { openPage } from './content.js';
import { showCurrentDate } from './utils.js';

let user = null;

function handleLogin() {
  const loginForm = document.getElementById('userLoginForm');
  const propertyData = document.getElementById('propertyData');
  const propertyInfo = document.getElementById('propertyInfo');

  propertyData.style.display = 'none';

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    user = authenticateUser(username, password);
    if (user) {
      const isAdmin = isAdminUser(user);
      propertyInfo.textContent = `📖 INFO: ${isAdmin ? 'All Properties' : user.property}`;
      propertyData.style.display = 'block';
      loginForm.style.display = 'none';
      document.querySelector('#loginForm h2').textContent = `Welcome, ${username}!`;

      loadNavigation(user);
    } else {
      alert('User or password invalid. Please try again.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname !== '/index.html') {
    loadNavigation(user);
  }
  handleLogin();
  showCurrentDate();
  setInterval(showCurrentDate, 1000);
});

