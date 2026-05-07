// Forzamos que la función exista desde el segundo 1
window.cambiarSkinMenu = function(id, tipo) {
    console.log("BOTÓN PULSADO: ID " + id + " TIPO " + tipo);
    if(typeof ejecutarCambioReal === 'function') {
        ejecutarCambioReal(id, tipo);
    } else {
        alert("Error: La lógica interna aún no ha cargado");
    }
};

// ================================================================
// 1. VARIABLES GLOBALES Y PERSISTENCIA (SISTEMA DE GUARDADO)
// ================================================================
var inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
var equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];
var monedas = parseInt(localStorage.getItem("gq_monedas")) || 0;
var ticketsNormales = parseInt(localStorage.getItem("gq_tk_normal")) || 0;
var stockTienda = JSON.parse(localStorage.getItem("gq_stock_tienda")) || [];
var stockTienda7 = JSON.parse(localStorage.getItem("gq_stock_tienda7")) || [];
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
    "18": { nombre: "Pidgeot Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/18.png", precio: 35 },
    "807": { nombre: "Zeraora Shiny", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/807.png", precio: 100 },
};



function guardar() {
    // 1. GUARDADO LOCAL (Lo que ya tenías)
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
    localStorage.setItem("gq_monedas", monedas);
    localStorage.setItem("gq_tk_normal", ticketsNormales);
    localStorage.setItem("gq_shards", fragmentosEstelares);
    localStorage.setItem("gq_skins_owner", JSON.stringify(skinsPoseidas));
    localStorage.setItem("gq_stock_skins", JSON.stringify(stockSkinsDia));
    localStorage.setItem("gq_fecha_skins", ultimaFechaSkins);
    localStorage.setItem("gq_stock_tienda", JSON.stringify(stockTienda));
    localStorage.setItem("gq_stock_tienda7", JSON.stringify(stockTienda7));
    localStorage.setItem("gq_fecha_tienda", ultimaFechaTienda);
    // Añadimos la mochila por si acaso faltaba
    localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));

    // 2. GUARDADO EN LA NUBE (Firebase)
    // Verificamos si hay un usuario conectado
    const usuario = firebase.auth().currentUser;
    
    if (usuario) {
        db.collection("usuarios").doc(usuario.uid).update({
            inventario: inventario,
            equipoUids: equipoUids,
            monedas: monedas,
            ticketsNormales: ticketsNormales,
            fragmentosEstelares: fragmentosEstelares,
            skinsPoseidas: skinsPoseidas,
            mochila: window.mochila,
            // Guardamos también la fecha para sincronizar tiendas si quieres
            ultimaFechaTienda: ultimaFechaTienda 
        })
        .then(() => {
            console.log("☁️ Partida sincronizada en la nube con éxito.");
        })
        .catch((error) => {
            console.error("❌ Error al sincronizar en la nube:", error);
        });
    } else {
        console.warn("⚠️ Guardado solo local. Inicia sesión para guardar en la nube.");
    }
}

