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
    // Volvemos a leer antes de sumar para no perder datos
    let mochilaActual = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };
    mochilaActual[tipo] = (mochilaActual[tipo] || 0) + cantidad;
    
    window.mochila = mochilaActual; // Actualizar variable en memoria
    localStorage.setItem("gq_mochila", JSON.stringify(mochilaActual));
    console.log("Objeto guardado:", tipo, cantidad);
};

window.usarCaramelo = function(uid) {
    // Sincronizar antes de usar
    window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };

    if (window.mochila.caramelo_raro <= 0) {
        alert("¡No tienes caramelos!");
        return;
    }

    const p = inventario.find(item => item.uid === uid);
    if (p) {
        p.lvl = (p.lvl || 1) + 1;
        p.ataque = (p.ataque || 10) + 2;
        p.vidaMax = (p.vidaMax || 50) + 5;
        p.vida = p.vidaMax;

        window.mochila.caramelo_raro--;
        
        localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
        if (typeof guardar === 'function') guardar(); 
        
        // Refresco visual
        const overlay = document.getElementById('overlay-copias');
        if (overlay) overlay.remove();
        
        if (typeof abrirMenuCopias === 'function') abrirMenuCopias(p.id); 
        console.log(`${p.nombre} subió al nivel ${p.lvl}`);
    }
};