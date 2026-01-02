document.addEventListener("DOMContentLoaded", function () {
    // 1. ENLACE DIRECTO A TU GOOGLE SHEETS (Publicado como CSV)
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vREyuMsDq-kKAgCCtSLYn575bPSvaeit9cK9DI768iIP3sKgfB4HAlpWhqCbRXyO4tsX63zI1i10Kb7/pub?output=csv';

    const listaContenedor = document.getElementById('lista-sitios');
    const categoriaFiltrar = listaContenedor.getAttribute('data-ca');

    fetch(SHEET_URL)
        .then(response => response.text())
        .then(csvText => {
            // Dividimos el CSV por filas
            const filas = csvText.split(/\r?\n/).slice(1); 
            listaContenedor.innerHTML = ""; // Limpiamos el mensaje de "Cargando..."

            let hayResultados = false;

            filas.forEach(fila => {
                // Esta expresión regular separa por comas respetando si hay comas dentro de comillas
                const columnas = fila.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g);

                // Comprobamos que la fila tenga al menos las 6 columnas necesarias
                if (columnas && columnas.length >= 6) {
                    const nombre = columnas[0].replace(/"/g, "").trim();
                    const descripcion = columnas[1].replace(/"/g, "").trim();
                    const urlImagen = columnas[2].replace(/"/g, "").trim();
                    const linkWeb = columnas[3].replace(/"/g, "").trim();
                    const categoriaExcel = columnas[4].replace(/"/g, "").trim();
                    const tipoPlataforma = columnas[5].replace(/"/g, "").trim();

                    // FILTRO: Solo mostramos si la Columna E coincide con "Online"
                    if (categoriaExcel === categoriaFiltrar) {
                        hayResultados = true;

                        // LÓGICA DE COLORES PARA LA ETIQUETA (Badge)
                        let colorBadge = "#E37C3A"; // Naranja Diversencia (por defecto)
                        const tipoLimpio = tipoPlataforma.toLowerCase();

                        if (tipoLimpio === 'instagram') {
                            colorBadge = "#E1306C"; // Rosa Instagram
                        } else if (tipoLimpio === 'tiktok') {
                            colorBadge = "#000000"; // Negro TikTok
                        } else if (tipoLimpio === 'web') {
                            colorBadge = "#4db7c3"; // Azul Turquesa Diversencia
                        }

                        // CREACIÓN DE LA TARJETA
                        const card = document.createElement('div');
                        card.className = 'tarjeta-online';
                        card.innerHTML = `
                            <div class="card-img-container">
                                <span class="badge-tipo" style="background:${colorBadge}">${tipoPlataforma}</span>
                                <img src="${urlImagen}" alt="${nombre}" onerror="this.src='logo.png'">
                            </div>
                            <div class="card-info">
                                <h3>${nombre}</h3>
                                <p>${descripcion}</p>
                                <a href="${linkWeb}" target="_blank" class="btn-visitar">Ver en ${tipoPlataforma}</a>
                            </div>
                        `;
                        listaContenedor.appendChild(card);
                    }
                }
            });

            // Si después de recorrer todo no hay nada con la categoría "Online"
            if (!hayResultados) {
                listaContenedor.innerHTML = `<p class="loading-msg">No se han encontrado recursos online todavía. ¡Vuelve pronto!</p>`;
            }
        })
        .catch(error => {
            console.error('Error al cargar el CSV:', error);
            listaContenedor.innerHTML = `<p class="loading-msg">Hubo un error al conectar con la lista de recursos.</p>`;
        });
});
