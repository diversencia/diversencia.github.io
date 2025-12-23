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
            color: white;
            border: none;
            border-radius: 50%;
            width: 65px;
            height: 65px;
            font-size: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 6px 20px rgba(227,124,58,0.4);
            transition: all 0.3s ease;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
        }
        #btn-accesibilidad-fijo:hover { transform: scale(1.1); box-shadow: 0px 8px 25px rgba(227,124,58,0.6); }
        
        #contador-activas {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 12px;
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
            font-family: sans-serif;
        }

        /* Clases de estado que se aplican al HTML o BODY */
        .modo-contraste-alto { filter: contrast(1.8) !important; }
        .modo-oscuro { filter: invert(1) hue-rotate(180deg) !important; }
        .modo-oscuro img, .modo-oscuro video { filter: invert(1) hue-rotate(180deg); } /* Evita fotos en negativo */
        
        .fuente-dislexia * { font-family: "OpenDyslexic", "Comic Sans MS", cursive !important; }
        .enlaces-resaltados a { background-color: yellow !important; color: black !important; text-decoration: underline !important; }
        
        /* Estilos internos del panel para que no hereden los filtros */
        #panel-accesibilidad-fijo *, #btn-accesibilidad-fijo * { filter: none !important; }
        
        .btn-acc-opcion {
            width: 100%;
            margin-bottom: 8px;
            padding: 10px;
            cursor: pointer;
            background: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
        }
        .btn-acc-opcion.activo { background: #d4edda; border-color: #28a745; }
    `;
    document.head.appendChild(style);

    // 2. Crear Elementos
    var boton = document.createElement('button');
    boton.id = 'btn-accesibilidad-fijo';
    boton.innerHTML = '♿<span id="contador-activas">0</span>';
    
    var panel = document.createElement('div');
    panel.id = 'panel-accesibilidad-fijo';
    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <strong>Accesibilidad</strong>
            <button onclick="window.toggleMenuAcc()" style="cursor:pointer; border:none; background:none; font-size:20px;">×</button>
        </div>
        <button class="btn-acc-opcion" onclick="window.toggleModoOscuro()" data-opcion="oscuro">Modo Oscuro</button>
        <button class="btn-acc-opcion" onclick="window.toggleContrasteAlto()" data-opcion="contraste">Alto Contraste</button>
        <button class="btn-acc-opcion" onclick="window.toggleFuenteDislexia()" data-opcion="dislexia">Fuente Dislexia</button>
        <button class="btn-acc-opcion" style="background:#333; color:white; margin-top:10px" onclick="window.resetTodo()">Restablecer todo</button>
    `;

    document.body.appendChild(boton);
    document.body.appendChild(panel);

    // 3. Lógica Global
    window.toggleMenuAcc = function() {
        var p = document.getElementById('panel-accesibilidad-fijo');
        p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    };

    window.toggleModoOscuro = function() { toggleClase('oscuro', 'modo-oscuro'); };
    window.toggleContrasteAlto = function() { toggleClase('contraste', 'modo-contraste-alto'); };
    window.toggleFuenteDislexia = function() { toggleClase('dislexia', 'fuente-dislexia'); };

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
        ['modo-oscuro', 'modo-contraste-alto', 'fuente-dislexia'].forEach(c => document.documentElement.classList.remove(c));
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

})();
