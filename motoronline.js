document.addEventListener("DOMContentLoaded", function () {
    // 1. URL DE TU GOOGLE SHEETS
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vREyuMsDq-kKAgCCtSLYn575bPSvaeit9cK9DI768iIP3sKgfB4HAlpWhqCbRXyO4tsX63zI1i10Kb7/pub?output=csv';

    const listaContenedor = document.getElementById('lista-sitios');
    const categoriaFiltrar = listaContenedor.getAttribute('data-ca');

    fetch(SHEET_URL)
        .then(response => response.text())
        .then(csvText => {
            // Dividir por filas y limpiar encabezados
            const filas = csvText.split(/\r?\n/).slice(1); 
            listaContenedor.innerHTML = ""; 

            let hayResultados = false;

            filas.forEach(fila => {
                // Regex para manejar comas dentro de comillas
                const columnas = fila.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g);

                if (columnas && columnas.length >= 6) {
                    const nombre = columnas[0].replace(/"/g, "").trim();
                    const descripcion = columnas[1].replace(/"/g, "").trim();
                    const urlImagen = columnas[2].replace(/"/g, "").trim();
                    const linkWeb = columnas[3].replace(/"/g, "").trim();
                    const categoriaExcel = columnas[4].replace(/"/g, "").trim();
                    const tiposRaw = columnas[5].replace(/"/g, "").trim();

                    // Filtramos por la columna E (debe decir "Online")
                    if (categoriaExcel === categoriaFiltrar) {
                        hayResultados = true;

                        // PROCESAR MÚLTIPLES TIPOS (Separados por coma en la Columna F)
                        const listaTipos = tiposRaw.split(',').map(t => t.trim());
                        
                        let badgesHTML = '';
                        listaTipos.forEach((tipo, index) => {
                            let color = "#E37C3A"; // Naranja Diversencia
                            const tMin = tipo.toLowerCase();
                            
                            if (tMin === 'instagram') color = "#E1306C";
                            else if (tMin === 'tiktok') color = "#000000";
                            else if (tMin === 'web') color = "#4db7c3";
                            
                            // Posicionamiento vertical si hay varios
                            const offset = index * 32; 
                            badgesHTML += `<span class="badge-tipo" style="background:${color}; top:${15 + offset}px;">${tipo}</span>`;
                        });

                        const card = document.createElement('div');
                        card.className = 'tarjeta-online';
                        card.innerHTML = `
                            <div class="card-img-container">
                                ${badgesHTML}
                                <img src="${urlImagen}" alt="${nombre}" onerror="this.src='logo.png'">
                            </div>
                            <div class="card-info">
                                <h3>${nombre}</h3>
                                <p>${descripcion}</p>
                                <a href="${linkWeb}" target="_blank" class="btn-visitar">Ver contenido</a>
                            </div>
                        `;
                        listaContenedor.appendChild(card);
                    }
                }
            });

            if (!hayResultados) {
                listaContenedor.innerHTML = `<p class="loading-msg">No se han encontrado recursos todavía para la categoría "${categoriaFiltrar}".</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            listaContenedor.innerHTML = `<p class="loading-msg">Error al conectar con la base de datos de Diversencia.</p>`;
        });
});
