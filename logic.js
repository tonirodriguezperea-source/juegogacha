let inventario = JSON.parse(localStorage.getItem("gq_inv")) || [];
let equipoUids = JSON.parse(localStorage.getItem("gq_team")) || [];

function guardar() {
    localStorage.setItem("gq_inv", JSON.stringify(inventario));
    localStorage.setItem("gq_team", JSON.stringify(equipoUids));
}

function tirarGacha() {
    const rand = Math.random() * 100;
    let rareza = rand < 2 ? "legendario" : rand < 10 ? "epico" : rand < 30 ? "raro" : "comun";
    let opciones = DB.filter(p => p.rareza === rareza);
    const base = opciones[Math.floor(Math.random() * opciones.length)];
    
    const nuevo = { 
        ...base, 
        uid: "UID-" + Date.now(), 
        lvl: 1, 
        xp: 0 
    };
    
    inventario.push(nuevo);
    guardar();
    alert(`¡Invocado: ${nuevo.nombre}!`);
    location.reload(); // Recargamos para ver cambios
}