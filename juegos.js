document.addEventListener('DOMContentLoaded', function () {
  const contenedor = document.getElementById('juegos-mesa');
  if (!contenedor) return;

  contenedor.innerHTML = '<p style="text-align:center;padding:2rem;color:#4db7c3">🔄 Cargando juegos...</p>';

  const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQahgpF9ULG3v0mZzS2ZmbARwhCE_bTE0FiEF7yM3w_u06JYrT598NFhK4xD0LF5fUAN6qNDyh6vznU/pub?gid=0&single=true&output=csv';

  fetch(URL_CSV)
    .then(res => res.text())
    .then(texto => {
      const filas = procesarCSV(texto);
      
      if (filas[0] && filas[0][0] && filas[0][0].includes('<!DOCTYPE html>')) {
        throw new Error('❌ Sheet HTML. Verifica: Archivo > Compartir > "Cualquier persona" > Publicar CSV.');
      }
      
      const cabecera = filas[0];
      const datos = filas.slice(1).filter(f => f.length && f[0]);

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

        // 🔥 ICONOS ULTRA VISUALES - NUEVAS COLUMNAS
        const detallesGenericos = [];
        cabecera.forEach((col, i) => {
          if (i === idx.titulo || i === idx.imagen || i === idx.descLarga || i === idx.enlace || i === idx.edad) return;
          
          const valor = fila[i]?.trim();
          if (!valor) return;

          let icono = valor;
          const colLower = col.toLowerCase();
          
          // 📊 DIFICULTAD → ESTRELLAS
          if (colLower.includes('dificultad')) {
            const nivel = valor.toLowerCase();
            let estrellas = nivel.includes('baja') ? '⭐⭐' : 
                           nivel.includes('media') ? '⭐⭐⭐' : '⭐⭐⭐⭐⭐';
            icono = `📊 ${estrellas}`;
          }
          // 🎲 DOBBLE
          else if (colLower.includes('doble') || colLower.includes('dobble')) {
            icono = '🎲 Dobble';
          }
          // 📖 NARRATIVO
          else if (colLower.includes('narrat') || colLower.includes('ed') || colLower.includes('historia')) {
            icono = '📖 Narrativo';
          }
          // 👥 JUGADORES
          else if (colLower.includes('jugador') || colLower.includes('player')) {
            icono = `👥 ${valor}`;
          }
          // ⏱️ TIEMPO
          else if (colLower.includes('durac') || colLower.includes('tiempo') || colLower.includes('min')) {
            icono = `⏱️ ${valor}`;
          }
          // 💰 PRECIO
          else if (colLower.includes('precio') || valor.match(/€|\$/)) {
            icono = `💰 ${valor}`;
          }
          // ♿ ACCESIBILIDAD_DETALLE
          else if (colLower.includes('accesibilidad_detalle')) {
            const feats = valor.split(';').map(f=>f.trim().toLowerCase());
            let icons = [];
            if (feats.some(f=>f.includes('contraste'))) icons.push('🎨');
            if (feats.some(f=>f.includes('visual'))) icons.push('👁️');
            if (feats.some(f=>f.includes('predecible'))) icons.push('🔄');
            icono = icons.join(' ');
          }
          // ✅ ACCESS+
          else if (colLower.includes('disponibilidad_access')) {
            icono = valor.includes('Access+') ? '✅ Access+' : '🔧 DIY';
          }
          // 🔗 LINK ACCESS
          else if (colLower.includes('link_access')) {
            icono = `<a href="${valor}" target="_blank" class="juego-link-access" title="Access+ oficial">🔗 Access+</a>`;
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
            ${enlace !== '#' ? `<a href="${enlace}" class="juego-link" target="_blank" rel="noopener">🛒 Ver tienda</a>` : ''}
          </div>
        `;

        contenedor.appendChild(card);
      });

      contenedor.innerHTML = contenedor.innerHTML; // Limpia loading

      // Toggle funcionalidad
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
      console.error('💥', err);
      contenedor.innerHTML = `<p style="color:#e74c3c;text-align:center;padding:2rem">
        ${err.message}<br>
        <small>F12 para detalles. Sheet: Archivo > Publicar > CSV público.</small>
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
