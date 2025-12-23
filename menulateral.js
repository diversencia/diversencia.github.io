const crearMenu = () => {
  const menuHTML = `
  <style>
    /* Contenedor del menú lateral */
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
      padding-top: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .menu-wrapper.visible {
      left: 0;
    }

    /* BOTÓN CENTRADO EN EL LATERAL IZQUIERDO */
    .hamburguesa {
      position: fixed;
      top: 50%;           /* Lo baja a la mitad de la altura */
      left: 0;            /* Pegado al borde izquierdo */
      transform: translateY(-50%); /* Ajuste exacto para centrado vertical */
      z-index: 1000;
      cursor: pointer;
      background: #4db7c3;
      border: none;
      padding: 12px 8px;   /* Un poco más alto para que sea fácil de clicar */
      border-radius: 0 8px 8px 0; /* Redondeado solo en el lado derecho */
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    /* Si el menú está abierto, el botón se mueve con él */
    .hamburguesa.active {
      left: 250px;
    }

    .hamburguesa svg {
      stroke: white;
    }

    /* Estilos de la lista y asterisco */
    .menu-lateral ul {
      list-style: none;
      padding: 20px;
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
      font-size: 18px;
    }

    .asterisco-activo {
      color: #ff8c00;
      margin-left: 8px;
      font-weight: bold;
      display: none;
    }

    .active .asterisco-activo {
      display: inline;
    }

    .logo-menu img {
      width: 120px;
      margin: 20px auto;
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
    toggleBtn.classList.toggle("active"); // Para que el botón se desplace
    iconoMenu.innerHTML = abierto
      ? '<polyline points="15 18 9 12 15 6" />'
      : '<polyline points="9 18 15 12 9 6" />';
  });

  // Lógica del asterisco
  const pathActual = window.location.pathname.split("/").pop() || "index.html";
  const enlaces = document.querySelectorAll("#lista-menu a");
  enlaces.forEach(enlace => {
    if (enlace.getAttribute("href") === pathActual) {
      enlace.parentElement.classList.add("active");
    }
  });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crearMenu);
} else {
    crearMenu();
}
