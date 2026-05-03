/** * GACHA SYSTEM 2.0  - Optimizado */

// Cargamos datos al inicio
let monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
let ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 10;

window.invocar = function(saga) {
    // 1. Sincronizar tickets
    ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;

    if (ticketsNormales <= 0) {
        alert("¡No tienes tickets normales!");
        return;
    }

    // 2. FILTRO ULTRA-REFORZADO
    // Convertimos todo a minúsculas y quitamos TODOS los espacios para comparar
    const busquedaLimpia = saga.toLowerCase().replace(/\s/g, ""); 

    const poolSaga = DB.filter(p => {
        // Hacemos lo mismo con el nombre de la saga en la base de datos
        const sagaDBLimpia = p.saga.toLowerCase().replace(/\s/g, "");
        return sagaDBLimpia.includes(busquedaLimpia);
    });
    
    // Si sigue fallando, esto nos dirá qué está pasando en la consola (F12)
    if (poolSaga.length === 0) {
        console.error("DEBUG GACHA:");
        console.log("Buscaste:", busquedaLimpia);
        console.log("Sagas disponibles en tu DB:", [...new Set(DB.map(p => p.saga))]);
        alert("No se han encontrado personajes de: " + saga);
        return;
    }

    // 3. SELECCIÓN DE RAREZA
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    
    let posibles = poolSaga.filter(p => p.rareza === rareza);
    if (posibles.length === 0) posibles = poolSaga; 
    
    const bichoConseguido = posibles[Math.floor(Math.random() * posibles.length)];

    ejecutarAnimacionGacha(saga, bichoConseguido);
};

function ejecutarAnimacionGacha(saga, personaje) {
    const overlay = document.getElementById('gacha-animacion');
    const objeto = document.getElementById('objeto-invocacion');
    const resultado = document.getElementById('resultado-invocacion');
    
    // Gasto de ticket
    ticketsNormales--;
    guardarEconomia();
    actualizarHUD(); // Actualizamos inmediatamente el contador
    
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    
    // Selección de imagen de invocación
    const esPokemon = saga.toLowerCase().includes('pokemon');
    const imgObjeto = esPokemon 
        ? "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
        : "https://e7.pngegg.com/pngimages/913/635/png-clipart-dragonball-shenron-dragon-ball-z-supersonic-warriors-bola-de-drac-goku-dragon-ball-television-fictional-characters-thumbnail.pnghttps://upload.wikimedia.org/wikipedia/commons/b/b7/Dragon_Ball_4-star.svg";
    
    objeto.innerHTML = `<img src="${imgObjeto}" width="120" class="objeto-vibrando">`;

    // Animación de salida
    setTimeout(() => {
        objeto.className = "objeto-explotando";
        
        setTimeout(() => {
            objeto.className = ""; 
            objeto.innerHTML = "";
            resultado.style.display = 'block';
            
            // Lógica de coleccionista (Máximo 10 copias)
            const copias = inventario.filter(p => p.id === personaje.id).length;
            
            if (copias >= 10) {
                const premios = { comun: 10, raro: 50, epico: 200, legendario: 1000 };
                const valor = premios[personaje.rareza] || 10;
                monedas += valor;
                guardarEconomia();
                
                resultado.innerHTML = `
                    <div class="recompensa-monedas">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <p style="color:#ff4444; font-weight:bold; font-size: 1.2rem;">¡MÁXIMO NIVEL ALCANZADO!</p>
                        <h3 style="color:#ffcc00; text-shadow: 0 0 10px rgba(255,204,0,0.5);">+💰 ${valor} Monedas</h3>
                    </div>`;
            } else {
                const nuevo = { ...personaje, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
                inventario.push(nuevo);
                if (typeof guardar === 'function') guardar(); 
                
                resultado.innerHTML = `
                    <div class="nuevo-personaje">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h3 style="color: #94a3b8; margin:0;">¡HAS OBTENIDO A!</h3>
                        <h2 style="color:${RAREZAS[personaje.rareza]}; font-size: 2rem; margin: 5px 0;">${personaje.nombre}</h2>
                        <span class="dex-badge" style="background:${RAREZAS[personaje.rareza]}; color:black; padding: 5px 15px; border-radius: 20px; font-weight:bold;">
                            ${personaje.rareza.toUpperCase()}
                        </span>
                    </div>`;
            }
            
            resultado.innerHTML += `<br><button onclick="cerrarGacha()" class="btn-play" style="margin-top:20px;">CONTINUAR</button>`;
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

window.actualizarHUD = function() {
    const elTickets = document.getElementById('val-tk-normal');
    if (elTickets) {
        elTickets.innerText = ticketsNormales;
    }
    
    const elMonedas = document.getElementById('val-monedas'); 
    if (elMonedas) {
        elMonedas.innerText = monedas;
    }
};