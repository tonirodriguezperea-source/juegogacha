// 1. PROTECCIÓN DE TIPOS: Usamos var para que el navegador no bloquee el script si se recarga
window.TABLA_TIPOS = window.TABLA_TIPOS || {
    "fuego": { fuerte: "planta", debil: "agua" },
    "agua": { fuerte: "fuego", debil: "planta" },
    "planta": { fuerte: "agua", debil: "fuego" },
    "guerrero": { fuerte: "monstruo", debil: "magia" },
    "monstruo": { fuerte: "magia", debil: "guerrero" }
};

// 2. ESTADO DE BATALLA GLOBAL (Usamos window para asegurar acceso total)
window.battleState = window.battleState || {
    player: null, 
    enemy: null, 
    turn: 'player',
    playerTeam: [], 
    enemyTeam: [],
    playerIdx: 0, 
    enemyIdx: 0,
    isDefending: false, 
    enemyDefending: false
};

// 3. FUNCIÓN PRINCIPAL: Inicia el combate
window.iniciarBatalla = function() {
    console.log("¡BOTÓN DETECTADO!"); 
    
    if (typeof inventario === 'undefined') {
        alert("Error: No se encuentra el inventario. Revisa el orden de los scripts.");
        return;
    }

    const equipo = inventario.filter(p => equipoUids.includes(p.uid));
    if (equipo.length === 0) return alert("¡Tu equipo está vacío!");

    // Configuramos el estado usando la variable global
    window.battleState.playerTeam = equipo;
    window.battleState.enemyTeam = generarRivales(equipo);
    window.battleState.playerIdx = 0;
    window.battleState.enemyIdx = 0;

    prepararLuchadores();
    
    // Cambiamos las pantallas
    document.getElementById('pantalla-lobby').style.display = 'none';
    document.getElementById('battle-screen').style.display = 'flex';
    
    actualizarInterfazBatalla();
    escribirLog("⚔️ ¡Comienza el combate!");
};

function generarRivales(equipoPlayer) {
    const num = Math.floor(Math.random() * 3) + 1;
    const lvlMedio = equipoPlayer.reduce((a, b) => a + b.lvl, 0) / equipoPlayer.length;
    let rivales = [];
    for (let i = 0; i < num; i++) {
        const base = DB[Math.floor(Math.random() * DB.length)];
        const lvl = Math.max(1, Math.floor(lvlMedio + (Math.random() * 6 - 3)));
        rivales.push({ ...base, lvl, hp: 80 + (lvl * 5), maxHp: 80 + (lvl * 5), energy: 1 });
    }
    return rivales;
}

function prepararLuchadores() {
    const pData = battleState.playerTeam[battleState.playerIdx];
    battleState.player = { ...pData, hp: 100 + (pData.lvl * 5), maxHp: 100 + (pData.lvl * 5), energy: 1 };
    battleState.enemy = { ...battleState.enemyTeam[battleState.enemyIdx] };
}

window.playerMove = function(tipo) {
    if (battleState.turn !== 'player') return;
    const p = battleState.player;
    const e = battleState.enemy;

    if (tipo === 'recargar') {
        p.energy = Math.min(p.energy + 1, 3);
        escribirLog(`${p.nombre} recarga energía.`);
    } else if (tipo === 'defensa') {
        battleState.isDefending = true;
        escribirLog(`${p.nombre} se defiende.`);
    } else {
        const mult = calcularMult(p.tipo, e.tipo);
        let dmg = Math.floor(((tipo === 'fuerte' ? 35 : 15) + (p.lvl * 2)) * mult);
        
        if (battleState.enemyDefending) { 
            dmg = Math.floor(dmg / 2); 
            battleState.enemyDefending = false; 
        }
        
        e.hp -= dmg;
        p.energy -= (tipo === 'fuerte' ? 2 : 1);
        escribirLog(`${p.nombre} ataca (${dmg} daño). ${mult > 1 ? '¡Es muy efectivo!' : ''}`);
    }

    actualizarInterfazBatalla();
    checkEstado();
};

