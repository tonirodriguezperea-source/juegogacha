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
            const datos = doc.data();
            // Actualizamos las variables globales de tu juego
            window.monedas = datos.monedas || 0;
            window.inventario = datos.inventario || [];
            window.mochila = datos.mochila || { caramelo_raro: 0 };
            window.ticketsNormales = datos.ticketsNormales || 0;
            window.fragmentosEstelares = d.fragmentosEstelares || 0; // <-- Añade esta
            window.equipoUids = d.equipoUids || [];               // <-- Añade esta
            window.skinsPoseidas = d.skinsPoseidas || [];         // <-- Añade esta

            // Actualizamos la interfaz
            if (typeof actualizarHUD === 'function') actualizarHUD();
            if (typeof renderMochila === 'function') renderMochila();
            
            // Ocultamos el login si ya cargó todo
            document.getElementById('pantalla-login').style.display = 'none';
            console.log("Datos sincronizados desde la nube ✅");
        }
    }).catch(err => console.error("Error al cargar datos:", err));
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