// 1. Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASUcIx_stwxuYkRUhWR-zZINJgbP4pYJU",
  authDomain: "gachatara1172.firebaseapp.com",
  projectId: "gachatara1172",
  storageBucket: "gachatara1172.firebasestorage.app",
  messagingSenderId: "771111845576",
  appId: "1:771111845576:web:26eda52f6c95366d1aaffd",
  measurementId: "G-45G3SW56RG"
};

// Inicializamos Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 2. Escuchar el estado de la sesión
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuario detectado:", user.email);
        // Si hay usuario, quitamos la pantalla de login SÍ O SÍ
        const loginScreen = document.getElementById('pantalla-login');
        if (loginScreen) loginScreen.style.display = 'none';
        
        cargarDatosNube(user.uid); 
    } else {
        // Si no hay usuario, la mostramos
        const loginScreen = document.getElementById('pantalla-login');
        if (loginScreen) loginScreen.style.display = 'flex';
    }
});

// 3. Función para descargar datos de Google a tu juego
function cargarDatosNube(uid) {
    db.collection("usuarios").doc(uid).get().then((doc) => {
        if (doc.exists) {
            const d = doc.data(); // Usaremos "d" para abreviar
            
            console.log("Descargando datos de la nube para:", uid);

            // 1. Sincronizamos TODAS las variables globales
            window.monedas = d.monedas || 0;
            window.ticketsNormales = d.ticketsNormales || 0;
            window.fragmentosEstelares = d.fragmentosEstelares || 0;
            window.mochila = d.mochila || { caramelo_raro: 0 };
            window.inventario = d.inventario || [];
            window.equipoUids = d.equipoUids || [];
            window.skinsPoseidas = d.skinsPoseidas || [];
            
            // 2. Sincronizamos también el stock de tiendas para que no cambie al refrescar
            window.stockTienda = d.stockTienda || {};
            window.stockTienda7 = d.stockTienda7 || {};
            window.stockSkinsDia = d.stockSkinsDia || {};
            window.ultimaFechaTienda = d.ultimaFechaTienda || "";
            window.ultimaFechaSkins = d.ultimaFechaSkins || "";

            // 3. ACTUALIZAMOS LA INTERFAZ (Para que veas los cambios al momento)
            if (typeof actualizarHUD === 'function') actualizarHUD();
            if (typeof renderMochila === 'function') renderMochila();
            if (typeof renderInventario === 'function') renderInventario();
            if (typeof actualizarVisualEquipo === 'function') actualizarVisualEquipo(); 

            // 4. Finalizamos
            const loginScreen = document.getElementById('pantalla-login');
            if (loginScreen) loginScreen.style.display = 'none';
            
            console.log("✅ Datos sincronizados desde la nube con éxito.");
        } else {
            console.log("No hay datos previos en la nube, se usarán los locales.");
            // Si el usuario es nuevo, ocultamos el login igual para que empiece a jugar
            document.getElementById('pantalla-login').style.display = 'none';
        }
    }).catch(err => {
        console.error("❌ Error al cargar datos de Firebase:", err);
    });
}
// 4. Funciones globales para los botones del HTML (Usamos window.)
window.ejecutarRegistro = function() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    if(!email || !pass) return alert("Rellena todos los campos");

    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            const inicial = {
                monedas: 500,
                ticketsNormales: 5,
                inventario: [],
                mochila: { caramelo_raro: 0 }
            };
            
            db.collection("usuarios").doc(userCredential.user.uid).set(inicial).then(() => {
                alert("¡Cuenta creada!");
                // CAMBIO AQUÍ: Ocultamos la pantalla en lugar de recargar
                document.getElementById('pantalla-login').style.display = 'none';
            });
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
};

window.ejecutarLogin = function() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            // OCULTAR AL ENTRAR
            document.getElementById('pantalla-login').style.display = 'none';
        })
        .catch(err => alert("Error: " + err.message));
};