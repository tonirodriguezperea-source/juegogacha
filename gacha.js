/** * GACHA SYSTEM 2.0 
 * Archivo independiente para gestionar invocaciones y economía
 */

// 1. VARIABLES DE ECONOMÍA (Si no están en otro sitio)
let monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
let ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 10;

// 2. FUNCIÓN PRINCIPAL DE INVOCACIÓN
window.invocar = function(saga) {
    if (ticketsNormales <= 0) {
        alert("¡No tienes tickets normales! Consigue más en batalla.");
        return;
    }

    // Filtrar personajes de la DB por la saga elegida
    let opcionesSaga = DB.filter(p => p.saga.toLowerCase().includes(saga.toLowerCase()));
    
    // Probabilidades: Legendario 2%, Épico 8%, Raro 20%, Común 70%
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    
    let posibles = opcionesSaga.filter(p => p.rareza === rareza);
    if (posibles.length === 0) posibles = opcionesSaga; // Por si una saga no tiene esa rareza
    
    const bichoConseguido = posibles[Math.floor(Math.random() * posibles.length)];

    // Iniciar la parte visual
    ejecutarAnimacionGacha(saga, bichoConseguido);
};

// 3. LÓGICA DE LA ANIMACIÓN Y REVELACIÓN
function ejecutarAnimacionGacha(saga, personaje) {
    const overlay = document.getElementById('gacha-animacion');
    const objeto = document.getElementById('objeto-invocacion');
    const resultado = document.getElementById('resultado-invocacion');
    
    // Gastar ticket y guardar
    ticketsNormales--;
    guardarEconomia();
    
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    
    // Elegir imagen: Pokéball o Esfera
    const imgObjeto = saga === 'pokemon' 
        ? "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
        : "https://upload.wikimedia.org/wikipedia/commons/b/b7/Dragon_Ball_4-star.svg";
    
    objeto.innerHTML = `<img src="${imgObjeto}" width="120">`;
    objeto.className = "objeto-vibrando";

    // Fase 1: Vibración
    setTimeout(() => {
        objeto.className = "objeto-explotando";
        
        // Fase 2: Revelación
        setTimeout(() => {
            objeto.innerHTML = "";
            resultado.style.display = 'block';
            
            // Lógica de 10 copias (Compensación)
            const copias = inventario.filter(p => p.id === personaje.id).length;
            
            if (copias >= 10) {
                const premios = { comun: 10, raro: 50, epico: 200, legendario: 1000 };
                const valor = premios[personaje.rareza];
                monedas += valor;
                guardarEconomia();
                
                resultado.innerHTML = `
                    <div class="recompensa-monedas">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <p style="color:#ff4444">¡MÁXIMO ALCANZADO (10/10)!</p>
                        <h3 style="color:#ffcc00">+💰 ${valor} Monedas</h3>
                    </div>`;
            } else {
                // Añadir al inventario real
                const nuevo = { ...personaje, uid: "UID-" + Date.now(), lvl: 1 };
                inventario.push(nuevo);
                if (typeof guardar === 'function') guardar(); // Llama al guardar de logic.js
                
                resultado.innerHTML = `
                    <div class="nuevo-personaje">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h2 style="color:${RAREZAS[personaje.rareza]}">${personaje.nombre}</h2>
                        <p>${personaje.rareza.toUpperCase()}</p>
                    </div>`;
            }
            
            resultado.innerHTML += `<button onclick="cerrarGacha()" class="btn-cerrar-gacha">CONTINUAR</button>`;
            actualizarHUD();
        }, 600);
    }, 1500);
}

// 4. UTILIDADES
window.cerrarGacha = function() {
    document.getElementById('gacha-animacion').style.display = 'none';
    if (typeof renderLobby === 'function') renderLobby();
};

function guardarEconomia() {
    localStorage.setItem("gq_monedas", monedas);
    localStorage.setItem("gq_tk_normal", ticketsNormales);
}