// Aseguramos que la variable exista globalmente al cargar
window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };

function renderMochila() {
    console.log("Ejecutando renderMochila..."); 
    
    // FORZAR LECTURA: Esto es vital para que si compraste en la tienda, el dato aparezca aquí
    window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };
    
    const grid = document.getElementById('mochila-grid');
    if (!grid) {
        console.error("Error crítico: No existe 'mochila-grid' en el HTML");
        return;
    }

    grid.innerHTML = ""; // Limpiar antes de dibujar

    if (window.mochila.caramelo_raro <= 0) {
        grid.innerHTML = `
            <div style="text-align:center; width:100%; padding:40px; color:#94a3b8;">
                <p style="font-size:1.2rem;">🎒 Tu mochila está vacía</p>
                <button onclick="mostrar('tienda')" style="margin-top:10px; background:#facc15; color:black; border:none; padding:8px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">IR A LA TIENDA</button>
            </div>`;
        return;
    }

    // Dibujamos el caramelo
    grid.innerHTML = `
        <div style="background: #1a1a2e; border: 2px solid #facc15; padding: 20px; border-radius: 20px; text-align: center; width: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); margin: 10px;">
            <div style="font-size: 3rem; margin-bottom: 10px; filter: drop-shadow(0 0 5px #facc15);">🍬</div>
            <h3 style="color: white; margin: 5px 0; font-family: sans-serif;">Caramelo Raro</h3>
            <div style="background: #facc15; color: black; display: inline-block; padding: 5px 15px; border-radius: 10px; font-weight: bold; font-size: 1.2rem; margin: 10px 0;">
                x${window.mochila.caramelo_raro}
            </div>
            <p style="color: #94a3b8; font-size: 0.75rem; margin-top: 5px;">Úsalo en el menú de Equipo para subir nivel.</p>
        </div>
    `;
}

// Globalizamos para que logic.js y tienda.js la vean siempre
window.renderMochila = renderMochila;

window.añadirObjeto = function(tipo, cantidad) {
    // 1. Leemos la mochila del disco duro
    let mochilaActual = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };
    
    // 2. Sumamos la cantidad
    mochilaActual[tipo] = (mochilaActual[tipo] || 0) + cantidad;
    
    // 3. ACTUALIZACIÓN CRÍTICA: 
    // Si lo que añadimos es un caramelo, actualizamos también la variable ticketsNormales
    // para que la Tienda y el HUD se enteren al instante.
    if (tipo === 'caramelo_raro') {
        window.ticketsNormales = mochilaActual[tipo];
        localStorage.setItem("gq_tk_normal", window.ticketsNormales);
    }
    
    // 4. Guardamos la mochila
    window.mochila = mochilaActual; 
    localStorage.setItem("gq_mochila", JSON.stringify(mochilaActual));
    
    // 5. Refrescamos visualmente todo
    if (typeof actualizarHUD === 'function') actualizarHUD();
    if (typeof renderMochila === 'function') renderMochila();

    console.log(`✅ Objeto añadido: ${tipo}. Nueva cantidad: ${mochilaActual[tipo]}`);
};

window.usarCaramelo = function(uid) {
    // 1. Sincronizar con el disco duro (LocalStorage)
    window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };

    // 2. Comprobar si hay caramelos
    if (window.mochila.caramelo_raro <= 0) {
        alert("¡No tienes caramelos!");
        return;
    }

    const p = inventario.find(item => item.uid === uid);
    if (p) {
        // --- EL FRENO DEL NIVEL 100 ---
        if ((p.lvl || 1) >= 100) {
            alert("¡Este Pokémon ya está al nivel máximo!");
            return;
        }

        // 3. Aplicar subida
        p.lvl = (parseInt(p.lvl) || 1) + 1;
        
        // Mejora de stats (un poco más equilibrada)
        p.ataque = (p.ataque || 10) + 5;
        p.vidaMax = (p.vidaMax || 50) + 15;
        p.vida = p.vidaMax;

        // 4. RESTAR Y GUARDAR (Lo más importante)
        window.mochila.caramelo_raro--;
        localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
        
        // 5. Guardar el inventario de Pokémon (el nivel nuevo)
        if (typeof guardar === 'function') {
            guardar(); 
        }

        // 6. Refresco visual total
        const overlay = document.getElementById('overlay-copias');
        if (overlay) overlay.remove();
        
        // Si tienes la función para abrir el panel, lo reabrimos para ver los cambios
        if (typeof abrirMenuCopias === 'function') {
            abrirMenuCopias(p.id); 
        }

        console.log(`🍬 Caramelo usado. Nivel: ${p.lvl}. Quedan: ${window.mochila.caramelo_raro}`);
    }
};