function checkEstado() {
    if (battleState.enemy.hp <= 0) {
        battleState.enemyIdx++;
        if (battleState.enemyIdx < battleState.enemyTeam.length) {
            battleState.enemy = { ...battleState.enemyTeam[battleState.enemyIdx] };
            escribirLog("¡Rival derrotado! Entra el siguiente.");
            actualizarInterfazBatalla();
        } else {
            alert("¡VICTORIA!");
            return finalizar(true);
        }
    } else if (battleState.player.hp <= 0) {
        battleState.playerIdx++;
        if (battleState.playerIdx < battleState.playerTeam.length) {
            prepararLuchadores();
            escribirLog("¡Tu héroe cayó! Sale el relevo.");
            actualizarInterfazBatalla();
        } else {
            alert("Has sido derrotado...");
            return finalizar(false);
        }
    } else if (battleState.turn === 'player') {
        battleState.turn = 'enemy';
        setTimeout(turnoIA, 1000);
    }
}

function turnoIA() {
    const e = battleState.enemy;
    const p = battleState.player;
    if (!e || !p) return;

    let accion = e.energy >= 2 ? 'fuerte' : (e.energy >= 1 ? 'ataque' : 'recargar');

    if (accion === 'recargar') {
        e.energy = Math.min(e.energy + 1, 3);
        escribirLog(`${e.nombre} carga energía.`);
    } else {
        const mult = calcularMult(e.tipo, p.tipo);
        let dmg = Math.floor(((accion === 'fuerte' ? 35 : 15) + (e.lvl * 2)) * mult);
        if (battleState.isDefending) {
            dmg = Math.floor(dmg / 2);
            battleState.isDefending = false; 
        }
        
        p.hp -= dmg;
        e.energy -= (accion === 'fuerte' ? 2 : 1);
        escribirLog(`${e.nombre} golpea (${dmg} daño).`);
    }
    
    battleState.turn = 'player';
    actualizarInterfazBatalla();
    if (p.hp <= 0) checkEstado();
}

function calcularMult(a, b) {
    if (!a || !b) return 1;
    const tipoA = a.toLowerCase();
    const tipoB = b.toLowerCase();
    if (TABLA_TIPOS[tipoA]?.fuerte === tipoB) return 1.5;
    if (TABLA_TIPOS[tipoA]?.debil === tipoB) return 0.5;
    return 1;
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;
    if(!p || !e) return;

    document.getElementById('player-hp-bar').style.width = Math.max(0, (p.hp/p.maxHp)*100) + "%";
    document.getElementById('enemy-hp-bar').style.width = Math.max(0, (e.hp/e.maxHp)*100) + "%";
    
    document.getElementById('player-battle-img').innerHTML = obtenerImagenHTML(p, "sprite-jugador luchador-anim");
    document.getElementById('enemy-battle-img').innerHTML = obtenerImagenHTML(e, "sprite-rival luchador-anim");
    
    document.getElementById('player-battle-name').innerText = `${p.nombre} (LV.${p.lvl})`;
    document.getElementById('enemy-battle-name').innerText = `${e.nombre} (LV.${e.lvl})`;
    
    const pEn = document.getElementById('player-energy');
    if (pEn) {
        pEn.innerHTML = "";
        for(let i=0; i<3; i++) {
            pEn.innerHTML += `<div class="dot ${i < p.energy ? 'active' : ''}"></div>`;
        }
    }
    
    const btnAtq = document.getElementById('btn-ataque');
    const btnFrt = document.getElementById('btn-fuerte');
    if(btnAtq) btnAtq.disabled = p.energy < 1 || battleState.turn === 'enemy';
    if(btnFrt) btnFrt.disabled = p.energy < 2 || battleState.turn === 'enemy';
}

function escribirLog(msg) {
    const log = document.getElementById('battle-log');
    if (log) log.innerHTML = `<div>> ${msg}</div>` + log.innerHTML;
}

function finalizar(win) {
    if (win) {
        battleState.playerTeam.forEach(p => {
            let char = inventario.find(inv => inv.uid === p.uid);
            if (char) char.lvl++;
        });
        guardar();
    }
    document.getElementById('battle-screen').style.display = 'none';
    mostrar('lobby');
}

window.cambiarBicho = function() {
    if (battleState.turn !== 'player' || battleState.playerTeam.length <= 1) return;
    battleState.playerIdx = (battleState.playerIdx + 1) % battleState.playerTeam.length;
    prepararLuchadores();
    battleState.turn = 'enemy';
    actualizarInterfazBatalla();
    escribirLog("🔄 ¡Cambio de héroe!");
    setTimeout(turnoIA, 1000);
};