function renderMochila() {
    console.log("Dibujando mochila..."); // Verás esto en F12 si la función se ejecuta
    const grid = document.getElementById('mochila-grid');
    if (!grid) {
        console.error("No se encontró el elemento mochila-grid");
        return;
    }

    // Leemos la mochila del localStorage
    window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };

    if (window.mochila.caramelo_raro <= 0) {
        grid.innerHTML = `<p style="color:white;">No tienes objetos todavía.</p>`;
        return;
    }

    // Dibujamos el caramelo
    grid.innerHTML = `
        <div style="background: #1a1a2e; border: 2px solid #facc15; padding: 20px; border-radius: 20px; text-align: center; width: 200px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
            <div style="font-size: 3rem; margin-bottom: 10px;">🍬</div>
            <h3 style="color: white; margin: 5px 0;">Caramelo Raro</h3>
            <div style="background: #facc15; color: black; display: inline-block; padding: 5px 15px; border-radius: 10px; font-weight: bold; font-size: 1.2rem;">
                x${window.mochila.caramelo_raro}
            </div>
            <p style="color: #94a3b8; font-size: 0.75rem; margin-top: 10px;">Úsalo en el menú de Equipo para subir nivel.</p>
        </div>
    `;
}

// Función auxiliar para añadir caramelos (la usará la tienda)
window.añadirObjeto = function(tipo, cantidad) {
    if (!window.mochila) window.mochila = { caramelo_raro: 0 };
    window.mochila[tipo] = (window.mochila[tipo] || 0) + cantidad;
    localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
};

window.usarCaramelo = function(uid) {
    if (window.mochila.caramelo_raro <= 0) {
        alert("¡No tienes caramelos!");
        return;
    }

    const p = inventario.find(item => item.uid === uid);
    if (p) {
        p.lvl = (p.lvl || 1) + 1;
        
        // Subimos stats (esto arreglará los "undefined")
        p.ataque = (p.ataque || 10) + 2;
        p.vidaMax = (p.vidaMax || 50) + 5;
        p.vida = p.vidaMax;

        window.mochila.caramelo_raro--;
        
        localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
        guardar(); // Guarda el inventario de Pokémon
        
        // Cerramos el menú actual para refrescar los datos
        document.getElementById('overlay-copias').remove();
        abrirMenuCopias(p.id); 
        
        console.log(`${p.nombre} subió al nivel ${p.lvl}`);
    }
};