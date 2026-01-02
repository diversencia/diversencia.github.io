// Configuración
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT097AKUjkqCpEjvsTSGsGYipqeQRBGckPQt2VUc4GUNrK3F3C59WMPe9eFRX6PYLi-0aTLRGLqmVi0/pub?output=csv';

async function renderizarKit() {
    const contenedor = document.getElementById('recursos-container');
    
    try {
        const respuesta = await fetch(SHEET_URL);
        const texto = await respuesta.text();
        
        // Convertir CSV a Array de objetos (limpiando retornos de carro)
        const filas = texto.split(/\r?\n/).map(fila => fila.split(','));
        const cabeceras = filas[0];
        const datos = filas.slice(1);

        contenedor.innerHTML = ''; // Limpiar cargando...

        datos.forEach(fila => {
            if (fila.length < 2) return; // Saltar filas vacías

            // Mapeo de columnas: 0=Nombre, 1=Archivo, 2=Tipo, 3=Categoria
            const nombre = fila[0].trim();
            const archivo = fila[1].trim();
            const tipo = fila[2] ? fila[2].trim() : 'Recurso';
            const categoria = fila[3] ? fila[3].trim() : 'General';

            // Crear la tarjeta HTML
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta-descarga';
            tarjeta.setAttribute('data-categoria', categoria);

            tarjeta.innerHTML = `
                <div class="previsualizacion">
                    <img src="kitdiver/${archivo}" alt="${nombre}" onerror="this.src='kitdiver/default.jpg'">
                    <span class="tipo-tag">${tipo}</span>
                </div>
                <div class="contenido-tarjeta">
                    <h3 style="font-family:'Fredoka'; margin-bottom:15px; color:#333;">${nombre}</h3>
                    <a href="kitdiver/${archivo}" class="boton-descargar" download>
                        Descargar
                    </a>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error('Error al cargar el Kit:', error);
        contenedor.innerHTML = '<p>Error al cargar los materiales. Por favor, intenta más tarde.</p>';
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', renderizarKit);
