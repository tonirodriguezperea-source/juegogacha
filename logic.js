// --- logic.js (VERSIÓN BLINDADA CONTRA ERRORES) ---

let inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
let equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];

function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
}

// --- SISTEMA GACHA ---
function tirarGacha() {
    console.log("Invocando..."); 
    
    // Verificación de seguridad: ¿Existe la base de datos?
    if (typeof DB === 'undefined') return console.error("Error: DB no cargada");

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

    // Refrescar pantallas solo si existen en el HTML
    renderLobby();
    const pEquipo = document.getElementById('pantalla-equipo');
    if(pEquipo && pEquipo.style.display !== 'none') {
        renderEquipo();
    }
    renderDex();
}

// --- RENDER EQUIPO (SISTEMA DE SAGAS + HOVER) ---
function renderEquipo() {
    const sagasList = document.getElementById('sagas-list');
    const inputBusqueda = document.getElementById('busqueda-equipo');
    
    if (!sagasList) return; // Si no existe el contenedor, salimos para evitar error
    
    const filtro = inputBusqueda ? inputBusqueda.value.toLowerCase() : "";
    sagasList.innerHTML = '';

    if (inventario.length === 0) {
        sagasList.innerHTML = '<p style="padding:20px; color:var(--text-dim);">No tienes personajes aún.</p>';
        return;
    }

    const especiesUnicas = {};
    inventario.forEach(p => {
        if (!especiesUnicas[p.id]) {
            especiesUnicas[p.id] = { ...p, cantidad: 0, copias: [] };
        }
        especiesUnicas[p.id].cantidad++;
        especiesUnicas[p.id].copias.push(p);
    });

    const sagas = {};
    Object.values(especiesUnicas).forEach(p => {
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
            const wrap = document.createElement('div');
            wrap.className = 'card-stack';
            
            const estaEnEquipo = p.copias.some(c => equipoUids.includes(c.uid));
            const badge = p.cantidad > 1 ? `<div class="stack-count">x${p.cantidad}</div>` : '';

            wrap.innerHTML = `
                ${badge}
                <div class="card ${estaEnEquipo ? 'active-team' : ''}" 
                     onmouseenter="mostrarInfo('${p.id}')"
                     onclick="abrirSelectorCopias('${p.id}')">
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

// --- PANEL DE INFORMACIÓN (DERECHA) ---
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

    // Usamos el operador ?. para evitar errores si los elementos no están cargados
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

// --- SELECCIÓN DE PERSONAJE ---
function abrirSelectorCopias(personajeId) {
    const copias = inventario.filter(p => p.id == personajeId);
    if (copias.length === 1) {
        togglePersonajeEquipo(copias[0].uid);
    } else {
        let msg = `Tienes ${copias.length} copias. ¿Cuál quieres usar?\n`;
        copias.forEach((c, i) => msg += `${i}: Nivel ${c.lvl} ${equipoUids.includes(c.uid) ? '(En Equipo)' : ''}\n`);
        let choice = prompt(msg);
        if (choice !== null && choice !== "" && copias[choice]) {
            togglePersonajeEquipo(copias[choice].uid);
        }
    }
}

function togglePersonajeEquipo(uid) {
    const index = equipoUids.indexOf(uid);
    if (index > -1) {
        equipoUids.splice(index, 1);
    } else {
        if (equipoUids.length < 3) {
            equipoUids.push(uid);
        } else {
            alert("Equipo lleno (Máx 3).");
        }
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
        display.innerHTML = '<p>Equipo vacío</p>';
    } else {
        display.innerHTML = team.map((p, i) => {
            const style = i === 1 ? 'transform:scale(1.3); margin: 0 20px;' : '';
            return `<span style="display:inline-block; transition: 0.3s; ${style}">${p.emoji}</span>`;
        }).join('');
    }
}

function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;
    grid.innerHTML = DB.map(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        return `<div class="card" style="opacity:${tiene?1:0.3}">${p.emoji}<br>${tiene?p.nombre:'???'}</div>`;
    }).join('');
}