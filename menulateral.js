const crearMenu = () => {
  const menuHTML = `
  <style>
    /* Contenedor principal */
    .menu-wrapper {
      position: fixed;
      left: -250px;
      top: 0;
      width: 250px;
      height: 100vh;
      background: #ffffff;
      transition: all 0.3s ease;
      z-index: 999;
      box-shadow: 2px 0 10px rgba(0,0,0,0.2);
      padding-top: 60px; /* Espacio para que el botón no tape el logo */
    }

    /* Cuando el menú está abierto */
    .menu-wrapper.visible {
      left: 0;
    }

    /* Botón Hamburguesa */
    .hamburguesa {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      cursor: pointer;
      background: #4db7c3; /* Color de fondo que pediste */
      border: none;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hamburguesa svg {
      stroke: white; /* Color del icono */
    }

    /* Estilos de la lista */
    .menu-lateral ul {
      list-style: none;
      padding: 20px;
      margin: 0;
    }

    .menu-lateral ul li {
      margin-bottom: 15px;
    }

    .menu-lateral ul li a {
      text-decoration: none;
      color: #333; /* Color del texto */
      font-family: sans-serif;
      font-size: 18px;
      display: block;
    }

    .logo-menu img {
      width: 80%;
      margin: 0 auto 20px auto;
      display: block;
    }
  </style>

  <div class="page-wrapper">
    <button id="toggle-menu" class="hamburguesa" aria-label="Menú">
      <svg id="icono-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
           viewBox="0 0 24 24" fill="none" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <div class="menu-wrapper" id="menu-wrapper">
      <nav class="menu-lateral">
        <div class="logo-menu"><img src="logo.png" alt="Logo" /></div>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="sobre.html">Sobre Nosotros</a></li>
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

  document.body.insertAdjacentHTML('afterbegin', menuHTML);

  // Lógica de apertura
  const menuWrapper = document.getElementById("menu-wrapper");
  const toggleBtn = document.getElementById("toggle-menu");
  const iconoMenu = document.getElementById("icono-menu");

  toggleBtn.addEventListener("click", () => {
    const abierto = menuWrapper.classList.toggle("visible");
    iconoMenu.innerHTML = abierto
      ? '<polyline points="15 18 9 12 15 6" />'
      : '<polyline points="9 18 15 12 9 6" />';
  });
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crearMenu);
} else {
    crearMenu();
}