function actualizarHUD() {
    // --- CONEXIÓN CON LA MOCHILA ---
    // En lugar de usar la variable suelta, leemos directamente el dato real
    const tks = (window.mochila && window.mochila.caramelo_raro !== undefined) 
                ? window.mochila.caramelo_raro 
                : (ticketsNormales || 0);

    const mons = monedas || 0;
    const shards = fragmentosEstelares || 0;

    const idsTickets = ['val-tk-normal', 'val-tk-normal-hud', 'cont-tickets'];
    const idsMonedas = ['cont-monedas', 'val-monedas', 'tienda-monedas'];
    const idsShards = ['val-shards', 'val-shards-hud'];

    // 1. Actualizamos Caramelos (Tickets)
    idsTickets.forEach(id => { 
        const el = document.getElementById(id);
        if(el) el.innerText = tks; 
    });

    // 2. Actualizamos Monedas
    idsMonedas.forEach(id => { 
        const el = document.getElementById(id);
        if(el) el.innerText = mons; 
    });
    
    // 3. Actualizamos Fragmentos
    idsShards.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = shards;
    });

    // 4. EXTRA: Si tienes el texto de "Tienes: X" en la tienda, lo actualizamos también
    const stockTienda = document.getElementById('stock-caramelos');
    if (stockTienda) stockTienda.innerText = "Tienes: " + tks;
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
    const idBusqueda = parseInt(id);
    const copias = inventario.filter(p => parseInt(p.id) === idBusqueda);
    
    if (copias.length === 0) return;

    const baseDB = DB.find(db => parseInt(db.id) === idBusqueda);
    const tieneSkin = skinsPoseidas && skinsPoseidas.some(s => parseInt(s.idPersonaje) === idBusqueda);
    const skinActual = copias[0].skin || 'normal';

    const overlay = document.createElement('div');
    overlay.id = "overlay-copias";
    overlay.className = "modal-evolucion";
    overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:100001;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(5px);";
    
    let html = `
        <div style="background:#1a1a2e; padding:25px; border-radius:20px; border:2px solid #facc15; width:380px; color: white; font-family: sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <div style="text-align:center; margin-bottom: 20px;">
                <div id="img-contenedor-menu" style="width:110px; height:110px; margin: 0 auto; display:flex; justify-content:center; align-items:center;">
                    ${obtenerImagenHTML({...baseDB, skin: skinActual})}
                </div>
                <h2 style="color:#facc15; margin:10px 0 5px 0;">${baseDB.nombre}</h2>
                
                <div style="display:flex; justify-content:center; gap:10px; margin-top:15px;">
                    <button onclick="if(window.cambiarSkinMenu) { window.cambiarSkinMenu('${idBusqueda}', 'normal'); } else { console.error('Error: cambiarSkinMenu no encontrada'); }" 
                            style="cursor:pointer; padding:8px 15px; background:#333; color:white; border:1px solid #555; border-radius:8px; font-size:0.8rem;">Normal</button>
                    
                    ${tieneSkin ? `
                        <button onclick="if(window.cambiarSkinMenu) { window.cambiarSkinMenu('${idBusqueda}', 'shiny'); } else { console.error('Error: cambiarSkinMenu no encontrada'); }" 
                                style="cursor:pointer; padding:8px 15px; background:linear-gradient(to bottom, #facc15, #b48608); color:black; border:none; border-radius:8px; font-weight:bold; font-size:0.8rem;">Shiny ✨</button>
                    ` : ''}
                </div>
            </div>

            <div style="max-height:300px; overflow-y:auto; padding-right:5px; border-top:1px solid #333; padding-top:15px;">`;

    const copiasOrdenadas = [...copias].sort((a,b) => (b.estrellas||0) - (a.ofestrellas||0));

    copiasOrdenadas.forEach((c, idx) => {
        const enEq = equipoUids.includes(c.uid);
        const est = parseInt(c.estrellas) || 0;
        const nec = est + 1;
        const disp = copias.filter(p => p.uid !== c.uid && !equipoUids.includes(p.uid)).length;
        
        const atk = c.ataque || (baseDB ? baseDB.ataque : 0);
        const hp = c.vidaMax || (baseDB ? baseDB.vidaMax : 0);
        const nivel = c.lvl || 1;

        html += `
            <div style="background:#0f0f1b; border:1px solid ${enEq ? '#4ade80' : '#444'}; border-radius:12px; padding:12px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:0.85rem; font-weight:bold; color:white;">Instancia #${idx+1} ${c.skin === 'shiny' ? '✨' : ''}</span>
                        <div style="color:#facc15; font-size:1rem; letter-spacing:2px;">
                            ${est > 0 ? '⭐'.repeat(est) : '<span style="color:#444">☆☆☆☆☆</span>'}
                        </div>
                    </div>
                    <button onclick="toggleEquipo('${c.uid}'); document.getElementById('overlay-copias').remove();" 
                            style="background:${enEq ? '#ef4444' : '#4ade80'}; color:black; border:none; padding:6px 12px; border-radius:8px; font-size:0.7rem; font-weight:bold; cursor:pointer;">
                        ${enEq ? 'QUITAR' : 'PONER'}
                    </button>
                </div>
                
                <div style="font-size:0.75rem; color:#aaa; margin:8px 0; background:rgba(255,255,255,0.05); padding:5px; border-radius:5px;">
                    ⚔️ ${atk} | ❤️ ${hp} | <span style="color:#4ade80; font-weight:bold;">Niv. ${nivel}</span>
                </div>

                <button onclick="usarCaramelo('${c.uid}')" 
                        style="width:100%; margin-bottom:10px; background:#4ade80; color:black; border:none; padding:8px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:0.75rem; display:flex; align-items:center; justify-content:center; gap:5px;">
                    🍬 DAR CARAMELO (-1)
                </button>

                ${est < 5 ? `
                    <button onclick="ascenderPokemon('${c.uid}')" 
                            style="width:100%; padding:10px; background:#facc15; border:none; border-radius:8px; font-weight:bold; cursor:pointer; opacity:${disp >= nec ? '1' : '0.4'}; font-size:0.8rem; color:black;">
                        Subir a ${est+1} ⭐ (Nec. ${nec} copias)
                    </button>
                ` : '<div style="text-align:center; color:#facc15; font-size:0.75rem; font-weight:bold;">¡RANGO MÁXIMO!</div>'}
            </div>`;
    });

    html += `</div>
            <button onclick="document.getElementById('overlay-copias').remove()" style="width:100%; margin-top:15px; background:none; border:none; color:#777; cursor:pointer; font-size:0.9rem;">Cerrar Panel</button>
        </div>`;

    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}
