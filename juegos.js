document.addEventListener('DOMContentLoaded', function () {
  // ✅ CAMBIO: nuevo contenedor para vista carrusel/lista
  const contenedor = document.getElementById('container-Todos');
  if (!contenedor) return;

  contenedor.innerHTML = '<p id="loading-msg" style="text-align:center;padding:2rem;color:#4db7c3">🔄 Cargando juegos...</p>';

  const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQahgpF9ULG3v0mZzS2ZmbARwhCE_bTE0FiEF7yM3w_u06JYrT598NFhK4xD0LF5fUAN6qNDyh6vznU/pub?gid=0&single=true&output=csv';

  // ✅ NUEVO: Array global para el modal
  let juegosMesaData = [];

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

      // 🔥 MAPEADOR accesibilidad (TU CÓDIGO ORIGINAL)
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

      // ✅ LIMPIA loading + todo
      contenedor.innerHTML = '';

      datos.forEach((fila, index) => {
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

        // 🔥 Procesa accesibilidad para badges + clases filtro
        const accesibilidades = accesibilidad
          .split(';')
          .map(t => t.trim())
          .map(t => mapaAccesibilidad[t] || 'motora')
          .filter((v, i, a) => a.indexOf(v) === i);

        const clasesFiltro = accesibilidades.map(acc => `accesibilidad-${acc}`).join(' ');

        // ✅ NUEVO: ESTRUCTURA CARD para carrusel/lista + modal (igual a Cultura Inclusiva)
        const card = document.createElement('article');
        card.className = 'card ' + clasesFiltro;
        card.setAttribute('data-index', index);
        card.setAttribute('data-titulo', titulo);
        card.setAttribute('data-edad', edad);
        card.setAttribute('data-desc', descCorta);
        card.setAttribute('data-img', imagen);
        card.setAttribute('data-enlace', enlace);

        card.innerHTML = `
          ${imagen ? `<img src="${imagen}" alt="${titulo}">` : ''}
          <div class="card-body">
            <span class="card-tag">${accesibilidades[0] || 'Juego'}</span>
            <h3>${titulo}</h3>
          </div>
        `;
        
        contenedor.appendChild(card);

        // ✅ NUEVO: guardar datos para el modal
        juegosMesaData[index] = {
          nombre: titulo,
          edad: edad,
          descripcion: descCorta,
          descripcionLarga: descLarga,
          img: imagen,
          enlace: enlace,
          jugadores: jugadores,
          duracion: duracion,
          habilidades: habilidades,
          accesibilidad: accesibilidad,
          tipo: accesibilidades[0] || 'Juego de mesa'
        };
      });

      // ✅ GLOBAL: exponer para el modal en el HTML
      window.juegosMesaData = juegosMesaData;

      // ✅ TU CÓDIGO ORIGINAL: filtros (adaptado a nuevos botones)
      inicializarFiltros();
      
      document.getElementById('loading-msg')?.remove();
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = `<p style="color:#e74c3c;text-align:center;padding:2rem">${err.message}</p>`;
    });

  function procesarCSV(texto) {
    // TU FUNCIÓN ORIGINAL SIN CAMBIOS
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

  function inicializarFiltros() {
    // ✅ CAMBIO: nuevos botones con data-age y data-access (no btn-filtro)
    
    // Filtros edad
    document.querySelectorAll('.filter-btn[data-age]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.filter-btn[data-age].active')?.classList.remove('active');
        btn.classList.add('active');
        filtrarJuegos();
      });
    });

    // Filtros accesibilidad
    document.querySelectorAll('.filter-btn[data-access]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.filter-btn[data-access].active')?.classList.remove('active');
        btn.classList.add('active');
        filtrarJuegos();
      });
    });

    // Búsqueda
    const buscador = document.getElementById('buscador');
    if (buscador) {
      buscador.addEventListener('input', filtrarJuegos);
    }

    // Limpiar
    const limpiarBtn = document.getElementById('limpiar-filtros');
    if (limpiarBtn) {
      limpiarBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn[data-age]').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-age="0"]')?.classList.add('active');
        document.querySelectorAll('.filter-btn[data-access]').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-access="all"]')?.classList.add('active');
        if (buscador) buscador.value = '';
        filtrarJuegos();
      });
    }
  }

  function filtrarJuegos() {
    // ✅ CAMBIO: ahora las cards son `.card` no `.juego-card`
    const cards = document.querySelectorAll('.card');
    const busqueda = document.getElementById('buscador')?.value.toLowerCase() || '';
    const edadActiva = parseInt(document.querySelector('.filter-btn[data-age].active')?.dataset.age || '0');
    const accesoActivo = document.querySelector('.filter-btn[data-access].active')?.dataset.access || 'all';

    let visibles = 0;

    cards.forEach(card => {
      // Búsqueda texto
      const texto = card.textContent.toLowerCase();
      const coincideBusqueda = !busqueda || texto.includes(busqueda);

      // Edad
      const edadCard = parseInt(card.getAttribute('data-edad') || '99');
      const coincideEdad = edadCard >= edadActiva;

      // Accesibilidad
      const coincideAcceso = accesoActivo === 'all' || 
        [...card.classList].some(clase => clase === `accesibilidad-${accesoActivo}`);

      const mostrar = coincideBusqueda && coincideEdad && coincideAcceso;
      
      card.style.display = mostrar ? 'block' : 'none';
      if (mostrar) visibles++;
    });

    // ✅ CAMBIO: si tienes contador, ajusta el ID (o eliminar si no lo usas)
    const contador = document.getElementById('contador-resultados');
    if (contador) {
      contador.textContent = 
        visibles === 0 ? 'No se encontraron resultados' : 
        `Mostrando ${visibles} ${visibles === 1 ? 'juego' : 'juegos'}`;
    }
  }
});
