const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI0jqC8RUmQwifG87iizwfsvq7UMMCw_Qbnv6oNmVuBoVOOxkr1C_S_P2rlPagnS-78ghJc5d-bk-L/pub?output=csv";
let filtroActivo = 'todos';

window.sideScroll = (id, step) => {
    document.getElementById(id).scrollBy({ left: step, behavior: 'smooth' });
};

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
    document.getElementById('buscador').addEventListener('input', filtrarContenido);
});

async function cargarDatos() {
    try {
        const res = await fetch(URL_SHEETS);
        const csv = await res.text();
        const filas = parsearCSV(csv).slice(1);
        pintarTarjetas(filas);
    } catch (e) { console.error("Error cargando Google Sheets", e); }
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

function pintarTarjetas(datos) {
    const ids = { 'Película': 'container-Pelicula', 'Serie': 'container-Serie', 'Libro': 'container-Libro' };
    Object.values(ids).forEach(id => document.getElementById(id).innerHTML = "");

    datos.forEach(item => {
        const [titulo, formato, diversidad, edad, autor, sinopsis, imagen, plataforma] = item;
        const container = document.getElementById(ids[formato]);
        if (!container || !titulo) return;

        // Limpieza estricta de URL (elimina espacios y basura oculta de Sheets)
        const urlImg = imagen.split(' ')[0].replace(/[^\x20-\x7E]/g, '');

        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-titulo', titulo.toLowerCase());
        card.setAttribute('data-autor', (autor || "").toLowerCase());
        card.setAttribute('data-div', diversidad);

        card.innerHTML = `
            <img src="${urlImg}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300?text=Diversencia'">
            <div class="card-body">
                <span class="card-tag">${diversidad}</span>
                <h3>${titulo}</h3>
            </div>
        `;
        card.onclick = () => verDetalle(titulo, diversidad, autor, sinopsis, urlImg, plataforma);
        container.appendChild(card);
    });
    filtrarContenido();
}

window.cambiarVista = (modo) => {
    const body = document.body;
    const btnC = document.getElementById('btn-vista-carrusel');
    const btnL = document.getElementById('btn-vista-lista');

    if (modo === 'lista') {
        body.classList.replace('vista-carrusel', 'vista-lista');
        btnL.classList.add('active'); btnC.classList.remove('active');
    } else {
        body.classList.replace('vista-lista', 'vista-carrusel');
        btnC.classList.add('active'); btnL.classList.remove('active');
    }
};

window.filtrarDiversidad = (tipo, btn) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroActivo = tipo;
    filtrarContenido();
};

function filtrarContenido() {
    const txt = document.getElementById('buscador').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const matchT = card.getAttribute('data-titulo').includes(txt) || card.getAttribute('data-autor').includes(txt);
        const matchD = filtroActivo === 'todos' || card.getAttribute('data-div').includes(filtroActivo);
        card.style.display = (matchT && matchD) ? "flex" : "none";
    });

    document.querySelectorAll('.seccion-horizontal').forEach(sec => {
        const hayVisibles = Array.from(sec.querySelectorAll('.card')).some(c => c.style.display !== "none");
        sec.style.display = hayVisibles ? "block" : "none";
    });
}

window.verDetalle = (tit, div, aut, sin, img, plat) => {
    document.getElementById('m-tit').innerText = tit;
    document.getElementById('m-div').innerText = div;
    document.getElementById('m-aut').innerText = aut;
    document.getElementById('m-sin').innerText = sin;
    document.getElementById('m-img').src = img;
    document.getElementById('m-plat').innerText = plat ? "📌 Disponible en: " + plat : "";
    document.getElementById('miModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.cerrarModal = () => {
    document.getElementById('miModal').style.display = 'none';
    document.body.style.overflow = 'auto';
};

window.onclick = (e) => { if (e.target.id === 'miModal') cerrarModal(); };
