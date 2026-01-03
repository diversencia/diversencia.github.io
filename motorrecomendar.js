const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI0jqC8RUmQwifG87iizwfsvq7UMMCw_Qbnv6oNmVuBoVOOxkr1C_S_P2rlPagnS-78ghJc5d-bk-L/pub?output=csv";
let filtroDiversidad = 'todos';

window.sideScroll = (id, step) => {
    document.getElementById(id).scrollBy({ left: step, behavior: 'smooth' });
};

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
    document.getElementById('buscador').addEventListener('input', aplicarFiltros);
});

async function cargarDatos() {
    try {
        const res = await fetch(URL_SHEETS);
        const csv = await res.text();
        const filas = procesarCSV(csv).slice(1);
        renderizar(filas);
    } catch (e) { console.error("Error cargando datos", e); }
}

function procesarCSV(texto) {
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

function renderizar(lista) {
    const conts = { 'Película': 'container-Pelicula', 'Serie': 'container-Serie', 'Libro': 'container-Libro' };
    Object.values(conts).forEach(id => document.getElementById(id).innerHTML = "");

    lista.forEach(item => {
        const [titulo, formato, diversidad, edad, autor, sinopsis, imagen, plataforma] = item;
        const contenedor = document.getElementById(conts[formato]);
        if (!contenedor || !titulo) return;

        const imgLimpia = imagen.split(' ')[0].replace('​', ''); // Limpia caracteres invisibles
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-titulo', titulo.toLowerCase());
        card.setAttribute('data-autor', (autor || "").toLowerCase());
        card.setAttribute('data-div', diversidad);

        card.innerHTML = `
            <img src="${imgLimpia}" onerror="this.src='https://via.placeholder.com/200x300?text=Diversencia'">
            <div class="card-body">
                <span class="card-tag">${diversidad}</span>
                <h3>${titulo}</h3>
            </div>
        `;
        card.onclick = () => abrirModal(titulo, diversidad, autor, sinopsis, imgLimpia, plataforma);
        contenedor.appendChild(card);
    });
    aplicarFiltros();
}

window.cambiarVista = (modo) => {
    const body = document.body;
    const btnC = document.getElementById('btn-vista-carrusel');
    const btnL = document.getElementById('btn-vista-lista');
    const tituloLista = document.getElementById('lista-todas-titulo');

    if (modo === 'lista') {
        body.classList.replace('vista-carrusel', 'vista-lista');
        btnL.classList.add('active'); btnC.classList.remove('active');
        tituloLista.style.display = 'block';
    } else {
        body.classList.replace('vista-lista', 'vista-carrusel');
        btnC.classList.add('active'); btnL.classList.remove('active');
        tituloLista.style.display = 'none';
    }
    aplicarFiltros();
};

window.filtrarDiversidad = (tipo, btn) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroDiversidad = tipo;
    aplicarFiltros();
};

function aplicarFiltros() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const matchT = card.getAttribute('data-titulo').includes(query) || card.getAttribute('data-autor').includes(query);
        const matchD = filtroDiversidad === 'todos' || card.getAttribute('data-div').includes(filtroDiversidad);
        card.style.display = (matchT && matchD) ? "flex" : "none";
    });

    document.querySelectorAll('.seccion-horizontal').forEach(sec => {
        const tiene = Array.from(sec.querySelectorAll('.card')).some(c => c.style.display !== "none");
        sec.style.display = tiene ? "block" : "none";
    });
}

window.abrirModal = (tit, div, aut, sin, img, plat) => {
    document.getElementById('m-tit').innerText = tit;
    document.getElementById('m-div').innerText = div;
    document.getElementById('m-aut').innerText = aut;
    document.getElementById('m-sin').innerText = sin;
    document.getElementById('m-img').src = img;
    document.getElementById('m-plat').innerText = plat ? "Disponible en: " + plat : "";
    document.getElementById('miModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.cerrarModal = () => {
    document.getElementById('miModal').style.display = 'none';
    document.body.style.overflow = 'auto';
};

window.onclick = (e) => { if (e.target.id === 'miModal') cerrarModal(); };
