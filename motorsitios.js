document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('lista-sitios');
    if (!contenedor) return;

    const caActual = contenedor.getAttribute('data-ca');
    // ⚠️ GOOGLE SHEETS (CSV)
    const URL_SHEETS = "https://docs.google.com/spreadsheets/d/1r9zcos93gDjpxCgp3aXfbFc2PgziJWZ5oS94ci7SJnE/edit?gid=0#gid=0:~:text=https%3A//docs.google.com/spreadsheets/d/e/2PACX%2D1vQzS05I_9ZX0A_M_%2DbjZxi7sPkN0cMC0reC1LMaI_krVIK8E7Rda1RV%2DTm1DAG5cwfV2%2DLvSTYECFbO/pub%3Foutput%3Dcsv"; 

    let todosLosSitios = [];

    fetch(URL_SHEETS)
        .then(res => res.text())
        .then(csvText => {
            // Procesamos el CSV (limpiando comillas y espacios)
            const filas = csvText.split("\n").map(f => f.split(",").map(c => c.replace(/^"|"$/g, '').trim()));
            
            // Filtramos por Comunidad Autónoma (Columna B / Índice 1)
            todosLosSitios = filas.slice(1).filter(f => f[1] === caActual);

            if (todosLosSitios.length === 0) {
                contenedor.innerHTML = `<p style="text-align:center; font-family:'Fredoka', sans-serif; color:#888; padding:20px;">Estamos actualizando los espacios de ${caActual}.</p>`;
                return;
            }

            crearInterfazBusqueda();
            renderizarTarjetas(todosLosSitios);
        });

    function crearInterfazBusqueda() {
        const zonaFiltros = document.createElement('div');
        zonaFiltros.style = "margin-bottom: 30px; text-align: center; display: flex; flex-direction: column; gap: 15px; align-items: center;";

        // 1. EL BUSCADOR DE TEXTO
        const buscador = document.createElement('input');
        buscador.type = "text";
        buscador.placeholder = "🔍 Escribe nombre, dirección o categoría...";
        buscador.style = "width:90%; max-width:500px; padding:12px 20px; border-radius:30px; border:2px solid #4db7c3; font-family:'Fredoka', sans-serif; outline:none; box-shadow: 0 4px 6px rgba(0,0,0,0.05);";
        
        // Lógica de búsqueda en tiempo real
        buscador.oninput = (e) => {
            const t = e.target.value.toLowerCase();
            const filtrados = todosLosSitios.filter(s => 
                s[0].toLowerCase().includes(t) || // Nombre
                s[2].toLowerCase().includes(t) || // Dirección
                s[4].toLowerCase().includes(t) || // Categoría
                s[3].toLowerCase().includes(t)    // Descripción
            );
            renderizarTarjetas(filtrados);
        };

        // 2. BOTONES DE ACCESIBILIDAD
        const botonesDiv = document.createElement('div');
        botonesDiv.style = "display:flex; gap:8px; flex-wrap:wrap; justify-content:center;";
        
        const configFiltros = [
            { id: 'todos', nom: 'Todos', ico: '✨', col: '#4db7c3' },
            { id: 'movilidad', nom: 'Movilidad', ico: '♿', col: '#2ecc71' },
            { id: 'cognitiva', nom: 'Cognitiva', ico: '🧩', col: '#3498db' },
            { id: 'visual', nom: 'Visual', ico: '👁️', col: '#e67e22' },
            { id: 'trato', nom: 'Trato', ico: '🤝', col: '#f1c40f' }
        ];

        configFiltros.forEach(cat => {
            const btn = document.createElement('button');
            btn.innerHTML = `${cat.ico} ${cat.nom}`;
            btn.style = `padding:8px 15px; border-radius:20px; border:2px solid ${cat.col}; background:white; color:${cat.col}; cursor:pointer; font-family:'Fredoka', sans-serif; font-weight:bold; transition: 0.2s;`;
            
            btn.onclick = () => {
                const filtrados = cat.id === 'todos' ? todosLosSitios : todosLosSitios.filter(s => s[5].toLowerCase().includes(cat.id));
                renderizarTarjetas(filtrados);
            };
            botonesDiv.appendChild(btn);
        });

        zonaFiltros.appendChild(buscador);
        zonaFiltros.appendChild(botonesDiv);
        contenedor.innerHTML = "";
        contenedor.before(zonaFiltros);
    }

    function renderizarTarjetas(lista) {
        contenedor.innerHTML = "";
        lista.forEach(fila => {
            const [nombre, ca, direccion, descripcion, categoria, adaptaciones] = fila;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nombre + " " + direccion)}`;

            // Procesar adaptaciones para iconos
            let adaptHtml = "";
            if (adaptaciones) {
                adaptaciones.split(",").forEach(a => {
                    const text = a.trim().toLowerCase();
                    let icon = "•"; let c = "#888";
                    if(text.includes("movilidad")) { icon="♿"; c="#2ecc71"; }
                    else if(text.includes("cognitiva")) { icon="🧩"; c="#3498db"; }
                    else if(text.includes("visual")) { icon="👁️"; c="#e67e22"; }
                    else if(text.includes("trato")) { icon="🤝"; c="#f1c40f"; }
                    adaptHtml += `<span style="color:${c}; border:1px solid ${c}44; background:${c}11; padding:3px 8px; border-radius:12px; font-size:0.75em; margin-right:5px; font-weight:bold;">${icon} ${a.trim()}</span>`;
                });
            }

            const tarjeta = document.createElement('div');
            tarjeta.style = "background:white; padding:25px; border-radius:20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom:25px; border-left:10px solid #4db7c3; text-align:left; font-family:'Fredoka', sans-serif;";
            
            tarjeta.innerHTML = `
                <div style="margin-bottom:8px;"><span style="font-size:0.7em; color:#4db7c3; font-weight:bold; text-transform:uppercase; border:1px solid #4db7c3; padding:2px 8px; border-radius:6px;">${categoria}</span></div>
                <h3 style="margin:0 0 10px 0; color:#333; font-size:1.4em;">${nombre}</h3>
                <p style="color:#555; font-size:0.95em; line-height:1.4; margin-bottom:15px;">${descripcion}</p>
                <div style="margin-bottom:15px; display:flex; flex-wrap:wrap; gap:5px;">${adaptHtml}</div>
                <div style="padding-top:15px; border-top:1px solid #eee; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <span style="font-size:0.85em; color:#999; flex:1;">📍 ${direccion}</span>
                    <a href="${mapsUrl}" target="_blank" style="text-decoration:none; background:#4db7c3; color:white; padding:10px 18px; border-radius:12px; font-size:0.9em; font-weight:bold; box-shadow: 0 4px 10px rgba(77,183,195,0.3);">🗺️ Cómo llegar</a>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    }
});
