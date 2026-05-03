// ================================================================
// 1. VARIABLES GLOBALES Y PERSISTENCIA (SISTEMA DE GUARDADO)
// ================================================================
var inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
var equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];
var monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
var ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;
var stockTienda = JSON.parse(localStorage.getItem("gq_stock_tienda")) || [];
var ultimaFechaTienda = localStorage.getItem("gq_fecha_tienda") || "";
var fragmentosEstelares = parseInt(localStorage.getItem("gq_shards")) || 0;
var skinsPoseidas = JSON.parse(localStorage.getItem("gq_skins_owner")) || []; 
var stockSkinsDia = JSON.parse(localStorage.getItem("gq_stock_skins")) || [];
var ultimaFechaSkins = localStorage.getItem("gq_fecha_skins") || "";

// Precios estándar por rareza (para usar en toda la app)
const PRECIOS_RAREZA = {
    "comun": 1000,
    "raro": 2500,
    "epico": 6000,
    "legendario": 15000
};

const SKINS_DATA = {
    "1": { nombre: "Bulbasaur Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png", precio: 20 },
    "4": { nombre: "Charmander Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png", precio: 20 },
    "7": { nombre: "Squirtle Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png", precio: 20 },
    "25": { nombre: "Pikachu Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png", precio: 30 },
    "150": { nombre: "Mewtwo Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/150.png", precio: 100 },
    "6": { nombre: "Charizard Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png", precio: 60 },
    "94": { nombre: "Gengar Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/94.png", precio: 40 },
    "130": { nombre: "Gyarados Rojo", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/130.png", precio: 50 },
    "3": { nombre: "Venusaur Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/3.png", precio: 35 },
    "9": { nombre: "Blastoise Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/9.png", precio: 35 },
    "133": { nombre: "Eevee Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/133.png", precio: 30 },
    "143": { nombre: "Snorlax Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/143.png", precio: 30 },
    "2": { nombre: "Ivysaur Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/2.png", precio: 25 },
    "5": { nombre: "Charmeleon Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/5.png", precio: 25 },
    "8": { nombre: "Wartortle Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/8.png", precio: 25 },
    "10": { nombre: "Caterpie Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10.png", precio: 15 },
    "11": { nombre: "Metapod Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/11.png", precio: 15 },
    "12": { nombre: "Butterfree Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/12.png", precio: 30 },
    "13": { nombre: "Weedle Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/13.png", precio: 15 },
    "14": { nombre: "Kakuna Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/14.png", precio: 15 },
    "15": { nombre: "Beedrill Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/15.png", precio: 30 },
    "16": { nombre: "Pidgey Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/16.png", precio: 15 },
    "17": { nombre: "Pidgeotto Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/17.png", precio: 25 },
    "18": { nombre: "Pidgeot Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/18.png", precio: 35 }
};

// Descripciones de la Pokédex
const descripciones = {
    "1": "Bulbasaur es un Pokémon tipo planta. Lleva una semilla en su lomo que crece con él.",
    "2": "Ivysaur es un Pokémon tipo planta. Lleva una semilla con la que duerme, paraliza y envenena.",
    "4": "Charmander prefiere los lugares cálidos. La llama de su cola indica su salud.",
    "7": "Squirtle se protege con su caparazón y dispara chorros de agua a presión.",
    "1200": "Son Goku, el guerrero legendario que protege la Tierra con su fuerza infinita.",
    "1201": "Vegeta, el príncipe de los saiyans. Su orgullo es tan grande como su poder.",
    "1202": "Gohan, hijo de Goku. Posee un potencial oculto que despierta en momentos críticos."
};

function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
    localStorage.setItem("gq_monedas", monedas);
    localStorage.setItem("gq_tk_normal", ticketsNormales);
    localStorage.setItem("gq_shards", fragmentosEstelares);
    localStorage.setItem("gq_skins_owner", JSON.stringify(skinsPoseidas));
    localStorage.setItem("gq_stock_skins", JSON.stringify(stockSkinsDia));
    localStorage.setItem("gq_fecha_skins", ultimaFechaSkins);
    localStorage.setItem("gq_stock_tienda", JSON.stringify(stockTienda));
    localStorage.setItem("gq_fecha_tienda", ultimaFechaTienda);
}

