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

function tirarGacha() {
    if (typeof DB === 'undefined') return;
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    let opciones = DB.filter(p => p.rareza === rareza);
    const base = opciones[Math.floor(Math.random() * opciones.length)];
    
    const nuevo = { ...base, uid: "UID-" + Date.now(), lvl: 1 };
    inventario.push(nuevo);
    guardar();
    alert("¡Has obtenido a " + nuevo.nombre + "!");
    renderLobby();
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
                        <span style="font-size:3rem">${p.emoji}</span>
                        <div style="font-size:0.8rem; font-weight:bold;">${p.nombre}</div>
                    </div>
                </div>`;
        });
        list.appendChild(sec);
    }
}

function mostrarInfo(id) {
    const p = DB.find(x => x.id == id);
    if(!p) return;
    document.getElementById('info-photo').innerText = p.emoji;
    document.getElementById('info-name').innerText = p.nombre;
    document.getElementById('info-desc').innerText = descripciones[p.id] || "Héroe listo para la acción.";
    document.getElementById('info-dex').innerText = p.id;
    document.getElementById('info-tipo').innerText = p.tipo.toUpperCase();
    document.getElementById('info-saga').innerText = p.saga;
}

function abrirMenuCopias(id) {
    const copias = inventario.filter(p => p.id == id);
    const overlay = document.createElement('div');
    overlay.id = "overlay-copias";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center;";
    
    let html = `<div class="modal-copias-content" style="background:var(--bg-panel);padding:20px;border-radius:15px;border:2px solid var(--accent);width:300px;">
        <h3 style="text-align:center">Copias de ${copias[0].nombre}</h3>`;
    
    copias.forEach(c => {
        const enEq = equipoUids.includes(c.uid);
        html += `
            <div class="copia-row" style="display:flex;justify-content:space-between;margin:10px 0;padding:10px;background:var(--bg-dark);border-radius:8px;">
                <span>NV.${c.lvl} ${enEq ? '⭐' : ''}</span>
                <button onclick="toggleEquipo('${c.uid}'); document.getElementById('overlay-copias').remove()" class="nav-btn">
                    ${enEq ? 'Quitar' : 'Poner'}
                </button>
            </div>`;
    });
    html += `<button onclick="document.getElementById('overlay-copias').remove()" class="nav-btn" style="width:100%;margin-top:10px;color:var(--danger)">Cerrar</button></div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}

function toggleEquipo(uid) {
    const idx = equipoUids.indexOf(uid);
    if (idx > -1) equipoUids.splice(idx, 1);
    else if (equipoUids.length < 3) equipoUids.push(uid);
    else alert("Equipo lleno.");
    guardar();
    renderEquipo();
    renderLobby();
}

function renderLobby() {
    const team = inventario.filter(p => equipoUids.includes(p.uid));
    const display = document.getElementById('hero-display');
    if (display) display.innerHTML = team.map(p => `<span>${p.emoji}</span>`).join('');
}

function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (grid) grid.innerHTML = DB.map(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        return `<div class="card" style="opacity:${tiene?1:0.3}">${p.emoji}<br>${tiene?p.nombre:'??'}</div>`;
    }).join('');
}

function borrarPartida() {
    const confirmar = confirm("⚠️ ¿ESTÁS SEGURO? ⚠️\nEsto borrará todos tus héroes y tu equipo para siempre.");
    
    if (confirmar) {
        // Borramos los datos del almacenamiento local
        localStorage.removeItem("gq_inv");
        localStorage.removeItem("gq_team");
        
        // Opcional: Si tienes más datos como oro o nivel de cuenta, límpialos también
        // localStorage.clear(); // Esto borraría ABSOLUTAMENTE todo lo del dominio
        
        alert("Partida borrada. Reiniciando aventura...");
        
        // Recargamos la página para que el inventario empiece vacío
        location.reload();
    }
}