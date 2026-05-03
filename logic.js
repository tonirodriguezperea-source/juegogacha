// --- 1. CONFIGURACIÓN VISUAL ---
window.obtenerImagenHTML = function(p, clases = "") {
    if (!p) return `<span class="sprite ${clases}">❓</span>`;
    const spriteURL = p.sprite || (typeof DB !== 'undefined' ? DB.find(d => d.id === p.id)?.sprite : "");
    const emojiFallback = p.emoji || (typeof DB !== 'undefined' ? DB.find(d => d.id === p.id)?.emoji : "👤");

    if (spriteURL && spriteURL.trim() !== "") {
        return `
            <img src="${spriteURL}" class="sprite ${clases}" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
            <span class="sprite-emoji ${clases}" style="display:none;">${emojiFallback}</span>
        `;
    }
    return `<span class="sprite-emoji ${clases}">${emojiFallback}</span>`;
};

// --- 2. CARGA DE DATOS Y ECONOMÍA ---
var inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
var equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];
var monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
// IMPORTANTE: Cargamos los tickets del almacenamiento
var ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0; 
var tiendaDiaria = JSON.parse(localStorage.getItem("gq_tienda_diaria")) || { fecha: "", items: [] };

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
    localStorage.setItem("gq_tk_normal", ticketsNormales); // Guardamos tickets
    localStorage.setItem("gq_tienda_diaria", JSON.stringify(tiendaDiaria));
}

function actualizarHUD() {
    // Actualiza Monedas
    const elMonedas = document.getElementById('cont-monedas');
    if (elMonedas) elMonedas.innerText = monedas;
    
    // Actualiza Tickets (esto hace que funcionen los números en la pantalla de Gacha)
    const elTickets = document.getElementById('val-tk-normal');
    if (elTickets) elTickets.innerText = ticketsNormales;
}

// --- 3. FUNCIONES DE JUEGO (CORREGIDO GACHA) ---

// Cambiado de tirarGacha a invocar para que el HTML lo reconozca
function invocar(saga) {
    if (typeof DB === 'undefined') return console.error("Base de datos no encontrada");
    
    // Comprobar si tiene tickets
    if (ticketsNormales <= 0) {
        alert("❌ No tienes tickets. ¡Clica en el botón de Regalo en el Inicio!");
        return;
    }

    // Restar ticket y guardar
    ticketsNormales--;

    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    
    // Filtrar por rareza y opcionalmente por saga (Pokémon o Saiyan)
    let opciones = DB.filter(p => p.rareza === rareza);
    if (saga) {
        let opcionesSaga = opciones.filter(p => p.saga.toLowerCase() === saga.toLowerCase());
        if (opcionesSaga.length > 0) opciones = opcionesSaga;
    }

    if (opciones.length === 0) opciones = DB.filter(p => p.rareza === "comun");
    
    const base = opciones[Math.floor(Math.random() * opciones.length)];

    // Límite de 10 copias
    const copiasActuales = inventario.filter(p => p.id === base.id).length;
    if (copiasActuales >= 10) {
        alert(`¡Ya tienes 10 copias de ${base.nombre}!`);
        monedas += 100; 
        guardar();
        actualizarHUD();
        return; 
    }

    const nuevo = { ...base, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
    inventario.push(nuevo);
    
    // Ganancia de monedas por cada tirada
    const bonus = Math.floor(Math.random() * 101) + 50; 
    monedas += bonus;
    
    guardar();
    actualizarHUD();
    alert(`✨ ¡Invocado: ${nuevo.nombre}! (+${bonus} 💰) ✨`);
    
    // Actualizar todas las pantallas por si están abiertas
    if (typeof renderLobby === 'function') renderLobby();
    if (typeof renderEquipo === 'function') renderEquipo();
    if (typeof renderDex === 'function') renderDex();
}

function regalarTickets() {
    ticketsNormales += 10;
    guardar();
    actualizarHUD();
    alert("🎁 ¡10 Tickets añadidos!");
}

// --- RESTO DE TUS FUNCIONES (SIN TOCAR NADA) ---

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
        sec.innerHTML = `<h3 class="saga-title">${s}</h3><div class="grid"></div>`;
        const grid = sec.querySelector('.grid');
        sagas[s].forEach(p => {
            const enEquipo = p.copias.some(c => equipoUids.includes(c.uid));
            grid.innerHTML += `
                <div class="card-stack">
                    ${p.cantidad > 1 ? `<div class="stack-count">x${p.cantidad}</div>` : ''}
                    <div class="card ${enEquipo ? 'active-team' : ''}" 
                         onclick="abrirMenuCopias('${p.id}')" 
                         onmouseenter="mostrarInfo('${p.id}')">
                        <div class="card-avatar">${obtenerImagenHTML(p)}</div>
                        <div class="card-name">${p.nombre}</div>
                    </div>
                </div>`;
        });
        list.appendChild(sec);
    }
}

