// --- logic.js ---

// Función para renderizar la lista de personajes en la pantalla de EQUIPO
function renderEquipo() {
    const grid = document.getElementById('equipo-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Limpiamos para no duplicar

    if (inventario.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No tienes personajes. ¡Ve a invocar!</p>';
        return;
    }

    // Agrupamos por especie (id) para mostrar cuánto tienes de cada uno
    // Opcional: Si prefieres ver todos los duplicados, quita la lógica de "especies"
    inventario.forEach(p => {
        const estaEnEquipo = equipoUids.includes(p.uid);
        
        const card = document.createElement('div');
        card.className = `card ${estaEnEquipo ? 'active-team' : ''}`;
        card.style.borderColor = estaEnEquipo ? 'var(--accent)' : 'var(--border)';
        card.onclick = () => togglePersonajeEquipo(p.uid);

        card.innerHTML = `
            <div class="rarity-line" style="background:${RAREZAS[p.rareza]}"></div>
            <span class="card-emoji" style="font-size:3rem; display:block; margin:10px 0;">${p.emoji}</span>
            <strong>${p.nombre}</strong><br>
            <small style="color:var(--accent)">LV.${p.lvl}</small>
        `;
        grid.appendChild(card);
    });
}

// Función para añadir/quitar del equipo (máximo 3)
function togglePersonajeEquipo(uid) {
    const index = equipoUids.indexOf(uid);
    
    if (index > -1) {
        // Si ya está, lo quitamos
        equipoUids.splice(index, 1);
    } else {
        // Si no está, comprobamos el límite de 3
        if (equipoUids.length < 3) {
            equipoUids.push(uid);
        } else {
            alert("¡El equipo está lleno! Quita a alguien primero.");
            return;
        }
    }
    
    guardar();       // Guardamos en LocalStorage
    renderEquipo();  // Refrescamos la pantalla de equipo
    renderLobby();   // Refrescamos el lobby por si volvemos
}

// Asegúrate de que la función guardar existe
function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
}