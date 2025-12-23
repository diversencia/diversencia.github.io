// Función para cargar el menú
function cargarMenu() {
    const menuHTML = '
    <button id="toggle-menu" class="hamburguesa" aria-label="Abrir menú" style="background-color: #f39c12; border: none;">
      <svg id="icono-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
           viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <div class="menu-wrapper" id="menu-wrapper" aria-label="Menú principal">
      <nav id="menu-lateral" class="menu-lateral">
        <div class="logo-menu">
          <img src="logo.png" alt="Logo Diversencia" />
        </div>
        <ul>
          <li><a href="index.html">Inicio</a><span class="asterisco1">*</span></li>
          <li><a href="sobre.html">Sobre Nosotros</a></li>
          <li><a href="espacios.html">Espacios Inclusivos</a></li>
          <li><a href="juegos.html">Juegos de mesa</a></li>
          <li><a href="online.html">Recursos online</a></li>
          <li><a href="causas.html">Causas</a></li>
          <li><a href="contacto.html">Contacto</a></li>
        </ul>
      </nav>
    </div>
    ';

    // Insertar el menú al principio del body o dentro de un contenedor
    document.body.insertAdjacentHTML('afterbegin', menuHTML);

    // Lógica del botón (la que ya tenías)
    const menuWrapper = document.getElementById("menu-wrapper");
    const toggleBtn = document.getElementById("toggle-menu");
    const iconoMenu = document.getElementById("icono-menu");

    toggleBtn.addEventListener("click", () => {
      const abierto = menuWrapper.classList.toggle("visible");
      toggleBtn.classList.toggle("active");
      // Cambiamos el icono y nos aseguramos de que siga siendo blanco
      iconoMenu.innerHTML = abierto
        ? '<polyline points="15 18 9 12 15 6" stroke="white" />'
        : '<polyline points="9 18 15 12 9 6" stroke="white" />';
    });

    // Código extra para marcar la página "activa" automáticamente
    const links = document.querySelectorAll('#menu-lateral ul li a');
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('activo');
        }
    });
}

// Ejecutar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", cargarMenu);
