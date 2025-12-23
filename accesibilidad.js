(function() {
    var style = document.createElement('style');
    style.textContent = '#btn-accesibilidad-fijo{position:fixed!important;bottom:20px!important;right:20px!important;z-index:999999!important;background:linear-gradient(135deg,#E37C3A 0%,#d96b2a 100%)!important;color:white!important;border:none!important;border-radius:50%!important;width:65px!important;height:65px!important;font-size:32px!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0px 6px 20px rgba(227,124,58,0.4)!important;transition:all 0.3s ease!important;-webkit-tap-highlight-color:transparent!important;touch-action:manipulation!important;user-select:none!important;-webkit-user-select:none!important}#btn-accesibilidad-fijo:hover{transform:scale(1.1)!important;box-shadow:0px 8px 25px rgba(227,124,58,0.6)!important}#btn-accesibilidad-fijo:active{transform:scale(0.95)!important}#contador-activas{position:absolute!important;top:-5px!important;right:-5px!important;background:#ff4444!important;color:white!important;border-radius:50%!important;width:24px!important;height:24px!important;display:none!important;align-items:center!important;justify-content:center!important;font-size:12px!important;font-weight:bold!important;border:2px solid white!important}#panel-accesibilidad-fijo{display:none;position:fixed!important;bottom:100px!important;right:20px!important;z-index:999999!important;background:white!important;padding:20px!important;border-radius:15px!important;box-shadow:0px 10px 40px rgba(0,0,0,0.2)!important;width:280px!important;max-height:80vh!important;overflow-y:auto!important;border:3px solid #E37C3A!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;animation:slideIn 0.3s ease!important}@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.acc-header{display:flex!important;justify-content:space-between!important;align-items:center!important;margin-bottom:15px!important;padding-bottom:10px!important;border-bottom:2px solid #E37C3A!important}.acc-header strong{color:#E37C3A!important;font-size:18px!important}.acc-close{background:none!important;border:none!important;font-size:24px!important;cursor:pointer!important;color:#666!important;padding:0!important;width:30px!important;height:30px!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:50%!important;transition:all 0.2s!important}.acc-close:hover{background:#f0f0f0!important;color:#333!important}.acc-section{margin-bottom:15px!important}.acc-section-title{font-size:12px!important;color:#666!important;text-transform:uppercase!important;font-weight:bold!important;margin-bottom:8px!important;letter-spacing:0.5px!important}.btn-acc-opcion{width:100%!important;margin-bottom:8px!important;padding:12px 15px!important;cursor:pointer!important;background:#f8f8f8!important;border:2px solid #e0e0e0!important;border-radius:8px!important;font-weight:600!important;color:#333!important;transition:all 0.2s ease!important;display:flex!important;align-items:center!important;justify-content:space-between!important;font-size:14px!important}.btn-acc-opcion:hover{background:#E37C3A!important;color:white!important;border-color:#E37C3A!important;transform:translateX(-3px)!important}.btn-acc-opcion.activo{background:#d4edda!important;border-color:#28a745!important;color:#155724!important}.btn-acc-opcion .icono{font-size:18px!important;margin-right:8px!important}.btn-acc-opcion .check{display:none!important;color:#28a745!important;font-weight:bold!important}.btn-acc-opcion.activo .check{display:inline!important}.btn-reset{background:linear-gradient(135deg,#333 0%,#222 100%)!important;color:white!important;border-color:#333!important;margin-top:10px!important}.btn-reset:hover{background:linear-gradient(135deg,#555 0%,#444 100%)!important;border-color:#555!important}.zoom-controls{display:flex!important;gap:8px!important}.zoom-controls button{flex:1!important}.modo-contraste-alto{filter:contrast(1.5)!important}.modo-oscuro{filter:invert(1) hue-rotate(180deg)!important}.enlaces-resaltados a{text-decoration:underline!important;text-decoration-thickness:2px!important;text-underline-offset:3px!important}.fuente-dislexia *{font-family:"Comic Sans MS","OpenDyslexic",cursive!important;letter-spacing:0.1em!important}.espaciado-aumentado *{line-height:2!important;letter-spacing:0.05em!important}.animaciones-pausadas *{animation-play-state:paused!important;transition:none!important}@media (max-width:768px){#btn-accesibilidad-fijo{width:60px!important;height:60px!important;bottom:15px!important;right:15px!important;font-size:28px!important;z-index:9999999!important}#panel-accesibilidad-fijo{width:calc(100vw - 40px)!important;right:20px!important;left:20px!important;bottom:85px!important}}';
    document.head.appendChild(style);
    
    var boton = document.createElement('button');
    boton.id = 'btn-accesibilidad-fijo';
    boton.setAttribute('onclick', 'window.toggleMenuAcc()');
    boton.setAttribute('aria-label', 'Menú de accesibilidad');
    boton.innerHTML = '♿<span id="contador-activas">0</span>';
    
    var panel = document.createElement('div');
    panel.id = 'panel-accesibilidad-fijo';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Panel de accesibilidad');
    panel.innerHTML = '<div class="acc-header"><strong>♿ Accesibilidad</strong><button class="acc-close" onclick="window.toggleMenuAcc()" aria-label="Cerrar menú">×</button></div><div class="acc-section"><div class="acc-section-title">📏 Tamaño de texto</div><div class="zoom-controls"><button class="btn-acc-opcion" onclick="window.cambiarZoom(0.9)" data-opcion="zoom-menos"><span><span class="icono">➖</span> Reducir</span></button><button class="btn-acc-opcion" onclick="window.cambiarZoom(1)" data-opcion="zoom-normal"><span><span class="icono">🏠</span> Normal</span></button><button class="btn-acc-opcion" onclick="window.cambiarZoom(1.2)" data-opcion="zoom-mas"><span><span class="icono">➕</span> Aumentar</span></button></div></div><div class="acc-section"><div class="acc-section-title">🎨 Visual</div><button class="btn-acc-opcion" onclick="window.toggleContrasteAlto()" data-opcion="contraste"><span><span class="icono">🌗</span> Alto contraste</span><span class="check">✓</span></button><button class="btn-acc-opcion" onclick="window.toggleModoOscuro()" data-opcion="oscuro"><span><span class="icono">🌙</span> Modo oscuro</span><span class="check">✓</span></button><button class="btn-acc-opcion" onclick="window.toggleResaltarEnlaces()" data-opcion="enlaces"><span><span class="icono">🔗</span> Resaltar enlaces</span><span class="check">✓</span></button></div><div class="acc-section"><div class="acc-section-title">📖 Legibilidad</div><button class="btn-acc-opcion" onclick="window.toggleFuenteDislexia()" data-opcion="dislexia"><span><span class="icono">🔤</span> Fuente dislexia</span><span class="check">✓</span></button><button class="btn-acc-opcion" onclick="window.toggleEspaciado()" data-opcion="espaciado"><span><span class="icono">📏</span> Más espaciado</span><span class="check">✓</span></button></div><div class="acc-section"><div class="acc-section-title">⚡ Animaciones</div><button class="btn-acc-opcion" onclick="window.togglePausarAnimaciones()" data-opcion="animaciones"><span><span class="icono">⏸️</span> Pausar animaciones</span><span class="check">✓</span></button></div><button class="btn-acc-opcion btn-reset" onclick="window.resetTodo()"><span><span class="icono">🔄</span> Restablecer todo</span></button>';
    
    document.body.appendChild(boton);
    document.body.appendChild(panel);
    
    window.addEventListener('DOMContentLoaded', function() {
        cargarConfiguracion();
    });
    
    function cargarConfiguracion() {
        var zoom = localStorage.getItem('acc-zoom');
        if (zoom) {
            document.body.style.transform = 'scale(' + zoom + ')';
            document.body.style.transformOrigin = 'top center';
            marcarActivo('zoom-' + (zoom === '0.9' ? 'menos' : zoom === '1.2' ? 'mas' : 'normal'));
        }
        
        var opciones = ['contraste', 'oscuro', 'enlaces', 'dislexia', 'espaciado', 'animaciones'];
        opciones.forEach(function(opcion) {
            if (localStorage.getItem('acc-' + opcion) === 'activo') {
                aplicarOpcion(opcion, true);
            }
        });
        
        actualizarContador();
    }
    
    function marcarActivo(opcion) {
        var btn = document.querySelector('[data-opcion="' + opcion + '"]');
        if (btn) btn.classList.add('activo');
    }
    
    function aplicarOpcion(opcion, estado) {
        var clases = {
            'contraste': 'modo-contraste-alto',
            'oscuro': 'modo-oscuro',
            'enlaces': 'enlaces-resaltados',
            'dislexia': 'fuente-dislexia',
            'espaciado': 'espaciado-aumentado',
            'animaciones': 'animaciones-pausadas'
        };
        
        if (estado) {
            document.documentElement.classList.add(clases[opcion]);
            marcarActivo(opcion);
        } else {
            document.documentElement.classList.remove(clases[opcion]);
        }
    }
    
    window.toggleMenuAcc = function() {
        var panel = document.getElementById('panel-accesibilidad-fijo');
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    }
    
    window.cambiarZoom = function(valor) {
        document.body.style.transform = 'scale(' + valor + ')';
        document.body.style.transformOrigin = 'top center';
        localStorage.setItem('acc-zoom', valor);
        
        document.querySelectorAll('[data-opcion^="zoom-"]').forEach(function(btn) {
            btn.classList.remove('activo');
        });
        var sufijo = valor === 0.9 ? 'menos' : valor === 1.2 ? 'mas' : 'normal';
        marcarActivo('zoom-' + sufijo);
        
        actualizarContador();
    }
    
    window.toggleContrasteAlto = function() {
        toggleOpcion('contraste', 'modo-contraste-alto');
    }
    
    window.toggleModoOscuro = function() {
        toggleOpcion('oscuro', 'modo-oscuro');
    }
    
    window.toggleResaltarEnlaces = function() {
        toggleOpcion('enlaces', 'enlaces-resaltados');
    }
    
    window.toggleFuenteDislexia = function() {
        toggleOpcion('dislexia', 'fuente-dislexia');
    }
    
    window.toggleEspaciado = function() {
        toggleOpcion('espaciado', 'espaciado-aumentado');
    }
    
    window.togglePausarAnimaciones = function() {
        toggleOpcion('animaciones', 'animaciones-pausadas');
    }
    
    function toggleOpcion(nombre, clase) {
        var activo = document.documentElement.classList.toggle(clase);
        var btn = document.querySelector('[data-opcion="' + nombre + '"]');
        
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
        document.body.style.transform = 'scale(1)';
        
        var clases = ['modo-contraste-alto', 'modo-oscuro', 'enlaces-resaltados', 
                       'fuente-dislexia', 'espaciado-aumentado', 'animaciones-pausadas'];
        clases.forEach(function(clase) {
            document.documentElement.classList.remove(clase);
        });
        
        document.querySelectorAll('.btn-acc-opcion').forEach(function(btn) {
            btn.classList.remove('activo');
        });
        
        localStorage.clear();
        
        actualizarContador();
    }
    
    function actualizarContador() {
        var activas = document.querySelectorAll('.btn-acc-opcion.activo').length;
        var contador = document.getElementById('contador-activas');
        
        if (activas > 0) {
            contador.textContent = activas;
            contador.style.display = 'flex';
        } else {
            contador.style.display = 'none';
        }
    }
    
    document.addEventListener('click', function(event) {
        var panel = document.getElementById('panel-accesibilidad-fijo');
        var btn = document.getElementById('btn-accesibilidad-fijo');
        
        if (panel && !panel.contains(event.target) && !btn.contains(event.target)) {
            panel.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            var panel = document.getElementById('panel-accesibilidad-fijo');
            if (panel && panel.style.display === 'block') {
                panel.style.display = 'none';
            }
        }
    });
})();
