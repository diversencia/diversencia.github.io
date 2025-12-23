const crearMenu = () => {
  const menuHTML = `
  <style>
    /* Estilos del Contenedor del Menú Lateral */
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
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .menu-wrapper.visible {
      left: 0;
    }

    /* BOTÓN SIEMPRE AZULITO Y CENTRADO */
    .hamburguesa {
      position: fixed;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 1000;
      cursor: pointer;
      background-color: #4db7c3 !important; /* Tu azul característico */
      border: none;
      padding: 12px 8px;
      border-radius: 0 8px 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      outline: none;
    }

    /* Evitar que cambie de color al hacer clic */
    .hamburguesa:focus, 
    .hamburguesa:active {
      background-color: #4db7c3 !important;
      outline: none;
    }

    .hamburguesa:hover {
      background-color: #3fa3af !important; /* Oscurece un poco al pasar el ratón */
    }

    /* Mover el botón junto con el menú */
    .hamburguesa.active {
      left: 250px;
    }

    .hamburguesa svg {
      stroke: white !important;
    }

    /* Estilos del Interior del Menú */
    .menu-lateral {
      padding-top: 20px;
    }

    .logo-menu img {
      width: 140px;
      margin: 0 auto 20px auto;
      display: block;
    }

    .menu-lateral ul {
      list-style: none;
      padding: 0 20px;
      margin: 0;
    }

    .menu-lateral ul li {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .menu-lateral ul li a {
      text-decoration: none;
      color: #333;
      font-size: 17px;
      font-weight: 500;
      transition: color 0.2s;
    }

    .menu-lateral ul li a:hover {
      color: #4db7c3;
    }

    /* Estilo del Asterisco Naranja */
    .asterisco-activo {
      color: #ff8c00;
      margin-left: 8px;
      font-weight: bold;
      font-size: 20px;
      display: none; /* Oculto por defecto */
    }

    /* Mostrar asterisco solo si el padre tiene la clase .active */
    .active .asterisco-activo {
      display: inline;
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

  // --- LÓGICA DE FUNCIONAMIENTO ---
  const menuWrapper = document.getElementById("menu-wrapper");
  const toggleBtn = document.getElementById("toggle-menu");
  const iconoMenu = document.getElementById("icono-menu");

  toggleBtn.addEventListener("click", () => {
    const abierto = menuWrapper.classList.toggle("visible");
    toggleBtn.classList.toggle("active");
    
    // Cambia la dirección de la flecha según esté abierto o cerrado
    iconoMenu.innerHTML = abierto
      ? '<polyline points="15 18 9 12 15 6" />'
      : '<polyline points="9 18 15 12 9 6" />';
  });

  // --- LÓGICA DEL ASTERISCO AUTOMÁTICO ---
  // Obtenemos el nombre del archivo actual (ej: sobre.html)
  const pathActual = window.location.pathname.split("/").pop();
  const enlaces = document.querySelectorAll("#lista-menu a");

  enlaces.forEach(enlace => {
    const href = enlace.getAttribute("href");
    // Si la URL coincide o si estamos en la raíz y el enlace es index.html
    if (href === pathActual || (pathActual === "" && href === "index.html")) {
      enlace.parentElement.classList.add("active");
    }
  });
};

// Asegurar que el script se ejecute siempre
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crearMenu);
} else {
    crearMenu();
}
