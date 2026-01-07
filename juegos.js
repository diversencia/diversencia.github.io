document.addEventListener('DOMContentLoaded', function () {
  const contenedor = document.getElementById('juegos-mesa');
  if (!contenedor) return;

  contenedor.innerHTML = '<p style="text-align:center;padding:2rem;color:#4db7c3">🔄 Cargando juegos...</p>';

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

      contenedor.innerHTML = ''; // Limpia loading

      datos.forEach(fila => {
        const titulo = fila[idx.titulo] || '';
        const edadNum = parseInt(fila[idx.edad] || 0);
        const descCorta = fila[idx.descCorta] || '';
        const descLarga = fila[idx.descLarga] || '';
        const imagen = fila[idx.imagen] || '';
        const enlace = fila[idx.enlace] || '#';
        const jugadores = fila[idx.jugadores] || '';
        const duracion = fila[idx.duracion] || '';
        const habilidades = fila[idx.habilidades] || '';
        const accesibilidad = fila[idx.accesibilidad] || '';

        // 🔥 DETECTAR CATEGORÍA Y ACCESIBILIDAD PARA FILTROS
        const categoria = descCorta.toLowerCase().includes('cooperat') ? 'cooperativo' :
                         descCorta.toLowerCase().includes('estrateg') ? 'estrategia' : 'familiar';
        const accessTags = accesibilidad.toLowerCase().split(';').map(t => t.trim());
        const accessMain = accessTags.find(t => t.includes('visual')) ? 'visual' :
                          accessTags.find(t => t.includes('aud')) ? 'auditiva' :
                          accessTags.find(t => t.includes('motor')) ? 'motora' : 'cognitiva';

        // **ESTRELLAS DIFICULTAD + ICONOS VISUALES (ÚNICOS)**
        let dificultadEstrellas = '';
        let iconosDetalles = [];
        cabecera.forEach((col, i) => {
          if ([idx.titulo, idx.imagen, idx.descLarga, idx.enlace, idx.edad].includes(i)) return;
          
          const valor = fila[i]?.trim();
          if (!valor) return;

          const colLower = col.toLowerCase();
          
          if (colLower.includes('dificultad')) {
            const nivel = valor.toLowerCase();
            dificultadEstrellas = nivel.includes('baja') ? '⭐⭐' :
                                 nivel.includes('media') ? '⭐⭐⭐' : '⭐⭐⭐⭐⭐';
          } else if (colLower.includes('jugador')) {
            iconosDetalles.push(`<span class="det-badge">👥 ${valor}</span>`);
          } else if (colLower.includes('durac') || colLower.includes('min')) {
            iconosDetalles.push(`<span class="det-badge">⏱️ ${valor}</span>`);
          } else if (colLower.includes('precio')) {
            iconosDetalles.push(`<span class="det-badge">💰 ${valor}</span>`);
          } else if (colLower.includes('dobble') || colLower.includes('doble')) {
            iconosDetalles.push(`<span class="det-badge">🎲 Dobble</span>`);
          }
        });

        const card = document.createElement('article');
        card.className = 'juego-card';
        // ✅ ATRIBUTOS PARA FILTROS
        card.dataset.category = categoria;
        card.dataset.age = edadNum;
        card.dataset.access = accessMain;

        card.innerHTML = `
          ${imagen ? `<img src="${imagen}" alt="${titulo}" class="juego-img" loading="lazy">` : ''}
          <h3 class="juego-titulo">${titulo}</h3>
          <p class="juego-edad">Edad: ${edadNum}+</p>
          <p class="juego-desc-corta">${descCorta}</p>
          ${dificultadEstrellas ? `<p class="juego-dificultad">📊 ${dificultadEstrellas}</p>` : ''}
          <button class="juego-toggle" aria-expanded="false">Ver detalles</button>
          <div class="juego-detalles" hidden>
            ${jugadores ? `<p><strong>Jugadores:</strong> ${jugadores}</p>` : ''}
            ${habilidades ? `<p><strong>Habilidades:</strong> ${habilidades}</p>` : ''}
            <div class="juego-iconos">${iconosDetalles.join('')}</div>
            <div class="juego-tags">
              ${accesibilidad.split(';').map(t => `<span class="juego-tag">${t.trim()}</span>`).filter(Boolean).join('')}
            </div>
            ${descLarga ? `<p>${descLarga}</p>` : ''}
            ${enlace !== '#' ? `<a href="${enlace}" class="juego-link" target="_blank" rel="noopener">🛒 Tienda</a>` : ''}
          </div>
        `;
        contenedor.appendChild(card);
      });

      // ✅ FILTROS FUNCIONALES
      inicializarFiltros();

      // Toggle detalles
      contenedor.addEventListener('click', e => {
        if (!e.target.classList.contains('juego-toggle')) return;
        const btn = e.target;
        const detalles = btn.nextElementSibling;
        const abierto = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !abierto);
        detalles.hidden = abierto;
      });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = `<p style="color:#e74c3c;text-align:center;padding:2rem">${err.message}</p>`;
    });

  function inicializarFiltros() {
    const searchInput = document.getElementById('buscar-juego');
    const btnFiltros = document.querySelectorAll('.btn-filtro');
    const btnReset = document.getElementById('limpiar-filtros');
    const contador = document.getElementById('contador-resultados');
    
    let filtroCat = 'all', filtroAge = 0, filtroAccess = 'all';

    function aplicarFiltros() {
      const termino = searchInput.value.toLowerCase();
      let count = 0;
      
      contenedor.querySelectorAll('.juego-card').forEach(card => {
        const txt = card.textContent.toLowerCase();
        const catOk = filtroCat === 'all' || card.dataset.category === filtroCat;
        const ageOk = parseInt(card.dataset.age) >= filtroAge;
        const accessOk = filtroAccess === 'all' || card.dataset.access === filtroAccess;
        const searchOk = !termino || txt.includes(termino);
        
        if (catOk && ageOk && accessOk && searchOk) {
          card.style.display = 'block';
          count++;
        } else {
          card.style.display = 'none';
        }
      });
      contador.textContent = `Mostrando ${count} juegos.`;
    }

    btnFiltros.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.cat) filtroCat = btn.dataset.cat;
        if (btn.dataset.age !== undefined) filtroAge = parseInt(btn.dataset.age);
        if (btn.dataset.access) filtroAccess = btn.dataset.access;
        
        btnFiltros.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', b.classList.contains('active'));
        });
        aplicarFiltros();
      });
    });

    searchInput.addEventListener('input', aplicarFiltros);
    
    btnReset.addEventListener('click', () => {
      searchInput.value = '';
      filtroCat = filtroAge = filtroAccess = 'all';
      btnFiltros.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      document.querySelector('[data-cat="all"]').classList.add('active');
      document.querySelector('[data-cat="all"]').setAttribute('aria-pressed', 'true');
      aplicarFiltros();
    });

    aplicarFiltros(); // Inicial
  }

  function procesarCSV(texto) {
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
