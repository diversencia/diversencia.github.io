document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('lista-sitios');
    if (!contenedor) return;

    const caActual = contenedor.getAttribute('data-ca');
    // ⚠️ ENLACE CSV
    const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzS05I_9ZX0A_M_-bjZxi7sPkN0cMC0reC1LMaI_krVIK8E7Rda1RV-Tm1DAG5cwfV2-LvSTYECFbO/pub?output=csv"; 

    let todosLosSitios = [];

    fetch(URL_SHEETS)
        .then(res => res.text())
        .then(csvText => {
            const filas = csvText.split("\n").map(f => f.split(",").map(c => c.replace(/^"|"$/g, '').trim()));
            todosLosSitios = filas.slice(1).filter(f => f[1] === caActual);

            if (todosLosSitios.length === 0) {
                contenedor.innerHTML = "<p style='text-align:center;'>No hay datos para esta comunidad aún.</p>";
                return;
            }

            crearInterfazBusqueda();
            renderizarTarjetas(todosLosSitios);
        });

    function crearInterfazBusqueda() {
        const headerFiltros = document.createElement('div');
        headerFiltros.style = "margin-bottom: 30px; text-align: center;";
        
        // Input de búsqueda por texto (Como tenías antes)
        const buscador = document.createElement('input');
        buscador.type = "text";
        buscador.placeholder = "🔍 Buscar por nombre...";
        buscador.style = "width:100%; max-width:400px; padding:12px; border-radius:25px; border:1px solid #ddd; margin-bottom:20px; font-family:'Fredoka',sans-serif;";
        
        buscador.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtrados = todosLosSitios.filter(s => s[0].toLowerCase().includes(term) || s[2].toLowerCase().includes(term));
            renderizarTarjetas(filtrados);
        };

        // Botones de accesibilidad
        const botonesDiv = document.createElement('div');
        botonesDiv.style = "display:flex; gap:10px; flex-wrap:wrap; justify-content:center;";
        
        const filtros = [
            { id: 'todos', nom: 'Todos', ico: '✨', col: '#4db7c3' },
            { id: 'movilidad', nom: 'Movilidad', ico: '♿', col: '#2ecc71' },
            { id: 'cognitiva', nom: 'Cognitiva', ico: '🧩', col: '#3498db' },
            { id: 'visual', nom: 'Visual', ico: '👁️', col: '#e67e22' },
            { id: 'trato', nom: 'Buen trato', ico: '🤝', col: '#f1c40f' }
        ];

        filtros.forEach(cat => {
            const btn = document.createElement('button');
            btn.innerHTML = `${cat.ico} ${cat.nom}`;
            btn.style = `padding:8px 15px; border-radius:20px; border:2px solid ${cat.col}; background:white; color:${cat.col}; cursor:pointer; font-family:'Fredoka',sans-serif; font-weight:bold;`;
            btn.onclick = () => {
                const filtrados = cat.id === 'todos' ? todosLosSitios : todosLosSitios.filter(s => s[5].toLowerCase().includes(cat.id));
                renderizarTarjetas(filtrados);
            };
            botonesDiv.appendChild(btn);
        });

        headerFiltros.appendChild(buscador);
        headerFiltros.appendChild(botonesDiv);
        contenedor.innerHTML = "";
        contenedor.before(headerFiltros);
    }

    function renderizarTarjetas(lista) {
        contenedor.innerHTML = "";
        lista.forEach(fila => {
            const [nombre, ca, direccion, descripcion, categoria, adaptaciones] = fila;
            const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(nombre + " " + direccion)}`;

            const card = document.createElement('div');
            card.className = "tabla-container"; // Reutilizamos tu clase para mantener sombras
            card.style = "background:white; padding:20px; border-radius:15px; margin-bottom:20px; border-left:8px solid #4db7c3; text-align:left; box-shadow: 0 4px 10px rgba(0,0,0,0.05);";
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <span style="font-size:0.7em; background:#e0f7f9; color:#4db7c3; padding:4px 10px; border-radius:10px; font-weight:bold;">${categoria}</span>
                </div>
                <h3 style="margin:10px 0 5px 0; font-family:'Fredoka',sans-serif; color:#333;">${nombre}</h3>
                <p style="color:#666; font-size:0.9em; margin-bottom:10px;">${descripcion}</p>
                <p style="font-size:0.8em; color:#999; margin-bottom:15px;">📍 ${direccion}</p>
                <a href="${mapsUrl}" target="_blank" style="text-decoration:none; background:#4db7c3; color:white; padding:10px 20px; border-radius:10px; font-size:0.8em; font-weight:bold; display:inline-block;">Cómo llegar</a>
            `;
            contenedor.appendChild(card);
        });
    }
});
