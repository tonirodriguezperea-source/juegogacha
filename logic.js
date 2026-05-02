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
    const sagasList = document.getElementById('sagas-list');
    const filtro = document.getElementById('busqueda-equipo').value.toLowerCase();
    if (!sagasList) return;

    sagasList.innerHTML = '';

    // 1. Agrupar inventario por Sagas y por ID (para el contador x2, x3...)
    const sagas = {};
    
    // Obtenemos una lista de "especies únicas" para mostrar en la cuadrícula
    const especiesUnicas = {};
    inventario.forEach(p => {
        if (!especiesUnicas[p.id]) {
            especiesUnicas[p.id] = { ...p, cantidad: 0, copias: [] };
        }
        especiesUnicas[p.id].cantidad++;
        especiesUnicas[p.id].copias.push(p);
    });

    // Clasificar por Saga
    Object.values(especiesUnicas).forEach(p => {
        if (p.nombre.toLowerCase().includes(filtro)) {
            if (!sagas[p.saga]) sagas[p.saga] = [];
            sagas[p.saga].push(p);
        }
    });

    // 2. Dibujar cada sección de Saga
    for (const nombreSaga in sagas) {
        const seccion = document.createElement('div');
        seccion.className = 'saga-section';
        seccion.innerHTML = `<h3 class="saga-title">${nombreSaga}</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'grid'; // Reutilizamos tu clase de rejilla

        sagas[nombreSaga].forEach(p => {
            const wrap = document.createElement('div');
            wrap.className = 'card-stack';
            
            // Si tienes más de 1, sale el numerito
            const badge = p.cantidad > 1 ? `<div class="stack-count">x${p.cantidad}</div>` : '';
            
            const estaEnEquipo = p.copias.some(c => equipoUids.includes(c.uid));

            wrap.innerHTML = `
                ${badge}
                <div class="card ${estaEnEquipo ? 'active-team' : ''}" 
                     onmouseenter="mostrarInfo('${p.id}')"
                     onclick="abrirSelectorCopias('${p.id}')">
                    <span class="card-emoji" style="font-size:3rem;">${p.emoji}</span>
                    <div style="font-size:0.8rem;">${p.nombre}</div>
                </div>
            `;
            grid.appendChild(wrap);
        });
        
        seccion.appendChild(grid);
        sagasList.appendChild(seccion);
    }
}

// Función para actualizar el panel derecho al pasar el ratón
function mostrarInfo(personajeId) {
    const p = DB.find(x => x.id == personajeId);
    if (!p) return;

    // Aquí puedes añadir descripciones personalizadas en tu database.js
    const descripciones = {
        "1": "Un extraño pokémon semilla que es muy dócil. Su planta crece con él.",
        "101": "El guerrero saiyan más fuerte de la Tierra. Siempre busca superar sus límites.",
        "4": "Prefiere las cosas calientes. Se dice que cuando llueve sale vapor de su cola.",
        "102": "El orgulloso príncipe de los Saiyans. Su rivalidad con Goku no tiene fin."
    };

    document.getElementById('info-photo').innerText = p.emoji;
    document.getElementById('info-name').innerText = p.nombre;
    document.getElementById('info-desc').innerText = descripciones[p.id] || "Sin descripción disponible para este héroe.";
    document.getElementById('info-dex').innerText = p.id;
    document.getElementById('info-tipo').innerText = p.tipo.toUpperCase();
    document.getElementById('info-saga').innerText = p.saga;
}

// Función para cuando haces clic (abre la opción de elegir cuál de tus Gokus quieres)
function abrirSelectorCopias(personajeId) {
    const copias = inventario.filter(p => p.id == personajeId);
    
    if (copias.length === 1) {
        togglePersonajeEquipo(copias[0].uid);
    } else {
        // Por ahora, para no complicar el HTML, usamos un prompt o elegimos el de mayor nivel
        // En el futuro podemos hacer un modal aquí
        let msg = `Tienes ${copias.length} copias. ¿Cuál quieres usar?\n`;
        copias.forEach((c, i) => msg += `${i}: Nivel ${c.lvl} ${equipoUids.includes(c.uid) ? '(En Equipo)' : ''}\n`);
        let choice = prompt(msg);
        if (choice !== null && copias[choice]) {
            togglePersonajeEquipo(copias[choice].uid);
        }
    }
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