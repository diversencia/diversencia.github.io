document.addEventListener('DOMContentLoaded', function () {
  const contenedor = document.getElementById('juegos-mesa');
  if (!contenedor) return;

  // URL corregida con &amp; -> & para mejor compatibilidad, y output=csv explícito
  const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQahgpF9ULG3v0mZzS2ZmbARwhCE_bTE0FiEF7yM3w_u06JYrT598NFhK4xD0LF5fUAN6qNDyh6vznU/pub?gid=0&single=true&output=csv';

  fetch(URL_CSV)
    .then(res => res.text())
    .then(texto => {
      const filas = procesarCSV(texto);
      
      // Si parece HTML en lugar de CSV, mostrar error específico
      if (filas[0] && filas[0][0] && filas[0][0].includes('<!DOCTYPE html>')) {
        throw new Error('El Sheet devuelve HTML. Verifica permisos públicos (publicar como CSV enlace público sin login).');
      }
      
      const cabecera = filas[0];
      const datos = filas.slice(1).filter(f => f.length && f[0]);

      const idx = {};
      // Columnas existentes + genérico para nuevas
      const columnasConocidas = {
        titulo: 'titulo',
        edad: 'edad',
        descCorta: 'descripcion_corta',
        descLarga: 'descripcion_larga',
        imagen: 'imagen_url',
        enlace: 'enlace_tienda',
        jugadores: 'jugadores',
        duracion: 'duracion',
        habilidades: 'habilidades',
        accesibilidad: 'accesibilidad'
      };
      Object.keys(columnasConocidas).forEach(key => {
        idx[key] = cabecera.indexOf(columnasConocidas[key]);
      });

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

        // Detectar columnas nuevas/genéricas para detalles
        const detallesGenericos = [];
        cabecera.forEach((col, i) => {
          if (i === idx.titulo || i === idx.descCorta || i === idx.imagen || 
              i === idx.descLarga || i === idx.enlace || i === idx.edad) return; // Skip conocidas principales
          const valor = fila[i];
          if (valor && valor.trim()) {
            detallesGenericos.push(`<p><strong>${col}:</strong> ${valor}</p>`);
          }
        });

        card.innerHTML = `
          ${imagen ? `<img src="${imagen}" alt="Caja del juego ${titulo}" class="juego-img" loading="lazy">` : ''}
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
            
            ${detallesGenericos.join('')}  <!-- Aquí van las nuevas columnas automáticamente -->

            <div class="juego-tags">
              ${accesibilidad
                .split(';')
                .map(t => t.trim())
                .filter(Boolean)
                .map(t => {
                  const txt = t.toLowerCase();
                  let extraClass = '';
                  if (txt.includes('visión') || txt.includes('visual')) {
                    extraClass = ' juego-tag--visual';
                  } else if (txt.includes('sordera') || txt.includes('auditiva')) {
                    extraClass = ' juego-tag--auditiva';
                  } else if (txt.includes('motora')) {
                    extraClass = ' juego-tag--motora';
                  } else if (txt.includes('cognitiva') || txt.includes('aprendizaje')) {
                    extraClass = ' juego-tag--cognitiva';
                  } else if (txt.includes('tea') || txt.includes('autismo')) {
                    extraClass = ' juego-tag--tea';
                  }
                  return `<span class="juego-tag${extraClass}">${t}</span>`;
                })
                .join('')}
            </div>
            
            ${descLarga ? `<p style="margin-top:0.5rem;">${descLarga}</p>` : ''}
            <a href="${enlace}" class="juego-link" target="_blank" rel="noopener">
              Ver tienda
            </a>
          </div>
        `;

        contenedor.appendChild(card);
      });

      // Event listener para toggles (mismo)
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
      contenedor.innerHTML = `<p>Error cargando datos: ${err.message}. Verifica que el Sheet esté publicado como "CSV visible para cualquiera con enlace".</p>`;
    });

  // Parser CSV mejorado (maneja comillas dobles escapadas "")
  function procesarCSV(texto) {
    const lineas = texto.split(/\r?\n/).filter(l => l.trim());
    return lineas.map(linea => {
      const celdas = [];
      let celda = '';
      let dentroComillas = false;

      for (let i = 0; i < linea.length; i++) {
        const ch = linea[i];
        if (ch === '"') {
          if (dentroComillas && linea[i+1] === '"') {
            celda += '"'; // Escapa "" como "
            i++; // Skip siguiente "
          } else {
            dentroComillas = !dentroComillas;
          }
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
