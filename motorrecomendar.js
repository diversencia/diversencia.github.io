const URL_SHEETS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI0jqC8RUmQwifG87iizwfsvq7UMMCw_Qbnv6oNmVuBoVOOxkr1C_S_P2rlPagnS-78ghJc5d-bk-L/pub?output=csv";

let currentFilter = 'todos';

// Desplazamiento horizontal para las flechas
window.sideScroll = function(elementId, step) {
    const container = document.getElementById(elementId);
    container.scrollBy({ left: step, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    document.getElementById('buscador').addEventListener('input', runFilters);
});

async function fetchData() {
    try {
        const response = await fetch(URL_SHEETS);
        const data = await response.text();
        const rows = parseCSV(data).slice(1);
        renderContent(rows);
    } catch (error) {
        console.error("Error cargando Google Sheets:", error);
    }
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    return lines.map(line => {
        const cells = [];
        let current = '';
        let inQuotes = false;
        for (let char of line) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                cells.push(current.trim());
                current = '';
            } else current += char;
        }
        cells.push(current.trim());
        return cells.map(c => c.replace(/^"|"$/g, '').trim());
    });
}

function renderContent(items) {
    const sections = {
        'Película': document.getElementById('container-Pelicula'),
        'Serie': document.getElementById('container-Serie'),
        'Libro': document.getElementById('container-Libro')
    };

    // Limpiar carruseles
    Object.values(sections).forEach(s => s.innerHTML = "");

    items.forEach(item => {
        const [titulo, formato, diversidad, edad, autor, sinopsis, imagen, plataforma] = item;
        const container = sections[formato];

        if (container && titulo) {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-titulo', titulo.toLowerCase());
            card.setAttribute('data-autor', (autor || "").toLowerCase());
            card.setAttribute('data-diversidad', diversidad);

            // Limpieza de URL de imagen para evitar bloqueos
            const cleanImg = imagen.split(' ')[0]; 

            card.innerHTML = `
                <img src="${cleanImg}" alt="${titulo}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300?text=Diversencia'">
                <div class="card-body">
                    <span class="card-tag">${diversidad}</span>
                    <h3>${titulo}</h3>
                </div>
            `;

            card.onclick = () => showDetails(titulo, diversidad, autor, sinopsis, cleanImg, plataforma);
            container.appendChild(card);
        }
    });
    runFilters();
}

window.filtrarDiversidad = function(tipo, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = tipo;
    runFilters();
}

function runFilters() {
    const query = document.getElementById('buscador').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const t = card.getAttribute('data-titulo');
        const a = card.getAttribute('data-autor');
        const d = card.getAttribute('data-diversidad');

        const matchText = t.includes(query) || a.includes(query);
        const matchDiv = currentFilter === 'todos' || d.includes(currentFilter);

        card.style.display = (matchText && matchDiv) ? "flex" : "none";
    });

    // Ocultar sección si no hay nada visible
    document.querySelectorAll('.seccion-horizontal').forEach(sec => {
        const hasVisible = Array.from(sec.querySelectorAll('.card')).some(c => c.style.display !== "none");
        sec.style.display = hasVisible ? "block" : "none";
    });
}

window.showDetails = function(tit, div, aut, sin, img, plat) {
    document.getElementById('m-tit').innerText = tit;
    document.getElementById('m-div').innerText = div;
    document.getElementById('m-aut').innerText = aut;
    document.getElementById('m-sin').innerText = sin;
    document.getElementById('m-img').src = img;
    
    const platContainer = document.getElementById('m-plat');
    if (plat && plat !== "Librerías") {
        platContainer.innerHTML = `<span class="btn-plat-link">Disponible en: ${plat}</span>`;
    } else {
        platContainer.innerHTML = `<span style="color:#666">Disponible en: Librerías</span>`;
    }

    document.getElementById('miModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

window.cerrarModal = function() {
    document.getElementById('miModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = (e) => {
    if (e.target.id === 'miModal') cerrarModal();
}
