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
    
    // Usamos stockTienda (variable global en logic.js)
    if (ultimaFechaTienda !== hoy) {
        if (typeof DB !== 'undefined' && DB.length > 0) {
            const seleccion = [...DB]
                .sort(() => 0.5 - Math.random())
                .slice(0, 6);

            stockTienda = seleccion; 
            ultimaFechaTienda = hoy;
            guardar(); // Guarda en localStorage
            console.log("🏪 Tienda actualizada para hoy: " + hoy);
        }
    }
}

// 3. Renderizado en el HTML
function renderTienda() {
    const grid = document.getElementById('tienda-grid');
    if (!grid) return;

    actualizarTiendaSiEsNecesario();

    // Encabezado con monedas del jugador
    let html = `
        <div class="tienda-header" style="grid-column: 1/-1; background: #1a1a2e; padding: 20px; border-radius: 15px; border: 2px solid #eab308; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 style="margin:0; color: #eab308;">Tienda Diaria</h2>
                <small style="color: #94a3b8;">Los productos cambian cada 24h</small>
            </div>
            <div style="font-size: 1.8rem; font-weight: bold; color: #eab308;">💰 <span id="tienda-monedas">${monedas}</span></div>
        </div>
    `;

    // Cartas de personajes
    stockTienda.forEach((p) => {
        const copiasActuales = inventario.filter(inv => inv.id === p.id).length;
        const precio = PRECIOS_TIENDA[p.rareza] || 1000;
        const colorRareza = (typeof RAREZAS !== 'undefined') ? RAREZAS[p.rareza] : "#fff";
        const estaLleno = copiasActuales >= 10;

        html += `
            <div class="card-tienda" style="background: #1a1a2e; border: 1px solid ${estaLleno ? '#333' : colorRareza}; padding: 15px; border-radius: 15px; text-align: center; opacity: ${estaLleno ? '0.7' : '1'}">
                <div style="font-size: 0.8rem; color: #94a3b8; text-align: right;">#${p.id}</div>
                <div style="height: 100px; display: flex; align-items: center; justify-content: center;">
                    ${obtenerImagenHTML(p)}
                </div>
                <h3 style="margin: 10px 0 5px 0; color: white;">${p.nombre}</h3>
                <div style="font-size: 0.7rem; color: ${colorRareza}; font-weight: bold; margin-bottom: 5px;">${p.rareza.toUpperCase()}</div>
                <div style="color: #666; font-size: 0.8rem; margin-bottom: 10px;">Posees: ${copiasActuales}/10</div>
                
                <div style="color: #eab308; font-weight: bold; margin-bottom: 12px; font-size: 1.1rem;">${precio} 💰</div>
                
                ${estaLleno ? 
                    `<button disabled style="width: 100%; background: #333; color: #777; border: none; padding: 10px; border-radius: 8px; cursor: not-allowed; font-weight: bold;">MÁXIMO</button>` :
                    `<button onclick="comprarPersonajeTienda('${p.id}', ${precio})" 
                        style="width: 100%; background: #eab308; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #1a1a2e;">
                        COMPRAR
                    </button>`
                }
            </div>
        `;
    });

    // Sección de Ticket Gacha
    html += `
        <div style="grid-column: 1/-1; background: linear-gradient(90deg, #1a1a2e, #16213e); border: 2px dashed #4ade80; padding: 20px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <div>
                <h3 style="margin:0; color: white;">Pack de Tickets Gacha</h3>
                <p style="margin:5px 0 0 0; color: #94a3b8;">Canjea monedas por una tirada extra</p>
            </div>
            <button onclick="comprarTicketTienda()" style="background: #4ade80; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #0f172a;">
                CANJEAR x 500 💰
            </button>
        </div>
    `;

// --- NUEVA SECCIÓN: SUMINISTROS (CARAMELOS RAROS) ---
    html += `
        <div style="grid-column: 1/-1; margin-top: 30px;">
            <h3 style="color: #eab308; border-bottom: 1px solid #333; padding-bottom: 10px;">Suministros y Objetos</h3>
        </div>
        
        <div class="card-tienda" style="background: #1a1a2e; border: 1px solid #facc15; padding: 15px; border-radius: 15px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 10px;">🍬</div>
            <h3 style="margin: 0; color: white;">Caramelo Raro</h3>
            <p style="font-size: 0.75rem; color: #94a3b8; margin: 5px 0 10px 0;">Sube 1 nivel a cualquier Pokémon</p>
            <div style="color: #eab308; font-weight: bold; font-size: 1.1rem; margin-bottom: 12px;">300 💰</div>
            <button onclick="comprarCaramelo()" style="width: 100%; background: #facc15; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #1a1a2e;">
                COMPRAR
            </button>
            <div style="margin-top: 8px; font-size: 0.7rem; color: #4ade80;">Tienes: ${window.mochila ? window.mochila.caramelo_raro : 0}</div>
        </div>
    `;

    grid.innerHTML = html;
}function renderTienda() {
    const grid = document.getElementById('tienda-grid');
    if (!grid) return;

    actualizarTiendaSiEsNecesario();

    // 1. Empezamos el HTML
    let html = `
        <div class="tienda-header" style="grid-column: 1/-1; background: #1a1a2e; padding: 20px; border-radius: 15px; border: 2px solid #eab308; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2 style="margin:0; color: #eab308;">Tienda Diaria</h2>
                <small style="color: #94a3b8;">Los productos cambian cada 24h</small>
            </div>
            <div style="font-size: 1.8rem; font-weight: bold; color: #eab308;">💰 <span id="tienda-monedas">${monedas}</span></div>
        </div>
    `;

    // 2. Sumamos los personajes (tu código actual)
    stockTienda.forEach((p) => {
        const copiasActuales = inventario.filter(inv => inv.id === p.id).length;
        const precio = PRECIOS_TIENDA[p.rareza] || 1000;
        const colorRareza = (typeof RAREZAS !== 'undefined') ? RAREZAS[p.rareza] : "#fff";
        const estaLleno = copiasActuales >= 10;

        html += `
            <div class="card-tienda" style="background: #1a1a2e; border: 1px solid ${estaLleno ? '#333' : colorRareza}; padding: 15px; border-radius: 15px; text-align: center; opacity: ${estaLleno ? '0.7' : '1'}">
                <div style="height: 100px; display: flex; align-items: center; justify-content: center;">${obtenerImagenHTML(p)}</div>
                <h3 style="margin: 10px 0 5px 0; color: white;">${p.nombre}</h3>
                <div style="color: #eab308; font-weight: bold; margin-bottom: 12px;">${precio} 💰</div>
                ${estaLleno ? 
                    `<button disabled style="width: 100%; background: #333; color: #777; border: none; padding: 10px; border-radius: 8px;">MÁXIMO</button>` :
                    `<button onclick="comprarPersonajeTienda('${p.id}', ${precio})" style="width: 100%; background: #eab308; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">COMPRAR</button>`
                }
            </div>
        `;
    });

    // 3. SUMAMOS LOS CARAMELOS (Antes del innerHTML)
    html += `
        <div style="grid-column: 1/-1; margin-top: 30px;">
            <h3 style="color: #eab308; border-bottom: 1px solid #333; padding-bottom: 10px;">Suministros</h3>
        </div>
        <div class="card-tienda" style="background: #1a1a2e; border: 1px solid #facc15; padding: 15px; border-radius: 15px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 10px;">🍬</div>
            <h3 style="margin: 0; color: white;">Caramelo Raro</h3>
            <div style="color: #eab308; font-weight: bold; font-size: 1.1rem; margin-bottom: 12px;">300 💰</div>
            <button onclick="comprarCaramelo()" style="width: 100%; background: #facc15; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">COMPRAR</button>
            <div style="margin-top: 8px; font-size: 0.75rem; color: #4ade80;">Tienes: ${window.mochila ? window.mochila.caramelo_raro : 0}</div>
        </div>
    `;

    // 4. AL FINAL DE TODO, INYECTAMOS
    grid.innerHTML = html;
}

