// ==========================================
// SISTEMA DE MISIONES (DIARIAS / FUTURAS)
// ==========================================

let misionesDiarias = JSON.parse(localStorage.getItem("gq_misiones_diariasv2")) || [
    { id: "login", desc: "Regalo por iniciar sesión", meta: 1, progreso: 0, listo: false, premio: 2, tipoPremio: "tickets" },
    { id: "gacha_3", desc: "Tira 3 veces al Gacha", meta: 3, progreso: 0, listo: false, premio: 500, tipoPremio: "monedas" }, // Nueva misión
    { id: "ganar_combates", desc: "Gana 3 combates completos", meta: 3, progreso: 0, listo: false, premio: 15, tipoPremio: "shards" }
];

let fechaMisiones = localStorage.getItem("gq_fecha_misiones") || "";

// --- LÓGICA DE PROGRESO ---

function verificarReinicioMisiones() {
    const hoy = new Date().toLocaleDateString();
    if (fechaMisiones !== hoy) {
        misionesDiarias.forEach(m => { 
            m.progreso = 0; 
            m.listo = false; 
        });
        fechaMisiones = hoy;
        guardarMisiones();
    }
}

function avanzarMision(id, cantidad) {
    const mision = misionesDiarias.find(m => m.id === id);
    if (mision && !mision.listo) {
        mision.progreso += cantidad;
        if (mision.progreso >= mision.meta) {
            mision.progreso = mision.meta;
            completarMision(mision);
        }
        guardarMisiones();
    }
}

function completarMision(m) {
    m.listo = true;
    
    if (m.tipoPremio === "tickets") {
        window.ticketsNormales += m.premio;
    } else if (m.tipoPremio === "monedas") { // <--- AÑADIR ESTO
        window.monedas += m.premio;
    } else {
        window.fragmentosEstelares += m.premio;
    }

    // Bonus por completar el 100%
    if (misionesDiarias.every(mis => mis.listo)) {
        window.fragmentosEstelares += 10;
        alert("🎉 ¡PLENO DIARIO! Bonus: +10 Fragmentos ✨");
    }

    if (typeof window.guardar === "function") window.guardar();
    if (typeof window.actualizarHUD === "function") window.actualizarHUD();
    renderMisiones();
}

// --- VISUAL ---

function renderMisiones() {
    verificarReinicioMisiones();
    const contenedor = document.getElementById('pantalla-misiones');
    if (!contenedor) return;

    // Auto-completar login al entrar
    avanzarMision('login', 1);

    let html = `<h2 style="color:#facc15; text-align:center; margin-bottom:20px; font-family:Arial;">DIARIO DE MISIONES</h2>`;
    
    // Sección Diarias (luego puedes repetir esto para 'Semanales')
    html += `<div style="margin-bottom:20px; color:#8b5cf6; font-weight:bold; border-bottom:1px solid #333;">OBJETIVOS DIARIOS</div>`;

    misionesDiarias.forEach(m => {
        const porcentaje = (m.progreso / m.meta) * 100;
        const icono = m.tipoPremio === "tickets" ? "🎫" : "✨";
        
        html += `
            <div style="background: rgba(30, 30, 50, 0.9); border: 2px solid ${m.listo ? '#4ade80' : '#3b82f6'}; padding: 15px; border-radius: 12px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="color:white; font-weight:bold;">${m.desc}</div>
                        <div style="color:#888; font-size:0.8rem;">Progreso: ${m.progreso} / ${m.meta}</div>
                    </div>
                    <div style="text-align:center; min-width:50px;">
                        <span style="font-size:1.2rem;">${icono}</span>
                        <div style="color:white; font-size:0.7rem;">x${m.premio}</div>
                    </div>
                </div>
                <div style="background:#000; height:6px; border-radius:10px; margin-top:10px;">
                    <div style="width:${porcentaje}%; background:${m.listo ? '#4ade80' : '#3b82f6'}; height:100%; border-radius:10px; transition:0.5s;"></div>
                </div>
            </div>`;
    });

    contenedor.innerHTML = html;
}

function guardarMisiones() {
    localStorage.setItem("gq_misiones_diarias", JSON.stringify(misionesDiarias));
    localStorage.setItem("gq_fecha_misiones", fechaMisiones);
}