let inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
let equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];

function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
}

function renderEquipo() {
    const list = document.getElementById('sagas-list');
    if (!list) return;
    list.innerHTML = '';

    // Agrupar solo lo que tenemos
    const especies = {};
    inventario.forEach(p => {
        if (!especies[p.id]) especies[p.id] = { ...p, cantidad: 0, copias: [] };
        especies[p.id].cantidad++;
        especies[p.id].copias.push(p);
    });

    // Filtrar sagas vacías
    const sagas = {};
    Object.values(especies).forEach(p => {
        if (!sagas[p.saga]) sagas[p.saga] = [];
        sagas[p.saga].push(p);
    });

    for (const s in sagas) {
        const sec = document.createElement('div');
        sec.innerHTML = `<h3 class="saga-title">${s}</h3>`;
        const grid = document.createElement('div');
        grid.className = 'grid';
        
        sagas[s].forEach(p => {
            const enEquipo = p.copias.some(c => equipoUids.includes(c.uid));
            grid.innerHTML += `
                <div class="card-stack">
                    ${p.cantidad > 1 ? `<div class="stack-count">x${p.cantidad}</div>` : ''}
                    <div class="card ${enEquipo ? 'active-team' : ''}" onclick="abrirMenuCopias('${p.id}')" onmouseenter="mostrarInfo('${p.id}')">
                        <span style="font-size:2rem">${p.emoji}</span>
                        <div style="font-size:0.7rem">${p.nombre}</div>
                    </div>
                </div>
            `;
        });
        sec.appendChild(grid);
        list.appendChild(sec);
    }
}

function abrirMenuCopias(id) {
    const copias = inventario.filter(p => p.id == id);
    const overlay = document.createElement('div');
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center;";
    
    let html = `<div style="background:var(--bg-panel);padding:20px;border-radius:15px;border:2px solid var(--accent);width:280px;">`;
    html += `<h3 style="margin-top:0">Copias de ${copias[0].nombre}</h3>`;
    
    copias.forEach(c => {
        const enEq = equipoUids.includes(c.uid);
        html += `
            <div style="display:flex;justify-content:space-between;margin:10px 0;padding:10px;background:#1e293b;border-radius:8px;">
                <span>NV.${c.lvl} ${enEq ? '⭐' : ''}</span>
                <button onclick="toggleEquipo('${c.uid}'); this.parentElement.parentElement.parentElement.remove()" class="nav-btn">
                    ${enEq ? 'Quitar' : 'Poner'}
                </button>
            </div>
        `;
    });
    html += `<button onclick="this.parentElement.parentElement.remove()" class="nav-btn" style="width:100%;margin-top:10px">Cerrar</button></div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}

function toggleEquipo(uid) {
    const idx = equipoUids.indexOf(uid);
    if (idx > -1) equipoUids.splice(idx, 1);
    else if (equipoUids.length < 3) equipoUids.push(uid);
    else alert("Máximo 3 héroes");
    guardar();
    renderEquipo();
    renderLobby();
}

function mostrarInfo(id) {
    const p = DB.find(x => x.id == id);
    document.getElementById('info-photo').innerText = p.emoji;
    document.getElementById('info-name').innerText = p.nombre;
    document.getElementById('info-dex').innerText = p.id;
    document.getElementById('info-tipo').innerText = p.tipo;
    document.getElementById('info-saga').innerText = p.saga;
}

function renderLobby() {
    const team = inventario.filter(p => equipoUids.includes(p.uid));
    const display = document.getElementById('hero-display');
    if (!display) return;
    display.innerHTML = team.map(p => `<span>${p.emoji}</span>`).join('');
}