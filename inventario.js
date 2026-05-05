// inventario.js

// Estructura para los objetos (Caramelos Raros, Piedras, etc.)
window.mochila = JSON.parse(localStorage.getItem("gq_mochila")) || {
    caramelo_raro: 0,
    polvo_estelar: 0
};

// Función para añadir objetos
window.añadirObjeto = function(idObjeto, cantidad) {
    if (window.mochila[idObjeto] !== undefined) {
        window.mochila[idObjeto] += cantidad;
    } else {
        window.mochila[idObjeto] = cantidad;
    }
    guardarMochila();
};

window.guardarMochila = function() {
    localStorage.setItem("gq_mochila", JSON.stringify(window.mochila));
};

// Función para subir nivel con Caramelo Raro
window.usarCaramelo = function(uid) {
    if (window.mochila.caramelo_raro <= 0) {
        alert("¡No tienes Caramelos Raros!");
        return;
    }

    const pokemon = inventario.find(p => p.uid === uid);
    if (pokemon) {
        pokemon.lvl = (pokemon.lvl || 1) + 1;
        
        // Bonus de stats por nivel (ejemplo: +5 ataque, +10 vida)
        pokemon.ataque = (pokemon.ataque || 20) + 5;
        pokemon.vidaMax = (pokemon.vidaMax || 100) + 10;
        
        window.mochila.caramelo_raro--;
        
        guardar(); // Guardar inventario pokemon
        guardarMochila();
        
        console.log(`${pokemon.nombre} ha subido al nivel ${pokemon.lvl}`);
        
        // Refrescar el menú de copias para ver el nuevo nivel
        if(typeof abrirMenuCopias === 'function') abrirMenuCopias(pokemon.id);
    }
};