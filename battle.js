const TABLA_TIPOS = {
    "fuego": { fuerte: "planta", debil: "agua" },
    "agua": { fuerte: "fuego", debil: "planta" },
    "planta": { fuerte: "agua", debil: "fuego" }
};

window.battleState = {
    player: null, enemy: null, turn: 'player',
    playerTeam: [], enemyTeam: [],
    playerIdx: 0, enemyIdx: 0
};

// ESTA FUNCIÓN ES LA QUE LLAMA EL BOTÓN
window.iniciarBatalla = function() {
    const equipo = inventario.filter(p => equipoUids.includes(p.uid));
    if (equipo.length === 0) return alert("¡Selecciona héroes en Equipo!");

    battleState.playerTeam = equipo;
    battleState.enemyTeam = generarRivales(equipo);
    battleState.playerIdx = 0;
    battleState.enemyIdx = 0;

    prepararLuchadores();
    
    document.getElementById('battle-screen').style.display = 'flex';
    actualizarInterfazBatalla();
    escribirLog("⚔️ ¡Comienza el combate!");
};

function generarRivales(equipoPlayer) {
    const lvlMedio = equipoPlayer.reduce((a, b) => a + b.lvl, 0) / equipoPlayer.length;
    const base = DB[Math.floor(Math.random() * DB.length)];
    const lvl = Math.max(1, Math.round(lvlMedio));
    return [{ ...base, lvl, hp: 80 + (lvl*5), maxHp: 80 + (lvl*5), energy: 1 }];
}

function prepararLuchadores() {
    const pData = battleState.playerTeam[battleState.playerIdx];
    battleState.player = { ...pData, hp: 100 + (pData.lvl*5), maxHp: 100 + (pData.lvl*5), energy: 1 };
    battleState.enemy = { ...battleState.enemyTeam[0] };
}

window.playerMove = function(tipo) {
    if (battleState.turn !== 'player') return;
    const p = battleState.player;
    const e = battleState.enemy;

    if (tipo === 'ataque') {
        let dmg = 15 + (p.lvl * 2);
        e.hp -= dmg;
        escribirLog(`${p.nombre} ataca y hace ${dmg} de daño.`);
    } else if (tipo === 'recargar') {
        p.energy = Math.min(p.energy + 1, 3);
        escribirLog(`${p.nombre} recarga energía.`);
    }

    actualizarInterfazBatalla();
    if (e.hp <= 0) {
        alert("¡Ganaste!");
        finalizar(true);
    } else {
        battleState.turn = 'enemy';
        setTimeout(turnoIA, 1000);
    }
};

function turnoIA() {
    const e = battleState.enemy;
    const p = battleState.player;
    let dmg = 10 + (e.lvl * 2);
    p.hp -= dmg;
    escribirLog(`${e.nombre} te golpea y hace ${dmg} de daño.`);
    
    battleState.turn = 'player';
    actualizarInterfazBatalla();
    if (p.hp <= 0) {
        alert("Perdiste...");
        finalizar(false);
    }
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;
    
    document.getElementById('player-hp-bar').style.width = (p.hp/p.maxHp*100) + "%";
    document.getElementById('enemy-hp-bar').style.width = (e.hp/e.maxHp*100) + "%";
    
    document.getElementById('player-battle-img').innerHTML = obtenerImagenHTML(p, "sprite-jugador luchador-anim");
    document.getElementById('enemy-battle-img').innerHTML = obtenerImagenHTML(e, "sprite-rival luchador-anim");
    
    document.getElementById('player-battle-name').innerText = p.nombre;
    document.getElementById('enemy-battle-name').innerText = e.nombre;
}

function escribirLog(msg) {
    const log = document.getElementById('battle-log');
    log.innerHTML = `<div>> ${msg}</div>` + log.innerHTML;
}

function finalizar(win) {
    document.getElementById('battle-screen').style.display = 'none';
    if(win) {
        inventario.find(p => p.uid === battleState.player.uid).lvl++;
        guardar();
    }
    mostrar('lobby');
}