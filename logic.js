// ================================================================
// 1. VARIABLES GLOBALES Y PERSISTENCIA (SISTEMA DE GUARDADO)
// ================================================================
var inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
var equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];
var monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
var ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;
var stockTienda = JSON.parse(localStorage.getItem("gq_stock_tienda")) || [];
var ultimaFechaTienda = localStorage.getItem("gq_fecha_tienda") || "";

// Precios estándar por rareza (para usar en toda la app)
const PRECIOS_RAREZA = {
    "comun": 1000,
    "raro": 2500,
    "epico": 6000,
    "legendario": 15000
};

// Descripciones de la Pokédex
const descripciones = {
    "1": "Bulbasaur es un Pokémon tipo planta. Lleva una semilla en su lomo que crece con él.",
    "2": "Ivysaur es un Pokémon tipo planta. Lleva una semilla con la que duerme, paraliza y envenena.",
    "4": "Charmander prefiere los lugares cálidos. La llama de su cola indica su salud.",
    "7": "Squirtle se protege con su caparazón y dispara chorros de agua a presión.",
    "1200": "Son Goku, el guerrero legendario que protege la Tierra con su fuerza infinita.",
    "1201": "Vegeta, el príncipe de los saiyans. Su orgullo es tan grande como su poder.",
    "1202": "Gohan, hijo de Goku. Posee un potencial oculto que despierta en momentos críticos."
};

function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
    localStorage.setItem("gq_monedas", monedas);
    localStorage.setItem("gq_tk_normal", ticketsNormales);
    localStorage.setItem("gq_stock_tienda", JSON.stringify(stockTienda));
    localStorage.setItem("gq_fecha_tienda", ultimaFechaTienda);
    console.log("💾 Progreso guardado automáticamente.");
}

function actualizarHUD() {
    // 1. Recuperamos los valores reales de las variables
    // Asegúrate de que estas variables se llamen así en tu logic.js
    const tks = ticketsNormales || 0;
    const mons = monedas || 0;

    // 2. Actualizamos TODOS los posibles IDs que existan en el HTML
    const idsTickets = ['val-tk-normal', 'val-tk-normal-hud', 'cont-tickets'];
    const idsMonedas = ['cont-monedas', 'val-monedas', 'tienda-monedas'];

    idsTickets.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = tks;
    });

    idsMonedas.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = mons;
    });
}

// ================================================================
// 2. MOTOR VISUAL (RENDERIZADO DE SPRITES Y EMOJIS)
// ================================================================
window.obtenerImagenHTML = function(p, clases = "", lado = "") {
    if (!p) return `<span class="sprite ${clases}">❓</span>`;
    
    const spriteURL = p.sprite || (typeof DB !== 'undefined' ? DB.find(d => d.id === p.id)?.sprite : "");
    const emojiFallback = p.emoji || (typeof DB !== 'undefined' ? DB.find(d => d.id === p.id)?.emoji : "👤");

    // Determinamos si hay que girar la imagen (Solo para el jugador)
    // Si es saga Pokemon y es el lado del jugador, giramos.
    const esPokemon = p.saga && p.saga.toLowerCase().includes('pokemon');
    const estiloGiro = (lado === "jugador" && esPokemon) ? "transform: scaleX(-1);" : "";

    if (spriteURL && spriteURL.trim() !== "") {
        return `
            <div class="sprite-container ${clases}" style="position:relative; display:inline-block; ${estiloGiro}">
                <img src="${spriteURL}" class="sprite ${clases}" 
                     style="display:block; max-width:100%;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                <span class="sprite-emoji ${clases}" style="display:none; font-size:2rem;">${emojiFallback}</span>
            </div>
        `;
    }
    return `<span class="sprite-emoji ${clases}" style="font-size:2rem; ${estiloGiro}">${emojiFallback}</span>`;
};
// ================================================================
// 3. SISTEMA DE TIENDA DINÁMICA (ROTACIÓN DIARIA)
// ================================================================




// ================================================================
// 4. FUNCIONES DE COMPRA Y TRANSACCIÓN
// ================================================================


