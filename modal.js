document.addEventListener("DOMContentLoaded", (event) => {
    const modal = document.getElementById("myModal");
    // const openModalBtn = document.querySelector(".openModalBtn");
    const closeBtn = document.querySelector(".closeBtn");

    modal.style.display = "none";
    console.log("Script Modal cargado correctamente");

    // Función para desmarcar todos los checkboxes
    const uncheckAllCheckboxes = () => {
      const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    };

    //Para todas las ocurrencias de boton para abrir la ventana modal
    const openModalBtns = document.querySelectorAll(".openModalBtn");
    openModalBtns.forEach((openModalBtn) => {
      openModalBtn.onclick = function (event) {
        const buttonRect = openModalBtn.getBoundingClientRect();
        const modalContent = openModalBtn.querySelector(".modal-content");

        // Desmarcar todos los checkboxes
        uncheckAllCheckboxes();

        modal.style.display = "block";
        modal.style.top = `${buttonRect.bottom + window.scrollY}px`;
        modal.style.left = `${buttonRect.left + window.scrollX}px`;
      };
    });

    // Ocultar la ventana modal al hacer clic en la "x"
    closeBtn.onclick = function () {
      modal.style.display = "none";
    };

    
    // Ocultar la ventana modal al hacer clic fuera de ella
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  });