// FUNCIÓN AUXILIAR PARA CAMBIAR LA SKIN DE TODAS LAS COPIAS Y LA IMAGEN DEL MENÚ
window.cambiarSkinMenu = function(id, tipo) {
    console.log("Cambiando skin de ID:", id, "a tipo:", tipo);
    const idNumerico = parseInt(id);

    // 1. Buscamos la data de la skin para obtener el sprite nuevo
    // Si es normal, el sprite vendrá de la DB original. Si es shiny, de SKINS_DATA.
    const dataSkin = (tipo === 'shiny') ? SKINS_DATA[idNumerico] : DB.find(d => parseInt(d.id) === idNumerico);

    if (!dataSkin) {
        console.error("No se encontró información para la skin del ID:", idNumerico);
        return;
    }

    // 2. Actualizar el inventario
    inventario.forEach(p => {
        if (parseInt(p.id) === idNumerico) {
            p.skin = tipo; // Guardamos el estado ('normal' o 'shiny')
            p.sprite = dataSkin.sprite; // ¡ESTO ES CLAVE! Actualizamos la imagen real
        }
    });

    // 3. Intentar refrescar la imagen del menú si existe
    const contenedor = document.getElementById('img-contenedor-menu');
    if (contenedor) {
        // Usamos el sprite que acabamos de elegir
        contenedor.innerHTML = obtenerImagenHTML({
            id: idNumerico,
            sprite: dataSkin.sprite,
            skin: tipo
        });
    }

    // 4. Guardar y refrescar todo el juego
    guardar();
    
    // Estas dos funciones son vitales para que el cambio se vea 
    // en el Lobby y en la lista de Equipo sin recargar la página.
    if (typeof renderEquipo === 'function') renderEquipo();
    if (typeof renderLobby === 'function') renderLobby();
    
    console.log("Skin actualizada con éxito en todas las copias.");
};
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
    // 1. Ocultamos todas las pantallas
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(p => p.style.display = 'none');
    
    // 2. Buscamos la pantalla por su ID (asegúrate de que en el HTML sea 'pantalla-XXX')
    const pActive = document.getElementById('pantalla-' + pantalla);
    if (pActive) pActive.style.display = 'block';

    // 3. Lógica específica para cada sección
    if (pantalla === 'tienda') {
        renderTienda();      // Dibuja personajes y caramelos en la tienda
        if (typeof renderTiendaSkins === 'function') renderTiendaSkins(); // Dibuja los Shinys
    }

    // --- NUEVA SECCIÓN PARA LA MOCHILA ---
    if (pantalla === 'inventario-objetos') {
        if (typeof renderMochila === 'function') {
            renderMochila(); 
        } else {
            console.error("Error: La función renderMochila no existe en inventario.js");
        }
    }

    // Resto de pantallas
    if (pantalla === 'misiones') renderMisiones();
    if (pantalla === 'lobby') renderLobby();
    if (pantalla === 'equipo') renderEquipo();
    if (pantalla === 'pokedex') renderDex();

    // Siempre actualizamos el HUD (monedas, tickets...)
    actualizarHUD();
}
function mostrarInfo(id) {
    const p = DB.find(x => x.id == id);
    if (!p) return;
    document.getElementById('info-photo').innerHTML = obtenerImagenHTML(p);
    document.getElementById('info-name').innerText = p.nombre;
    document.getElementById('info-desc').innerText = p.descripcion;
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

function ascenderPokemon(uidSeleccionado) {
    const principal = inventario.find(p => p.uid === uidSeleccionado);
    if (!principal) return;

    const estrellasActuales = principal.estrellas || 0;
    if (estrellasActuales >= 5) {
        alert("¡Este Pokémon ya ha alcanzado la perfección (5 estrellas)! ⭐⭐⭐⭐⭐");
        return;
    }

    // --- NUEVA DIFICULTAD ESCALABLE ---
    // Si tiene 0 estrellas, pide 1. Si tiene 1, pide 2. Si tiene 2, pide 3... y así.
    const necesarias = estrellasActuales + 1; 

    // Buscamos copias del mismo ID, distinto UID y que no estén equipadas
    const disponibles = inventario.filter(p => 
        p.id === principal.id && 
        p.uid !== principal.uid && 
        !equipoUids.includes(p.uid)
    );

    if (disponibles.length < necesarias) {
        alert(`Dificultad de Rango: Para subir a ${estrellasActuales + 1} estrellas necesitas ${necesarias} copias extra. Solo tienes ${disponibles.length}.`);
        return;
    }

    if (!confirm(`¿Deseas sacrificar ${necesarias} copias para que ${principal.nombre} alcance las ${estrellasActuales + 1} estrellas?`)) return;

    // 1. Eliminamos las copias sacrificadas
    for (let i = 0; i < necesarias; i++) {
        const indexParaBorrar = inventario.findIndex(p => p.uid === disponibles[i].uid);
        if (indexParaBorrar !== -1) inventario.splice(indexParaBorrar, 1);
    }

    // 2. Aplicamos la mejora (Mantenemos el 30% de subida de stats)
    principal.estrellas = estrellasActuales + 1;
    
    // Aseguramos stats base si fallan
    const baseDB = DB.find(db => db.id === principal.id);
    if (!principal.ataque) principal.ataque = baseDB ? baseDB.ataque : 50;
    if (!principal.vidaMax) principal.vidaMax = baseDB ? baseDB.vidaMax : 500;

    principal.ataque = Math.round(principal.ataque * 1.3);
    principal.vidaMax = Math.round(principal.vidaMax * 1.3);
    principal.hp = principal.vidaMax;

    guardar();
    document.getElementById('overlay-copias').remove();
    abrirMenuCopias(principal.id);
    alert(`¡Ascensión lograda! ${principal.nombre} es ahora un rango ${principal.estrellas} ⭐.`);
}

function ejecutarCambioReal(id, tipo) {
    const idNum = parseInt(id);
    
    // 1. Actualizar inventario
    inventario.forEach(p => {
        if (parseInt(p.id) === idNum) {
            p.skin = tipo;
            // Actualizar sprite
            if (tipo === 'shiny' && typeof SKINS_DATA !== 'undefined' && SKINS_DATA[idNum]) {
                p.sprite = SKINS_DATA[idNum].sprite;
            } else {
                const base = DB.find(d => parseInt(d.id) === idNum);
                if (base) p.sprite = base.sprite;
            }
        }
    });

    // 2. Actualizar visualmente el menú abierto
    const imgCont = document.getElementById('img-contenedor-menu');
    if (imgCont) {
        const baseDB = DB.find(db => parseInt(db.id) === idNum);
        imgCont.innerHTML = obtenerImagenHTML({...baseDB, skin: tipo});
    }

    // 3. Guardar y refrescar
    if(typeof guardar === 'function') guardar();
    if(typeof renderEquipo === 'function') renderEquipo();
    if(typeof renderLobby === 'function') renderLobby();
    
    console.log("Cambio de skin completado para ID:", idNum);
}

function borrarPartida() {
    console.log("Intentando borrar partida..."); // Para ver si el botón responde
    
    if (confirm("⚠️ ¿ESTÁS SEGURO? Perderás todos tus Pokémon y monedas.")) {
        if (confirm("❗ ¿ÚLTIMA PALABRA? No hay marcha atrás.")) {
            // Limpieza absoluta de la memoria
            localStorage.clear();
            
            // Forzamos el reinicio total
            alert("Partida eliminada correctamente.");
            window.location.reload();
        }
    }
}

// ================================================================
// 8. SISTEMA DE NIVEL Y CARAMELOS (CON LÍMITE NV. 100)
// ================================================================

window.usarCaramelo = function(uid) {
    console.log("Intentando usar caramelo en:", uid);

    // 1. Sincronizar mochila antes de empezar
    window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || { caramelo_raro: 0 };
    
    // 2. Encontrar al Pokémon
    const p = inventario.find(x => x.uid === uid);
    if (!p) {
        console.error("No se encontró el Pokémon");
        return;
    }

    // 3. Bloqueo de Nivel 100
    let nivelActual = parseInt(p.lvl) || 1;
    if (nivelActual >= 100) {
        alert("¡Nivel máximo (100) alcanzado!");
        return;
    }

    // 4. Verificación de Caramelos (Miramos en la mochila que es el dato real)
    if (window.mochila.caramelo_raro > 0) {
        
        // --- LA RESTA DOBLE (Mochila y Variable Global) ---
        window.mochila.caramelo_raro -= 1;
        window.ticketsNormales = window.mochila.caramelo_raro;

        // --- LA SUBIDA DE NIVEL Y STATS ---
        p.lvl = nivelActual + 1;
        const baseDB = DB.find(db => db.id == p.id);
        if (baseDB) {
            p.ataque = Math.round((parseInt(p.ataque) || baseDB.ataque) * 1.05);
            p.vidaMax = Math.round((parseInt(p.vidaMax) || baseDB.vidaMax) * 1.05);
            p.hp = p.vidaMax;
        }

        // --- GUARDADO TOTAL ---
        // Guardamos la mochila
        localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
        // Guardamos los tickets (para la tienda)
        localStorage.setItem("gq_tk_normal", window.ticketsNormales);
        // Guardamos el inventario de pokémon
        if (typeof guardar === 'function') guardar(); 

        // --- REFRESCO DE INTERFAZ ---
        actualizarHUD();
        
        // Si estamos en el menú de copias, lo refrescamos para que se vea el cambio
        const overlay = document.getElementById('overlay-copias');
        if (overlay) {
            overlay.remove();
            if (typeof abrirMenuCopias === 'function') abrirMenuCopias(p.id);
        }

        console.log(`🍬 Éxito. Nivel: ${p.lvl}. Caramelos restantes: ${window.mochila.caramelo_raro}`);
    } else {
        alert("⚠️ No tienes caramelos en la mochila.");
    }
};