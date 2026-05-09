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
    
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    objeto.style.display = 'flex';
    
    // Si es secreta, la estrella brilla en ROJO
    const colorEstrella = personaje.rareza === "Secreta" ? "#ff4d4d" : "#f59e0b";

    objeto.innerHTML = `
        <div id="estrella-deseo" class="objeto-vibrando" style="font-size: 100px; filter: drop-shadow(0 0 30px ${colorEstrella});">
            ⭐
        </div>`;

    setTimeout(() => {
        const estrella = document.getElementById('estrella-deseo');
        if (estrella) {
            estrella.style.transition = "all 0.5s ease-out";
            estrella.style.transform = "scale(2.5)";
            estrella.style.opacity = "0";
        }
        
        setTimeout(() => {
            objeto.style.display = 'none';
            resultado.style.display = 'block';
            
            // --- LÓGICA DE COPIAS CORREGIDA ---
            const copias = inventario.filter(p => parseInt(p.id) === parseInt(personaje.id)).length;
            
            if (copias >= 10) {
                // AÑADIDA "Secreta" a los premios para que no de error
                const premios = { comun: 100, raro: 250, epico: 600, legendario: 1500, Secreta: 3000 };
                const valor = premios[personaje.rareza] || 100;
                monedas += valor;
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h3 style="color:#ff4444; margin-top:10px;">DESEO REPETIDO</h3>
                        <p style="color:#94a3b8;">Ya tienes el máximo de copias de este bicho.</p>
                        <h2 style="color:#eab308;">+💰 ${valor} Monedas</h2>
                    </div>`;
            } else {
                // AÑADIR AL INVENTARIO
                const bichoConseguido = {
                    ...personaje, 
                    uid: "UID-" + Date.now() + Math.random().toString(36).substr(2, 5),
                    lvl: 1,
                    xp: 0,
                    estrellas: 0 
                };
                inventario.push(bichoConseguido);
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        <div style="transform: scale(1.8); margin-bottom: 30px;">
                            ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        </div>
                        <h3 style="color: #94a3b8; margin:0; letter-spacing: 3px;">${personaje.rareza === "Secreta" ? "¡¡REVELACIÓN SECRETA!!" : "¡NUEVO DESEO!"}</h3>
                        <h2 style="color:${RAREZAS[personaje.rareza] || '#ff4d4d'}; font-size: 2.5rem; margin: 15px 0;">
                            ${personaje.nombre}
                        </h2>
                    </div>`;
            }
            
            resultado.innerHTML += `<br><button onclick="cerrarGacha()" class="nav-btn" style="margin-top:30px; background:#f59e0b; color:black; padding:12px 40px; border-radius:10px; font-weight:bold; cursor:pointer;">CONTINUAR</button>`;
            
            // GUARDADO FINAL EN FIREBASE Y LOCAL
            guardar(); 
            actualizarHUD();
            if (typeof avanzarMision === 'function') avanzarMision('gacha_3', 1); 
        }, 600);
    }, 1800);
}