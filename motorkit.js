const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT097AKUjkqCpEjvsTSGsGYipqeQRBGckPQt2VUc4GUNrK3F3C59WMPe9eFRX6PYLi-0aTLRGLqmVi0/pub?output=csv';

async function cargarKit() {
    const contenedor = document.getElementById('recursos-container');
    
    try {
        const respuesta = await fetch(SHEET_URL);
        const texto = await respuesta.text();
        
        const filas = texto.split(/\r?\n/).filter(f => f.trim() !== "");
        const datos = filas.slice(1); 

        contenedor.innerHTML = ''; 

        datos.forEach(fila => {
            // Detectar si el CSV usa comas o puntos y coma
            let columnas = fila.includes(';') ? fila.split(';') : fila.split(',');
            
            if (columnas.length < 2) return;

            const nombre = columnas[0].replace(/["']/g, "").trim();
            const archivo = columnas[1].replace(/["']/g, "").trim();
            const tipo = (columnas[2] || "Recurso").replace(/["']/g, "").trim();

            if (!archivo || archivo.includes("IMAGE")) return;

            // RUTA CORREGIDA: Ahora usa "Kitdiver" con K mayúscula
            const rutaFinal = `Kitdiver/${archivo}`;

            const card = document.createElement('div');
            card.className = 'card-descarga';
            card.innerHTML = `
                <div class="img-container">
                    <span class="tag-formato">${tipo}</span>
                    <img src="${rutaFinal}" alt="${nombre}" 
                         onerror="console.error('No se encontró el archivo en: ${rutaFinal}'); this.src='https://via.placeholder.com/400x225?text=Archivo+no+encontrado';">
                </div>
                <div class="card-body-kit">
                    <h3 style="font-family:'Fredoka'; font-size: 1.1rem; margin:0;">${nombre}</h3>
                    <a href="${rutaFinal}" class="btn-descarga" download="${archivo}">Descargar</a>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error de conexión:', error);
        contenedor.innerHTML = '<p>Error al conectar con el Google Sheets.</p>';
    }
}

document.addEventListener('DOMContentLoaded', cargarKit);
