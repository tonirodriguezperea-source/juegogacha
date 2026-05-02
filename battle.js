let battleState = {
    player: null,
    enemy: null,
    turn: 'player',
    isDefending: false,
    playerTeam: [],
    currentIndex: 0
};

function iniciarBatalla() {
    // 1. Cargar equipo completo
    battleState.playerTeam = inventario.filter(p => equipoUids.includes(p.uid));
    
    if (battleState.playerTeam.length === 0) {
        return alert("¡Selecciona al menos un héroe en tu equipo!");
    }

    // 2. Configurar primer luchador y rival
    battleState.currentIndex = 0;
    setupPlayer();
    setupEnemy();

    // 3. Resetear estado
    battleState.turn = 'player';
    battleState.isDefending = false;

    // 4. Mostrar interfaz
    document.getElementById('battle-screen').style.display = 'flex';
    escribirLog(`¡Comienza la batalla! Suerte con ${battleState.player.nombre}.`);
    actualizarInterfazBatalla();
}

function setupPlayer() {
    const pData = battleState.playerTeam[battleState.currentIndex];
    battleState.player = {
        ...pData,
        hp: 100 + (pData.lvl * 5),
        maxHp: 100 + (pData.lvl * 5),
        energy: 1
    };
}

function setupEnemy() {
    const rivalBase = DB[Math.floor(Math.random() * DB.length)];
    battleState.enemy = {
        ...rivalBase,
        hp: 80 + (battleState.player.lvl * 4),
        maxHp: 80 + (battleState.player.lvl * 4),
        energy: 1
    };
}

function playerMove(tipo) {
    if (battleState.turn !== 'player') return;
    
    const p = battleState.player;
    const e = battleState.enemy;

    if (tipo === 'recargar') {
        p.energy = Math.min(p.energy + 1, 3);
        escribirLog(`${p.nombre} recarga energía.`);
    } 
    else if (tipo === 'ataque') {
        const dmg = 15 + (p.lvl * 2);
        e.hp -= dmg;
        p.energy -= 1;
        escribirLog(`${p.nombre} ataca y quita ${dmg} HP.`);
    }
    else if (tipo === 'fuerte') {
        const dmg = 35 + (p.lvl * 3);
        e.hp -= dmg;
        p.energy -= 2;
        escribirLog(`¡ATAQUE POTENTE! ${dmg} de daño.`);
    }
    else if (tipo === 'defensa') {
        battleState.isDefending = true;
        escribirLog(`${p.nombre} se prepara para defender.`);
    }

    actualizarInterfazBatalla();

    if (e.hp <= 0) {
        alert("¡Victoria! El rival ha sido derrotado.");
        return finalizarBatalla(true);
    }

    // Pasar turno al rival
    battleState.turn = 'enemy';
    setTimeout(turnoEnemigo, 1000);
}

function turnoEnemigo() {
    const e = battleState.enemy;
    const p = battleState.player;
    
    // IA del Rival
    if (e.energy >= 1) {
        let dmg = 12 + (e.lvl || 1);
        if (battleState.isDefending) {
            dmg = Math.floor(dmg / 2);
            escribirLog("¡Defendiste el golpe! Daño reducido.");
        }
        p.hp -= dmg;
        e.energy -= 1;
        escribirLog(`${e.nombre} te ataca y quita ${dmg} HP.`);
    } else {
        e.energy++;
        escribirLog(`${e.nombre} está cargando energía...`);
    }

    battleState.isDefending = false; // Se quita la defensa tras el golpe
    battleState.turn = 'player';
    
    actualizarInterfazBatalla();

    if (p.hp <= 0) {
        cambiarSiguientePokemon();
    }
}

function cambiarSiguientePokemon() {
    battleState.currentIndex++;
    if (battleState.currentIndex < battleState.playerTeam.length) {
        escribirLog("¡Tu héroe ha caído! Entra el siguiente...");
        setupPlayer();
        actualizarInterfazBatalla();
    } else {
        alert("Todos tus héroes han caído...");
        finalizarBatalla(false);
    }
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;

    // Barras de Vida
    document.getElementById('player-hp-bar').style.width = Math.max(0, (p.hp / p.maxHp * 100)) + "%";
    document.getElementById('enemy-hp-bar').style.width = Math.max(0, (e.hp / e.maxHp * 100)) + "%";

    // Textos y Emojis
    document.getElementById('player-battle-img').innerText = p.emoji;
    document.getElementById('enemy-battle-img').innerText = e.emoji;
    document.getElementById('player-battle-name').innerText = `${p.nombre} (LV.${p.lvl})`;
    document.getElementById('enemy-battle-name').innerText = e.nombre;

    // Energía
    dibujarPuntos('player-energy', p.energy);
    dibujarPuntos('enemy-energy', e.energy);

    // Botones
    document.getElementById('btn-ataque').disabled = (p.energy < 1 || battleState.turn === 'enemy');
    document.getElementById('btn-fuerte').disabled = (p.energy < 2 || battleState.turn === 'enemy');
    document.getElementById('btn-defensa').disabled = (battleState.turn === 'enemy');
}

function dibujarPuntos(id, cant) {
    const container = document.getElementById(id);
    container.innerHTML = "";
    for(let i=0; i<3; i++) {
        container.innerHTML += `<div class="dot ${i < cant ? 'active' : ''}"></div>`;
    }
}

function escribirLog(msg) {
    const log = document.getElementById('battle-log');
    log.innerHTML = `<div>> ${msg}</div>` + log.innerHTML;
}

function finalizarBatalla(victoria) {
    if (victoria) {
        // Subir nivel al equipo
        battleState.playerTeam.forEach(p => {
            const ref = inventario.find(inv => inv.uid === p.uid);
            if (ref) ref.lvl++;
        });
        guardar();
    }
    document.getElementById('battle-screen').style.display = 'none';
    mostrar('lobby');
}