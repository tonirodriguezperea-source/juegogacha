// 1. Configuración Visual (CORREGIDA PARA COMBATE)
function obtenerImagenHTML(p, claseExtra = "") {
    if (p && p.sprite) {
        // Ahora inyecta correctamente las clases de giro y animación
        return `<img src="${p.sprite}" class="sprite-render ${claseExtra}" alt="${p.nombre}">`;
    }
    // Si no hay sprite, mantiene el emoji pero permite clases
    return `<span class="emoji-render ${claseExtra}">${p && p.emoji ? p.emoji : '❓'}</span>`;
}

// 2. Carga inicial de datos
let inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
let equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];

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
    const nuevo = { ...base, uid: "UID-" + Date.now() + Math.random(), lvl: 1 };
    
    inventario.push(nuevo);
    guardar();
    
    alert(`✨ ¡Has invocado a ${nuevo.nombre}! ✨`);
    
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

    if (elements.photo) elements.photo.innerHTML = obtenerImagenHTML(p, "info-sprite");
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
    overlay.className = "modal-overlay"; 
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;";
    
    let html = `<div style="background:#1a1a2e;padding:25px;border-radius:20px;border:2px solid #4ade80;width:320px;box-shadow: 0 0 20px rgba(0,0,0,0.5); color: white;">
        <div style="text-align:center; margin-bottom: 15px;">${obtenerImagenHTML(copias[0], 'modal-sprite')}</div>
        <h3 style="text-align:center;margin-top:0;color:#4ade80;">Gestionar ${copias[0].nombre}</h3>`;
    
    copias.forEach(c => {
        const enEq = equipoUids.includes(c.uid);
        html += `
            <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0;padding:12px;background:#0f0f1b;border-radius:10px;border:1px solid #333;">
                <span style="font-weight:bold;">NV.${c.lvl} ${enEq ? '⭐' : ''}</span>
                <button onclick="toggleEquipo('${c.uid}'); document.getElementById('overlay-copias').remove()" 
                        style="padding:5px 15px; font-size:0.8rem; cursor:pointer; background:transparent; color:${enEq ? '#ef4444' : '#4ade80'}; border: 1px solid ${enEq ? '#ef4444' : '#4ade80'}; border-radius: 5px;">
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

function renderLobby() {
    const team = inventario.filter(p => equipoUids.includes(p.uid));
    const display = document.getElementById('hero-display');
    if (!display) return;
    
    if (team.length === 0) {
        display.innerHTML = `<p style="font-size:1rem; color:#888">No hay héroes seleccionados</p>`;
    } else {
        // Añadimos una clase de tamaño para que en el lobby no se vean minúsculos
        display.innerHTML = team.map(p => `<div class="lobby-hero">${obtenerImagenHTML(p, "sprite-lobby")}</div>`).join('');
    }
}

function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;
    grid.innerHTML = DB.map(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        return `
            <div class="card" style="opacity:${tiene ? 1 : 0.2}; filter:${tiene ? 'none' : 'grayscale(100%)'}">
                <div class="card-avatar">${obtenerImagenHTML(p)}</div>
                <div class="card-name">${tiene ? p.nombre : '???'}</div>
            </div>`;
    }).join('');
}

function borrarPartida() {
    const confirmar = confirm("⚠️ ¿ESTÁS TOTALMENTE SEGURO? ⚠️\nPerderás todos tus personajes y niveles para siempre.");
    if (confirmar) {
        localStorage.clear();
        alert("Memoria borrada. Reiniciando juego...");
        location.reload();
    }
}