function mostrarInfo(id) {
    const p = DB.find(x => x.id == id);
    if (!p) return;
    const elements = {
        photo: document.getElementById('info-photo'),
        name: document.getElementById('info-name'),
        desc: document.getElementById('info-desc'),
        dex: document.getElementById('info-dex'),
        tipo: document.getElementById('info-tipo'),
        saga: document.getElementById('info-saga')
    };
    if (elements.photo) elements.photo.innerHTML = obtenerImagenHTML(p);
    if (elements.name) elements.name.innerText = p.nombre;
    if (elements.desc) elements.desc.innerText = descripciones[p.id] || "Héroe listo para la batalla.";
    if (elements.dex) elements.dex.innerText = p.id;
    if (elements.tipo) elements.tipo.innerText = p.tipo ? p.tipo.toUpperCase() : "???";
    if (elements.saga) elements.saga.innerText = p.saga;
}

function abrirMenuCopias(id) {
    const copias = inventario.filter(p => p.id == id);
    const overlay = document.createElement('div');
    overlay.id = "overlay-copias";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;";
    
    let html = `
        <div style="background:#1a1a2e;padding:25px;border-radius:20px;border:2px solid #4ade80;width:340px;color: white;max-height: 85vh;overflow-y: auto;">
            <div style="text-align:center; margin-bottom: 15px;">${obtenerImagenHTML(copias[0])}</div>
            <h3 style="text-align:center;margin-top:0;color:#4ade80;">Gestionar ${copias[0].nombre}</h3>`;

    copias.forEach(c => {
        const enEq = equipoUids.includes(c.uid);
        html += `
            <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0;padding:12px;background:#0f0f1b;border-radius:10px;border:1px solid #333;">
                <span style="font-weight:bold;">NV.${c.lvl} ${enEq ? '⭐' : ''}</span>
                <button onclick="toggleEquipo('${c.uid}'); document.getElementById('overlay-copias').remove()" 
                        style="padding:5px 15px; cursor:pointer; background:transparent; color:${enEq ? '#ef4444' : '#4ade80'}; border: 1px solid ${enEq ? '#ef4444' : '#4ade80'}; border-radius: 5px;">
                    ${enEq ? 'Quitar' : 'Elegir'}
                </button>
            </div>`;
    });

    html += `<button onclick="document.getElementById('overlay-copias').remove()" style="width:100%; margin-top:15px; background: #333; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">Regresar</button></div>`;
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
            alert("⚠️ Tu equipo ya tiene 3 héroes.");
        }
    }
    guardar();
    renderEquipo();
    renderLobby();
}

window.renderLobby = function() {
    const contenedor = document.getElementById('hero-display');
    if (!contenedor) return;
    const equipo = inventario.filter(p => equipoUids.includes(p.uid));
    if (equipo.length === 0) {
        contenedor.innerHTML = "<p style='color: #94a3b8;'>Equipo vacío.</p>";
        return;
    }
    contenedor.innerHTML = equipo.map(p => `
        <div class="lobby-character-card">
            <div class="lobby-sprite">${obtenerImagenHTML(p, "luchador-anim")}</div>
            <div class="lobby-info" style="text-align: center;">
                <p style="font-weight: bold; margin: 0;">${p.nombre}</p>
                <div style="background: rgba(74, 222, 128, 0.2); color: #4ade80; border: 1px solid #4ade80; border-radius: 4px; display: inline-block; padding: 0px 8px; font-size: 0.75rem; margin: 4px 0;">LV. ${p.lvl || 1}</div>
                <br>
                <small style="text-transform: uppercase;">${p.rareza}</small>
            </div>
        </div>
    `).join("");
};

function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;
    const totalEspecies = DB.length;
    const especiesObtenidas = DB.filter(p => inventario.some(inv => inv.id === p.id)).length;
    const porcentaje = Math.round((especiesObtenidas / totalEspecies) * 100);
    const dbOrdenada = [...DB].sort((a, b) => a.id - b.id);
    
    let html = `<div style="grid-column: 1 / -1; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; color: white;">
            <span>Progreso</span><span>${especiesObtenidas} / ${totalEspecies} (${porcentaje}%)</span>
        </div>
        <div style="width: 100%; height: 10px; background: #2d2d44; border-radius: 10px; overflow: hidden;">
            <div style="width: ${porcentaje}%; height: 100%; background: #4ade80;"></div>
        </div>
    </div>`;

    html += dbOrdenada.map(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        return `<div class="dex-card ${tiene ? 'registrado' : 'desconocido'}" onclick="${tiene ? `mostrarInfo('${p.id}')` : ''}">
            <div class="dex-header">#${String(p.id).padStart(3, '0')}</div>
            <div class="dex-body">${obtenerImagenHTML(p)}</div>
            <div class="dex-footer">${tiene ? p.nombre : '???'}</div>
        </div>`;
    }).join('');
    grid.innerHTML = html;
}

// --- 4. NAVEGACIÓN Y CARGA ---
function mostrar(pantalla) {
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(p => p.style.display = 'none');

    const pActive = document.getElementById('pantalla-' + pantalla);
    if (pActive) pActive.style.display = 'block';

    const renders = {
        'lobby': renderLobby,
        'equipo': renderEquipo,
        'pokedex': renderDex,
        'tienda': typeof renderTienda === 'function' ? renderTienda : null
    };

    const ejecutarRender = renders[pantalla];
    if (typeof ejecutarRender === 'function') ejecutarRender();
    
    actualizarHUD();
}

function borrarPartida() {
    if (confirm("⚠️ ¿BORRAR TODO?")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = () => {
    actualizarHUD();
    mostrar('lobby');
};