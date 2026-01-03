const detallesGenericos = [];
cabecera.forEach((col, i) => {
  if (i === idx.titulo || i === idx.imagen || i === idx.descLarga || i === idx.enlace || i === idx.edad) return;
  
  const valor = fila[i]?.trim();
  if (!valor) return;

  let icono = valor;
  const colLower = col.toLowerCase();
  
  // 🔥 DIFICULTAD → ESTRELLAS (Baja=⭐⭐, Media=⭐⭐⭐, Alta=⭐⭐⭐⭐⭐)
  if (colLower.includes('dificultad')) {
    const nivel = valor.toLowerCase();
    let estrellas = nivel.includes('baja') ? '⭐⭐' : 
                   nivel.includes('media') ? '⭐⭐⭐' : '⭐⭐⭐⭐⭐';
    icono = `📊 ${estrellas}`;
  }
  // 🎲 DOBBLE/DOBLE → Dado específico
  else if (colLower.includes('doble') || colLower.includes('dobble')) {
    icono = '🎲 Dobble';
  }
  // 📖 NARRATIVO → Libro abierto
  else if (colLower.includes('narrat') || colLower.includes('ed') || colLower.includes('historia')) {
    icono = '📖 Narrativo';
  }
  // 👥 JUGADORES → Personas
  else if (colLower.includes('jugador') || colLower.includes('player')) {
    icono = `👥 ${valor}`;
  }
  // ⏱️ DURACIÓN → Reloj
  else if (colLower.includes('durac') || colLower.includes('tiempo') || colLower.includes('min')) {
    icono = `⏱️ ${valor}`;
  }
  // 💰 PRECIO → Dinero
  else if (colLower.includes('precio') || valor.includes('$') || valor.includes('€')) {
    icono = `💰 ${valor}`;
  }
  // ♿ ACCESIBILIDAD_DETALLE → Iconos WCAG
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
    icono = `<a href="${valor}" target="_blank" class="juego-link-access">🔗 Access+</a>`;
  }
  
  detallesGenericos.push(`<span class="juego-ico">${icono}</span>`);
});
