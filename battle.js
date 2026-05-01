let battleState = {
    player: null,
    enemy: null,
    turn: 'player',
    canDefend: true
};

function iniciarBatalla() {
    const team = inventario.filter(p => equipoUids.includes(p.uid));
    if (team.length === 0) return alert("¡Elige equipo primero!");

    document.getElementById('battle-screen').style.display = 'flex';
    
    // Configuramos al primer luchador
    battleState.player = { ...team[0], hp: 100 + (team[0].lvl * 10), maxHp: 100 + (team[0].lvl * 10), energy: 0 };
    
    // Enemigo aleatorio
    const eBase = DB[Math.floor(Math.random() * DB.length)];
    battleState.enemy = { ...eBase, hp: 80 + (team[0].lvl * 8), maxHp: 80 + (team[0].lvl * 8), energy: 0 };

    actualizarInterfazBatalla();
    escribirLog(`¡Un ${battleState.enemy.nombre} salvaje apareció!`);
}

function playerMove(tipo) {
    const p = battleState.player;
    const e = battleState.enemy;

    if (tipo === 'recargar') {
        p.energy = Math.min(p.energy + 1, 3);
        escribirLog(`${p.nombre} recarga energía (+1)`);
    } 
    else if (tipo === 'ataque') {
        let daño = calcularDaño(p, e, 15);
        e.hp -= daño;
        p.energy -= 1;
        escribirLog(`${p.nombre} ataca causando ${daño} de daño.`);
    }
    else if (tipo === 'fuerte') {
        let daño = calcularDaño(p, e, 40);
        e.hp -= daño;
        p.energy -= 2;
        escribirLog(`¡GOLPE CRÍTICO! ${p.nombre} causa ${daño} de daño.`);
    }
    else if (tipo === 'defensa') {
        battleState.isDefending = true;
        battleState.canDefend = false; // Bloqueo de spam
        escribirLog(`${p.nombre} se prepara para defenderse.`);
    }

    actualizarInterfazBatalla();
    if (e.hp <= 0) return finalizarBatalla(true);
    
    setTimeout(turnoEnemigo, 1000);
}

function turnoEnemigo() {
    const e = battleState.enemy;
    const p = battleState.player;
    
    // IA Simple: Si tiene energía, ataca. Si no, recarga.
    if (e.energy >= 1 && Math.random() > 0.5) {
        let daño = calcularDaño(e, p, 12);
        if (battleState.isDefending) {
            daño = Math.floor(daño / 2);
            escribirLog(`¡Defensa exitosa! El daño se reduce.`);
        }
        p.hp -= daño;
        e.energy -= 1;
        escribirLog(`${e.nombre} te ataca y quita ${daño} HP.`);
    } else {
        e.energy = Math.min(e.energy + 1, 3);
        escribirLog(`${e.nombre} está recargando...`);
    }

    battleState.isDefending = false;
    if (!battleState.canDefend) battleState.canDefend = true; // Permite defender en el próximo turno del jugador

    actualizarInterfazBatalla();
    if (p.hp <= 0) finalizarBatalla(false);
}

function calcularDaño(atacante, defensor, base) {
    let mult = 1;
    // Tabla de tipos
    if (TABLA_TIPOS[atacante.tipo].ventaja === defensor.tipo) mult = 1.5;
    if (TABLA_TIPOS[defensor.tipo].ventaja === atacante.tipo) mult = 0.7;
    
    return Math.floor(base * mult + (atacante.lvl * 2));
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;

    // Vidas
    document.getElementById('player-hp-bar').style.width = (p.hp / p.maxHp * 100) + "%";
    document.getElementById('enemy-hp-bar').style.width = (e.hp / e.maxHp * 100) + "%";
    
    // Emojis y nombres
    document.getElementById('player-battle-name').innerText = p.nombre;
    document.getElementById('enemy-battle-name').innerText = e.nombre;
    document.getElementById('player-battle-img').innerText = p.emoji;
    document.getElementById('enemy-battle-img').innerText = e.emoji;

    // Energía (Cargas)
    actualizarEnergia('player-energy', p.energy);
    actualizarEnergia('enemy-energy', e.energy);

    // Bloqueo de botones según energía
    document.getElementById('btn-ataque').disabled = p.energy < 1;
    document.getElementById('btn-fuerte').disabled = p.energy < 2;
    document.getElementById('btn-defensa').disabled = !battleState.canDefend;
}

function actualizarEnergia(containerId, cantidad) {
    const dots = document.getElementById(containerId).querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index < cantidad);
    });
}

function escribirLog(msg) {
    const log = document.getElementById('battle-log');
    log.innerHTML = `<p>> ${msg}</p>` + log.innerHTML;
}

function finalizarBatalla(victoria) {
    alert(victoria ? "¡HAS GANADO! +1 Nivel para tu equipo." : "Has sido derrotado...");
    if (victoria) {
        equipoUids.forEach(uid => {
            let p = inventario.find(i => i.uid === uid);
            if (p) p.lvl++;
        });
        guardar();
    }
    document.getElementById('battle-screen').style.display = 'none';
    location.reload();
}