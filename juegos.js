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

      // ✅ TODAS LAS 13 COLUMNAS
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
        accesibilidad: cabecera.indexOf('accesibilidad'),
        accesDetalle: cabecera.indexOf('accesibilidad_detalle'),    // ✅ NUEVO
        dispAccess: cabecera.indexOf('disponibilidad_access'),      // ✅ NUEVO
        linkAccess: cabecera.indexOf('link_access')                 // ✅ NUEVO
      };

      contenedor.innerHTML = '';

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
        const accesDetalle = fila[idx.accesDetalle] || '';          // ✅ NUEVO
        const dispAccess = fila[idx.dispAccess] || '';              // ✅ NUEVO
        const linkAccess = fila[idx.linkAccess] || '';              // ✅ NUEVO

        // CATEGORÍA Y ACCESS PARA FILTROS
        const categoria = descCorta.toLowerCase().includes('cooperat') ? 'cooperativo' :
                         descCorta.toLowerCase().includes('estrateg') ? 'estrategia' : 'familiar';
        const accessTags = accesibilidad.toLowerCase().split(';').map(t => t.trim());
        const accessMain = accessTags.find(t => t.includes('visual')) ? 'visual' :
                          accessTags.find(t => t.includes('aud')) ? 'auditiva' :
                          accessTags.find(t => t.includes('motor')) ? 'motora' : 'cognitiva';

        // 🔥 ICONOS DE TODAS LAS 13 COLUMNAS ✅
        let dificultadEstrellas = '';
        let iconosDetalles = [];
        
        cabecera.forEach((col, i) => {
          const valor = fila[i]?.trim();
          if (!valor) return;

          const colLower = col.toLowerCase();
          
          // ⭐ DIFICULTAD
          if (colLower.includes('dificultad')) {
            const nivel = valor.toLowerCase();
            dificultadEstrellas = nivel.includes('baja') ? '⭐⭐' :
                                 nivel.includes('media') ? '⭐⭐⭐' : '⭐⭐⭐⭐⭐';
          }
          // 👥 JUGADORES
          else if (colLower.includes('jugador')) {
            iconosDetalles.push(`<span class="det-badge">👥 ${valor}</span>`);
          }
          // ⏱️ DURACIÓN
          else if (colLower.includes('durac') || colLower.includes('min')) {
            iconosDetalles.push(`<span class="det-badge">⏱️ ${valor}</span>`);
          }
          // 🔗 LINK ACCESS ✅ NUEVO
          else if (i === idx.linkAccess && valor.startsWith('http')) {
            iconosDetalles.push(`<a href="${valor}" target="_blank" class="det-badge link-access">🔗 Access+</a>`);
          }
          // ✅ DISPONIBILIDAD ACCESS ✅ NUEVO
          else if (i === idx.dispAccess) {
            iconosDetalles.push(`<span class="det-badge">${valor.includes('Access+') ? '✅ Access+' : '🔧 DIY'}</span>`);
          }
          // 👁️ ACCESIBILIDAD DETALLE ✅ NUEVO
          else if (i === idx.accesDetalle) {
            const feats = valor.split(';').map(f => f.trim().toLowerCase());
            let icons = [];
            if (feats.some(f => f.includes('contraste'))) icons.push('🎨');
            if (feats.some(f => f.includes('visual'))) icons.push('👁️');
            if (feats.some(f => f.includes('audit'))) icons.push('👂');
            if (feats.some(f => f.includes('motor'))) icons.push('🦽');
            iconosDetalles.push(`<span class="det-badge">🎯 ${icons.join(' ')}</span>`);
          }
          // 🎲 CUALQUIER OTRA COLUMNA (habilidades, etc.)
          else {
            iconosDetalles.push(`<span class="det-badge">${valor}</span>`);
          }
        });

        const card = document.createElement('article');
        card.className = 'juego-card';
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

      inicializarFiltros();
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = `<p style="color:#e74c3c;text-align:center;padding:2rem">${err.message}</p>`;
    });

  // ✅ TUS FUNCIONES EXISTENTES (sin cambios)
  function inicializarFiltros() {
    // ... tu código de filtros igual ...
  }

  function procesarCSV(texto) {
    // ... tu función igual ...
  }
});
