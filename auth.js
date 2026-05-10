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
function cargarDatosNube(uid) {
    db.collection("usuarios").doc(uid).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            console.log("📦 Datos recibidos de la nube...");

            // 1. CARGA INTELIGENTE DEL INVENTARIO
            // Leemos lo que hay en el PC (local) y lo que hay en la Nube
            const invLocal = JSON.parse(localStorage.getItem("gq_inv")) || [];
            const invNube = data.inventario || [];

            // Si el PC tiene más bichos, nos quedamos con los del PC y actualizamos la nube
            if (invLocal.length > invNube.length) {
                console.warn("⚠️ ¡Detectado desfase! El PC tiene más Pokémon. Sincronizando nube...");
                window.inventario = invLocal;
                // Forzamos guardado para que la nube se actualice con los nuevos
                if (typeof guardar === 'function') guardar(); 
            } else {
                // Si la nube es igual o más grande, usamos la nube
                window.inventario = invNube;
                localStorage.setItem("gq_inv", JSON.stringify(window.inventario));
            }

            // 2. CARGA DEL RESTO DE VARIABLES (Siempre el valor más alto)
            window.monedas = Math.max(window.monedas || 0, data.monedas || 0);
            window.ticketsNormales = Math.max(window.ticketsNormales || 0, data.ticketsNormales || 0);
            window.fragmentosEstelares = Math.max(window.fragmentosEstelares || 0, data.fragmentosEstelares || 0);

            // 3. CARGA DE OTROS DATOS (Equipos, Mochila, etc)
            window.equipoUids = data.equipoUids || [];
            window.mochila = data.mochila || { caramelo_raro: 0 };
            window.skinsPoseidas = data.skinsPoseidas || [];
            
            // Actualizamos visualmente el juego
            if (typeof actualizarHUD === 'function') actualizarHUD();
            
            console.log("✅ Carga completada. Inventario actual:", window.inventario.length);
        } else {
            console.log("🆕 Usuario nuevo: No hay datos en la nube aún.");
        }
    }).catch((error) => {
        console.error("❌ Error al cargar de la nube:", error);
    });
}
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