// --- logic.js (VERSIÓN PRO: MENÚS VISUALES + FILTROS INTELIGENTES) ---

let inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
let equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];

function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
}

// --- SISTEMA GACHA ---
function tirarGacha() {
    if (typeof DB === 'undefined') return console.error("DB no encontrada");

    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    
    let opciones = DB.filter(p => p.rareza === rareza);
    if (opciones.length === 0) opciones = DB;

    const base = opciones[Math.floor(Math.random() * opciones.length)];
    const nuevo = { 
        ...base, 
        uid: "UID-" + Date.now() + "-" + Math.floor(Math.random() * 1000), 
        lvl: 1, 
        xp: 0 
    };
    
    inventario.push(nuevo);
    guardar();

    alert(`✨ ¡NUEVO HÉROE! ✨\nHas obtenido a: ${nuevo.nombre}`);

    renderLobby();
    renderDex();
    if(document.getElementById('pantalla-equipo').style.display !== 'none') renderEquipo();
}

// --- RENDER EQUIPO (SÓLO PERSONAJES QUE TIENES) ---
function renderEquipo() {
    const sagasList = document.getElementById('sagas-list');
    const inputBusqueda = document.getElementById('busqueda-equipo');
    if (!sagasList) return;
    
    const filtro = inputBusqueda ? inputBusqueda.value.toLowerCase() : "";
    sagasList.innerHTML = '';

    if (inventario.length === 0) {
        sagasList.innerHTML = '<p style="padding:20px; color:var(--text-dim);">No tienes personajes aún.</p>';
        return;
    }

    // Agrupar por especie para mostrar "stacks" (el número x2, x5)
    const especiesPoseidas = {};
    inventario.forEach(p => {
        if (!especiesPoseidas[p.id]) {
            especiesPoseidas[p.id] = { ...p, cantidad: 0, copias: [] };
        }
        especiesPoseidas[p.id].cantidad++;
        especiesPoseidas[p.id].copias.push(p);
    });

    // Organizar por sagas (Sólo las sagas que tengan personajes que posees)
    const sagas = {};
    Object.values(especiesPoseidas).forEach(p => {
        if (p.nombre.toLowerCase().includes(filtro)) {
            if (!sagas[p.saga]) sagas[p.saga] = [];
            sagas[p.saga].push(p);
        }
    });

    for (const nombreSaga in sagas) {
        const seccion = document.createElement('div');
        seccion.className = 'saga-section';
        seccion.innerHTML = `<h3 class="saga-title">${nombreSaga}</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'grid'; 

        sagas[nombreSaga].forEach(p => {
            const estaEnEquipo = p.copias.some(c => equipoUids.includes(c.uid));
            const wrap = document.createElement('div');
            wrap.className = 'card-stack';
            
            wrap.innerHTML = `
                ${p.cantidad > 1 ? `<div class="stack-count">x${p.cantidad}</div>` : ''}
                <div class="card ${estaEnEquipo ? 'active-team' : ''}" 
                     onmouseenter="mostrarInfo('${p.id}')"
                     onclick="abrirMenuCopias('${p.id}')">
                    <span class="card-emoji" style="font-size:3rem; display:block;">${p.emoji}</span>
                    <div style="font-size:0.8rem; font-weight:bold;">${p.nombre}</div>
                </div>
            `;
            grid.appendChild(wrap);
        });
        seccion.appendChild(grid);
        sagasList.appendChild(seccion);
    }
}

// --- PANEL DE INFORMACIÓN ---
function mostrarInfo(personajeId) {
    const p = DB.find(x => x.id == personajeId);
    if (!p) return;

    const descripciones = {
        "1": "Bulbasaur es un Pokémon tipo planta. Lleva una semilla en su lomo que crece con él.",
        "4": "Charmander prefiere los lugares cálidos. La llama de su cola indica su salud.",
        "7": "Squirtle se protege con su caparazón y dispara chorros de agua a presión.",
        "101": "Son Goku, el guerrero legendario que protege la Tierra con su fuerza infinita.",
        "102": "Vegeta, el príncipe de los saiyans. Su orgullo es tan grande como su poder.",
        "103": "Gohan, hijo de Goku. Posee un potencial oculto que despierta en momentos críticos."
    };

    const elPhoto = document.getElementById('info-photo');
    const elName = document.getElementById('info-name');
    const elDesc = document.getElementById('info-desc');
    const elDex = document.getElementById('info-dex');
    const elTipo = document.getElementById('info-tipo');
    const elSaga = document.getElementById('info-saga');

    if (elPhoto) elPhoto.innerText = p.emoji;
    if (elName) elName.innerText = p.nombre;
    if (elDesc) elDesc.innerText = descripciones[p.id] || "Héroe legendario listo para la batalla.";
    if (elDex) elDex.innerText = p.id;
    if (elTipo) elTipo.innerText = p.tipo.toUpperCase();
    if (elSaga) elSaga.innerText = p.saga;
}

// --- NUEVO SISTEMA DE MENÚ DE COPIAS ---
function abrirMenuCopias(id) {
    const copias = inventario.filter(p => p.id == id);
    
    const overlay = document.createElement('div');
    overlay.id = "overlay-copias";
    // El estilo se aplica aquí directamente para asegurar que funcione sin fallos
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(5px);";
    
    let filas = copias.map(c => {
        const enEquipo = equipoUids.includes(c.uid);
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; margin:8px 0; padding:12px; border-radius:10px; border:1px solid ${enEquipo?'var(--accent)':'#334155'};">
                <span style="font-weight:bold; color:white;">NV.${c.lvl} ${enEquipo ? '⭐' : ''}</span>
                <button onclick="togglePersonajeEquipo('${c.uid}'); cerrarModal();" class="nav-btn" style="padding:5px 12px; font-size:0.8rem; border-color:${enEquipo?'var(--danger)':'var(--accent)'}; color:white;">
                    ${enEquipo ? 'Quitar' : 'Seleccionar'}
                </button>
            </div>
        `;
    }).join('');

    overlay.innerHTML = `
        <div style="background:#0f172a; padding:25px; border-radius:20px; border:2px solid var(--accent); width:320px; box-shadow:0 0 40px rgba(0,0,0,0.6);">
            <h3 style="margin-top:0; text-align:center; color:var(--accent);">Elegir ${copias[0].nombre}</h3>
            <div style="max-height:300px; overflow-y:auto; margin-bottom:15px;">${filas}</div>
            <button onclick="cerrarModal()" class="nav-btn" style="width:100%; border-color:var(--danger); color:var(--danger);">CERRAR</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

function cerrarModal() {
    const modal = document.getElementById('overlay-copias');
    if(modal) modal.remove();
}

function togglePersonajeEquipo(uid) {
    const index = equipoUids.indexOf(uid);
    if (index > -1) {
        equipoUids.splice(index, 1);
    } else {
        if (equipoUids.length < 3) equipoUids.push(uid);
        else alert("Equipo lleno (Máx 3).");
    }
    guardar();
    renderEquipo();
    renderLobby();
}

function renderLobby() {
    const display = document.getElementById('hero-display');
    if (!display) return;
    const team = inventario.filter(p => equipoUids.includes(p.uid));
    
    if (team.length === 0) {
        display.innerHTML = '<p style="color:var(--text-dim)">Equipo vacío</p>';
    } else {
        display.innerHTML = team.map((p, i) => {
            const scale = i === 1 ? 'scale(1.3)' : 'scale(1)';
            const margin = i === 1 ? '0 30px' : '0';
            return `<span style="display:inline-block; transform:${scale}; margin:${margin}; filter:drop-shadow(0 0 10px var(--accent-glow)); transition:0.3s;">${p.emoji}</span>`;
        }).join('');
    }
}

function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;
    grid.innerHTML = DB.map(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        return `<div class="card" style="opacity:${tiene?1:0.2}; filter:${tiene?'grayscale(0)':'grayscale(1)'}">${p.emoji}<br>${tiene?p.nombre:'???'}</div>`;
    }).join('');
}