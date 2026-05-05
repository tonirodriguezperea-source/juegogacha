window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };

function renderMochila() {
    const grid = document.getElementById('mochila-grid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="card-tienda" style="background: #1a1a2e; border: 1px solid #facc15; padding: 20px; border-radius: 15px; text-align: center; width: 200px; margin: 0 auto;">
            <div style="font-size: 3rem;">🍬</div>
            <h3 style="color: white;">Caramelo Raro</h3>
            <p style="color: #94a3b8; font-size: 0.8rem;">Úsalo desde el menú de cada Pokémon en tu Equipo.</p>
            <div style="font-size: 1.5rem; color: #facc15; font-weight: bold;">x${window.mochila.caramelo_raro}</div>
        </div>
    `;
}

// Modifica tu función mostrar() en logic.js para que llame a renderMochila()
// ejemplo: if(pantalla === 'inventario-objetos') renderMochila();