// 4. Lógica de Compra de Personaje
function comprarPersonajeTienda(id, precio) {
    const pBase = DB.find(p => p.id == id);
    const copias = inventario.filter(inv => inv.id == id).length;

    if (copias >= 10) {
        alert("⚠️ Ya tienes 10 copias de este héroe.");
        return;
    }

    if (monedas >= precio) {
        monedas -= precio;
        const nuevo = { ...pBase, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
        inventario.push(nuevo);
        guardar();
        actualizarHUD(); // Actualiza los contadores de arriba
        renderTienda(); // Refresca la tienda
        alert(`¡🎉 ${pBase.nombre} comprado con éxito!`);
    } else {
        alert("❌ No tienes suficientes monedas.");
    }
}

// 5. Lógica de Compra de Ticket
function comprarTicketTienda() {
    if (monedas >= 500) {
        monedas -= 500;
        ticketsNormales++; // Suma a la variable global
        guardar();
        actualizarHUD();
        renderTienda();
        alert("✅ ¡Has comprado 1 Ticket Gacha!");
    } else {
        alert("❌ No tienes monedas suficientes (500 💰).");
    }
}

// Lógica para comprar Caramelos
function comprarCaramelo() {
    const PRECIO_CARAMELO = 300; // Puedes ajustar el precio

    if (monedas >= PRECIO_CARAMELO) {
        monedas -= PRECIO_CARAMELO;
        
        // Usamos la función de inventario.js que definimos antes
        if (typeof añadirObjeto === 'function') {
            añadirObjeto("caramelo_raro", 1);
        } else {
            // Backup por si aún no has creado inventario.js
            window.mochila.caramelo_raro = (window.mochila.caramelo_raro || 0) + 1;
            localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
        }

        guardar();
        actualizarHUD();
        renderTienda();
        console.log("🍬 Caramelo Raro comprado");
    } else {
        alert("❌ No tienes suficientes monedas (300 💰).");
    }
}