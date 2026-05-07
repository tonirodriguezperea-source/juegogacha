// Tu configuración de Firebase (la que copiaste)
const firebaseConfig = {
  apiKey: "AIzaSyAsUCix_stwxYkRUHwR-zZINJgbP4pYJU",
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

// Variable para saber quién está jugando
let usuarioActual = null;

// Escuchar si el usuario entra o sale
auth.onAuthStateChanged((user) => {
    if (user) {
        usuarioActual = user;
        console.log("Usuario logueado:", user.email);
        cargarDatosNube(); // Cuando entra, bajamos sus Pokémon
    } else {
        usuarioActual = null;
        console.log("Nadie ha iniciado sesión");
    }
});

// REGISTRARSE
function registrar(email, pass) {
    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            alert("¡Cuenta creada! Bienvenido.");
            // Creamos su partida inicial en la nube
            db.collection("usuarios").doc(userCredential.user.uid).set({
                monedas: 500,
                ticketsNormales: 0,
                inventario: [],
                mochila: { caramelo_raro: 0 }
            });
        })
        .catch((error) => alert("Error: " + error.message));
}

// ENTRAR
function entrar(email, pass) {
    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            alert("Has entrado correctamente.");
            // Al entrar, el listener onAuthStateChanged se encargará de cargar los datos
        })
        .catch((error) => alert("Error al entrar: " + error.message));
}

function ejecutarLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    if(!email || !pass) return alert("Rellena todos los campos");

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            document.getElementById('pantalla-login').style.display = 'none';
        })
        .catch(err => {
            document.getElementById('msj-auth').innerText = "Error: Datos incorrectos";
        });
}

function ejecutarRegistro() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    if(!email || !pass) return alert("Rellena todos los campos");

    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // Creamos sus datos iniciales en la nube
            db.collection("usuarios").doc(userCredential.user.uid).set({
                monedas: 500,
                ticketsNormales: 5,
                inventario: [],
                mochila: { caramelo_raro: 0 }
            });
            document.getElementById('pantalla-login').style.display = 'none';
            alert("¡Cuenta creada!");
        })
        .catch(err => {
            document.getElementById('msj-auth').innerText = "Error: " + err.message;
        });
}