/** * GACHA SYSTEM 2.0  - Optimizado */

// Cargamos datos al inicio
let monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
let ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 10;

window.invocar = function(saga) {
    // 1. Sincronizar tickets desde el almacenamiento real
    ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;

    if (ticketsNormales <= 0) {
        alert("¡No tienes tickets normales! Consigue más en batalla.");
        return;
    }

    // 2. FILTRO ULTRA-REFORZADO
    const busquedaLimpia = saga.toLowerCase().replace(/\s/g, ""); 

    const poolSaga = DB.filter(p => {
        const sagaDBLimpia = p.saga.toLowerCase().replace(/\s/g, "");
        return sagaDBLimpia.includes(busquedaLimpia);
    });
    
    if (poolSaga.length === 0) {
        console.error("DEBUG GACHA: Buscaste:", busquedaLimpia);
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
    
    // Gasto de ticket inmediato
    ticketsNormales--;
    guardarEconomia();
    actualizarHUD(); 
    
    // Configurar vista inicial
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    objeto.style.display = 'flex';
    
    // Selección de imagen (Usando links estables)
    const esPkmn = saga.toLowerCase().includes('pokemon');
    const imgAnimacion = esPkmn 
        ? "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
        : "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg";

    objeto.innerHTML = `<img src="${imgAnimacion}" width="150" class="objeto-vibrando">`;

    // Fase 1: Vibración y Explosión
    setTimeout(() => {
        const img = objeto.querySelector('img');
        if (img) img.className = "objeto-explotando";
        
        // Fase 2: Mostrar Resultado
        setTimeout(() => {
            objeto.style.display = 'none';
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
                        <p style="color:#ff4444; font-weight:bold; font-size: 1.2rem;">¡MÁXIMO NIVEL ALCANZADO!</p>
                        <h3 style="color:#ffcc00; text-shadow: 0 0 10px rgba(255,204,0,0.5);">+💰 ${valor} Monedas</h3>
                    </div>`;
            } else {
                const nuevo = { ...personaje, uid: "UID-" + Date.now(), lvl: 1 };
                inventario.push(nuevo);
                if (typeof guardar === 'function') guardar(); 
                
                resultado.innerHTML = `
                    <div class="nuevo-personaje" style="text-align:center;">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h3 style="color: #94a3b8; margin:0;">¡HAS OBTENIDO A!</h3>
                        <h2 style="color:${RAREZAS[personaje.rareza]}; font-size: 2.2rem; margin: 10px 0;">${personaje.nombre}</h2>
                        <span style="background:${RAREZAS[personaje.rareza]}; color:black; padding: 5px 15px; border-radius: 20px; font-weight:bold;">
                            ${personaje.rareza.toUpperCase()}
                        </span>
                    </div>`;
            }
            
            resultado.innerHTML += `<br><button onclick="cerrarGacha()" class="nav-btn" style="margin-top:20px; cursor:pointer;">CONTINUAR</button>`;
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
    let tks = localStorage.getItem("gq_tk_normal") || 0;
    let mons = localStorage.getItem("gq_monedas") || 0;

    const spanTks = document.getElementById('val-tk-normal');
    if (spanTks) spanTks.innerText = tks;

    const spanMons = document.getElementById('val-monedas');
    if (spanMons) spanMons.innerText = mons;
    
    // Sincronizar variables de sesión
    ticketsNormales = parseInt(tks);
    monedas = parseInt(mons);
};