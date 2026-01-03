const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI0jqC8RUmQwifG87iizwfsvq7UMMCw_Qbnv6oNmVuBoVOOxkr1C_S_P2rlPagnS-78ghJc5d-bk-L/pub?output=csv";

let filtroDiversidad = 'todos';

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();

    // Listener para el buscador
    document.getElementById('buscador').addEventListener('input', () => {
        aplicarFiltros();
    });
});

async function cargarDatos() {
    try {
        const res = await fetch(URL_SHEETS);
        const csvText = await res.text();
        const filas = procesarCSV(csvText).slice(1); // Quitar cabecera
        renderizar(filas);
    } catch (err) {
        console.error("Error cargando datos:", err);
    }
}

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
        return celdas.map(c => c.replace(/^"|"$/g, '').trim());
    });
}

function renderizar(lista) {
    const conts = {
        'Pelicula': document.getElementById('container-Pelicula'),
        'Serie': document.getElementById('container-Serie'),
        'Libro': document.getElementById('container-Libro')
    };

    // Limpiar contenedores
    Object.values(conts).forEach(c => { if(c) c.innerHTML = ""; });

    lista.forEach(item => {
        const [titulo, formato, diversidad, edad, autor, sinopsis, imagen, plataforma] = item;
        const contenedor = conts[formato];

        if (contenedor && titulo) {
            const card = document.createElement('div');
            card.className = 'card';
            // Guardamos datos para filtrar
            card.setAttribute('data-titulo', titulo.toLowerCase());
            card.setAttribute('data-autor', (autor || "").toLowerCase());
            card.setAttribute('data-diversidad', diversidad);

            card.innerHTML = `
                <img src="${imagen}" alt="${titulo}" onerror="this.src='https://via.placeholder.com/200x300?text=Diversencia'">
                <div class="card-body">
                    <span class="card-tag">${diversidad}</span>
                    <h3>${titulo}</h3>
                </div>
            `;

            card.onclick = () => abrirModal(titulo, diversidad, autor, sinopsis, imagen, plataforma);
            contenedor.appendChild(card);
        }
    });
    aplicarFiltros(); // Ejecutar filtros iniciales
}

function filtrarPorDiversidad(tipo, btn) {
    // Actualizar botones
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    filtroDiversidad = tipo;
    aplicarFiltros();
}

function aplicarFiltros() {
    const textoBuscado = document.getElementById('buscador').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const t = card.getAttribute('data-titulo');
        const a = card.getAttribute('data-autor');
        const d = card.getAttribute('data-diversidad');

        const cumpleTexto = t.includes(textoBuscado) || a.includes(textoBuscado);
        const cumpleDiv = filtroDiversidad === 'todos' || d === filtroDiversidad;

        if (cumpleTexto && cumpleDiv) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });

    // Ocultar secciones vacías
    document.querySelectorAll('.seccion-horizontal').forEach(sec => {
        const tieneVisibles = Array.from(sec.querySelectorAll('.card')).some(c => c.style.display !== "none");
        sec.style.display = tieneVisibles ? "block" : "none";
    });
}

function abrirModal(tit, div, aut, sin, img, plat) {
    document.getElementById('m-tit').innerText = tit;
    document.getElementById('m-div').innerText = div;
    document.getElementById('m-aut').innerText = aut;
    document.getElementById('m-sin').innerText = sin;
    document.getElementById('m-img').src = img;
    document.getElementById('m-plat').innerText = plat ? "Disponible en: " + plat : "";
    document.getElementById('miModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.getElementById('miModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = (e) => {
    if (e.target.className === 'modal') cerrarModal();
};
