// Estructura del Menú de Accesibilidad
const menuAccesibilidad = `
<style>
    #btn-accesibilidad-fijo {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 999999 !important;
        background: #E37C3A !important;
        color: white !important;
        border: none !important;
        border-radius: 50% !important;
        width: 60px !important;
        height: 60px !important;
        font-size: 30px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0px 5px 15px rgba(0,0,0,0.5) !important;
    }

    #panel-accesibilidad-fijo {
        display: none;
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        z-index: 999999 !important;
        background: white !important;
        padding: 20px !important;
        border-radius: 10px !important;
        box-shadow: 0px 5px 20px rgba(0,0,0,0.3) !important;
        width: 200px !important;
        border: 2px solid #E37C3A !important;
        font-family: sans-serif !important;
    }

    .modo-contraste-total {
        filter: invert(1) hue-rotate(180deg) !important;
        background-color: white !important;
    }

    .btn-acc-opcion {
        width: 100% !important;
        margin-bottom: 8px !important;
        padding: 10px !important;
        cursor: pointer !important;
        background: #f4f4f4 !important;
        border: 1px solid #ccc !important;
        border-radius: 5px !important;
        font-weight: bold !important;
        color: #333 !important;
    }
</style>

<button id="btn-accesibilidad-fijo" onclick="window.toggleMenuAcc()">👤</button>

<div id="panel-accesibilidad-fijo">
    <strong style="display:block;margin-bottom:12px;color:black;text-align:center;">Accesibilidad</strong>
    <button class="btn-acc-opcion" onclick="window.cambiarFont(1.2)">➕ Aumentar</button>
    <button class="btn-acc-opcion" onclick="window.cambiarFont(1)">🏠 Normal</button>
    <button class="btn-acc-opcion" onclick="window.toggleContraste()">🌓 Contraste</button>
    <button class="btn-acc-opcion" onclick="window.resetTodo()" style="background:#333 !important; color:white !important;">🔄 Restablecer</button>
</div>
`;

document.body.insertAdjacentHTML('beforeend', menuAccesibilidad);

// --- LÓGICA CON MEMORIA ---

// 1. Al cargar la página, comprobar si el modo contraste estaba activo
if (localStorage.getItem('contraste') === 'activo') {
    document.documentElement.classList.add('modo-contraste-total');
}

// 2. Comprobar si el zoom estaba activo
if (localStorage.getItem('zoom')) {
    document.body.style.zoom = localStorage.getItem('zoom');
}

window.toggleMenuAcc = function() {
    var p = document.getElementById('panel-accesibilidad-fijo');
    p.style.display = (p.style.display === 'block') ? 'none' : 'block';
}

window.cambiarFont = function(n) {
    document.body.style.zoom = n;
    localStorage.setItem('zoom', n); // Guardar zoom
}

window.toggleContraste = function() {
    document.documentElement.classList.toggle('modo-contraste-total');
    // Guardar estado
    if (document.documentElement.classList.contains('modo-contraste-total')) {
        localStorage.setItem('contraste', 'activo');
    } else {
        localStorage.setItem('contraste', 'inactivo');
    }
}

window.resetTodo = function() {
    document.body.style.zoom = 1;
    document.documentElement.classList.remove('modo-contraste-total');
    localStorage.clear(); // Limpiar memoria
}

// Cerrar al hacer clic fuera
document.addEventListener('click', function(event) {
    var panel = document.getElementById('panel-accesibilidad-fijo');
    var btn = document.getElementById('btn-accesibilidad-fijo');
    if (panel && !panel.contains(event.target) && event.target !== btn) {
        panel.style.display = 'none';
    }
});
