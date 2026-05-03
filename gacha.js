/** * GACHA SYSTEM 2.0 - Optimizado y Sincronizado */

window.invocar = function(saga) {
    // 1. Sincronizar datos reales antes de empezar
    // Usamos las variables globales que ya existen en logic.js para no crear duplicados
    ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;

    if (ticketsNormales <= 0) {
        alert("¡No tienes tickets! Consigue más en la tienda o en batalla.");
        return;
    }

    // 2. FILTRO DE SAGA
    const busquedaLimpia = saga.toLowerCase().replace(/\s/g, ""); 

    const poolSaga = DB.filter(p => {
        const sagaDBLimpia = p.saga.toLowerCase().replace(/\s/g, "");
        return sagaDBLimpia.includes(busquedaLimpia);
    });
    
    if (poolSaga.length === 0) {
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
    
    // Gasto de ticket y guardado
    ticketsNormales--;
    guardar(); 
    actualizarHUD(); 
    
    // Configuración visual
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    objeto.style.display = 'flex';
    
    // --- LA ESTRELLA DEL DESEO ---
    // Usamos un div con el emoji y un brillo (glow) dorado
    objeto.innerHTML = `
        <div id="estrella-deseo" class="objeto-vibrando" style="
            font-size: 100px; 
            filter: drop-shadow(0 0 20px #f59e0b); 
            cursor: default;
            user-select: none;">
            ⭐
        </div>`;

    // Fase 1: La estrella vibra (espera del deseo)
    setTimeout(() => {
        const estrella = document.getElementById('estrella-deseo');
        
        // Fase 2: ¡La estrella explota en luz!
        if (estrella) {
            estrella.style.transition = "all 0.5s ease-out";
            estrella.style.transform = "scale(2.5)";
            estrella.style.filter = "brightness(2) blur(5px)";
            estrella.style.opacity = "0";
        }
        
        setTimeout(() => {
            objeto.style.display = 'none';
            resultado.style.display = 'block';
            
            // Lógica de inventario / copias
            const copias = inventario.filter(p => p.id === personaje.id).length;
            
            if (copias >= 10) {
                const premios = { comun: 100, raro: 250, epico: 600, legendario: 1500 };
                const valor = premios[personaje.rareza] || 100;
                monedas += valor;
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h3 style="color:#ff4444; margin-top:10px;">DESEO REPETIDO</h3>
                        <p style="color:#94a3b8;">Límite de 10 copias alcanzado.</p>
                        <h2 style="color:#eab308;">+💰 ${valor} Monedas</h2>
                    </div>`;
            } else {
                const nuevo = { ...personaje, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
                inventario.push(nuevo);
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        <div style="transform: scale(1.8); margin-bottom: 30px;">
                            ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        </div>
                        <h3 style="color: #94a3b8; margin:0; letter-spacing: 3px;">¡DESEO CONCEDIDO!</h3>
                        <h2 style="color:${RAREZAS[personaje.rareza]}; font-size: 2.5rem; margin: 15px 0; text-shadow: 0 0 15px rgba(255,255,255,0.3);">
                            ${personaje.nombre}
                        </h2>
                        <div style="background:${RAREZAS[personaje.rareza]}; color:black; display:inline-block; padding: 8px 25px; border-radius: 30px; font-weight:bold; text-transform:uppercase;">
                            ${personaje.rareza}
                        </div>
                    </div>`;
            }
            
            resultado.innerHTML += `<br><button onclick="cerrarGacha()" class="nav-btn" style="margin-top:30px; background:#f59e0b; color:black; border:none; padding:12px 40px; border-radius:10px; font-weight:bold; cursor:pointer;">CONTINUAR</button>`;
            
            guardar();
            actualizarHUD();
        }, 600); // Tiempo de la "explosión"
    }, 1800); // Tiempo que está la estrella vibrando
}

window.cerrarGacha = function() {
    document.getElementById('gacha-animacion').style.display = 'none';
    mostrar('equipo'); // Vamos a ver el equipo para ver el nuevo bicho
};