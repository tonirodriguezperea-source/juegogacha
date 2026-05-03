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
    
    // Gasto de ticket
    ticketsNormales--;
    guardar(); // Usamos la función guardar() de logic.js que ya guarda todo
    actualizarHUD(); 
    
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    objeto.style.display = 'flex';
    
    // Imagen de la cápsula/pokeball según la saga
    const esPkmn = saga.toLowerCase().includes('pokemon');
    const imgAnimacion = esPkmn 
        ? "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
        : "https://upload.wikimedia.org/wikipedia/commons/b/b5/Dragon_Ball_Sphere.png"; // Imagen de esfera para DBZ

    objeto.innerHTML = `<img src="${imgAnimacion}" width="120" class="objeto-vibrando" style="filter: drop-shadow(0 0 10px gold);">`;

    // Fase 1: Animación
    setTimeout(() => {
        objeto.innerHTML = `<img src="${imgAnimacion}" width="120" class="objeto-explotando">`;
        
        // Fase 2: Mostrar Resultado
        setTimeout(() => {
            objeto.style.display = 'none';
            resultado.style.display = 'block';
            
            // Lógica de copias (Máximo 10)
            const copias = inventario.filter(p => p.id === personaje.id).length;
            
            if (copias >= 10) {
                const premios = { comun: 100, raro: 250, epico: 600, legendario: 1500 };
                const valor = premios[personaje.rareza] || 100;
                monedas += valor; // Sumamos a la variable global
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        ${obtenerImagenHTML(personaje, "sprite-revelado")}
                        <h3 style="color:#ff4444; margin-top:10px;">¡LIMITE ALCANZADO!</h3>
                        <p style="color:white;">Ya tienes 10 copias. Recompensa de consolación:</p>
                        <h2 style="color:#eab308;">+💰 ${valor} Monedas</h2>
                    </div>`;
            } else {
                // Añadir al inventario real
                const nuevo = { ...personaje, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
                inventario.push(nuevo);
                
                resultado.innerHTML = `
                    <div style="text-align:center;">
                        <div style="transform: scale(1.5); margin-bottom: 20px;">${obtenerImagenHTML(personaje)}</div>
                        <h3 style="color: #94a3b8; margin:0;">¡NUEVO HÉROE!</h3>
                        <h2 style="color:${RAREZAS[personaje.rareza]}; font-size: 2rem; margin: 10px 0;">${personaje.nombre}</h2>
                        <div style="background:${RAREZAS[personaje.rareza]}; color:black; display:inline-block; padding: 5px 15px; border-radius: 20px; font-weight:bold; text-transform:uppercase; font-size:0.8rem;">
                            ${personaje.rareza}
                        </div>
                    </div>`;
            }
            
            resultado.innerHTML += `<br><button onclick="cerrarGacha()" style="margin-top:20px; padding:10px 25px; background:#4ade80; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">LISTO</button>`;
            
            guardar(); // Guardamos el nuevo personaje o las monedas
            actualizarHUD(); // Refrescamos el contador de la pantalla
        }, 800);
    }, 1500);
}

window.cerrarGacha = function() {
    document.getElementById('gacha-animacion').style.display = 'none';
    mostrar('equipo'); // Vamos a ver el equipo para ver el nuevo bicho
};