// ================================================================
// 5. GESTIÓN DE EQUIPO Y MENÚ DE COPIAS
// ================================================================
function renderEquipo() {
    const list = document.getElementById('sagas-list');
    const filtro = document.getElementById('busqueda-equipo')?.value.toLowerCase() || "";
    if (!list) return;
    list.innerHTML = '';

    const especies = {};
    inventario.forEach(p => {
        if (!especies[p.id]) especies[p.id] = { ...p, cantidad: 0, copias: [] };
        especies[p.id].cantidad++;
        especies[p.id].copias.push(p);
    });

    const sagas = {};
    Object.values(especies).forEach(p => {
        if (p.nombre.toLowerCase().includes(filtro)) {
            if (!sagas[p.saga]) sagas[p.saga] = [];
            sagas[p.saga].push(p);
        }
    });

    for (const s in sagas) {
        const sec = document.createElement('div');
        sec.className = 'saga-section';
        sec.innerHTML = `<h3 class="saga-title" style="color:#4ade80; border-bottom:1px solid #333; padding-bottom:5px; margin-top:20px;">${s}</h3><div class="grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap:15px; margin-top:10px;"></div>`;
        const grid = sec.querySelector('.grid');
        
        sagas[s].forEach(p => {
            const enEquipo = p.copias.some(c => equipoUids.includes(c.uid));
            grid.innerHTML += `
                <div class="card-stack" style="position:relative;">
                    ${p.cantidad > 1 ? `<div class="stack-count" style="position:absolute; top:-5px; right:-5px; background:#4ade80; color:black; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:bold; z-index:2;">${p.cantidad}</div>` : ''}
                    <div class="card ${enEquipo ? 'active-team' : ''}" 
                         style="background:#1a1a2e; border:1px solid ${enEquipo ? '#4ade80' : '#333'}; padding:10px; border-radius:12px; text-align:center; cursor:pointer;"
                         onclick="abrirMenuCopias('${p.id}')" 
                         onmouseenter="mostrarInfo('${p.id}')">
                        <div class="card-avatar">${obtenerImagenHTML(p)}</div>
                        <div class="card-name" style="color:white; font-size:0.8rem; margin-top:5px;">${p.nombre}</div>
                    </div>
                </div>`;
        });
        list.appendChild(sec);
    }
}

