let battleState = {
    player: null,
    enemy: null,
    turn: 'player',
    canDefend: true,
    isDefending: false
};

// Necesitamos esta tabla si no la tienes en database.js
const TABLA_TIPOS = {
    "fuego": { ventaja: "planta" },
    "planta": { ventaja: "agua" },
    "agua": { ventaja: "fuego" },
    "lucha": { ventaja: "normal" },
    "normal": { ventaja: "ninguno" }
};

function iniciarBatalla() {
    const team = inventario.filter(p => equipoUids.includes(p.uid));
    if (team.length === 0) return alert("¡Elige equipo primero!");

    // Limpiar log anterior
    document.getElementById('battle-log').innerHTML = "";
    document.getElementById('battle-screen').style.display = 'flex';
    
    // Configurar Jugador
    const pBase = team[0];
    battleState.player = { 
        ...pBase, 
        hp: 100 + (pBase.lvl * 10), 
        maxHp: 100 + (pBase.lvl * 10), 
        energy: 1 // Empezamos con 1 de energía para que no sea aburrido
    };
    
    // Configurar Enemigo Aleatorio
    const eBase = DB[Math.floor(Math.random() * DB.length)];
    battleState.enemy = { 
        ...eBase, 
        hp: 80 + (pBase.lvl * 8), 
        maxHp: 80 + (pBase.lvl * 8), 
        energy: 1 
    };

    actualizarInterfazBatalla();
    escribirLog(`¡Un ${battleState.enemy.nombre} salvaje apareció!`);
}

function playerMove(tipo) {
    if (battleState.turn !== 'player') return;

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
        escribirLog(`${p.nombre} usa Ataque: ${daño} de daño.`);
    }
    else if (tipo === 'fuerte') {
        let daño = calcularDaño(p, e, 40);
        e.hp -= daño;
        p.energy -= 2;
        escribirLog(`¡GOLPE CRÍTICO de ${p.nombre}!: ${daño} de daño.`);
    }
    else if (tipo === 'defensa') {
        battleState.isDefending = true;
        battleState.canDefend = false;
        escribirLog(`${p.nombre} se pone en guardia.`);
    }

    actualizarInterfazBatalla();
    
    if (e.hp <= 0) {
        e.hp = 0;
        actualizarInterfazBatalla();
        setTimeout(() => finalizarBatalla(true), 500);
        return;
    }
    
    battleState.turn = 'enemy';
    setTimeout(turnoEnemigo, 1000);
}

function turnoEnemigo() {
    const e = battleState.enemy;
    const p = battleState.player;
    
    if (e.energy >= 2 && Math.random() > 0.7) {
        let daño = calcularDaño(e, p, 30);
        if (battleState.isDefending) daño = Math.floor(daño / 2);
        p.hp -= daño;
        e.energy -= 2;
        escribirLog(`¡${e.nombre} lanza un ataque fuerte! Quita ${daño} HP.`);
    } 
    else if (e.energy >= 1 && Math.random() > 0.4) {
        let daño = calcularDaño(e, p, 12);
        if (battleState.isDefending) daño = Math.floor(daño / 2);
        p.hp -= daño;
        e.energy -= 1;
        escribirLog(`${e.nombre} ataca y quita ${daño} HP.`);
    } else {
        e.energy = Math.min(e.energy + 1, 3);
        escribirLog(`${e.nombre} está concentrando energía...`);
    }

    battleState.isDefending = false;
    battleState.canDefend = true; 
    battleState.turn = 'player';

    actualizarInterfazBatalla();
    if (p.hp <= 0) {
        p.hp = 0;
        actualizarInterfazBatalla();
        setTimeout(() => finalizarBatalla(false), 500);
    }
}

function calcularDaño(atacante, defensor, base) {
    let mult = 1;
    const tabla = TABLA_TIPOS[atacante.tipo.toLowerCase()] || { ventaja: "" };
    if (tabla.ventaja === defensor.tipo.toLowerCase()) mult = 1.5;
    
    return Math.floor(base * mult + (atacante.lvl * 2));
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;

    // Actualizar Barras de Vida
    const pPorcentaje = Math.max(0, (p.hp / p.maxHp) * 100);
    const ePorcentaje = Math.max(0, (e.hp / e.maxHp) * 100);
    
    document.getElementById('player-hp-bar').style.width = pPorcentaje + "%";
    document.getElementById('enemy-hp-bar').style.width = ePorcentaje + "%";
    
    // Cambiar color de la barra si queda poca vida
    document.getElementById('player-hp-bar').style.background = pPorcentaje < 30 ? "var(--danger)" : "linear-gradient(90deg, #22c55e, #4ade80)";

    document.getElementById('player-battle-name').innerText = p.nombre + " (LVL " + p.lvl + ")";
    document.getElementById('enemy-battle-name').innerText = e.nombre;
    document.getElementById('player-battle-img').innerText = p.emoji;
    document.getElementById('enemy-battle-img').innerText = e.emoji;

    // Actualizar Bolitas de Energía
    crearPuntosEnergia('player-energy', p.energy);
    crearPuntosEnergia('enemy-energy', e.energy);

    // Bloquear botones
    document.getElementById('btn-ataque').disabled = (p.energy < 1 || battleState.turn === 'enemy');
    document.getElementById('btn-fuerte').disabled = (p.energy < 2 || battleState.turn === 'enemy');
    document.getElementById('btn-defensa').disabled = (!battleState.canDefend || battleState.turn === 'enemy');
}

// Esta función dibuja las bolitas desde cero para que siempre salgan
function crearPuntosEnergia(containerId, cantidad) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = i < cantidad ? "dot active" : "dot";
        container.appendChild(dot);
    }
}

function escribirLog(msg) {
    const log = document.getElementById('battle-log');
    const p = document.createElement('p');
    p.innerHTML = `<span style="color:var(--accent)">></span> ${msg}`;
    log.prepend(p); // Los mensajes nuevos salen arriba
}

function finalizarBatalla(victoria) {
    if (victoria) {
        alert("¡VICTORIA! Tus héroes ganan experiencia.");
        equipoUids.forEach(uid => {
            let p = inventario.find(i => i.uid === uid);
            if (p) p.lvl++;
        });
        guardar();
    } else {
        alert("Derrota... ¡Entrena más a tus héroes!");
    }
    document.getElementById('battle-screen').style.display = 'none';
    mostrar('lobby'); // En lugar de recargar, volvemos al lobby
}