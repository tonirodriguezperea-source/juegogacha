// 1. DEFINICIÓN DE TIPOS (Solo una vez)
const TABLA_TIPOS = {
    "fuego": { fuerte: "planta", debil: "agua" },
    "agua": { fuerte: "fuego", debil: "planta" },
    "planta": { fuerte: "agua", debil: "fuego" },
    "guerrero": { fuerte: "monstruo", debil: "magia" },
    "monstruo": { fuerte: "magia", debil: "guerrero" }
};

// 2. ESTADO GLOBAL
let battleState = {
    player: null,
    enemy: null,
    turn: 'player',
    isDefending: false,
    enemyDefending: false,
    playerTeam: [],
    enemyTeam: [],
    playerIdx: 0,
    enemyIdx: 0
};

// 3. FUNCIONES DE APOYO
function calcularMultiplicador(tipoAtacante, tipoDefensor) {
    if (!tipoAtacante || !tipoDefensor) return 1;
    const atacante = tipoAtacante.toLowerCase();
    const defensor = tipoDefensor.toLowerCase();
    const relacion = TABLA_TIPOS[atacante];
    if (relacion?.fuerte === defensor) return 1.5;
    if (relacion?.debil === defensor) return 0.5;
    return 1;
}

function escribirLog(msg) {
    const log = document.getElementById('battle-log');
    if (log) log.innerHTML = `<div>> ${msg}</div>` + log.innerHTML;
}

function dibujarPuntos(id, cant) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = "";
    for(let i=0; i<3; i++) container.innerHTML += `<div class="dot ${i<cant?'active':''}"></div>`;
}

// 4. LÓGICA DE COMBATE
function iniciarBatalla() {
    battleState.playerTeam = inventario.filter(p => equipoUids.includes(p.uid));
    if (battleState.playerTeam.length === 0) return alert("¡Elige a alguien en tu equipo!");

    battleState.enemyTeam = [];
    const numEnemigos = Math.floor(Math.random() * 3) + 1;
    const nivelMedioJugador = battleState.playerTeam.reduce((acc, p) => acc + p.lvl, 0) / battleState.playerTeam.length;

    for (let i = 0; i < numEnemigos; i++) {
        const base = DB[Math.floor(Math.random() * DB.length)];
        const nivelRival = Math.max(1, Math.floor(nivelMedioJugador + (Math.random() * 10 - 5)));
        battleState.enemyTeam.push({
            ...base,
            lvl: nivelRival,
            hp: 80 + (nivelRival * 5),
            maxHp: 80 + (nivelRival * 5),
            energy: 1
        });
    }

    battleState.playerIdx = 0;
    battleState.enemyIdx = 0;
    setupFighter('player');
    setupFighter('enemy');

    document.getElementById('battle-screen').style.display = 'flex';
    escribirLog(`¡Combate iniciado! El rival tiene ${numEnemigos} héroes.`);
    actualizarInterfazBatalla();
}

function setupFighter(tipo) {
    if (tipo === 'player') {
        const pData = battleState.playerTeam[battleState.playerIdx];
        battleState.player = {
            ...pData,
            hp: 100 + (pData.lvl * 5),
            maxHp: 100 + (pData.lvl * 5),
            energy: 1
        };
    } else {
        battleState.enemy = { ...battleState.enemyTeam[battleState.enemyIdx] };
    }
}

function playerMove(tipo) {
    if (battleState.turn !== 'player') return;
    const p = battleState.player;
    const e = battleState.enemy;

    if (tipo === 'recargar') {
        p.energy = Math.min(p.energy + 1, 3);
        escribirLog(`${p.nombre} carga energía.`);
    } else if (tipo === 'defensa') {
        battleState.isDefending = true;
        escribirLog(`${p.nombre} se defiende.`);
    } else {
        const mult = calcularMultiplicador(p.tipo, e.tipo);
        let dmgBase = (tipo === 'fuerte') ? 35 : 15;
        let totalDmg = Math.floor((dmgBase + (p.lvl * 2)) * mult);

        if (battleState.enemyDefending) {
            totalDmg = Math.floor(totalDmg / 2);
            battleState.enemyDefending = false;
            escribirLog(`¡Bloqueado!`);
        }

        e.hp -= totalDmg;
        p.energy -= (tipo === 'fuerte') ? 2 : 1;
        escribirLog(`${p.nombre} ataca. Daño: ${totalDmg} ${mult > 1 ? '¡Efectivo!' : ''}`);
    }

    actualizarInterfazBatalla();
    verificarEstado();
}

