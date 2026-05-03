const DB = [
    // --- LÍNEA BULBASAUR ---
    { id: 1, nombre: "Bulbasaur", emoji: "🍃", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { id: 2, nombre: "Ivysaur", emoji: "🌿", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" },
    { id: 3, nombre: "Venusaur", emoji: "🌳", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
    
    // --- LÍNEA CHARMANDER ---
    { id: 4, nombre: "Charmander", emoji: "🔥", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { id: 5, nombre: "Charmeleon", emoji: "☄️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png" },
    { id: 6, nombre: "Charizard", emoji: "🐲", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
    
    // --- LÍNEA SQUIRTLE ---
    { id: 7, nombre: "Squirtle", emoji: "💧", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { id: 8, nombre: "Wartortle", emoji: "🌊", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png" },
    { id: 9, nombre: "Blastoise", emoji: "🔫", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
    
    // --- BICHOS INICIALES ---
    { id: 10, nombre: "Caterpie", emoji: "🐛", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png" },
    { id: 11, nombre: "Metapod", emoji: "🔍", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png" },
    { id: 12, nombre: "Butterfree", emoji: "🦋", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png" },
    { id: 13, nombre: "Weedle", emoji: "🐝", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png" },
    { id: 14, nombre: "Kakuna", emoji: "🛡️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png" },
    { id: 15, nombre: "Beedrill", emoji: "⚔️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png" },
    
    // --- AVES ---
    { id: 16, nombre: "Pidgey", emoji: "🐦", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png" },
    { id: 17, nombre: "Pidgeotto", emoji: "🦅", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png" },
    { id: 18, nombre: "Pidgeot", emoji: "🌪️", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png" },
    { id: 19, nombre: "Rattata", emoji: "🐭", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png" },
    { id: 20, nombre: "Raticate", emoji: "🦷", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png" },
    { id: 21, nombre: "Spearow", emoji: "🐤", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png" },
    { id: 22, nombre: "Fearow", emoji: "🪁", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png" },
    
    // --- SERPIENTES ---
    { id: 23, nombre: "Ekans", emoji: "🐍", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png" },
    { id: 24, nombre: "Arbok", emoji: "👿", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png" },
    
    // --- ELÉCTRICOS ---
    { id: 25, nombre: "Pikachu", emoji: "⚡", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
    { id: 26, nombre: "Raichu", emoji: "🔋", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png" },
    
    // --- TIERRA/VENENO ---
    { id: 27, nombre: "Sandshrew", emoji: "🏜️", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png" },
    { id: 28, nombre: "Sandslash", emoji: "🌵", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png" },
    { id: 29, nombre: "Nidoran♀", emoji: "🚺", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png" },
    { id: 30, nombre: "Nidorina", emoji: "💠", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png" },
    { id: 31, nombre: "Nidoqueen", emoji: "👑", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png" },
    { id: 32, nombre: "Nidoran♂", emoji: "🚹", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png" },
    { id: 33, nombre: "Nidorino", emoji: "⚛️", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/33.png" },
    { id: 34, nombre: "Nidoking", emoji: "👺", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png" },
    
    // --- HADAS ---
    { id: 35, nombre: "Clefairy", emoji: "🌙", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png" },
    { id: 36, nombre: "Clefable", emoji: "🧚", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png" },
    
    // --- FUEGO ---
    { id: 37, nombre: "Vulpix", emoji: "🦊", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png" },
    { id: 38, nombre: "Ninetales", emoji: "🏮", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png" },
    
    // --- GLOBO ---
    { id: 39, nombre: "Jigglypuff", emoji: "🎤", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png" },
    { id: 40, nombre: "Wigglytuff", emoji: "🎀", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/40.png" },
    
    // --- MURCIÉLAGOS ---
    { id: 41, nombre: "Zubat", emoji: "🦇", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png" },
    { id: 42, nombre: "Golbat", emoji: "🧛", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" },
    
    // --- PLANTAS ---
    { id: 43, nombre: "Oddish", emoji: "🌱", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png" },
    { id: 44, nombre: "Gloom", emoji: "🥀", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png" },
    { id: 45, nombre: "Vileplume", emoji: "🌸", saga: "Pokémon", tipo: "agua", rareza: "epico", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png" },
    { id: 46, nombre: "Paras", emoji: "🍄", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/46.png" },
    { id: 47, nombre: "Parasect", emoji: "🦀", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/47.png" },
    
    // --- INSECTOS ---
    { id: 48, nombre: "Venonat", emoji: "🟣", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png" },
    { id: 49, nombre: "Venomoth", emoji: "🛸", saga: "Pokémon", tipo: "agua", rareza: "raro", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/49.png" },
    { id: 50, nombre: "Diglett", emoji: "🪵", saga: "Pokémon", tipo: "agua", rareza: "comun", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png" },

    // --- DRAGON BALL (Mantenemos los tuyos) ---
    { id: 101, nombre: "Goku", emoji: "👊", saga: "Dragon Ball", tipo: "fuego", rareza: "legendario", sprite: "https://media.tenor.com/y_26-S_C8SIAAAAC/goku-pixel.gif" },
    { id: 102, nombre: "Vegeta", emoji: "👑", saga: "Dragon Ball", tipo: "agua", rareza: "epico", sprite: "https://media.tenor.com/Y38G7Z4u830AAAAC/vegeta-pixel.gif" }
];

const RAREZAS = { 
    comun: '#94a3b8', raro: '#4ade80', epico: '#a855f7', legendario: '#f59e0b' 
};

const TABLA_TIPOS = { 
    fuego: { ventaja: 'planta', color: '#f87171' },
    planta: { ventaja: 'agua', color: '#4ade80' },
    agua: { ventaja: 'fuego', color: '#60a5fa' }
};