document.addEventListener("DOMContentLoaded", () => {
    const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI0jqC8RUmQwifG87iizwfsvq7UMMCw_Qbnv6oNmVuBoVOOxkr1C_S_P2rlPagnS-78ghJc5d-bk-L/pub?output=csv";
    
    let todasLasRecomendaciones = [];
    let filtroActual = 'todos';

    // 1. Cargar Datos
    fetch(URL_SHEETS)
        .then(res => res.text())
        .then(csvText => {
            todasLasRecomendaciones = procesarCSV(csvText).slice(1); // Quitamos cabecera
            crearInterfazBusqueda();
            renderizarCultura(todasLasRecomendaciones);
        });

    // Tu función robusta de procesamiento CSV
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

    function crearInterfazBusqueda() {
        const zona = document.getElementById('zona-controles');
        if (!zona) return;

        zona.className = "controles-superiores";
        
        // Buscador
        const buscador = document.createElement('input');
        buscador.type = "text";
        buscador.className = "search-input";
        buscador.placeholder = "🔍 Busca por título, autor o temática...";
        buscador.oninput = () => aplicarFiltros(buscador.value);

        // Grupo de Filtros
        const grupo = document.createElement('div');
        grupo.className = "filter-group";

        const cats = [
            { id: 'todos', nom: 'Todos' },
            { id: 'Neurodiversidad', nom: 'Neurodiversidad' },
            { id: 'Física', nom: 'Física' },
            { id: 'Sensorial', nom: 'Sensorial' },
            { id: 'Intelectual', nom: 'Intelectual' }
        ];

        cats.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${cat.id === 'todos' ? 'active' : ''}`;
            btn.innerText = cat.nom;
            btn.onclick = (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filtroActual = cat.id;
                aplicarFiltros(buscador.value);
            };
            grupo.appendChild(btn);
        });

        zona.appendChild(buscador);
        zona.appendChild(grupo);
    }

    function aplicarFiltros(texto) {
        const t = texto.toLowerCase();
        const filtrados = todasLasRecomendaciones.filter(r => {
            const cumpleTipo = filtroActual === 'todos' || r[2] === filtroActual;
            const cumpleTexto = r[0].toLowerCase().includes(t) || r[4].toLowerCase().includes(t);
            return cumpleTipo && cumpleTexto;
        });
        renderizarCultura(filtrados);
    }

    function renderizarCultura(lista) {
        // IDs de los contenedores horizontales
        const conts = {
            'Pelicula': document.getElementById('container-Pelicula'),
            'Serie': document.getElementById('container-Serie'),
            'Libro': document.getElementById('container-Libro')
        };

        // Limpiar contenedores y ocultar secciones
        Object.keys(conts).forEach(k => {
            if (conts[k]) {
                conts[k].innerHTML = "";
                document.getElementById(`sec-${k}`).style.display = "none";
            }
        });

        lista.forEach(item => {
            // [0]Titulo, [1]Formato, [2]Diversidad, [3]Edad, [4]Autor, [5]Sinopsis, [6]Imagen, [7]Plataforma
            const [titulo, formato, diversidad, edad, autor, sinopsis, imagen, plataforma] = item;

            if (conts[formato]) {
                document.getElementById(`sec-${formato}`).style.display = "block";
                
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${imagen}" alt="${titulo}" onerror="this.src='img/placeholder.jpg'">
                    <div class="card-body">
                        <span class="card-tag">${diversidad}</span>
                        <h3>${titulo}</h3>
                    </div>
                `;
                
                card.onclick = () => abrirModal(item);
                conts[formato].appendChild(card);
            }
        });
    }

    // Lógica del Modal
    function abrirModal(item) {
        const modal = document.getElementById('miModal');
        document.getElementById('m-img').src = item[6];
        document.getElementById('m-tit').innerText = item[0];
        document.getElementById('m-div').innerText = item[2];
        document.getElementById('m-aut').innerText = item[4];
        document.getElementById('m-sin').innerText = item[5];
        document.getElementById('m-plat').innerText = "Disponible en: " + item[7];
        modal.style.display = 'flex';
    }

    // Cerrar Modal
    document.querySelector('.modal-close').onclick = () => {
        document.getElementById('miModal').style.display = 'none';
    };

    window.onclick = (e) => {
        if (e.target == document.getElementById('miModal')) {
            document.getElementById('miModal').style.display = 'none';
        }
    };
});
