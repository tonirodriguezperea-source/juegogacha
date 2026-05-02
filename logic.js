// --- logic.js (VERSIÓN CORREGIDA Y BLINDADA) ---

// 1. Cargar datos del almacenamiento local al abrir el juego
let inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
let equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];

// 2. Función para guardar (se llama cada vez que algo cambia)
function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
}

// 3. Función del GACHA (Botón Invocar)
function tirarGacha() {
    console.log("Invocando..."); // Para que veas en la consola que funciona
    
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    
    let opciones = DB.filter(p => p.rareza === rareza);
    if (opciones.length === 0) opciones = DB; // Seguridad por si acaso

    const base = opciones[Math.floor(Math.random() * opciones.length)];
    
    // Crear el nuevo objeto personaje
    const nuevo = { 
        ...base, 
        uid: "UID-" + Date.now() + "-" + Math.floor(Math.random() * 1000), 
        lvl: 1, 
        xp: 0 
    };
    
    inventario.push(nuevo);
    guardar();

    // Mensaje visual
    alert(`✨ ¡INCREÍBLE! ✨\nHas obtenido a: ${nuevo.nombre} [${nuevo.rareza.toUpperCase()}]`);

    // Actualizar la pantalla en la que estemos automáticamente
    renderLobby();
    renderEquipo();
    renderDex();
}

// 4. Renderizar PANTALLA DE EQUIPO
function renderEquipo() {
    const grid = document.getElementById('equipo-grid');
    if (!grid) return; // Si no estamos en la pestaña equipo, no hace nada

    grid.innerHTML = ''; 

    if (inventario.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 50px; color: var(--text-dim);">Aún no tienes héroes. ¡Usa el botón Invocar!</p>';
        return;
    }

    inventario.forEach(p => {
        const estaEnEquipo = equipoUids.includes(p.uid);
        
        const card = document.createElement('div');
        // Usamos clases de CSS para el estilo
        card.className = `card ${estaEnEquipo ? 'active-team' : ''}`;
        card.onclick = () => togglePersonajeEquipo(p.uid);

        card.innerHTML = `
            <div class="rarity-line" style="background:${RAREZAS[p.rareza]}"></div>
            <span class="card-emoji" style="font-size:3rem; display:block; margin:10px 0;">${p.emoji}</span>
            <strong style="display:block; margin-bottom:5px;">${p.nombre}</strong>
            <div style="font-size:0.7rem; background:rgba(0,0,0,0.3); border-radius:4px; padding:2px;">NV.${p.lvl}</div>
        `;
        grid.appendChild(card);
    });
}

// 5. Añadir o quitar del equipo
function togglePersonajeEquipo(uid) {
    const index = equipoUids.indexOf(uid);
    
    if (index > -1) {
        equipoUids.splice(index, 1);
    } else {
        if (equipoUids.length < 3) {
            equipoUids.push(uid);
        } else {
            alert("⚠️ Equipo lleno (Máx 3)");
            return;
        }
    }
    
    guardar();
    renderEquipo();
    renderLobby();
}

// 6. Renderizar LOBBY (Personajes en el centro)
function renderLobby() {
    const display = document.getElementById('hero-display');
    if (!display) return;

    const team = inventario.filter(p => equipoUids.includes(p.uid));
    
    if (team.length === 0) {
        display.innerHTML = '<p style="color:var(--text-dim); font-size:0.9rem;">Tu equipo está vacío.<br>Selecciona héroes en la pestaña Equipo.</p>';
        return;
    }

    display.innerHTML = team.map((p, index) => {
        // El del medio (index 1) un poco más grande
        const scale = index === 1 ? 'scale(1.3)' : 'scale(1)';
        return `<span style="transform: ${scale}; transition: 0.3s; cursor:pointer;" title="${p.nombre}">${p.emoji}</span>`;
    }).join('');
}

// 7. Renderizar POKEDEX (Siluetas)
function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;

    grid.innerHTML = DB.map(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        return `
            <div class="card ${tiene ? '' : 'locked'}" style="opacity: ${tiene ? 1 : 0.3}">
                <span class="card-emoji" style="font-size:2.5rem;">${p.emoji}</span>
                <div style="font-size:0.8rem; font-weight:bold;">${tiene ? p.nombre : '???'}</div>
            </div>
        `;
    }).join('');
}