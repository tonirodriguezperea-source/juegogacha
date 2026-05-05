// Aseguramos que la mochila exista al cargar el script
window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };

function renderMochila() {
    const grid = document.getElementById('mochila-grid');
    if (!grid) return;

    // Limpiamos el grid antes de dibujar
    grid.innerHTML = "";

    // Si no tienes caramelos, mostramos un mensaje vacío
    if (window.mochila.caramelo_raro === 0) {
        grid.innerHTML = `
            <div style="color: #666; text-align: center; width: 100%; margin-top: 50px;">
                <p>Tu mochila está vacía...</p>
                <button onclick="mostrar('tienda')" style="background: #eab308; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">Ir a la Tienda</button>
            </div>`;
        return;
    }

    // Dibujamos la carta del Caramelo Raro
    grid.innerHTML = `
        <div class="card-objeto" style="background: #1a1a2e; border: 2px solid #facc15; padding: 20px; border-radius: 20px; text-align: center; width: 220px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); position: relative;">
            <div style="font-size: 3.5rem; margin-bottom: 10px; filter: drop-shadow(0 0 10px #facc15);">🍬</div>
            <h3 style="color: white; margin: 10px 0;">Caramelo Raro</h3>
            <p style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 15px;">Aumenta el nivel de un Pokémon en 1.</p>
            
            <div style="background: #facc15; color: #1a1a2e; font-size: 1.5rem; font-weight: bold; border-radius: 10px; padding: 5px 15px; display: inline-block;">
                x${window.mochila.caramelo_raro}
            </div>

            <div style="margin-top: 15px; font-size: 0.7rem; color: #4ade80; font-style: italic;">
                Úsalo desde el equipo para subir niveles.
            </div>
        </div>
    `;
}

// Función auxiliar para añadir caramelos (la usará la tienda)
window.añadirObjeto = function(tipo, cantidad) {
    if (!window.mochila) window.mochila = { caramelo_raro: 0 };
    window.mochila[tipo] = (window.mochila[tipo] || 0) + cantidad;
    localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
};