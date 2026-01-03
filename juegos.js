document.addEventListener('DOMContentLoaded', function () {
  console.log('🚀 JS CARGADO');
  
  const contenedor = document.getElementById('juegos-mesa');
  if (!contenedor) {
    console.error('❌ #juegos-mesa NO encontrado');
    return;
  }
  
  contenedor.innerHTML = '<p style="text-align:center;padding:2rem">🔄 Cargando juegos...</p>';

  const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQahgpF9ULG3v0mZzS2ZmbARwhCE_bTE0FiEF7yM3w_u06JYrT598NFhK4xD0LF5fUAN6qNDyh6vznU/pub?gid=0&output=csv';

  fetch(URL_CSV)
    .then(res => {
      console.log('✅ FETCH OK:', res.status);
      return res.text();
    })
    .then(texto => {
      console.log('📄 CSV INICIO:', texto.substring(0,150));
      const filas = procesarCSV(texto);
      
      if (filas[0] && filas[0][0] && filas[0][0].includes('<!DOCTYPE html>')) {
        contenedor.innerHTML = '<p style="color:#e74c3c">❌ Sheet HTML. Re-publica CSV.</p>';
        return;
      }
      
      const cabecera = filas[0];
      const datos = filas.slice(1).filter(f => f.length && f[0]);
      
      console.log('📊 CABECERA:', cabecera);
      console.log('🎮 JUEGOS:', datos.length);

      const idx = {};
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

        // 🔥 ICONOS VISUALES para nuevas columnas (SIN NOMBRES LARGOS)
        const detallesGenericos = [];
        cabecera.forEach((col, i) => {
          if (i === idx.titulo || i === idx.descCorta || i === idx.imagen || 
              i === idx.descLarga || i === idx.enlace || i === idx.edad ||
              i === idx.jugadores || i === idx.duracion || i === idx.habilidades) return;
              
          const valor = fila[i]?.trim();
          if (!valor) return;

          let icono = valor; // Default
          const colLower = col.toLowerCase().trim();
          
          // 🎯 MAPEO INTELIGENTE por tus columnas
          if (colLower.includes('dificultad') || colLower.includes('doble')) {
            const nivel = valor.toLowerCase();
            icono = nivel.includes('baja') ? '⭐⭐' : 
                    nivel.includes('media') ? '⭐⭐⭐' : '⭐⭐⭐⭐⭐';
            icono = `📊 ${icono}`;
          }
          else if (colLower.includes('doble') || colLower.includes('dobble')) {
            icono = '🎲 Dobble';
          }
          else if (colLower.includes('ed') || colLower.includes('narrat')) {
            icono = '📖 Narrativo';
          }
          else if (colLower.includes('precio') || colLower.includes('$')) {
            icono = `💰 ${valor}`;
          }
          else if (colLower.includes('tiempo') || colLower.includes('min')) {
            icono = `⏱️ ${valor}`;
          }
          else {
            // Solo valor limpio, sin título columna
            icono = valor;
          }
          
          detallesGenericos.push(`<span class="juego-ico">${icono}</span>`);
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
            
            <div class="juego-iconos">
              ${detallesGenericos.join('')}
            </div>

            <div class="juego-tags">
              ${accesibilidad
                .split(';')
                .map(t => t.trim())
                .filter(Boolean)
                .map(t => {
                  const txt = t.toLowerCase();
                  let extraClass = '';
                  if (txt.includes('visión') || txt.includes('visual')) extraClass = ' juego-tag--visual';
                  else if (txt.includes('sordera') || txt.includes('auditiva')) extraClass = ' juego-tag--auditiva';
                  else if (txt.includes('motora')) extraClass = ' juego-tag--motora';
                  else if (txt.includes('cognitiva') || txt.includes('aprendizaje')) extraClass = ' juego-tag--cognitiva';
                  else if (txt.includes('tea') || txt.includes('autismo')) extraClass = ' juego-tag--tea';
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

      contenedor.addEventListener('click', function (e) {
        if (!e.target.classList.contains('juego-toggle')) return;
        const boton = e.target;
        const detalles = boton.nextElementSibling;
        const abierto = boton.getAttribute('aria-expanded') === 'true';
        boton.setAttribute('aria-expanded', String(!abierto));
        detalles.hidden = abierto;
      });

      contenedor.innerHTML = ''; // Limpia loading al final
    })
    .catch(err => {
      console.error('💥 ERROR:', err);
      contenedor.innerHTML = `<p style="color:#e74c3c;text-align:center;padding:2rem">
        Error: ${err.message}<br><small>F12 para detalles</small>
      </p>`;
    });

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
            celda += '"';
            i++;
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
