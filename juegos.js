document.addEventListener('DOMContentLoaded', function () {
  const contenedor = document.getElementById('juegos-mesa');
  if (!contenedor) return;

  const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQahgpF9ULG3v0mZzS2ZmbARwhCE_bTE0FiEF7yM3w_u06JYrT598NFhK4xD0LF5fUAN6qNDyh6vznU/pub?gid=0&single=true&output=csv';

  fetch(URL_CSV)
    .then(res => res.text())
    .then(texto => {
      const filas = procesarCSV(texto);
      const cabecera = filas[0];
      const datos = filas.slice(1).filter(f => f.length && f[0]);

      const idx = {
        titulo: cabecera.indexOf('titulo'),
        edad: cabecera.indexOf('edad'),
        descCorta: cabecera.indexOf('descripcion_corta'),
        descLarga: cabecera.indexOf('descripcion_larga'),
        imagen: cabecera.indexOf('imagen_url'),
        enlace: cabecera.indexOf('enlace_tienda'),
        jugadores: cabecera.indexOf('jugadores'),
        duracion: cabecera.indexOf('duracion'),
        habilidades: cabecera.indexOf('habilidades'),
        accesibilidad: cabecera.indexOf('accesibilidad')
      };

      datos.forEach(fila => {
        const card = document.createElement('article');
        card.className = 'juego-card';

        const titulo = fila[idx.titulo] || '';
        const edad = fila[idx.edad] || '';
        const descCorta = fila[idx.descCorta] || '';
        const descLarga = fila[idx.descLarga] || '';
        const imagen = fila[idx.imagen] || '';
        const enlace = fila[idx.enlace] || '#';
        const jugadores = fila[idx.jugadores] || '';
        const duracion = fila[idx.duracion] || '';
        const habilidades = fila[idx.habilidades] || '';
        const accesibilidad = fila[idx.accesibilidad] || '';

        card.innerHTML = `
          ${imagen ? `<img src="${imagen}" alt="Caja del juego ${titulo}" class="juego-img">` : ''}
          <h3 class="juego-titulo">${titulo}</h3>
          <p class="juego-edad">Edad: ${edad}</p>
          <p class="juego-desc-corta">${descCorta}</p>

          <button class="juego-toggle" aria-expanded="false">
            Más información
          </button>

          <div class="juego-detalles" hidden>
            ${jugadores ? `<p><strong>Jugadores:</strong> ${jugadores}</p>` : ''}
            ${duracion ? `<p><strong>Duración:</strong> ${duracion}</p>` : ''}
            ${habilidades ? `<p><strong>Habilidades:</strong> ${habilidades}</p>` : ''}
            <div class="juego-tags">
              ${accesibilidad.split(';').map(t => t.trim()).filter(Boolean).map(t => `
                <span class="juego-tag">${t}</span>
              `).join('')}
            </div>
            ${descLarga ? `<p style="margin-top:0.5rem;">${descLarga}</p>` : ''}
            <a href="${enlace}" class="juego-link" target="_blank" rel="noopener">
              Ver tienda
            </a>
          </div>
        `;

        contenedor.appendChild(card);
      });

      contenedor.addEventListener('click', function (e) {
        if (!e.target.classList.contains('juego-toggle')) return;
        const boton = e.target;
        const detalles = boton.nextElementSibling;
        const abierto = boton.getAttribute('aria-expanded') === 'true';
        boton.setAttribute('aria-expanded', String(!abierto));
        detalles.hidden = abierto;
      });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = '<p>No se pudieron cargar los juegos ahora mismo.</p>';
    });

  // Parser CSV sencillo con comillas
  function procesarCSV(texto) {
    const lineas = texto.split(/\r?\n/).filter(l => l.trim() !== '');
    return lineas.map(linea => {
      const celdas = [];
      let celda = '';
      let dentroComillas = false;

      for (let ch of linea) {
        if (ch === '"') {
          dentroComillas = !dentroComillas;
        } else if (ch === ',' && !dentroComillas) {
          celdas.push(celda);
          celda = '';
        } else {
          celda += ch;
        }
      }
      celdas.push(celda);
      return celdas.map(c => c.trim().replace(/^"|"$/g, ''));
    });
  }
});
