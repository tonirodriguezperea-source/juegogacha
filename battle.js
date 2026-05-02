// Estado global de la batalla
let battleState = {
    player: null,
    enemy: null,
    turn: 'player'
};

function iniciarBatalla() {
    console.log("Intentando iniciar batalla...");

    // 1. Validar si hay equipo
    if (!equipoUids || equipoUids.length === 0) {
        alert("¡Primero necesitas elegir a alguien en tu equipo!");
        return;
    }

    // 2. Coger el primer personaje del equipo
    const pData = inventario.find(p => p.uid === equipoUids[0]);
    if (!pData) {
        console.error("No se encontró el personaje con UID:", equipoUids[0]);
        return;
    }

    // 3. Crear jugador y enemigo
    battleState.player = {
        nombre: pData.nombre,
        hp: 100,
        maxHp: 100,
        energy: 1,
        emoji: pData.emoji
    };

    const rivalBase = DB[Math.floor(Math.random() * DB.length)];
    battleState.enemy = {
        nombre: rivalBase.nombre + " Salvaje",
        hp: 80,
        maxHp: 80,
        energy: 1,
        emoji: rivalBase.emoji
    };

    console.log("Personajes cargados. Mostrando pantalla...");

    // 4. Cambiar de pantalla
    document.getElementById('battle-screen').style.display = 'flex';
    
    // 5. Limpiar el log y actualizar visuales
    const log = document.getElementById('battle-log');
    if(log) log.innerHTML = `<div>⚔️ ¡Un ${battleState.enemy.nombre} apareció!</div>`;
    
    actualizarInterfazBatalla();
}

function playerMove(tipo) {
    const p = battleState.player;
    const e = battleState.enemy;
    const log = document.getElementById('battle-log');

    if (tipo === 'recargar') {
        p.energy = Math.min(p.energy + 1, 3);
        log.innerHTML += `<div>🔋 Has recuperado energía.</div>`;
    } 
    else if (tipo === 'ataque' && p.energy >= 1) {
        p.energy -= 1;
        e.hp -= 20;
        log.innerHTML += `<div>⚔️ ¡Atacaste! El rival pierde 20 HP.</div>`;
    }
    else if (tipo === 'fuerte' && p.energy >= 2) {
        p.energy -= 2;
        e.hp -= 45;
        log.innerHTML += `<div>💥 ¡Golpe crítico! El rival pierde 45 HP.</div>`;
    }

    // Scroll automático del log
    log.scrollTop = log.scrollHeight;

    // Verificar si el enemigo murió
    if (e.hp <= 0) {
        alert("¡Has ganado la batalla!");
        finalizarBatalla(true);
        return;
    }

    actualizarInterfazBatalla();
}

function actualizarInterfazBatalla() {
    const p = battleState.player;
    const e = battleState.enemy;

    // Barras de Vida
    document.getElementById('player-hp-bar').style.width = (p.hp / p.maxHp * 100) + "%";
    document.getElementById('enemy-hp-bar').style.width = (e.hp / e.maxHp * 100) + "%";

    // Emojis y Nombres
    document.getElementById('player-battle-img').innerText = p.emoji;
    document.getElementById('enemy-battle-img').innerText = e.emoji;
    document.getElementById('player-battle-name').innerText = p.nombre;
    document.getElementById('enemy-battle-name').innerText = e.nombre;

    // Energía (Bolitas)
    const pEnergy = document.getElementById('player-energy');
    const eEnergy = document.getElementById('enemy-energy');
    
    if(pEnergy) {
        pEnergy.innerHTML = "";
        for(let i=0; i<3; i++) {
            pEnergy.innerHTML += `<div class="dot ${i < p.energy ? 'active' : ''}"></div>`;
        }
    }

    // Bloqueo de botones
    document.getElementById('btn-ataque').disabled = p.energy < 1;
    document.getElementById('btn-fuerte').disabled = p.energy < 2;
}

function finalizarBatalla(victoria) {
    document.getElementById('battle-screen').style.display = 'none';
}