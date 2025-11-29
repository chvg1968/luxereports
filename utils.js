// utils.js
export function showCurrentDate() {
  const dateContainer = document.getElementById('currentDate');
  if (dateContainer) {
      const now = new Date();
      dateContainer.textContent = now.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      });
  }
}
