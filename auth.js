// auth.js
let users = [];

fetch('users.json')
  .then(response => response.json())
  .then(data => {
    users = data.users;
  })
  .catch(error => console.error('Error al cargar datos de usuarios:', error));

function authenticateUser(username, password) {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user || null;
}

function getUserRole(user) {
  return user.role;
}

function isAdminUser(user) {
  return user.username === 'Lucy' && user.password === 'L000';
}

export { authenticateUser, getUserRole, isAdminUser };