function actualizarHUD() {
    const tks = ticketsNormales || 0;
    const mons = monedas || 0;
    const shards = fragmentosEstelares || 0; // <-- Nueva variable

    const idsTickets = ['val-tk-normal', 'val-tk-normal-hud', 'cont-tickets'];
    const idsMonedas = ['cont-monedas', 'val-monedas', 'tienda-monedas'];
    const idsShards = ['val-shards', 'val-shards-hud']; // <-- Nuevos IDs para el HTML

    idsTickets.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerText = tks; });
    idsMonedas.forEach(id => { if(document.getElementById(id)) document.getElementById(id).innerText = mons; });
    
    // Actualizamos los nuevos contadores de Fragmentos
    idsShards.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = shards;
    });
}
// ================================================================
// 2. MOTOR VISUAL (RENDERIZADO DE SPRITES Y EMOJIS)
// ================================================================
window.obtenerImagenHTML = function(p, clases = "") {
    if (!p) return `<span class="sprite ${clases}">❓</span>`;
    
    const spriteURL = p.sprite || (typeof DB !== 'undefined' ? DB.find(d => d.id === p.id)?.sprite : "");
    const emojiFallback = p.emoji || (typeof DB !== 'undefined' ? DB.find(d => d.id === p.id)?.emoji : "👤");

    if (spriteURL && spriteURL.trim() !== "") {
        // Le ponemos un estilo base. El giro lo haremos por fuera para no fallar.
        return `<img src="${spriteURL}" class="sprite ${clases}" style="max-width:100%; display:block; margin:auto;" 
                onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                <span class="sprite-emoji ${clases}" style="display:none; font-size:2rem;">${emojiFallback}</span>`;
    }
    return `<span class="sprite-emoji ${clases}" style="font-size:2rem;">${emojiFallback}</span>`;
};
// ================================================================
// 3. SISTEMA DE TIENDA DINÁMICA (ROTACIÓN DIARIA)
// ================================================================




// ================================================================
// 4. FUNCIONES DE COMPRA Y TRANSACCIÓN
// ================================================================


// ================================================================
// 5. GESTIÓN DE EQUIPO Y MENÚ DE COPIAS
// ================================================================
function renderEquipo() {
    const list = document.getElementById('sagas-list');
    const filtro = document.getElementById('busqueda-equipo')?.value.toLowerCase() || "";
    if (!list) return;
    list.innerHTML = '';

    const especies = {};
    inventario.forEach(p => {
        if (!especies[p.id]) especies[p.id] = { ...p, cantidad: 0, copias: [] };
        especies[p.id].cantidad++;
        especies[p.id].copias.push(p);
    });

    const sagas = {};
    Object.values(especies).forEach(p => {
        if (p.nombre.toLowerCase().includes(filtro)) {
            if (!sagas[p.saga]) sagas[p.saga] = [];
            sagas[p.saga].push(p);
        }
    });

    for (const s in sagas) {
        const sec = document.createElement('div');
        sec.className = 'saga-section';
        sec.innerHTML = `<h3 class="saga-title" style="color:#4ade80; border-bottom:1px solid #333; padding-bottom:5px; margin-top:20px;">${s}</h3><div class="grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap:15px; margin-top:10px;"></div>`;
        const grid = sec.querySelector('.grid');
        
        sagas[s].forEach(p => {
            const enEquipo = p.copias.some(c => equipoUids.includes(c.uid));
            grid.innerHTML += `
                <div class="card-stack" style="position:relative;">
                    ${p.cantidad > 1 ? `<div class="stack-count" style="position:absolute; top:-5px; right:-5px; background:#4ade80; color:black; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:bold; z-index:2;">${p.cantidad}</div>` : ''}
                    <div class="card ${enEquipo ? 'active-team' : ''}" 
                         style="background:#1a1a2e; border:1px solid ${enEquipo ? '#4ade80' : '#333'}; padding:10px; border-radius:12px; text-align:center; cursor:pointer;"
                         onclick="abrirMenuCopias('${p.id}')" 
                         onmouseenter="mostrarInfo('${p.id}')">
                        <div class="card-avatar">${obtenerImagenHTML(p)}</div>
                        <div class="card-name" style="color:white; font-size:0.8rem; margin-top:5px;">${p.nombre}</div>
                    </div>
                </div>`;
        });
        list.appendChild(sec);
    }
}

