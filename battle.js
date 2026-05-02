const TABLA_TIPOS = {
    "fuego": { fuerte: "planta", debil: "agua" },
    "agua": { fuerte: "fuego", debil: "planta" },
    "planta": { fuerte: "agua", debil: "fuego" },
    "guerrero": { fuerte: "monstruo", debil: "magia" }, // Ejemplo para DBZ
    "monstruo": { fuerte: "magia", debil: "guerrero" }
};

function calcularMultiplicador(tipoAtacante, tipoDefensor) {
    if (!tipoAtacante || !tipoDefensor) return 1;
    const relacion = TABLA_TIPOS[tipoAtacante.toLowerCase()];
    
    if (relacion?.fuerte === tipoDefensor.toLowerCase()) return 1.5; // ¡Súper efectivo!
    if (relacion?.debil === tipoDefensor.toLowerCase()) return 0.5;  // Poco efectivo...
    return 1;
}
let battleState = {
    player: null,
    enemy: null,
    turn: 'player',
    isDefending: false,
    playerTeam: [],
    enemyTeam: [], // Ahora el enemigo también tiene equipo
    playerIdx: 0,
    enemyIdx: 0
};

function iniciarBatalla() {
    // 1. Cargar equipo del jugador
    battleState.playerTeam = inventario.filter(p => equipoUids.includes(p.uid));
    if (battleState.playerTeam.length === 0) return alert("¡Elige a alguien en tu equipo!");

    // 2. Generar equipo enemigo (1 a 3 luchadores)
    battleState.enemyTeam = [];
    const numEnemigos = Math.floor(Math.random() * 3) + 1;
    const nivelMedioJugador = battleState.playerTeam.reduce((acc, p) => acc + p.lvl, 0) / battleState.playerTeam.length;

    for (let i = 0; i < numEnemigos; i++) {
        const base = DB[Math.floor(Math.random() * DB.length)];
        // Nivel parejo: entre -5 y +5 del nivel medio del jugador (mínimo nivel 1)
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

// NUEVA FUNCIÓN: Cambiar de bicho manualmente
function cambiarBicho() {
    if (battleState.turn !== 'player') return;
    if (battleState.playerTeam.length <= 1) return alert("¡No tienes a nadie más en el equipo!");

    // Buscamos el siguiente índice disponible
    let siguiente = (battleState.playerIdx + 1) % battleState.playerTeam.length;
    
    // Si el siguiente está muerto, saltamos (esto es por si implementas muerte permanente en la sesión)
    battleState.playerIdx = siguiente;
    setupFighter('player');
    
    escribirLog(`¡Cambio! Sale ${battleState.player.nombre} al campo.`);
    
    // Cambiar de bicho consume el turno
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
    } else if (tipo === 'ataque' && p.energy >= 1) {
        const dmg = 15 + (p.lvl * 2);
        e.hp -= dmg;
        p.energy--;
        escribirLog(`${p.nombre} golpea con ${dmg} de daño.`);
    } else if (tipo === 'fuerte' && p.energy >= 2) {
        const dmg = 35 + (p.lvl * 3);
        e.hp -= dmg;
        p.energy -= 2;
        escribirLog(`¡GOLPE CRÍTICO de ${dmg} daño!`);
    } else if (tipo === 'defensa') {
        battleState.isDefending = true;
        escribirLog(`${p.nombre} se pone en guardia.`);
    }

    actualizarInterfazBatalla();
    verificarEstado();

    // Dentro de playerMove, donde calculas el daño:
const mult = calcularMultiplicador(p.tipo, e.tipo);
let dmgBase = (tipo === 'fuerte') ? 35 : 15;
let totalDmg = Math.floor((dmgBase + (p.lvl * 2)) * mult);

if (battleState.enemyDefending) { // Si la IA se defendió
    totalDmg = Math.floor(totalDmg / 2);
    battleState.enemyDefending = false; 
    escribirLog(`¡${e.nombre} bloqueó parte del golpe!`);
}

e.hp -= totalDmg;
// ... resto del log con el mensaje de "Súper efectivo" si mult > 1
}

function verificarEstado() {
    const e = battleState.enemy;
    const p = battleState.player;

    if (e.hp <= 0) {
        battleState.enemyIdx++;
        if (battleState.enemyIdx < battleState.enemyTeam.length) {
            escribirLog(`¡${e.nombre} derrotado! Entra su siguiente luchador.`);
            setupFighter('enemy');
            actualizarInterfazBatalla();
        } else {
            alert("¡HAS GANADO EL COMBATE!");
            finalizarBatalla(true);
        }
    } else if (p.hp <= 0) {
        battleState.playerIdx++;
        if (battleState.playerIdx < battleState.playerTeam.length) {
            escribirLog(`¡${p.nombre} ha caído! ¡Sale el siguiente!`);
            setupFighter('player');
            actualizarInterfazBatalla();
        } else {
            alert("Derrota total...");
            finalizarBatalla(false);
        }
    } else if (battleState.turn === 'player') {
        battleState.turn = 'enemy';
        setTimeout(turnoEnemigo, 1000);
    }
}

function turnoEnemigo() {
    const e = battleState.enemy;
    const p = battleState.player;
    
    // IA Inteligente
    let decision;
    const rand = Math.random();

    if (e.energy >= 2 && rand > 0.3) {
        decision = 'fuerte';
    } else if (e.hp < 30 && e.energy >= 1 && rand > 0.5) {
        decision = 'defensa'; // Si está muriendo, intenta aguantar
    } else if (e.energy >= 1 && rand > 0.4) {
        decision = 'ataque';
    } else {
        decision = 'recargar';
    }

    // Ejecutar decisión
    if (decision === 'recargar') {
        e.energy = Math.min(e.energy + 1, 3);
        escribirLog(`${e.nombre} está concentrando energía...`);
    } else if (decision === 'defensa') {
        battleState.enemyDefending = true; // Necesitarás esta variable en el estado
        escribirLog(`${e.nombre} se pone en posición defensiva.`);
    } else {
        // ATAQUES (Con tabla de tipos)
        const mult = calcularMultiplicador(e.tipo, p.tipo);
        let dmgBase = (decision === 'fuerte') ? 35 : 15;
        let totalDmg = Math.floor((dmgBase + (e.lvl * 2)) * mult);

        if (battleState.isDefending) {
            totalDmg = Math.floor(totalDmg / 2);
            escribirLog("¡Tu defensa redujo el daño!");
        }

        p.hp -= totalDmg;
        e.energy -= (decision === 'fuerte') ? 2 : 1;

        let msg = `${e.nombre} usa ${decision.toUpperCase()}.`;
        if (mult > 1) msg += " ¡Es súper efectivo! 💥";
        if (mult < 1) msg += " No es muy efectivo... 💧";
        escribirLog(`${msg} Daño: ${totalDmg}`);
    }

    battleState.isDefending = false; // Reset de tu defensa
    battleState.turn = 'player';
    actualizarInterfazBatalla();
    if (p.hp <= 0) verificarEstado();
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;

    // Barras y Emojis
    document.getElementById('player-hp-bar').style.width = Math.max(0, (p.hp/p.maxHp)*100) + "%";
    document.getElementById('enemy-hp-bar').style.width = Math.max(0, (e.hp/e.maxHp)*100) + "%";
    document.getElementById('player-battle-img').innerText = p.emoji;
    document.getElementById('enemy-battle-img').innerText = e.emoji;
    document.getElementById('player-battle-name').innerText = `${p.nombre} (LV.${p.lvl})`;
    document.getElementById('enemy-battle-name').innerText = `${e.nombre} (LV.${e.lvl})`;

    // Energía
    dibujarPuntos('player-energy', p.energy);
    dibujarPuntos('enemy-energy', e.energy);

    // Botones (Añade el botón de cambio si quieres)
    const btns = document.querySelectorAll('.btn-action');
    btns.forEach(b => b.disabled = (battleState.turn === 'enemy'));
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