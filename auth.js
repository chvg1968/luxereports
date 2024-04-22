// auth.js
let users = [];

fetch('users.json')
  .then(response => response.json())
  .then(data => {
    users = data.users;
  })
  .catch(error => console.error('Error al cargar datos de usuarios:', error));

  function authenticateUser(username, password) {
    if (users.length === 0) {
      console.error('users.json not exist');
      return null;
    }
  
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
  
    return user || null;
  }

function getUserRole(user) {
  if (!user || !user.role) {
    return null; // O cualquier otro valor por defecto que desees
  }
  return user.role;
}

function isAdminUser(user) {
  // Verifica si el objeto user no es nulo y tiene las propiedades username y password
  if (user && user.username && user.password) {
    return user.username === 'Lucy' && user.password === 'L000';
  }
  // Si el objeto user es nulo o no tiene las propiedades necesarias, retorna false
  return false;
}

export { authenticateUser, getUserRole, isAdminUser };