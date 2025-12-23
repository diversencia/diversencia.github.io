const crearMenu = () => {
  // Importamos Fredoka para el texto general
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap';
  document.head.appendChild(fontLink);

  const menuHTML = `
  <style>
    /* Contenedor del Menú Lateral */
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
      font-family: 'Fredoka', sans-serif; 
      display: flex;
      flex-direction: column;
    }

    body.open-dyslexic .menu-wrapper,
    body.dislexia .menu-wrapper {
      font-family: 'OpenDyslexic', sans-serif !important;
    }

    .menu-wrapper.visible {
      left: 0;
    }

    /* BOTÓN VERDE CENTRADO */
    .hamburguesa {
      position: fixed;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 1000;
      cursor: pointer;
      background-color: #28a745 !important; /* Color verde */
      border: none;
      padding: 12px 8px;
      border-radius: 0 8px 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      outline: none;
    }

    .hamburguesa:focus, .hamburguesa:active {
      background-color: #28a745 !important;
    }

    .hamburguesa:hover {
      background-color: #218838 !important; /* Verde un poco más oscuro */
    }

    .hamburguesa.active {
      left: 250px;
    }

    .hamburguesa svg {
      stroke: white !important;
    }

    /* Ajuste del Logo (Más pequeño y un poco más arriba) */
    .logo-menu {
      padding: 25px 20px 10px 20px; 
      text-align: center;
    }

    .logo-menu img {
      max-width: 80%; /* Logo más pequeño */
      height: auto;
      max-height: 80px; 
      display: inline-block;
    }

    /* Estilos de la Lista */
    .menu-lateral ul {
      list-style: none;
      padding: 0 25px;
      margin: 0;
    }

    .menu-lateral ul li {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .menu-lateral ul li a {
      text-decoration: none;
      color: #4db7c3; /* Mantenemos el azul para los enlaces */
      font-size: 18px;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    /* Estilo del Asterisco con fuente Glacial Indifference */
    .asterisco-activo {
      color: #ff8c00;
      margin-left: 10px;
      font-weight: bold;
      font-size: 24px;
      font-family: 'Glacial Indifference', sans-serif; /* Fuente específica para el asterisco */
      display: none;
    }

    .active .asterisco-activo {
      display: inline;
    }

    @media (max-width: 480px) {
      .menu-wrapper {
        width: 75%; 
        left: -75%;
      }
      .hamburguesa.active {
        left: 75%;
      }
    }
  </style>

  <div class="page-wrapper">
    <button id="toggle-menu" class="hamburguesa" aria-label="Menú">
      <svg id="icono-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
           viewBox="0 0 24 24" fill="none" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <div class="menu-wrapper" id="menu-wrapper">
      <nav class="menu-lateral">
        <div class="logo-menu">
          <img src="logo.png" alt="Logo Diversencia" />
        </div>
        <ul id="lista-menu">
          <li><a href="index.html">Inicio</a><span class="asterisco-activo">*</span></li>
          <li><a href="sobre.html">Sobre Nosotros</a><span class="asterisco-activo">*</span></li>
          <li><a href="espacios.html">Espacios Inclusivos</a><span class="asterisco-activo">*</span></li>
          <li><a href="juegos.html">Juegos de mesa</a><span class="asterisco-activo">*</span></li>
          <li><a href="online.html">Recursos online</a><span class="asterisco-activo">*</span></li>
          <li><a href="causas.html">Causas</a><span class="asterisco-activo">*</span></li>
          <li><a href="contacto.html">Contacto</a><span class="asterisco-activo">*</span></li>
        </ul>
      </nav>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', menuHTML);

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

  const pathActual = window.location.pathname.split("/").pop();
  const enlaces = document.querySelectorAll("#lista-menu a");

  enlaces.forEach(enlace => {
    const href = enlace.getAttribute("href");
    if (href === pathActual || (pathActual === "" && href === "index.html")) {
      enlace.parentElement.classList.add("active");
    }
  });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crearMenu);
} else {
    crearMenu();
}
