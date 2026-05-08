// ==========================================
// tienda.js - GESTIÓN DE LA TIENDA DIARIA
// ==========================================

// 1. Precios actualizados por rareza
const PRECIOS_TIENDA = {
    "comun": 500,
    "raro": 1500,
    "epico": 5000,
    "legendario": 15000
};

// 2. Rotación de productos cada 24h
function actualizarTiendaSiEsNecesario() {
    const hoy = new Date().toLocaleDateString();
    
    if (ultimaFechaTienda !== hoy) {
        if (typeof DB !== 'undefined' && DB.length > 0) {
            
            // 1. KANTO: En tu database (foto bd6a17) veo que usas "Gen1"
            const poolGen1 = DB.filter(p => p.saga === "Gen1" || p.saga === "Pokémon");
            stockTienda = poolGen1
                .sort(() => 0.5 - Math.random())
                .slice(0, 6);

            // 2. ALOLA: En tu database usas "Gen7"
            const poolGen7 = DB.filter(p => p.saga === "Gen7");
            stockTienda7 = poolGen7
                .sort(() => 0.5 - Math.random())
                .slice(0, 6);

            ultimaFechaTienda = hoy;
            guardar();
            
            console.log("✅ Tiendas rotadas. Gen1: " + stockTienda.length + " | Gen7: " + stockTienda7.length);
        }
    }
}