function abrirMenuCopias(id) {
    const copias = inventario.filter(p => p.id == id);
    const overlay = document.createElement('div');
    overlay.id = "overlay-copias";
    overlay.className = "modal-overlay"; // Asegúrate de tener estilos para esto o usa style inline
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(4px);";
    
    const misSkins = skinsPoseidas.filter(s => s.idPersonaje == id);

    let html = `
        <div style="background:#1a1a2e; padding:25px; border-radius:20px; border:2px solid #4ade80; width:340px; color: white;">
            <div style="text-align:center; margin-bottom: 20px;">
                ${obtenerImagenHTML(copias[0])}
                <h3 style="color:#4ade80; margin:10px 0;">${copias[0].nombre}</h3>
            </div>
            
            <div style="max-height:200px; overflow-y:auto; margin-bottom:20px; padding-right:5px;">`;

    copias.forEach((c, index) => {
        const enEq = equipoUids.includes(c.uid);
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:10px; background:#0f0f1b; border-radius:10px; border:1px solid ${enEq ? '#4ade80' : '#333'};">
                <span style="font-size:0.9rem;">Copia #${index + 1}</span>
                <button onclick="toggleEquipo('${c.uid}'); document.getElementById('overlay-copias').remove()" 
                        style="padding:6px 12px; cursor:pointer; background:${enEq ? '#ef4444' : '#4ade80'}; color:black; border:none; border-radius:6px; font-weight:bold; font-size:0.8rem;">
                    ${enEq ? 'QUITAR' : 'PONER'}
                </button>
            </div>`;
    });

    html += `</div>
            <div style="border-top:1px solid #333; padding-top:15px;">
                <p style="color:#8b5cf6; font-size:0.8rem; font-weight:bold; margin-bottom:10px; text-transform:uppercase;">Apariencia ✨</p>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button onclick="aplicarSkin('${id}', 'default')" style="background:#333; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem;">Normal</button>`;
    
    misSkins.forEach(s => {
        html += `<button onclick="aplicarSkin('${id}', '${s.nombreSkin}')" style="background:#8b5cf6; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem;">Shiny</button>`;
    });

    html += `   </div>
            </div>
            <button onclick="document.getElementById('overlay-copias').remove()" style="width:100%; margin-top:20px; background:transparent; color:#666; border:none; padding:10px; cursor:pointer;">Cerrar</button>
        </div>`;

    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}

function aplicarSkin(idPersonaje, nombreSkin) {
    let nuevoSprite = "";
    if (nombreSkin === 'default') {
        nuevoSprite = DB.find(p => p.id == idPersonaje).sprite;
    } else {
        nuevoSprite = SKINS_DATA[idPersonaje].sprite;
    }

    inventario.forEach(p => {
        if (p.id == idPersonaje) {
            p.sprite = nuevoSprite;
            p.skinEquipada = nombreSkin;
        }
    });

    guardar();
    renderEquipo();
    renderLobby();
    if(document.getElementById('overlay-copias')) document.getElementById('overlay-copias').remove();
}

function toggleEquipo(uid) {
    const idx = equipoUids.indexOf(uid);
    if (idx > -1) {
        equipoUids.splice(idx, 1);
    } else {
        if (equipoUids.length < 3) {
            equipoUids.push(uid);
        } else {
            alert("⚠️ Máximo 3 héroes en el equipo.");
        }
    }
    guardar();
    renderEquipo();
    renderLobby();
}

// ================================================================
// 6. POKÉDEX, LOBBY Y NAVEGACIÓN
// ================================================================
function renderDex() {
    const grid = document.getElementById('dex-grid');
    if (!grid) return;
    
    const totalEspecies = DB.length;
    const especiesObtenidas = DB.filter(p => inventario.some(inv => inv.id === p.id)).length;
    const porcentaje = Math.round((especiesObtenidas / totalEspecies) * 100);

    let html = `
        <div class="dex-progress-wrapper" style="grid-column: 1 / -1; margin-bottom: 25px; background:#1a1a2e; padding:15px; border-radius:15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: white; font-weight:bold;">
                <span>PROGRESO DE COLECCIÓN</span>
                <span>${especiesObtenidas} / ${totalEspecies} (${porcentaje}%)</span>
            </div>
            <div style="width: 100%; height: 12px; background: #0f0f1b; border-radius: 10px; overflow: hidden; border:1px solid #333;">
                <div style="width: ${porcentaje}%; height: 100%; background: linear-gradient(90deg, #4ade80, #22c55e); transition: 1s width;"></div>
            </div>
        </div>
    `;

    DB.sort((a,b) => a.id - b.id).forEach(p => {
        const tiene = inventario.some(inv => inv.id === p.id);
        const color = RAREZAS[p.rareza] || '#94a3b8';
        
        html += `
            <div class="dex-card ${tiene ? 'registrado' : 'desconocido'}" 
                 style="background:#1a1a2e; border:2px solid ${tiene ? color : '#333'}; border-radius:15px; padding:15px; text-align:center; position:relative; cursor:pointer;" 
                 onclick="${tiene ? `mostrarInfo('${p.id}')` : ''}">
                <div style="position:absolute; top:5px; left:10px; color:#666; font-size:0.7rem;">#${p.id}</div>
                <div class="dex-body" style="margin:10px 0; filter: ${tiene ? 'none' : 'brightness(0) invert(0.2)'}">${obtenerImagenHTML(p)}</div>
                <div class="dex-footer">
                    <div style="color:${tiene ? 'white' : '#444'}; font-weight:bold; font-size:0.8rem;">${tiene ? p.nombre : '???'}</div>
                </div>
                ${tiene ? '<div style="position:absolute; bottom:5px; right:10px; color:#4ade80; font-size:0.8rem;">✔</div>' : ''}
            </div>`;
    });
    grid.innerHTML = html;
}

window.renderLobby = function() {
    const contenedor = document.getElementById('hero-display');
    if (!contenedor) return;
    const equipo = inventario.filter(p => equipoUids.includes(p.uid));
    
    if (equipo.length === 0) {
        contenedor.innerHTML = "<p style='color:#666;'>Tu equipo está vacío. Ve a la pestaña EQUIPO.</p>";
        return;
    }

    contenedor.innerHTML = equipo.map(p => `
        <div class="lobby-character-card" style="margin:0 20px; text-align:center;">
            <div class="lobby-sprite">${obtenerImagenHTML(p, "luchador-anim")}</div>
            <div class="lobby-info" style="background:rgba(0,0,0,0.5); padding:10px; border-radius:10px; margin-top:10px;">
                <p style="color:white; font-weight:bold; margin:0;">${p.nombre}</p>
                <div style="color:#4ade80; font-size:0.8rem;">LV. ${p.lvl || 1}</div>
                <small style="color:${RAREZAS[p.rareza]}; font-size:0.6rem; text-transform:uppercase;">${p.rareza}</small>
            </div>
        </div>`).join("");
};

function mostrar(pantalla) {
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(p => p.style.display = 'none');
    
    const pActive = document.getElementById('pantalla-' + pantalla);
    if (pActive) pActive.style.display = 'block';

    // Modificamos esta parte:
    if (pantalla === 'tienda') {
        renderTienda();      // Dibuja los personajes normales
        renderTiendaSkins(); // <--- AÑADIR ESTA LÍNEA (Dibuja los Shinys)
    }

    if (pantalla === 'lobby') renderLobby();
    if (pantalla === 'equipo') renderEquipo();
    if (pantalla === 'pokedex') renderDex();
    
    actualizarHUD();
}
function mostrarInfo(id) {
    const p = DB.find(x => x.id == id);
    if (!p) return;
    document.getElementById('info-photo').innerHTML = obtenerImagenHTML(p);
    document.getElementById('info-name').innerText = p.nombre;
    document.getElementById('info-desc').innerText = descripciones[p.id] || "Héroe listo para la batalla.";
    document.getElementById('info-dex').innerText = p.id;
    document.getElementById('info-tipo').innerText = p.tipo.toUpperCase();
    document.getElementById('info-saga').innerText = p.saga;
}

// ================================================================
// 7. INICIO DE LA APLICACIÓN
// ================================================================
window.onload = () => {
    actualizarHUD();
    mostrar('lobby');
};

// Este código vigila el contenedor del jugador y gira lo que haya dentro
const observer = new MutationObserver(() => {
    const contenedorJugador = document.getElementById('player-battle-img');
    if (contenedorJugador) {
        const img = contenedorJugador.querySelector('img');
        if (img) {
            img.style.transform = "scaleX(-1)";
            img.style.filter = "drop-shadow(-5px 10px 10px rgba(0,0,0,0.3))";
        }
    }
});

// Iniciamos la vigilancia cuando cargue la página
window.addEventListener('load', () => {
    const target = document.getElementById('player-battle-img');
    if (target) {
        observer.observe(target, { childList: true });
    }
});

function actualizarTiendaSkins() {
    const hoy = new Date().toLocaleDateString();
    if (ultimaFechaSkins !== hoy || stockSkinsDia.length === 0) {
        const todasLasKeys = Object.keys(SKINS_DATA);
        // Elegimos 12 al azar (o todas si hay menos de 12)
        const seleccionadas = todasLasKeys.sort(() => 0.5 - Math.random()).slice(0, 12);
        stockSkinsDia = seleccionadas.map(key => ({ idOriginal: key, ...SKINS_DATA[key] }));
        ultimaFechaSkins = hoy;
        guardar();
    }
}

function renderTiendaSkins() {
    actualizarTiendaSkins();
    const contenedor = document.getElementById('tienda-skins-grid');
    if (!contenedor) return;
    contenedor.innerHTML = "";

    stockSkinsDia.forEach(skin => {
        const yaLaTiene = skinsPoseidas.some(s => s.idPersonaje == skin.idOriginal && s.nombreSkin == skin.nombre);
        contenedor.innerHTML += `
            <div class="card skin-card" style="background:#1a1a2e; border:2px solid #8b5cf6; padding:15px; border-radius:15px; text-align:center; transition: 0.3s;">
                <div class="card-avatar" style="filter: drop-shadow(0 0 8px rgba(139,92,246,0.5))">
                    <img src="${skin.sprite}" style="width:70px; height:70px; object-fit:contain;">
                </div>
                <div style="color:white; font-size:0.8rem; margin:10px 0; font-weight:bold;">${skin.nombre}</div>
                <div style="color:#a78bfa; font-weight:bold; margin-bottom:10px;">✨ ${skin.precio}</div>
                <button onclick="${yaLaTiene ? '' : `comprarSkin('${skin.idOriginal}')`}" 
                        style="width:100%; background:${yaLaTiene ? '#333' : '#8b5cf6'}; color:white; border:none; padding:8px; border-radius:8px; cursor:pointer; font-weight:bold;">
                    ${yaLaTiene ? 'ADQUIRIDO' : 'COMPRAR'}
                </button>
            </div>`;
    });
}

function comprarSkin(id) {
    const skin = SKINS_DATA[id];
    if (fragmentosEstelares >= skin.precio) {
        fragmentosEstelares -= skin.precio;
        skinsPoseidas.push({ idPersonaje: id, nombreSkin: skin.nombre });
        guardar();
        actualizarHUD();
        renderTiendaSkins();
        alert(`✨ ¡Has desbloqueado a ${skin.nombre}! ✨`);
    } else {
        alert("⚠️ No tienes suficientes Fragmentos Estelares.");
    }
}

function testShards() {
    // 1. Sumamos 50 a la variable global
    fragmentosEstelares += 50;
    
    // 2. Guardamos en el localStorage
    guardar();
    
    // 3. Refrescamos el HUD para ver el cambio al instante
    actualizarHUD();
    
    // 4. Si estás en la tienda, refrescamos los botones para que se activen
    if (typeof renderTiendaSkins === "function") {
        renderTiendaSkins();
    }

    console.log("✨ DEBUG: Ahora tienes " + fragmentosEstelares + " fragmentos.");
}