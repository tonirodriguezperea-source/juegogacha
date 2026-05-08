// Aseguramos que la variable exista globalmente al cargar
window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };

function renderMochila() {
    console.log("Ejecutando renderMochila..."); 
    
    // Sincronizamos con el estado actual
    const grid = document.getElementById('mochila-grid');
    if (!grid) return;

    grid.innerHTML = ""; 

    if (!window.mochila || window.mochila.caramelo_raro <= 0) {
        grid.innerHTML = `
            <div style="text-align:center; width:100%; padding:40px; color:#94a3b8;">
                <p style="font-size:1.2rem;">🎒 Tu mochila está vacía</p>
                <button onclick="mostrar('tienda')" style="margin-top:10px; background:#facc15; color:black; border:none; padding:8px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">IR A LA TIENDA</button>
            </div>`;
        return;
    }

    grid.innerHTML = `
        <div style="background: #1a1a2e; border: 2px solid #facc15; padding: 20px; border-radius: 20px; text-align: center; width: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); margin: 10px;">
            <div style="font-size: 3rem; margin-bottom: 10px; filter: drop-shadow(0 0 5px #facc15);">🍬</div>
            <h3 style="color: white; margin: 5px 0;">Caramelo Raro</h3>
            <div style="background: #facc15; color: black; display: inline-block; padding: 5px 15px; border-radius: 10px; font-weight: bold; font-size: 1.2rem; margin: 10px 0;">
                x${window.mochila.caramelo_raro}
            </div>
            <p style="color: #94a3b8; font-size: 0.75rem; margin-top: 5px;">Úsalo en el menú de Equipo para subir nivel.</p>
        </div>
    `;
}

window.renderMochila = renderMochila;

window.añadirObjeto = function(tipo, cantidad) {
    if (!window.mochila) window.mochila = { caramelo_raro: 0 };
    
    // 1. Sumamos la cantidad
    window.mochila[tipo] = (window.mochila[tipo] || 0) + cantidad;
    
    // 2. Guardamos localmente
    localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
    
    // 3. ¡IMPORTANTE! Guardamos en la nube (Firebase)
    if (typeof guardar === 'function') guardar(); 

    // 4. Refrescamos visualmente
    if (typeof actualizarHUD === 'function') actualizarHUD();
    if (typeof renderMochila === 'function') renderMochila();

    console.log(`✅ Objeto añadido: ${tipo}. Total: ${window.mochila[tipo]}`);
};

window.usarCaramelo = function(uid) {
    if (!window.mochila || window.mochila.caramelo_raro <= 0) {
        alert("¡No tienes caramelos!");
        return;
    }

    const p = window.inventario.find(item => item.uid === uid);
    if (p) {
        if ((parseInt(p.lvl) || 1) >= 100) {
            alert("¡Este Pokémon ya está al nivel máximo!");
            return;
        }

        // Aplicar subida
        p.lvl = (parseInt(p.lvl) || 1) + 1;
        p.ataque = (parseInt(p.ataque) || 10) + 5;
        p.vidaMax = (parseInt(p.vidaMax) || 50) + 15;
        p.hp = p.vidaMax; 

        // Restamos el caramelo de la variable global
        window.mochila.caramelo_raro--;
        
        // Guardamos todo (LocalStorage + Firebase)
        localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
        if (typeof guardar === 'function') guardar(); 

        // Refresco visual
        if (typeof actualizarHUD === 'function') actualizarHUD();
        
        const overlay = document.getElementById('overlay-copias');
        if (overlay) overlay.remove();
        
        if (typeof abrirMenuCopias === 'function') {
            abrirMenuCopias(p.id); 
        }
    }
};