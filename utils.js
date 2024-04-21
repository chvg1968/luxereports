// utils.js
function showCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formattedDate = now.toLocaleString('en-En', options);
      currentDateElement.textContent = formattedDate;
    }
  }
  
  export { showCurrentDate };