function turnoEnemigo() {
    const e = battleState.enemy;
    const p = battleState.player;
    let decision = (e.energy >= 2) ? 'fuerte' : (e.energy >= 1 ? 'ataque' : 'recargar');

    if (decision === 'recargar') {
        e.energy = Math.min(e.energy + 1, 3);
        escribirLog(`${e.nombre} recarga.`);
    } else {
        const mult = calcularMultiplicador(e.tipo, p.tipo);
        let dmg = Math.floor(((decision === 'fuerte' ? 35 : 15) + (e.lvl * 2)) * mult);
        if (battleState.isDefending) dmg = Math.floor(dmg / 2);
        p.hp -= dmg;
        e.energy -= (decision === 'fuerte' ? 2 : 1);
        escribirLog(`${e.nombre} ataca. Daño: ${dmg}`);
    }

    battleState.isDefending = false;
    battleState.turn = 'player';
    actualizarInterfazBatalla();
    if (p.hp <= 0) verificarEstado();
}

function verificarEstado() {
    if (battleState.enemy.hp <= 0) {
        battleState.enemyIdx++;
        if (battleState.enemyIdx < battleState.enemyTeam.length) {
            setupFighter('enemy');
            escribirLog("¡Siguiente rival!");
        } else {
            alert("¡Victoria!");
            finalizarBatalla(true);
            return;
        }
    } else if (battleState.player.hp <= 0) {
        battleState.playerIdx++;
        if (battleState.playerIdx < battleState.playerTeam.length) {
            setupFighter('player');
            escribirLog("¡Cambio automático!");
        } else {
            alert("Derrota...");
            finalizarBatalla(false);
            return;
        }
    } else if (battleState.turn === 'player') {
        battleState.turn = 'enemy';
        setTimeout(turnoEnemigo, 1000);
    }
    actualizarInterfazBatalla();
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;
    if(!p || !e) return;

    document.getElementById('player-hp-bar').style.width = Math.max(0, (p.hp/p.maxHp)*100) + "%";
    document.getElementById('enemy-hp-bar').style.width = Math.max(0, (e.hp/e.maxHp)*100) + "%";
    document.getElementById('player-battle-img').innerText = p.emoji;
    document.getElementById('enemy-battle-img').innerText = e.emoji;
    document.getElementById('player-battle-name').innerText = `${p.nombre} (LV.${p.lvl})`;
    document.getElementById('enemy-battle-name').innerText = `${e.nombre} (LV.${e.lvl})`;

    dibujarPuntos('player-energy', p.energy);
    dibujarPuntos('enemy-energy', e.energy);

    document.getElementById('btn-ataque').disabled = (p.energy < 1 || battleState.turn === 'enemy');
    document.getElementById('btn-fuerte').disabled = (p.energy < 2 || battleState.turn === 'enemy');
}

function finalizarBatalla(victoria) {
    if (victoria) {
        battleState.playerTeam.forEach(p => {
            const ref = inventario.find(inv => inv.uid === p.uid);
            if (ref) ref.lvl++;
        });
        guardar();
    }
    document.getElementById('battle-screen').style.display = 'none';
    mostrar('lobby');
}

function cambiarBicho() {
    if (battleState.turn !== 'player') return;
    battleState.playerIdx = (battleState.playerIdx + 1) % battleState.playerTeam.length;
    setupFighter('player');
    battleState.turn = 'enemy';
    actualizarInterfazBatalla();
    setTimeout(turnoEnemigo, 1000);
}