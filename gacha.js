/** * GACHA SYSTEM 2.0 - Corregido para Rareza Secreta */

window.invocar = function(saga) {
    window.ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;

    if (window.ticketsNormales <= 0) {
        alert("¡No tienes tickets! Consigue más en la tienda o en batalla.");
        return;
    }

    const busquedaLimpia = saga.toLowerCase().replace(/\s/g, ""); 
    const poolSaga = DB.filter(p => {
        const sagaDBLimpia = p.saga.toLowerCase().replace(/\s/g, "");
        return sagaDBLimpia.includes(busquedaLimpia);
    });
    
    if (poolSaga.length === 0) {
        alert("No se han encontrado personajes de: " + saga);
        return;
    }

    const rand = Math.random() * 100;
    let rareza;

    if (rand <= 1) {
        rareza = "Secreta";      // 1% Megas
    } else if (rand <= 3) {
        rareza = "legendario";   // 2%
    } else if (rand <= 10) {
        rareza = "epico";        // 7%
    } else if (rand <= 30) {
        rareza = "raro";         // 20%
    } else {
        rareza = "comun";        // 70%
    }
    
    let posibles = poolSaga.filter(p => p.rareza === rareza);

    if (posibles.length === 0) {
        posibles = poolSaga.filter(p => p.rareza === "comun") || poolSaga;
    }
    
    const bichoBase = posibles[Math.floor(Math.random() * posibles.length)];

    window.ticketsNormales--; 
    localStorage.setItem("gq_tk_normal", window.ticketsNormales);

    // Sincronización inmediata antes de la animación
    if (typeof guardar === 'function') { guardar(); }
    if (typeof actualizarHUD === 'function') { actualizarHUD(); }
    
    ejecutarAnimacionGacha(saga, bichoBase);
};

function ejecutarAnimacionGacha(saga, personaje) {
    const overlay = document.getElementById('gacha-animacion');
    const objeto = document.getElementById('objeto-invocacion');
    const resultado = document.getElementById('resultado-invocacion');
    
    // --- SOLUCIÓN AL NOMBRE DE LA BASE DE DATOS ---
    // Si PERSONAJES no existe, intentamos usar DB (que es como lo tienes en tu archivo)
    if (!window.PERSONAJES && typeof DB !== 'undefined') {
        window.PERSONAJES = DB;
    }

    // --- MEJORA DE SEGURIDAD 1: Evitar el cuelgue inicial ---
    if (!personaje) {
        console.error("Error: El personaje es undefined. Cancelando gacha para evitar pantalla negra.");
        if (overlay) overlay.style.display = 'none';
        return;
    }

    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    objeto.style.display = 'flex';
    
    const colorEfecto = personaje.rareza === "Secreta" ? "#ff4d4d" : "#f59e0b";
    objeto.innerHTML = `<div id="estrella-deseo" class="objeto-vibrando" style="font-size:100px; filter:drop-shadow(0 0 30px ${colorEfecto});">⭐</div>`;

    setTimeout(() => {
        const est = document.getElementById('estrella-deseo');
        if (est) { est.style.transform = "scale(2.5)"; est.style.opacity = "0"; }
        
        setTimeout(() => {
            objeto.style.display = 'none';
            resultado.style.display = 'block';
            
            // 1. COMPROBACIÓN DE SEGURIDAD
            if (!window.inventario) window.inventario = [];

            // --- MEJORA DE SEGURIDAD 2: Asegurar que ID existe antes de filtrar ---
            const personajeId = personaje.id || 0;
            const copias = window.inventario.filter(p => p && parseInt(p.id) === parseInt(personajeId)).length;
            
            if (copias >= 10) {
                const premios = { comun: 100, raro: 250, epico: 600, legendario: 1500, Secreta: 3000 };
                const valor = premios[personaje.rareza] || 100;
                window.monedas += (window.monedas || 0) + valor;
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        ${typeof obtenerImagenHTML === 'function' ? obtenerImagenHTML(personaje, "sprite-revelado") : `<img src="${personaje.sprite}" class="sprite-revelado">`}
                        <h3 style="color:#ff4444;">REPETIDO</h3>
                        <h2 style="color:#eab308;">+💰 ${valor}</h2>
                    </div>`;
            } else {
                // 2. AÑADIR AL INVENTARIO
                const bichoNuevo = { 
                    ...personaje, 
                    uid: "UID-" + Date.now() + Math.random().toString(36).substr(2, 4), 
                    lvl: 1, 
                    xp: 0, 
                    estrellas: 0 
                };
                window.inventario.push(bichoNuevo);
                
                // --- MEJORA DE SEGURIDAD 3: Color por defecto ---
                let colorNombre = '#ff4d4d';
                if (typeof RAREZAS !== 'undefined' && RAREZAS[personaje.rareza]) {
                    colorNombre = RAREZAS[personaje.rareza];
                }

                resultado.innerHTML = `
                    <div style="text-align:center;">
                        <div style="transform:scale(1.6); margin-bottom:20px;">
                            ${typeof obtenerImagenHTML === 'function' ? obtenerImagenHTML(personaje, "sprite-revelado") : `<img src="${personaje.sprite}" class="sprite-revelado">`}
                        </div>
                        <h3 style="color:#94a3b8;">${personaje.rareza === "Secreta" ? "¡REVELACIÓN SECRETA!" : "¡NUEVO DESEO!"}</h3>
                        <h2 style="color:${colorNombre}; font-size:2rem;">${personaje.nombre}</h2>
                    </div>`;
            }

            resultado.innerHTML += `
                <button onclick="window.cerrarGacha()" class="nav-btn" style="margin-top:20px; background:#f59e0b; color:black; padding:12px 30px; border-radius:10px; font-weight:bold; cursor:pointer; border:none;">
                    CONTINUAR
                </button>`;

            // 3. GUARDADO CRÍTICO
            localStorage.setItem("gq_inv", JSON.stringify(window.inventario));
            
            if (typeof window.guardar === 'function') { 
                window.guardar(); 
            }
            
            if (typeof actualizarHUD === 'function') {
                actualizarHUD();
            }
            
        }, 600);
    }, 1200);
}

// Asegúrate de que esta función esté fuera para que el botón la vea
window.cerrarGacha = function() {
    console.log("Cerrando y forzando guardado final...");
    
    // 1. Guardado de seguridad en el navegador (Local)
    localStorage.setItem("gq_inventario", JSON.stringify(window.inventario));
    localStorage.setItem("gq_tk_normal", window.ticketsNormales);
    localStorage.setItem("gq_monedas", window.monedas);

    // 2. Intentar guardado en Firebase (Nube)
    if (typeof window.guardar === 'function') {
        window.guardar();
    }

    // 3. Cerrar interfaz
    const overlay = document.getElementById('gacha-animacion');
    if (overlay) overlay.style.display = 'none';
    
    if (typeof mostrar === 'function') mostrar('equipo');
};