/** * GACHA SYSTEM 2.0  */

let monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
let ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 10;

window.invocar = function(saga) {
    if (ticketsNormales <= 100) {
        alert("¡No tienes tickets normales! Consigue más en batalla.");
        return;
    }

    let opcionesSaga = DB.filter(p => p.saga.toLowerCase().includes(saga.toLowerCase()));
    
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    
    let posibles = opcionesSaga.filter(p => p.rareza === rareza);
    if (posibles.length === 0) posibles = opcionesSaga; 
    
    const bichoConseguido = posibles[Math.floor(Math.random() * posibles.length)];

    ejecutarAnimacionGacha(saga, bichoConseguido);
};

function ejecutarAnimacionGacha(saga, personaje) {
    const overlay = document.getElementById('gacha-animacion');
    const objeto = document.getElementById('objeto-invocacion');
    const resultado = document.getElementById('resultado-invocacion');
    
    ticketsNormales--;
    guardarEconomia();
    
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    
    // Ajuste para detectar Pokémon aunque lleve tilde
    const esPokemon = saga.toLowerCase().includes('pokemon');
    const imgObjeto = esPokemon 
        ? "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
        : "https://upload.wikimedia.org/wikipedia/commons/b/b7/Dragon_Ball_4-star.svg";
    
    objeto.innerHTML = `<img src="${imgObjeto}" width="120" class="objeto-vibrando">`;

    setTimeout(() => {
        objeto.className = "objeto-explotando";
        
        setTimeout(() => {
            objeto.className = ""; // Limpiar clases
            objeto.innerHTML = "";
            resultado.style.display = 'block';
            
            const copias = inventario.filter(p => p.id === personaje.id).length;
            
            if (copias >= 10) {
                const premios = { comun: 10, raro: 50, epico: 200, legendario: 1000 };
                const valor = premios[personaje.rareza] || 10;
                monedas += valor;
                guardarEconomia();
                
                resultado.innerHTML = `
                    <div class="recompensa-monedas">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <p style="color:#ff4444; font-weight:bold;">¡MÁXIMO ALCANZADO (10/10)!</p>
                        <h3 style="color:#ffcc00">Compensación: +💰 ${valor} Monedas</h3>
                    </div>`;
            } else {
                const nuevo = { ...personaje, uid: "UID-" + Date.now(), lvl: 1 };
                inventario.push(nuevo);
                if (typeof guardar === 'function') guardar(); 
                
                resultado.innerHTML = `
                    <div class="nuevo-personaje">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h2 style="color:${RAREZAS[personaje.rareza]}">¡Has obtenido a ${personaje.nombre}!</h2>
                        <p style="letter-spacing: 2px;">${personaje.rareza.toUpperCase()}</p>
                    </div>`;
            }
            
            resultado.innerHTML += `<button onclick="cerrarGacha()" class="btn-cerrar-gacha">CONTINUAR</button>`;
            actualizarHUD();
        }, 600);
    }, 1500);
}

window.cerrarGacha = function() {
    document.getElementById('gacha-animacion').style.display = 'none';
    if (typeof renderLobby === 'function') renderLobby();
};

function guardarEconomia() {
    localStorage.setItem("gq_monedas", monedas);
    localStorage.setItem("gq_tk_normal", ticketsNormales);
}

// Función para actualizar los textos en la pantalla
window.actualizarHUD = function() {
    const elTickets = document.getElementById('val-tk-normal');
    if (elTickets) elTickets.innerText = ticketsNormales;
    
    // Si tienes un lugar donde mostrar monedas en el gacha, añádelo aquí
    const elMonedas = document.getElementById('val-monedas'); 
    if (elMonedas) elMonedas.innerText = monedas;
};