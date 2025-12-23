document.addEventListener("DOMContentLoaded", () => {
    const menuWrapper = document.getElementById("menu-wrapper");
    const toggleBtn = document.getElementById("toggle-menu");
    const iconoMenu = document.getElementById("icono-menu");

    if (toggleBtn && menuWrapper) { // Verificamos que existan en la página
        toggleBtn.addEventListener("click", () => {
            const abierto = menuWrapper.classList.toggle("visible");
            toggleBtn.classList.toggle("active");
            
            // Cambia el icono de la flecha
            iconoMenu.innerHTML = abierto
                ? '<polyline points="15 18 9 12 15 6" />'
                : '<polyline points="9 18 15 12 9 6" />';
        });
    }
});