function abrirMenuCopias(id) {
    const copias = inventario.filter(p => p.id == id);
    const overlay = document.createElement('div');
    overlay.id = "overlay-copias";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;display:flex;justify-content:center;align-items:center; backdrop-filter:blur(5px);";
    
    let html = `
        <div style="background:#1a1a2e; padding:30px; border-radius:25px; border:2px solid #4ade80; width:350px; color: white; max-height: 80vh; overflow-y: auto;">
            <div style="text-align:center; margin-bottom: 20px;">
                ${obtenerImagenHTML(copias[0])}
                <h2 style="color:#4ade80; margin:10px 0;">${copias[0].nombre}</h2>
                <p style="color:#666; font-size:0.9rem;">Selecciona una copia para tu equipo</p>
            </div>
    `;

    copias.forEach((c, index) => {
        const enEq = equipoUids.includes(c.uid);
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin:10px 0; padding:15px; background:#0f0f1b; border-radius:12px; border:1px solid ${enEq ? '#4ade80' : '#333'};">
                <div>
                    <span style="display:block; font-weight:bold;">Copia #${index + 1}</span>
                    <span style="font-size:0.8rem; color:#4ade80;">NV. ${c.lvl || 1}</span>
                </div>
                <button onclick="toggleEquipo('${c.uid}'); document.getElementById('overlay-copias').remove()" 
                        style="padding:8px 16px; cursor:pointer; background:${enEq ? '#ef4444' : '#4ade80'}; color:black; border:none; border-radius:8px; font-weight:bold;">
                    ${enEq ? 'RETIRAR' : 'ELEGIR'}
                </button>
            </div>`;
    });

    html += `
            <button onclick="document.getElementById('overlay-copias').remove()" 
                    style="width:100%; margin-top:20px; background: #333; color: white; border: none; padding: 15px; border-radius: 12px; cursor: pointer; font-weight:bold;">
                CERRAR
            </button>
        </div>`;

    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}

function toggleEquipo(uid) {
    const idx = equipoUids.indexOf(uid);
    if (idx > -1) {
        equipoUids.splice(idx, 1);
    } else {
        if (equipoUids.length < 3) {
            equipoUids.push(uid);
        } else {
            alert("⚠️ Máximo 3 héroes en el equipo.");
        }
    }
    guardar();
    renderEquipo();
    renderLobby();
}

// ================================================================
// 6. POKÉDEX, LOBBY Y NAVEGACIÓN
// ================================================================
function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;
    
    const totalEspecies = DB.length;
    const especiesObtenidas = DB.filter(p => inventario.some(inv => inv.id === p.id)).length;
    const porcentaje = Math.round((especiesObtenidas / totalEspecies) * 100);

    let html = `
        <div class="dex-progress-wrapper" style="grid-column: 1 / -1; margin-bottom: 25px; background:#1a1a2e; padding:15px; border-radius:15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: white; font-weight:bold;">
                <span>PROGRESO DE COLECCIÓN</span>
                <span>${especiesObtenidas} / ${totalEspecies} (${porcentaje}%)</span>
            </div>
            <div style="width: 100%; height: 12px; background: #0f0f1b; border-radius: 10px; overflow: hidden; border:1px solid #333;">
                <div style="width: ${porcentaje}%; height: 100%; background: linear-gradient(90deg, #4ade80, #22c55e); transition: 1s width;"></div>
            </div>
        </div>
    `;

    DB.sort((a,b) => a.id - b.id).forEach(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        const color = RAREZAS[p.rareza] || '#94a3b8';
        
        html += `
            <div class="dex-card ${tiene ? 'registrado' : 'desconocido'}" 
                 style="background:#1a1a2e; border:2px solid ${tiene ? color : '#333'}; border-radius:15px; padding:15px; text-align:center; position:relative; cursor:pointer;" 
                 onclick="${tiene ? `mostrarInfo('${p.id}')` : ''}">
                <div style="position:absolute; top:5px; left:10px; color:#666; font-size:0.7rem;">#${p.id}</div>
                <div class="dex-body" style="margin:10px 0; filter: ${tiene ? 'none' : 'brightness(0) invert(0.2)'}">${obtenerImagenHTML(p)}</div>
                <div class="dex-footer">
                    <div style="color:${tiene ? 'white' : '#444'}; font-weight:bold; font-size:0.8rem;">${tiene ? p.nombre : '???'}</div>
                </div>
                ${tiene ? '<div style="position:absolute; bottom:5px; right:10px; color:#4ade80; font-size:0.8rem;">✔</div>' : ''}
            </div>`;
    });
    grid.innerHTML = html;
}

window.renderLobby = function() {
    const contenedor = document.getElementById('hero-display');
    if (!contenedor) return;
    const equipo = inventario.filter(p => equipoUids.includes(p.uid));
    
    if (equipo.length === 0) {
        contenedor.innerHTML = "<p style='color:#666;'>Tu equipo está vacío. Ve a la pestaña EQUIPO.</p>";
        return;
    }

    contenedor.innerHTML = equipo.map(p => `
        <div class="lobby-character-card" style="margin:0 20px; text-align:center;">
            <div class="lobby-sprite">${obtenerImagenHTML(p, "luchador-anim")}</div>
            <div class="lobby-info" style="background:rgba(0,0,0,0.5); padding:10px; border-radius:10px; margin-top:10px;">
                <p style="color:white; font-weight:bold; margin:0;">${p.nombre}</p>
                <div style="color:#4ade80; font-size:0.8rem;">LV. ${p.lvl || 1}</div>
                <small style="color:${RAREZAS[p.rareza]}; font-size:0.6rem; text-transform:uppercase;">${p.rareza}</small>
            </div>
        </div>`).join("");
};

function mostrar(pantalla) {
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(p => p.style.display = 'none');
    
    const pActive = document.getElementById('pantalla-' + pantalla);
    if (pActive) pActive.style.display = 'block';

    if (pantalla === 'tienda') renderTienda();
    if (pantalla === 'lobby') renderLobby();
    if (pantalla === 'equipo') renderEquipo();
    if (pantalla === 'pokedex') renderDex();
    
    actualizarHUD();
}

function mostrarInfo(id) {
    const p = DB.find(x => x.id == id);
    if (!p) return;
    document.getElementById('info-photo').innerHTML = obtenerImagenHTML(p);
    document.getElementById('info-name').innerText = p.nombre;
    document.getElementById('info-desc').innerText = descripciones[p.id] || "Héroe listo para la batalla.";
    document.getElementById('info-dex').innerText = p.id;
    document.getElementById('info-tipo').innerText = p.tipo.toUpperCase();
    document.getElementById('info-saga').innerText = p.saga;
}

// ================================================================
// 7. INICIO DE LA APLICACIÓN
// ================================================================
window.onload = () => {
    actualizarHUD();
    mostrar('lobby');
};