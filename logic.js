// 1. Configuración Visual (UNIFICADA Y CORREGIDA)
window.obtenerImagenHTML = function(p, clases = "") {
    if (!p) return `<span class="sprite ${clases}">❓</span>`;

    // Buscamos el sprite en el objeto o en la DB original por si acaso
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

// 2. Carga inicial de datos
var inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
var equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];

const descripciones = {
    "1": "Bulbasaur es un Pokémon tipo planta. Lleva una semilla en su lomo que crece con él.",
    "4": "Charmander prefiere los lugares cálidos. La llama de su cola indica su salud.",
    "7": "Squirtle se protege con su caparazón y dispara chorros de agua a presión.",
    "101": "Son Goku, el guerrero legendario que protege la Tierra con su fuerza infinita.",
    "102": "Vegeta, el príncipe de los saiyans. Su orgullo es tan grande como su poder.",
    "103": "Gohan, hijo de Goku. Posee un potencial oculto que despierta en momentos críticos."
};

function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
}

// 3. Funciones de Juego
function tirarGacha() {
    if (typeof DB === 'undefined') return console.error("Base de datos no encontrada");
    
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    let opciones = DB.filter(p => p.rareza === rareza);
    if (opciones.length === 0) opciones = DB.filter(p => p.rareza === "comun");
    
    const base = opciones[Math.floor(Math.random() * opciones.length)];

    // --- NUEVA REGLA: LÍMITE DE 10 COPIAS ---
    const copiasActuales = inventario.filter(p => p.id === base.id).length;
    
    if (copiasActuales >= 10) {
        alert(`¡Ya tienes 10 copias de ${base.nombre}! No puedes acumular más.`);
        // Aquí podrías añadir algo como: moneditas += 100; (si tuvieras dinero en el juego)
        return; 
    }
    // ----------------------------------------

    const nuevo = { ...base, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
    inventario.push(nuevo);
    guardar();
    
    alert(`✨ ¡Has invocado a ${nuevo.nombre}! ✨`);
    
    // Actualizar pantallas si están abiertas
    if (document.getElementById('pantalla-equipo').style.display !== 'none') renderEquipo();
    if (document.getElementById('pantalla-lobby').style.display !== 'none') renderLobby();
    if (document.getElementById('pantalla-pokedex').style.display !== 'none') renderDex();
}

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
    if (elements.tipo) elements.tipo.innerText = p.tipo.toUpperCase();
    if (elements.saga) elements.saga.innerText = p.saga;
}

function abrirMenuCopias(id) {
    const copias = inventario.filter(p => p.id == id);
    const overlay = document.createElement('div');
    overlay.id = "overlay-copias";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;";
    let html = `<div style="background:#1a1a2e;padding:25px;border-radius:20px;border:2px solid #4ade80;width:320px;color: white;">
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
    html += `<button onclick="document.getElementById('overlay-copias').remove()" style="width:100%;margin-top:15px; background: #333; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Regresar</button></div>`;
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
            alert("⚠️ Tu equipo ya tiene 3 héroes. Quita uno primero.");
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
        contenedor.innerHTML = "<p style='color: #94a3b8;'>Equipo vacío. Selecciona héroes en la pestaña EQUIPO.</p>";
        return;
    }

    contenedor.innerHTML = equipo.map(p => `
        <div class="lobby-character-card">
            <div class="lobby-sprite">${obtenerImagenHTML(p, "luchador-anim")}</div>
            <div class="lobby-info">
                <p style="font-weight: bold; margin: 5px 0;">${p.nombre}</p>
                <small style="color: ${typeof RAREZAS !== 'undefined' ? RAREZAS[p.rareza] : '#fff'}">${p.rareza.toUpperCase()}</small>
            </div>
        </div>
    `).join("");

    console.log("Lobby renderizado con éxito"); // Esto te confirmará en la consola que ha terminado
};

function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;

    // Ordenamos la DB por ID para que la Dex vaya en orden numérico
    const dbOrdenada = [...DB].sort((a, b) => a.id - b.id);

    grid.innerHTML = dbOrdenada.map(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        const colorRareza = RAREZAS[p.rareza] || '#94a3b8';
        
        // Formateamos el número a 3 cifras (ej: 001)
        const numeroDex = String(p.id).padStart(3, '0');

        return `
            <div class="dex-card ${tiene ? 'registrado' : 'desconocido'}" 
                 style="--card-color: ${tiene ? colorRareza : '#2d2d44'}"
                 onclick="${tiene ? `mostrarInfo('${p.id}')` : ''}">
                
                <div class="dex-header">
                    <span class="dex-number">#${numeroDex}</span>
                    <span class="dex-saga">${p.saga}</span>
                </div>

                <div class="dex-body">
                    <div class="card-avatar">
                        ${obtenerImagenHTML(p)}
                    </div>
                </div>

                <div class="dex-footer">
                    <div class="dex-name">${tiene ? p.nombre : '???'}</div>
                    ${tiene ? `<div class="dex-badge" style="background: ${colorRareza}">${p.rareza}</div>` : ''}
                </div>

                ${tiene ? '<div class="dex-check">✔</div>' : ''}
            </div>`;
    }).join('');
}

function borrarPartida() {
    if (confirm("⚠️ ¿BORRAR TODO?")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = () => {
    actualizarHUD(); // Esto forzará a que los "10" se cambien por el valor real guardado
    mostrar('lobby');
};