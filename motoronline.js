document.addEventListener("DOMContentLoaded", function () {
    // 1. URL DE TU GOOGLE SHEETS (DEBE ESTAR PUBLICADO COMO CSV)
    // Para obtenerlo: Archivo > Compartir > Publicar en la web > Valores separados por comas (.csv)
    const SHEET_URL = 'TU_URL_DE_GOOGLE_SHEETS_AQUÍ';

    const listaContenedor = document.getElementById('lista-sitios');
    const categoriaFiltrar = listaContenedor.getAttribute('data-ca');

    fetch(SHEET_URL)
        .then(response => response.text())
        .then(csvText => {
            const filas = csvText.split('\n').slice(1); // Omitir encabezados
            listaContenedor.innerHTML = ""; // Limpiar mensaje de carga

            let hayResultados = false;

            filas.forEach(fila => {
                // Separar por comas (teniendo en cuenta posibles comas dentro de textos)
                const columnas = fila.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g);

                if (columnas && columnas.length >= 5) {
                    const nombre = columnas[0].replace(/"/g, "");
                    const descripcion = columnas[1].replace(/"/g, "");
                    const urlImagen = columnas[2].replace(/"/g, "");
                    const linkWeb = columnas[3].replace(/"/g, "");
                    const categoriaExcel = columnas[4].replace(/"/g, "").trim();

                    // 2. FILTRO POR CATEGORÍA (Online)
                    if (categoriaExcel === categoriaFiltrar) {
                        hayResultados = true;
                        
                        // 3. CREAR LA TARJETA (ESTILO DIVERSENCIA)
                        const card = document.createElement('div');
                        card.className = 'tarjeta-online';
                        card.innerHTML = `
                            <div class="card-img-container">
                                <img src="${urlImagen}" alt="${nombre}" onerror="this.src='logo.png'">
                            </div>
                            <div class="card-info">
                                <h3>${nombre}</h3>
                                <p>${descripcion}</p>
                                <a href="${linkWeb}" target="_blank" class="btn-visitar">Visitar Web</a>
                            </div>
                        `;
                        listaContenedor.appendChild(card);
                    }
                }
            });

            if (!hayResultados) {
                listaContenedor.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">No se encontraron recursos online en este momento.</p>`;
            }
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            listaContenedor.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">Error al cargar los datos. Inténtalo de nuevo más tarde.</p>`;
        });
});
