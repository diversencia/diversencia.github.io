document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('lista-sitios');
    if (!contenedor) return;

    const caActual = contenedor.getAttribute('data-ca');
    
    // ⚠️ REEMPLAZA ESTO con tu enlace CSV de Google Sheets
    const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzS05I_9ZX0A_M_-bjZxi7sPkN0cMC0reC1LMaI_krVIK8E7Rda1RV-Tm1DAG5cwfV2-LvSTYECFbO/pub?output=csv";

    let todosLosSitios = [];

    fetch(URL_SHEETS)
        .then(res => res.text())
        .then(csvText => {
            // Convertimos el CSV en filas y limpiamos espacios o comillas extra
            const filas = csvText.split("\n").map(f => f.split(",").map(celda => celda.replace(/^"|"$/g, '').trim()));
            
            // Filtramos por la columna "Comunidad" (índice 1)
            todosLosSitios = filas.slice(1).filter(f => f[1] === caActual);

            if (todosLosSitios.length === 0) {
                contenedor.innerHTML = `<p style="text-align:center; padding:20px; font-family:'Fredoka', sans-serif; color:#666;">Estamos trabajando para añadir espacios en ${caActual}. <br>¡Vuelve pronto!</p>`;
                return;
            }

            crearBotonesFiltro();
            renderizarTarjetas(todosLosSitios);
        });

    function crearBotonesFiltro() {
        const filtrosDiv = document.createElement('div');
        filtrosDiv.style = "display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:30px;";
        
        const categoriasFiltro = [
            { id: 'todos', nom: 'Todos', ico: '✨', col: '#4A90E2' },
            { id: 'movilidad', nom: 'Movilidad', ico: '♿', col: '#2ecc71' },
            { id: 'cognitiva', nom: 'Cognitiva', ico: '🧩', col: '#3498db' },
            { id: 'visual', nom: 'Visual', ico: '👁️', col: '#e67e22' },
            { id: 'auditiva', nom: 'Auditiva', ico: '👂', col: '#9b59b6' },
            { id: 'trato', nom: 'Buen trato', ico: '🤝', col: '#f1c40f' }
        ];

        categoriasFiltro.forEach(cat => {
            const btn = document.createElement('button');
            btn.innerHTML = `${cat.ico} ${cat.nom}`;
            btn.style = `padding:8px 15px; border-radius:20px; border:2px solid ${cat.col}; background:white; color:${cat.col}; cursor:pointer; font-family:'Fredoka',sans-serif; font-weight:bold; transition:0.3s;`;
            
            btn.onclick = () => {
                // Filtramos por la columna "Adaptaciones" (índice 5)
                const filtrados = cat.id === 'todos' ? todosLosSitios : todosLosSitios.filter(s => s[5] && s[5].toLowerCase().includes(cat.id));
                renderizarTarjetas(filtrados);
            };
            filtrosDiv.appendChild(btn);
        });
        contenedor.before(filtrosDiv);
    }

    function renderizarTarjetas(lista) {
        contenedor.innerHTML = "";
        lista.forEach(fila => {
            // Mapeo: 0:Nombre, 1:Comunidad, 2:Dirección, 3:Descripción, 4:Categoría, 5:Adaptaciones
            const [nombre, comunidad, direccion, descripcion, categoria, adaptaciones] = fila;
            
            const busquedaMaps = encodeURIComponent(`${nombre} ${direccion}`);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${busquedaMaps}`;

            const card = document.createElement('div');
            card.style = "background:white; padding:20px; border-radius:15px; box-shadow:0 4px 12px rgba(0,0,0,0.08); margin-bottom:20px; border-left:6px solid #4A90E2; text-align:left; font-family:'Fredoka', sans-serif;";
            
            card.innerHTML = `
                <span style="font-size:0.75em; color:#4A90E2; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">${categoria}</span>
                <h3 style="margin:5px 0 10px 0; color:#333;">${nombre}</h3>
                <p style="color:#555; font-size:0.95em; line-height:1.4;">${descripcion}</p>
                <p style="font-size:0.85em; color:#888; margin:10px 0;">📍 ${direccion}</p>
                <a href="${mapsUrl}" target="_blank" style="display:inline-block; margin-top:10px; text-align:center; background:#4A90E2; color:white; padding:10px 20px; border-radius:10px; text-decoration:none; font-size:0.9em; font-weight:bold;">
                    🗺️ Ver en Google Maps
                </a>
            `;
            contenedor.appendChild(card);
        });
    }
});
