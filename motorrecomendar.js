const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI0jqC8RUmQwifG87iizwfsvq7UMMCw_Qbnv6oNmVuBoVOOxkr1C_S_P2rlPagnS-78ghJc5d-bk-L/pub?output=csv";
let filtroActual = 'todos';

window.sideScroll = (id, step) => {
    document.getElementById(id).scrollBy({ left: step, behavior: 'smooth' });
};

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
    document.getElementById('buscador').addEventListener('input', filtrarTodo);
});

async function cargarDatos() {
    try {
        const res = await fetch(URL_SHEETS);
        const data = await res.text();
        const filas = parsearCSV(data).slice(1);
        renderizarTarjetas(filas);
    } catch (e) { console.error("Error Sheets:", e); }
}

function parsearCSV(texto) {
    return texto.split(/\r?\n/).map(linea => {
        let celdas = [], actual = '', quotes = false;
        for (let char of linea) {
            if (char === '"') quotes = !quotes;
            else if (char === ',' && !quotes) { celdas.push(actual.trim()); actual = ''; }
            else actual += char;
        }
        celdas.push(actual.trim());
        return celdas.map(c => c.replace(/^"|"$/g, '').trim());
    });
}

function renderizarTarjetas(lista) {
    const conts = { 'Película': 'container-Pelicula', 'Serie': 'container-Serie', 'Libro': 'container-Libro' };
    Object.values(conts).forEach(id => document.getElementById(id).innerHTML = "");

    lista.forEach(item => {
        const [titulo, formato, diversidad, edad, autor, sinopsis, imagen, plataforma] = item;
        const contenedor = document.getElementById(conts[formato]);
        if (!contenedor || !titulo) return;

        // Limpieza de URL (Elimina espacios y caracteres invisibles que rompen la imagen)
        const urlImg = imagen.split(' ')[0].replace(/[^\x20-\x7E]/g, '');

        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-titulo', titulo.toLowerCase());
        card.setAttribute('data-autor', (autor || "").toLowerCase());
        card.setAttribute('data-div', diversidad);

        card.innerHTML = `
            <img src="${urlImg}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300?text=Cargando...'">
            <div class="card-body">
                <span class="card-tag">${diversidad}</span>
                <h3>${titulo}</h3>
            </div>
        `;
        card.onclick = () => abrirDetalles(titulo, diversidad, autor, sinopsis, urlImg, plataforma);
        contenedor.appendChild(card);
    });
    filtrarTodo();
}

window.cambiarVista = (modo) => {
    const b = document.body;
    const btnC = document.getElementById('btn-vista-carrusel');
    const btnL = document.getElementById('btn-vista-lista');

    if (modo === 'lista') {
        b.classList.replace('vista-carrusel', 'vista-lista');
        btnL.classList.add('active'); btnC.classList.remove('active');
    } else {
        b.classList.replace('vista-lista', 'vista-carrusel');
        btnC.classList.add('active'); btnL.classList.remove('active');
    }
};

window.filtrarDiversidad = (tipo, btn) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroActual = tipo;
    filtrarTodo();
};

function filtrarTodo() {
    const buscar = document.getElementById('buscador').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const t = card.getAttribute('data-titulo').includes(buscar) || card.getAttribute('data-autor').includes(buscar);
        const d = filtroActual === 'todos' || card.getAttribute('data-div').includes(filtroActual);
        card.style.display = (t && d) ? "flex" : "none";
    });

    document.querySelectorAll('.seccion-horizontal').forEach(sec => {
        const tiene = Array.from(sec.querySelectorAll('.card')).some(c => c.style.display !== "none");
        sec.style.display = tiene ? "block" : "none";
    });
}

window.abrirDetalles = (tit, div, aut, sin, img, plat) => {
    document.getElementById('m-tit').innerText = tit;
    document.getElementById('m-div').innerText = div;
    document.getElementById('m-aut').innerText = aut;
    document.getElementById('m-sin').innerText = sin;
    document.getElementById('m-img').src = img;
    document.getElementById('m-plat').innerText = plat ? "Ver en: " + plat : "";
    document.getElementById('miModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.cerrarModal = () => {
    document.getElementById('miModal').style.display = 'none';
    document.body.style.overflow = 'auto';
};

window.onclick = (e) => { if (e.target.id === 'miModal') cerrarModal(); };