// 3. Renderizado en el HTML
function renderTienda() {
    const grid = document.getElementById('tienda-grid');
    if (!grid) return;

    // --- ARREGLO PARA EL ERROR DE FOREACH ---
    // Nos aseguramos de que stockTienda sea SIEMPRE una lista
    if (!Array.isArray(window.stockTienda)) {
        window.stockTienda = []; 
    }
    if (!Array.isArray(window.stockTienda7)) {
        window.stockTienda7 = [];
    }

    // Si están vacías, forzamos la creación del stock
    if (window.stockTienda.length === 0 && typeof DB !== 'undefined' && DB.length > 0) {
        console.log("Generando stock de emergencia...");
        ultimaFechaTienda = ""; // Reseteamos fecha para obligar a actualizarTiendaSiEsNecesario
        actualizarTiendaSiEsNecesario();
    }
    // ------------------------------------

    // Encabezado con monedas del jugador y un contador visual
    let html = `
        <div class="tienda-header" style="grid-column: 1/-1; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 25px; border-radius: 15px; border: 2px solid #eab308; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <div>
                <h2 style="margin:0; color: #eab308; text-transform: uppercase; letter-spacing: 2px;">🏪 Tienda Mística</h2>
                <small style="color: #94a3b8;">✨ Los productos cambian cada 24h • <span style="color: #4ade80;">Stock Actualizado</span></small>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 5px;">Tus Monedas:</div>
                <div style="font-size: 2rem; font-weight: bold; color: #eab308; text-shadow: 0 0 10px rgba(234, 179, 8, 0.3);">💰 <span id="tienda-monedas">${monedas}</span></div>
            </div>
        </div>
    `;

    // ---------------------------------------------------------
    // SECCIÓN SAGA KANTO (GEN 1)
    // ---------------------------------------------------------
    html += `<div style="grid-column: 1/-1; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <h3 style="color: #4ade80; margin:0;">Saga Kanto (Gen 1)</h3>
                <div style="flex-grow: 1; height: 1px; background: linear-gradient(90deg, #4ade8033, transparent);"></div>
             </div>`;
    
    stockTienda.forEach((p) => {
        const copiasActuales = inventario.filter(inv => inv.id === p.id).length;
        const precio = PRECIOS_TIENDA[p.rareza] || 1000;
        const colorRareza = (typeof RAREZAS !== 'undefined') ? RAREZAS[p.rareza] : "#fff";
        const estaLleno = copiasActuales >= 10;

        html += `
            <div class="card-tienda" style="background: #1a1a2e; border: 2px solid ${estaLleno ? '#333' : colorRareza + '44'}; padding: 15px; border-radius: 15px; text-align: center; opacity: ${estaLleno ? '0.7' : '1'}; transition: transform 0.2s; position: relative; overflow: hidden;">
                ${!estaLleno ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: ${colorRareza};"></div>` : ''}
                <div style="font-size: 0.8rem; color: #94a3b8; text-align: right;">#${p.id}</div>
                <div style="height: 100px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 8px ${colorRareza}44);">
                    ${obtenerImagenHTML(p)}
                </div>
                <h3 style="margin: 10px 0 5px 0; color: white;">${p.nombre}</h3>
                <div style="font-size: 0.7rem; color: ${colorRareza}; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px;">• ${p.rareza.toUpperCase()} •</div>
                <div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 10px;">En posesión: <span style="color: white; font-weight: bold;">${copiasActuales}/10</span></div>
                
                <div style="color: #eab308; font-weight: bold; margin-bottom: 12px; font-size: 1.2rem; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 8px;">${precio.toLocaleString()} 💰</div>
                
                ${estaLleno ? 
                    `<button disabled style="width: 100%; background: #333; color: #777; border: none; padding: 12px; border-radius: 8px; cursor: not-allowed; font-weight: bold;">MÁXIMO NIVEL</button>` :
                    `<button onclick="comprarPersonajeTienda('${p.id}', ${precio})" 
                        style="width: 100%; background: #eab308; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #1a1a2e; text-transform: uppercase; transition: 0.2s;">
                        🛒 COMPRAR
                    </button>`
                }
            </div>
        `;
    });

    // ---------------------------------------------------------
    // SECCIÓN SAGA ALOLA (7ma GEN)
    // ---------------------------------------------------------
    html += `<div style="grid-column: 1/-1; margin: 40px 0 15px 0; display: flex; align-items: center; gap: 10px;">
                <h3 style="color: #60a5fa; margin:0;">Saga Alola (7ma Gen)</h3>
                <div style="flex-grow: 1; height: 1px; background: linear-gradient(90deg, #60a5fa33, transparent);"></div>
             </div>`;
    
    if (typeof stockTienda7 !== 'undefined') {
        stockTienda7.forEach((p) => {
            const copiasActuales = inventario.filter(inv => inv.id === p.id).length;
            const precio = PRECIOS_TIENDA[p.rareza] || 1000;
            const colorRareza = (typeof RAREZAS !== 'undefined') ? RAREZAS[p.rareza] : "#fff";
            const estaLleno = copiasActuales >= 10;

            html += `
                <div class="card-tienda" style="background: #1a1a2e; border: 2px solid ${estaLleno ? '#333' : colorRareza + '44'}; padding: 15px; border-radius: 15px; text-align: center; opacity: ${estaLleno ? '0.7' : '1'}; transition: 0.2s; position: relative;">
                    ${!estaLleno ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: ${colorRareza};"></div>` : ''}
                    <div style="font-size: 0.8rem; color: #94a3b8; text-align: right;">#${p.id}</div>
                    <div style="height: 100px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 8px ${colorRareza}44);">
                        ${obtenerImagenHTML(p)}
                    </div>
                    <h3 style="margin: 10px 0 5px 0; color: white;">${p.nombre}</h3>
                    <div style="font-size: 0.7rem; color: ${colorRareza}; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px;">• ${p.rareza.toUpperCase()} •</div>
                    <div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 10px;">En posesión: <span style="color: white; font-weight: bold;">${copiasActuales}/10</span></div>
                    
                    <div style="color: #eab308; font-weight: bold; margin-bottom: 12px; font-size: 1.2rem; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 8px;">${precio.toLocaleString()} 💰</div>
                    
                    ${estaLleno ? 
                        `<button disabled style="width: 100%; background: #333; color: #777; border: none; padding: 12px; border-radius: 8px; cursor: not-allowed; font-weight: bold;">MÁXIMO NIVEL</button>` :
                        `<button onclick="comprarPersonajeTienda('${p.id}', ${precio})" 
                            style="width: 100%; background: #eab308; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #1a1a2e; text-transform: uppercase;">
                            🛒 COMPRAR
                        </button>`
                    }
                </div>
            `;
        });
    }

    // Sección de Ticket Gacha mejorada
    html += `
        <div style="grid-column: 1/-1; background: linear-gradient(90deg, #1e293b, #0f172a); border: 2px dashed #4ade80; padding: 25px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; margin-top: 30px; box-shadow: 0 0 20px rgba(74, 222, 128, 0.1);">
            <div>
                <h3 style="margin:0; color: white; display: flex; align-items: center; gap: 10px;">🎟️ Pack de Tickets Gacha <span style="background: #4ade8022; color: #4ade80; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px;">OFERTA</span></h3>
                <p style="margin:5px 0 0 0; color: #94a3b8;">Canjea tus monedas por tickets de invocación</p>
            </div>
            <button onclick="comprarTicketTienda()" style="background: #4ade80; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-weight: bold; color: #0f172a; box-shadow: 0 4px 0 #166534; transition: 0.1s;" onmousedown="this.style.transform='translateY(2px)';this.style.boxShadow='none'" onmouseup="this.style.transform='none';this.style.boxShadow='0 4px 0 #166534'">
                COMPRAR x 500 💰
            </button>
        </div>
    `;

    // Sección de Caramelos
    html += `
        <div style="grid-column: 1/-1; margin-top: 40px; display: flex; align-items: center; gap: 10px;">
            <h3 style="color: #eab308; margin:0;">Suministros del Entrenador</h3>
            <div style="flex-grow: 1; height: 1px; background: linear-gradient(90deg, #eab30833, transparent);"></div>
        </div>
        
        <div class="card-tienda" style="background: #1a1a2e; border: 2px solid #facc15; padding: 20px; border-radius: 15px; text-align: center; position: relative;">
            <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #facc15; color: #1a1a2e; padding: 2px 10px; border-radius: 10px; font-size: 0.7rem; font-weight: bold;">POPULAR</div>
            <div style="font-size: 3rem; margin-bottom: 10px; filter: drop-shadow(0 0 10px #facc1555);">🍬</div>
            <h3 style="margin: 0; color: white;">Caramelo Raro</h3>
            <p style="font-size: 0.75rem; color: #94a3b8; margin: 8px 0 15px 0;">¡Potencia el nivel de tus Pokémon al instante!</p>
            <div style="color: #eab308; font-weight: bold; font-size: 1.3rem; margin-bottom: 15px;">300 💰</div>
            <button onclick="comprarCaramelo()" style="width: 100%; background: #facc15; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #1a1a2e; text-transform: uppercase;">
                ADQUIRIR
            </button>
            <div style="margin-top: 12px; font-size: 0.8rem; color: #4ade80; background: #4ade8011; padding: 5px; border-radius: 5px;">Tienes: <b>${window.mochila ? window.mochila.caramelo_raro : 0}</b> en mochila</div>
        </div>
    `;

    grid.innerHTML = html;
}

// 4. Lógica de Compra de Personaje
function comprarPersonajeTienda(id, precio) {
    const pBase = DB.find(p => p.id == id);
    if (!pBase) return;

    const copias = inventario.filter(inv => inv.id == id).length;

    if (copias >= 10) return alert("⚠️ Ya tienes 10 copias.");

    if (window.monedas >= precio) {
        window.monedas -= precio;
        const nuevo = { ...pBase, uid: "UID-" + Date.now(), lvl: 1 };
        window.inventario.push(nuevo);
        
        guardar(); // <--- Solo un guardado aquí
        
        actualizarHUD();
        renderTienda();
        alert(`¡🎉 ${pBase.nombre} comprado!`);
    } else {
        alert("❌ No tienes suficientes monedas.");
    }
}

// 5. Lógica de Compra de Ticket
// BUSCA ESTA FUNCIÓN Y CAMBIALA POR ESTA:
function comprarTicketTienda() {
    if (window.monedas >= 500) {
        window.monedas -= 500;
        window.ticketsNormales = (window.ticketsNormales || 0) + 1; // <--- FORZAMOS WINDOW
        
        guardar(); // Esto ahora sí enviará el ticket nuevo a Firebase
        
        if(typeof actualizarHUD === 'function') actualizarHUD();
        renderTienda();
        alert("✅ ¡Has comprado 1 Ticket Gacha!");
    } else {
        alert("❌ No tienes monedas suficientes.");
    }
}

function comprarCaramelo() {
    const PRECIO_CARAMELO = 300;

    if (monedas >= PRECIO_CARAMELO) {
        // 1. Restamos el dinero
        monedas -= PRECIO_CARAMELO;

        // 2. Usamos la función maestra que arreglamos antes
        // Esta ya se encarga de guardar en LocalStorage y sincronizar el HUD
        if (typeof window.añadirObjeto === 'function') {
            window.añadirObjeto("caramelo_raro", 1);
        } else {
            // Plan B por si acaso no carga el otro archivo
            window.mochila.caramelo_raro = (window.mochila.caramelo_raro || 0) + 1;
            localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
        }

        // 3. Guardamos el estado de las monedas y refrescamos la tienda
        guardar(); 
        renderTienda();
        
        console.log("🛒 Compra exitosa: 1 Caramelo Raro.");
    } else {
        alert("❌ No tienes suficientes monedas.");
    }
    guardar(); //
}