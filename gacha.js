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
    
    ticketsNormales--;
    guardar(); 
    actualizarHUD(); 
    
    overlay.style.display = 'flex';
    resultado.style.display = 'none';
    objeto.style.display = 'flex';
    
    const esPkmn = saga.toLowerCase().includes('pokemon');
    
    // URLs DEFINITIVAS Y ESTABLES (PNGs transparentes)
    const imgPoke = "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg";
    const imgDBZ = "https://www.pngarts.com/files/11/Dragon-Ball-Z-Orb-PNG-Image-Background.png"; 

    const urlElegida = esPkmn ? imgPoke : imgDBZ;

    // Insertamos la imagen con un diseño más sólido
    objeto.innerHTML = `
        <div class="objeto-vibrando" style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center;">
            <img src="${urlElegida}" 
                 id="img-gacha-temp"
                 style="width: 120px; height: auto; filter: drop-shadow(0 0 15px rgba(255,215,0,0.7));"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\'font-size:100px\'>✨</span>';">
        </div>`;

    // PEQUEÑO TRUCO: Esperamos 100ms para asegurar que el navegador "ve" la imagen antes de animar
    setTimeout(() => {
        const img = document.getElementById('img-gacha-temp');
        if(img) img.classList.add('objeto-vibrando');

        setTimeout(() => {
            // Fase de explosión
            if(img) img.className = "objeto-explotando";
            
            setTimeout(() => {
                objeto.style.display = 'none';
                resultado.style.display = 'block';
                
                const copias = inventario.filter(p => p.id === personaje.id).length;
                
                if (copias >= 10) {
                    const premios = { comun: 100, raro: 250, epico: 600, legendario: 1500 };
                    const valor = premios[personaje.rareza] || 100;
                    monedas += valor;
                    
                    resultado.innerHTML = `
                        <div style="text-align:center;">
                            ${obtenerImagenHTML(personaje, "sprite-revelado")}
                            <h3 style="color:#ff4444; margin-top:10px;">¡MÁXIMO NIVEL!</h3>
                            <p style="color:white;">Ya tienes 10 copias.</p>
                            <h2 style="color:#eab308;">+💰 ${valor} Monedas</h2>
                        </div>`;
                } else {
                    const nuevo = { ...personaje, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
                    inventario.push(nuevo);
                    
                    resultado.innerHTML = `
                        <div style="text-align:center;">
                            <div style="transform: scale(1.8); margin-bottom: 30px;">${obtenerImagenHTML(personaje)}</div>
                            <h3 style="color: #94a3b8; margin:0; letter-spacing: 2px;">¡HAS OBTENIDO A!</h3>
                            <h2 style="color:${RAREZAS[personaje.rareza]}; font-size: 2.5rem; margin: 15px 0; text-shadow: 0 0 10px rgba(0,0,0,0.5);">${personaje.nombre}</h2>
                            <div style="background:${RAREZAS[personaje.rareza]}; color:black; display:inline-block; padding: 8px 20px; border-radius: 30px; font-weight:bold; text-transform:uppercase; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                ${personaje.rareza}
                            </div>
                        </div>`;
                }
                
                resultado.innerHTML += `<br><button onclick="cerrarGacha()" style="margin-top:30px; padding:12px 35px; background:linear-gradient(180deg, #4ade80, #22c55e); border:none; border-radius:12px; cursor:pointer; font-weight:bold; color: white; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">CONTINUAR</button>`;
                
                guardar();
                actualizarHUD();
            }, 700);
        }, 1500);
    }, 50);
}

window.cerrarGacha = function() {
    document.getElementById('gacha-animacion').style.display = 'none';
    mostrar('equipo'); // Vamos a ver el equipo para ver el nuevo bicho
};