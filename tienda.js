// --- LÓGICA DE LA TIENDA ---

// Precios por rareza
const PRECIOS = {
    "comun": 500,
    "raro": 1500,
    "epico": 5000,
    "legendario": 15000
};

function actualizarTiendaSiEsNecesario() {
    const hoy = new Date().toLocaleDateString();
    
    // Si la fecha guardada es distinta a hoy, generamos nuevos items
    if (tiendaDiaria.fecha !== hoy) {
        // Mezclamos la DB y agarramos 6 personajes al azar
        const seleccion = [...DB]
            .sort(() => 0.5 - Math.random())
            .slice(0, 6)
            .map(p => ({
                ...p,
                precio: PRECIOS[p.rareza] || 1000 // Precio según rareza
            }));

        tiendaDiaria = { fecha: hoy, items: seleccion };
        guardar(); // Esta función vive en tu script.js principal
    }
}

function renderTienda() {
    const grid = document.getElementById('tienda-grid');
    if (!grid) return;

    actualizarTiendaSiEsNecesario();

    // Encabezado con monedas
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
    tiendaDiaria.items.forEach((p, index) => {
        html += `
            <div class="card-tienda" style="background: #1a1a2e; border: 1px solid #333; padding: 15px; border-radius: 15px; text-align: center; transition: transform 0.2s;">
                <div style="font-size: 0.8rem; color: #94a3b8; text-align: right;">#${p.id}</div>
                <div style="height: 100px; display: flex; align-items: center; justify-content: center;">
                    ${obtenerImagenHTML(p)}
                </div>
                <h3 style="margin: 10px 0 5px 0; color: white;">${p.nombre}</h3>
                <div style="color: #eab308; font-weight: bold; margin-bottom: 12px; font-size: 1.1rem;">${p.precio} 💰</div>
                <button onclick="comprarPersonaje(${index})" 
                    style="width: 100%; background: #eab308; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #1a1a2e;">
                    COMPRAR
                </button>
            </div>
        `;
    });

    // Sección de Tickets
    html += `
        <div style="grid-column: 1/-1; background: linear-gradient(90deg, #1a1a2e, #16213e); border: 2px dashed #4ade80; padding: 20px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <div>
                <h3 style="margin:0; color: white;">Pack de Tickets Gacha</h3>
                <p style="margin:5px 0 0 0; color: #94a3b8;">Consigue una tirada extra ahora mismo</p>
            </div>
            <button onclick="comprarTicket()" style="background: #4ade80; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #0f172a;">
                CANJEAR x 200 💰
            </button>
        </div>
    `;

    grid.innerHTML = html;
}

function comprarPersonaje(index) {
    const item = tiendaDiaria.items[index];
    
    if (monedas >= item.precio) {
        monedas -= item.precio;
        // Creamos la copia para el inventario
        const nuevo = { ...item, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
        inventario.push(nuevo);
        guardar();
        alert(`¡🎉 ${item.nombre} se ha unido a tu colección!`);
        renderTienda(); // Refresca para actualizar monedas
    } else {
        alert("❌ No tienes suficientes monedas.");
    }
}

function comprarTicket() {
    if (monedas >= 200) {
        monedas -= 200;
        guardar();
        alert("✅ ¡Ticket comprado! (Aquí puedes añadir lógica para sumar tiradas)");
        renderTienda();
    } else {
        alert("❌ Te faltan monedas para el ticket.");
    }
}