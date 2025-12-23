// Definimos el contenido HTML y CSS del menú
const menuHTML = `
  <style>
    /* Estilos básicos para que el toggle funcione */
    .menu-wrapper {
      position: fixed;
      left: -250px; /* Escondido por defecto */
      top: 0;
      width: 250px;
      height: 100%;
      background: #fff;
      transition: 0.3s;
      z-index: 999;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }
    .menu-wrapper.visible {
      left: 0;
    }
    .hamburguesa {
      cursor: pointer;
      background: none;
      border: none;
      z-index: 1000;
      position: fixed;
      top: 20px;
      left: 20px;
    }
    /* Añade aquí el resto de tu CSS de .menu-lateral, .logo-menu, etc. */
  </style>

  <div class="page-wrapper">
    <button id="toggle-menu" class="hamburguesa" aria-label="Menú">
      <svg id="icono-menu" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
           viewBox="0 0 24 24" fill="none" stroke="#4db7c3" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <div class="menu-wrapper" id="menu-wrapper" aria-label="Menú principal">
      <nav class="menu-lateral">
        <div class="logo-menu"><img src="logo.png" alt="Logo Diversencia" /></div>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="sobre.html">Sobre Nosotros</a><span class="asterisco1">*</span></li>
          <li><a href="espacios.html">Espacios Inclusivos</a></li>
          <li><a href="juegos.html">Juegos de mesa</a></li>
          <li><a href="online.html">Recursos online</a></li>
          <li><a href="causas.html">Causas</a></li>
          <li><a href="contacto.html">Contacto</a></li>
        </ul>
      </nav>
    </div>
  </div>
`;

// Inyectamos el menú al principio del body
document.body.insertAdjacentHTML('afterbegin', menuHTML);

// Lógica del script (tu código original)
const menuWrapper = document.getElementById("menu-wrapper");
const toggleBtn = document.getElementById("toggle-menu");
const iconoMenu = document.getElementById("icono-menu");

toggleBtn.addEventListener("click", () => {
  const abierto = menuWrapper.classList.toggle("visible");
  toggleBtn.classList.toggle("active");
  iconoMenu.innerHTML = abierto
    ? '<polyline points="15 18 9 12 15 6" />'
    : '<polyline points="9 18 15 12 9 6" />';
});
