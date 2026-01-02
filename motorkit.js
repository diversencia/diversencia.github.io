const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT097AKUjkqCpEjvsTSGsGYipqeQRBGckPQt2VUc4GUNrK3F3C59WMPe9eFRX6PYLi-0aTLRGLqmVi0/pub?output=csv';

async function cargarKit() {
    const contenedor = document.getElementById('recursos-container');
    
    try {
        const respuesta = await fetch(SHEET_URL);
        const texto = await respuesta.text();
        
        // Dividir filas y limpiar caracteres extraños del CSV
        const filas = texto.split(/\r?\n/).map(fila => fila.split(','));
        const datos = filas.slice(1);

        contenedor.innerHTML = ''; 

        datos.forEach(columna => {
            if (columna.length < 2) return;

            // Limpieza de datos (quitar comillas y espacios en blanco)
            const nombre = columna[0].replace(/['"]+/g, '').trim();
            const archivo = columna[1].replace(/['"]+/g, '').trim();
            const tipo = (columna[2] || 'Recurso').replace(/['"]+/g, '').trim();

            const card = document.createElement('div');
            card.className = 'card-descarga';
            card.innerHTML = `
                <div class="img-container">
                    <span class="tag-formato">${tipo}</span>
                    <img src="kitdiver/${archivo}" alt="${nombre}" onerror="this.src='https://via.placeholder.com/300x169?text=Diversencia'">
                </div>
                <div class="card-body-kit">
                    <h3 style="font-family:'Fredoka'; font-size: 1.1rem; margin:0;">${nombre}</h3>
                    <a href="kitdiver/${archivo}" class="btn-descarga" download="${archivo}">Descargar</a>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        contenedor.innerHTML = '<p>No se pudieron cargar los archivos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', cargarKit);
