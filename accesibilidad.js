(function() {
    // 1. Inyectar estilos optimizados
    var style = document.createElement('style');
    style.textContent = `
        #btn-accesibilidad-fijo {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg,#E37C3A 0%,#d96b2a 100%);
            border: none;
            border-radius: 50%;
            width: 65px;
            height: 65px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 6px 20px rgba(227,124,58,0.4);
            transition: all 0.3s ease;
            padding: 0;
            overflow: hidden;
        }

        /* Estilo para la imagen dentro del botón naranja */
        #btn-accesibilidad-fijo img {
            width: 70%;
            height: auto;
            pointer-events: none;
        }

        #btn-accesibilidad-fijo:hover { transform: scale(1.1); }
        
        #contador-activas {
            position: absolute;
            top: 2px;
            right: 2px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            border: 2px solid white;
        }

        #panel-accesibilidad-fijo {
            display: none;
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0px 10px 40px rgba(0,0,0,0.2);
            width: 280px;
            max-height: 80vh;
            overflow-y: auto;
            border: 3px solid #E37C3A;
            font-family: 'Fredoka', sans-serif;
        }

        /* CLASES DE ACCESIBILIDAD */
        .modo-contraste-alto { filter: contrast(1.8) !important; }
        .modo-oscuro { filter: invert(1) hue-rotate(180deg) !important; }
        .modo-oscuro img, .modo-oscuro video { filter: invert(1) hue-rotate(180deg); }
        .fuente-dislexia * { font-family: "OpenDyslexic", "Comic Sans MS", cursive !important; }
        
        /* Cursor Grande */
        .cursor-grande * { 
    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='%23E37C3A' stroke='white' stroke-width='1'><path d='M7 2l12 11.2l-5.8 0.5l3.3 7.3l-2.2 1l-3.2-7.4L7 19V2z'/></svg>"), auto !important; 
}
        
        /* Detener Animaciones */
        .sin-animaciones * { 
            animation: none !important; 
            transition: none !important; 
        }

        /* Guía de lectura */
        #guia-lectura-acc {
            position: fixed;
            left: 0;
            width: 100%;
            height: 2px;
            background: #ff8c00;
            z-index: 10000;
            pointer-events: none;
            display: none;
            box-shadow: 0 0 8px rgba(255,140,0,0.8);
        }

        .btn-acc-opcion {
            width: 100%;
            margin-bottom: 8px;
            padding: 12px;
            cursor: pointer;
            background: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 8px;
            text-align: left;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s;
        }
        .btn-acc-opcion.activo { background: #d4edda; border-color: #28a745; color: #155724; font-weight: bold; }
    `;
    document.head.appendChild(style);

    // 2. Crear Elementos
    var guia = document.createElement('div');
    guia.id = 'guia-lectura-acc';
    document.body.appendChild(guia);

    var boton = document.createElement('button');
    boton.id = 'btn-accesibilidad-fijo';
    // AQUÍ CARGAMOS TU IMAGEN
    boton.innerHTML = `<img src="adaptar.png" alt="Accesibilidad"><span id="contador-activas">0</span>`;
    
    var panel = document.createElement('div');
    panel.id = 'panel-accesibilidad-fijo';
    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <strong style="color:#E37C3A">Opciones de Adaptabilidad</strong>
            <button onclick="window.toggleMenuAcc()" style="cursor:pointer; border:none; background:none; font-size:24px;">×</button>
        </div>
        <button class="btn-acc-opcion" onclick="window.toggleModoOscuro()" data-opcion="oscuro">🌓 Modo Oscuro</button>
        <button class="btn-acc-opcion" onclick="window.toggleContrasteAlto()" data-opcion="contraste">🌗 Alto Contraste</button>
        <button class="btn-acc-opcion" onclick="window.toggleFuenteDislexia()" data-opcion="dislexia">🔡 Fuente Dislexia</button>
        <button class="btn-acc-opcion" onclick="window.toggleCursorGrande()" data-opcion="cursor">🔍 Cursor Grande</button>
        <button class="btn-acc-opcion" onclick="window.toggleGuiaLectura()" data-opcion="guia">📏 Guía de Lectura</button>
        <button class="btn-acc-opcion" onclick="window.toggleAnimaciones()" data-opcion="anim">🚫 Detener Animaciones</button>
        
        <button class="btn-acc-opcion" style="background:#333; color:white; margin-top:10px; text-align:center" onclick="window.resetTodo()">Restablecer configuración</button>
    `;

    document.body.appendChild(boton);
    document.body.appendChild(panel);

    // 3. Funciones de Lógica
    window.toggleMenuAcc = function() {
        var p = document.getElementById('panel-accesibilidad-fijo');
        p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    };

    window.toggleModoOscuro = function() { toggleClase('oscuro', 'modo-oscuro'); };
    window.toggleContrasteAlto = function() { toggleClase('contraste', 'modo-contraste-alto'); };
    window.toggleFuenteDislexia = function() { toggleClase('dislexia', 'fuente-dislexia'); };
    window.toggleCursorGrande = function() { toggleClase('cursor', 'cursor-grande'); };
    window.toggleAnimaciones = function() { toggleClase('anim', 'sin-animaciones'); };
    
    window.toggleGuiaLectura = function() {
        var activo = document.getElementById('guia-lectura-acc').style.display === 'block';
        if (!activo) {
            document.getElementById('guia-lectura-acc').style.display = 'block';
            document.querySelector(`[data-opcion="guia"]`).classList.add('activo');
            localStorage.setItem('acc-guia', 'activo');
            window.addEventListener('mousemove', moverGuia);
        } else {
            document.getElementById('guia-lectura-acc').style.display = 'none';
            document.querySelector(`[data-opcion="guia"]`).classList.remove('activo');
            localStorage.removeItem('acc-guia');
            window.removeEventListener('mousemove', moverGuia);
        }
        actualizarContador();
    };

    function moverGuia(e) {
        document.getElementById('guia-lectura-acc').style.top = e.clientY + 'px';
    }

    function toggleClase(nombre, clase) {
        var activo = document.documentElement.classList.toggle(clase);
        var btn = document.querySelector(`[data-opcion="${nombre}"]`);
        if (activo) {
            btn.classList.add('activo');
            localStorage.setItem('acc-' + nombre, 'activo');
        } else {
            btn.classList.remove('activo');
            localStorage.removeItem('acc-' + nombre);
        }
        actualizarContador();
    }

    window.resetTodo = function() {
        ['modo-oscuro', 'modo-contraste-alto', 'fuente-dislexia', 'cursor-grande', 'sin-animaciones'].forEach(c => document.documentElement.classList.remove(c));
        document.getElementById('guia-lectura-acc').style.display = 'none';
        document.querySelectorAll('.btn-acc-opcion').forEach(b => b.classList.remove('activo'));
        localStorage.clear();
        actualizarContador();
    };

    function actualizarContador() {
        var activas = document.querySelectorAll('.btn-acc-opcion.activo').length;
        var c = document.getElementById('contador-activas');
        c.style.display = activas > 0 ? 'flex' : 'none';
        c.textContent = activas;
    }

    boton.addEventListener('click', window.toggleMenuAcc);
    
    // Cargar estado inicial
    if(localStorage.getItem('acc-oscuro')) window.toggleModoOscuro();
    if(localStorage.getItem('acc-contraste')) window.toggleContrasteAlto();
    if(localStorage.getItem('acc-dislexia')) window.toggleFuenteDislexia();
    if(localStorage.getItem('acc-cursor')) window.toggleCursorGrande();
    if(localStorage.getItem('acc-anim')) window.toggleAnimaciones();
    if(localStorage.getItem('acc-guia')) window.toggleGuiaLectura();

})();
