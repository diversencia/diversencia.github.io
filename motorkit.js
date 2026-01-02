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
            let columnas = fila.includes(';') ? fila.split(';') : fila.split(',');
            if (columnas.length < 2) return;

            const nombre = columnas[0].replace(/["']/g, "").trim();
            const archivo = columnas[1].replace(/["']/g, "").trim();
            const tipo = (columnas[2] || "Recurso").replace(/["']/g, "").trim();

            if (!archivo || archivo.includes("IMAGE")) return;

            // IMPORTANTE: Asegúrate de que este nombre coincida EXACTO con tu carpeta en GitHub
            const carpeta = "Kitdiver"; 
            const rutaFinal = `${carpeta}/${archivo}`;

            const card = document.createElement('div');
            card.className = 'card-descarga';
            card.innerHTML = `
                <div class="img-container">
                    <span class="tag-formato">${tipo}</span>
                    <img src="${rutaFinal}" alt="${nombre}" 
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x225?text=Error:+Check+Caps+in+GitHub';">
                </div>
                <div class="card-body-kit">
                    <h3 style="font-family:'Fredoka'; font-size: 1.1rem; margin:0;">${nombre}</h3>
                    <a href="${rutaFinal}" class="btn-descarga" download>Descargar</a>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarKit);
