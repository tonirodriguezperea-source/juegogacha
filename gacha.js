/** * GACHA SYSTEM 2.0 - Corregido (Sin duplicados y con límite real) */

window.invocar = function(saga) {
    // 1. Sincronizar tickets
    ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;

    if (ticketsNormales <= 0) {
        alert("¡No tienes tickets! Consigue más en la tienda o en batalla.");
        return;
    }

    // 2. Filtro de Saga
    const busquedaLimpia = saga.toLowerCase().replace(/\s/g, ""); 
    const poolSaga = DB.filter(p => {
        const sagaDBLimpia = p.saga.toLowerCase().replace(/\s/g, "");
        return sagaDBLimpia.includes(busquedaLimpia);
    });
    
    if (poolSaga.length === 0) {
        alert("No se han encontrado personajes de: " + saga);
        return;
    }

    // 3. Selección de Rareza
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    
    let posibles = poolSaga.filter(p => p.rareza === rareza);
    if (posibles.length === 0) posibles = poolSaga; 
    
    const bichoBase = posibles[Math.floor(Math.random() * posibles.length)];

    // --- IMPORTANTE: GASTAR TICKET AQUÍ Y GUARDAR ---
    ticketsNormales--; 
    localStorage.setItem("gq_tk_normal", ticketsNormales);
    
    // Lanzamos la animación y ella se encarga de guardar el bicho (o las monedas)
    ejecutarAnimacionGacha(saga, bichoBase);
};

function ejecutarAnimacionGacha(saga, personaje) {
    const overlay = document.getElementById('gacha-animacion');
    const objeto = document.getElementById('objeto-invocacion');
    const resultado = document.getElementById('resultado-invocacion');
    
    actualizarHUD(); 
    
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    objeto.style.display = 'flex';
    
    objeto.innerHTML = `
        <div id="estrella-deseo" class="objeto-vibrando" style="font-size: 100px; filter: drop-shadow(0 0 20px #f59e0b);">
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
            
            // --- LÓGICA DE COPIAS (CORREGIDA) ---
            const copias = inventario.filter(p => parseInt(p.id) === parseInt(personaje.id)).length;
            
            if (copias >= 10) {
                // Si ya tiene 10, le damos monedas
                const premios = { comun: 100, raro: 250, epico: 600, legendario: 1500 };
                const valor = premios[personaje.rareza] || 100;
                monedas += valor;
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h3 style="color:#ff4444; margin-top:10px;">DESEO REPETIDO</h3>
                        <p style="color:#94a3b8;">Ya tienes 10 copias de este héroe.</p>
                        <h2 style="color:#eab308;">+💰 ${valor} Monedas</h2>
                    </div>`;
            } else {
                // Si tiene menos de 10, lo añadimos al inventario REALMENTE
                const bichoConseguido = {
                    ...personaje, 
                    uid: "UID-" + Date.now() + Math.random().toString(36).substr(2, 5),
                    lvl: 1,
                    estrellas: 0 
                };
                inventario.push(bichoConseguido);
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        <div style="transform: scale(1.8); margin-bottom: 30px;">
                            ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        </div>
                        <h3 style="color: #94a3b8; margin:0; letter-spacing: 3px;">¡NUEVO DESEO!</h3>
                        <h2 style="color:${RAREZAS[personaje.rareza]}; font-size: 2.5rem; margin: 15px 0;">
                            ${personaje.nombre}
                        </h2>
                    </div>`;
            }
            
            resultado.innerHTML += `<br><button onclick="cerrarGacha()" class="nav-btn" style="margin-top:30px; background:#f59e0b; color:black; padding:12px 40px; border-radius:10px; font-weight:bold; cursor:pointer;">CONTINUAR</button>`;
            
            guardar(); // Guardamos el inventario actualizado
            actualizarHUD();
            avanzarMision('gacha_3', 1); 
        }, 600);
    }, 1800);
}