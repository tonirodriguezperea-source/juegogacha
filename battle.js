const TABLA_TIPOS = {
    "fuego": { fuerte: "planta", debil: "agua" },
    "agua": { fuerte: "fuego", debil: "planta" },
    "planta": { fuerte: "agua", debil: "fuego" },
    "guerrero": { fuerte: "monstruo", debil: "magia" },
    "monstruo": { fuerte: "magia", debil: "guerrero" }
};

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

function calcularMultiplicador(tipoAtacante, tipoDefensor) {
    if (!tipoAtacante || !tipoDefensor) return 1;
    const atacante = tipoAtacante.toLowerCase();
    const defensor = tipoDefensor.toLowerCase();
    const relacion = TABLA_TIPOS[atacante];
    
    if (relacion?.fuerte === defensor) return 1.5;
    if (relacion?.debil === defensor) return 0.5;
    return 1;
}

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
    escribirLog(`¡Inicia el combate! El rival tiene ${numEnemigos} luchador(es).`);
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

function cambiarBicho() {
    if (battleState.turn !== 'player') return;
    if (battleState.playerTeam.length <= 1) return alert("¡No tienes a nadie más!");

    battleState.playerIdx = (battleState.playerIdx + 1) % battleState.playerTeam.length;
    setupFighter('player');
    escribirLog(`¡Cambio! Sale ${battleState.player.nombre}.`);
    
    battleState.turn = 'enemy';
    actualizarInterfazBatalla();
    setTimeout(turnoEnemigo, 1000);
}

function playerMove(tipo) {
    if (battleState.turn !== 'player') return;
    const p = battleState.player;
    const e = battleState.enemy;

    if (tipo === 'recargar') {
        p.energy = Math.min(p.energy + 1, 3);
        escribirLog(`${p.nombre} carga energía.`);
    } 
    else if (tipo === 'defensa') {
        battleState.isDefending = true;
        escribirLog(`${p.nombre} se pone en guardia.`);
    } 
    else {
        // Lógica de ATACAR (Normal o Fuerte)
        const mult = calcularMultiplicador(p.tipo, e.tipo);
        let dmgBase = (tipo === 'fuerte') ? 35 : 15;
        let totalDmg = Math.floor((dmgBase + (p.lvl * 2)) * mult);

        if (battleState.enemyDefending) {
            totalDmg = Math.floor(totalDmg / 2);
            battleState.enemyDefending = false;
            escribirLog(`¡El rival bloqueó parte del golpe!`);
        }

        e.hp -= totalDmg;
        p.energy -= (tipo === 'fuerte') ? 2 : 1;

        let msg = `${p.nombre} usa ${tipo.toUpperCase()}.`;
        if (mult > 1) msg += " ¡Es súper efectivo! 💥";
        if (mult < 1) msg += " No es muy efectivo... 💧";
        escribirLog(`${msg} Daño: ${totalDmg}`);
    }

    actualizarInterfazBatalla();
    verificarEstado();
}

function turnoEnemigo() {
    const e = battleState.enemy;
    const p = battleState.player;
    let decision;
    const rand = Math.random();

    if (e.energy >= 2 && rand > 0.3) decision = 'fuerte';
    else if (e.hp < 30 && e.energy >= 1 && rand > 0.5) decision = 'defensa';
    else if (e.energy >= 1 && rand > 0.4) decision = 'ataque';
    else decision = 'recargar';

    if (decision === 'recargar') {
        e.energy = Math.min(e.energy + 1, 3);
        escribirLog(`${e.nombre} concentra energía...`);
    } else if (decision === 'defensa') {
        battleState.enemyDefending = true;
        escribirLog(`${e.nombre} se defiende.`);
    } else {
        const mult = calcularMultiplicador(e.tipo, p.tipo);
        let dmgBase = (decision === 'fuerte') ? 35 : 15;
        let totalDmg = Math.floor((dmgBase + (e.lvl * 2)) * mult);

        if (battleState.isDefending) {
            totalDmg = Math.floor(totalDmg / 2);
            escribirLog("¡Defendiste el golpe!");
        }

        p.hp -= totalDmg;
        e.energy -= (decision === 'fuerte') ? 2 : 1;

        let msg = `${e.nombre} usa ${decision.toUpperCase()}.`;
        if (mult > 1) msg += " ¡Es súper efectivo! 💥";
        escribirLog(`${msg} Daño: ${totalDmg}`);
    }

    battleState.isDefending = false;
    battleState.turn = 'player';
    actualizarInterfazBatalla();
    if (p.hp <= 0) verificarEstado();
}

function verificarEstado() {
    const e = battleState.enemy;
    const p = battleState.player;

    if (e.hp <= 0) {
        battleState.enemyIdx++;
        if (battleState.enemyIdx < battleState.enemyTeam.length) {
            escribirLog(`¡Rival caído! Entra el siguiente.`);
            setupFighter('enemy');
            actualizarInterfazBatalla();
        } else {
            alert("¡VICTORIA!");
            finalizarBatalla(true);
        }
    } else if (p.hp <= 0) {
        battleState.playerIdx++;
        if (battleState.playerIdx < battleState.playerTeam.length) {
            escribirLog(`¡${p.nombre} debilitado! ¡Cambio automático!`);
            setupFighter('player');
            actualizarInterfazBatalla();
        } else {
            alert("DERROTA...");
            finalizarBatalla(false);
        }
    } else if (battleState.turn === 'player') {
        battleState.turn = 'enemy';
        setTimeout(turnoEnemigo, 1000);
    }
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

    const btns = document.querySelectorAll('.btn-action');
    btns.forEach(b => {
        const id = b.id;
        if(id === 'btn-ataque') b.disabled = (p.energy < 1 || battleState.turn === 'enemy');
        else if(id === 'btn-fuerte') b.disabled = (p.energy < 2 || battleState.turn === 'enemy');
        else b.disabled = (battleState.turn === 'enemy');
    });
}

function dibujarPuntos(id, cant) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = "";
    for(let i=0; i<3; i++) container.innerHTML += `<div class="dot ${i<cant?'active':''}"></div>`;
}

function escribirLog(msg) {
    const log = document.getElementById('battle-log');
    if (log) log.innerHTML = `<div>> ${msg}</div>` + log.innerHTML;
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