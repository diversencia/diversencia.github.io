Aquí tienes el JS modificado para generar exactamente la estructura que quieres con badges y clases de filtro:

javascript
document.addEventListener('DOMContentLoaded', function () {
  const contenedor = document.getElementById('juegos-mesa');
  if (!contenedor) return;

  contenedor.innerHTML = '<p id="loading-msg" style="text-align:center;padding:2rem;color:#4db7c3">🔄 Cargando juegos...</p>';

  const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQahgpF9ULG3v0mZzS2ZmbARwhCE_bTE0FiEF7yM3w_u06JYrT598NFhK4xD0LF5fUAN6qNDyh6vznU/pub?gid=0&single=true&output=csv';

  fetch(URL_CSV)
    .then(res => res.text())
    .then(texto => {
      const filas = procesarCSV(texto);
      
      if (filas[0]?.[0]?.includes('<!DOCTYPE html>')) {
        throw new Error('Sheet HTML → Archivo > Publicar > CSV público');
      }
      
      const cabecera = filas[0];
      const datos = filas.slice(1).filter(f => f[0]);

      const idx = {};
      const columnasConocidas = {
        titulo: 'titulo', edad: 'edad', descCorta: 'descripcion_corta',
        descLarga: 'descripcion_larga', imagen: 'imagen_url', enlace: 'enlace_tienda',
        jugadores: 'jugadores', duracion: 'duracion', habilidades: 'habilidades',
        accesibilidad: 'accesibilidad'
      };
      Object.keys(columnasConocidas).forEach(key => idx[key] = cabecera.indexOf(columnasConocidas[key]));

      // ✅ MAPEADOR ACCESIBILIDAD EXCEL → CLASES CSS
      const mapaAccesibilidad = {
        "Baja visión": "visual",
        "Dificultades de percepción visual": "visual",
        "Sordera": "auditiva",
        "Discapacidad motora": "motora",
        "Dificultades de comunicación": "motora",
        "TEA": "motora",
        "Discapacidad cognitiva": "motora",
        "Dificultades cognitivas": "motora",
        "Dificultades de aprendizaje": "motora",
        "Neurodiversidad": "motora",
        "TDAH": "motora",
        "Dificultades de atención": "motora",
        "accesibilidad": "motora"
      };

      // **RENDER con estructura EXACTA que quieres**
      contenedor.innerHTML = ''; // ✅ LIMPIA loading + todo

      datos.forEach(fila => {
        const titulo = fila[idx.titulo] || '';
        const edad = fila[idx.edad] || '';
        const descCorta = fila[idx.descCorta] || '';
        const imagen = fila[idx.imagen] || '';
        const enlace = fila[idx.enlace] || '#';
        const accesibilidadTexto = fila[idx.accesibilidad] || '';

        // 🔥 PROCESA ACCESIBILIDAD → CLASES + BADGES
        const accesibilidades = accesibilidadTexto
          .split(';')
          .map(t => t.trim())
          .map(t => mapaAccesibilidad[t] || 'motora')
          .filter((v, i, a) => a.indexOf(v) === i); // únicos

        const clasesAcceso = accesibilidades.map(acc => `accesibilidad-${acc}`).join(' ');
        const badgesHTML = accesibilidades.map(acc => {
          const iconos = { visual: '👁️', auditiva: '👂', motora: '✋' };
          return `<span class="badge ${acc}">${iconos[acc] || '✋'}</span>`;
        }).join('');

        // ✅ ESTRUCTURA EXACTA que pediste
        const card = document.createElement('div');
        card.className = `card-juego ${clasesAcceso}`;
        card.innerHTML = `
          ${imagen ? `<img src="${imagen}" alt="${titulo}" class="juego-img" loading="lazy">` : ''}
          <h4>${titulo}</h4>
          <p class="juego-edad">Edad: ${edad}</p>
          <p>${descCorta}</p>
          <div class="badges">${badgesHTML}</div>
          ${enlace !== '#' ? `<a href="${enlace}" class="juego-link" target="_blank" rel="noopener">🛒 Tienda</a>` : ''}
        `;
        
        contenedor.appendChild(card);
      });

      // Filtros y toggle (tu código existente aquí)
      inicializarFiltros();
      inicializarToggle();
      
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = `<p style="color:#e74c3c;text-align:center;padding:2rem">${err.message}</p>`;
    });

  function procesarCSV(texto) {
    // Tu función CSV sin cambios
    const lineas = texto.split(/\r?\n/).filter(l => l.trim());
    return lineas.map(linea => {
      const celdas = [];
      let celda = '';
      let dentroComillas = false;
      for (let i = 0; i < linea.length; i++) {
        const ch = linea[i];
        if (ch === '"') {
          if (dentroComillas && linea[i+1] === '"') { celda += '"'; i++; }
          else { dentroComillas = !dentroComillas; }
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
