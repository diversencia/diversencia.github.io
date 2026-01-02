document.addEventListener("DOMContentLoaded", () => {
    const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI0jqC8RUmQwifG87iizwfsvq7UMMCw_Qbnv6oNmVuBoVOOxkr1C_S_P2rlPagnS-78ghJc5d-bk-L/pub?output=csv";
    
    let todosLosContenidos = [];
    let filtroActual = 'todos';

    fetch(URL_SHEETS)
        .then(res => res.text())
        .then(csvText => {
            todosLosContenidos = procesarCSV(csvText).slice(1);
            crearInterfaz();
            renderizar(todosLosContenidos);
        });

    function procesarCSV(texto) {
        const lineas = texto.split(/\r?\n/);
        return lineas.map(linea => {
            const celdas = [];
            let celdaActual = '';
            let dentroComillas = false;
            for (let char of linea) {
                if (char === '"') dentroComillas = !dentroComillas;
                else if (char === ',' && !dentroComillas) {
                    celdas.push(celdaActual.trim());
                    celdaActual = '';
                } else celdaActual += char;
            }
            celdas.push(celdaActual.trim());
            return celdas.map(c => c.replace(/^"|"$/g, ''));
        });
    }

    function crearInterfaz() {
        const zona = document.getElementById('zona-controles');
        if(!zona) return;
        zona.innerHTML = ""; 
        zona.className = "controles-superiores";

        const buscador = document.createElement('input');
        buscador.className = "search-input";
        buscador.placeholder = "🔍 Escribe título, autor o temática...";
        
        buscador.addEventListener('input', (e) => {
            filtrarTodo(e.target.value);
        });

        const botonesDiv = document.createElement('div');
        botonesDiv.className = "filter-group";
        
        const filtros = [
            {id:'todos', nom:'Todos'},
            {id:'Neurodiversidad', nom:'Neurodiversidad'},
            {id:'Física', nom:'Física'},
            {id:'Sensorial', nom:'Sensorial'},
            {id:'Intelectual', nom:'Intelectual'}
        ];

        filtros.forEach(f => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${f.id === 'todos' ? 'active' : ''}`;
            btn.innerText = f.nom;
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filtroActual = f.id;
                filtrarTodo(buscador.value);
            };
            botonesDiv.appendChild(btn);
        });

        zona.appendChild(buscador);
        zona.appendChild(botonesDiv);
    }

    function filtrarTodo(texto) {
        const t = texto.toLowerCase();
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const titulo = card.getAttribute('data-titulo') || "";
            const autor = card.getAttribute('data-autor') || "";
            const diversidad = card.getAttribute('data-div') || "";

            const cumpleFiltro = filtroActual === 'todos' || diversidad === filtroActual;
            const cumpleTexto = titulo.includes(t) || autor.includes(t);

            if (cumpleFiltro && cumpleTexto) {
                card.style.display = "block";
                setTimeout(() => card.style.opacity = "1", 10);
            } else {
                card.style.opacity = "0";
                setTimeout(() => card.style.display = "none", 300);
            }
        });

        document.querySelectorAll('.seccion-horizontal').forEach(seccion => {
            const tieneVisibles = Array.from(seccion.querySelectorAll('.card')).some(c => c.style.display !== "none");
            seccion.style.display = tieneVisibles ? "block" : "none";
        });
    }

    function renderizar(lista) {
        const conts = {
            'Pelicula': document.getElementById('container-Pelicula'),
            'Serie': document.getElementById('container-Serie'),
            'Libro': document.getElementById('container-Libro')
        };

        Object.keys(conts).forEach(k => {
            if(conts[k]) {
                conts[k].innerHTML = "";
                document.getElementById(`sec-${k}`).style.display = "block";
            }
        });

        lista.forEach(item => {
            const [titulo, formato, diversidad, edad, autor, sinopsis, imagenRaw, plataforma] = item;
            
            // --- LIMPIEZA DE URL DE IMAGEN ---
            const imagen = imagenRaw ? imagenRaw.trim().replace(/^"|"$/g, '') : '';
            
            const contenedor = conts[formato];

            if (contenedor && imagen) {
                const card = document.createElement('div');
                card.className = 'card';
                card.setAttribute('data-titulo', titulo.toLowerCase());
                card.setAttribute('data-autor', autor.toLowerCase());
                card.setAttribute('data-div', diversidad);
                card.style.transition = "opacity 0.3s ease";
                
                card.innerHTML = `
                    <img src="${imagen}" alt="${titulo}" loading="lazy" onerror="this.src='https://via.placeholder.com/220x330?text=Cargando...'">
                    <div class="card-body">
                        <span class="card-tag">${diversidad}</span>
                        <h3>${titulo}</h3>
                    </div>
                `;

                card.onclick = () => {
                    document.getElementById('m-img').src = imagen;
                    document.getElementById('m-tit').innerText = titulo;
                    document.getElementById('m-div').innerText = diversidad;
                    document.getElementById('m-aut').innerText = autor;
                    document.getElementById('m-sin').innerText = sinopsis;
                    document.getElementById('m-plat').innerText = "Ver en: " + plataforma;
                    document.getElementById('miModal').style.display = 'flex';
                };
                contenedor.appendChild(card);
            }
        });
    }

    const closeBtn = document.getElementById('close-modal');
    if(closeBtn) closeBtn.onclick = () => document.getElementById('miModal').style.display = 'none';
    
    window.onclick = (e) => {
        if (e.target == document.getElementById('miModal')) document.getElementById('miModal').style.display = 'none';
    };
});
